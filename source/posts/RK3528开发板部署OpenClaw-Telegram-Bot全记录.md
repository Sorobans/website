---
title: 在 RK3528 ARM 开发板上部署 OpenClaw + Telegram Bot 全记录
date: 2026-02-07 10:30:00
tags:
  - OpenClaw
  - Telegram Bot
  - RK3528
  - Armbian
  - AI Agent
categories: 技术教程
---

> **TL;DR**：在一块 4GB 内存的 RK3528 ARM 板子（Armbian）上，从零搭建了 Telegram Bot，接入 Gemini / GPT-5 / Claude 多模型，支持 AI 聊天、图片生成和系统代理操作。本文完整复盘部署步骤与核心踩坑。

## 一、硬件与系统环境

| 项目    | 配置                                       |
| ------- | ------------------------------------------ |
| SoC     | Rockchip RK3528（四核 ARM Cortex-A53）     |
| 内存    | 4GB DDR4                                   |
| 存储    | 64GB eMMC                                  |
| 系统    | Armbian 25.11.0-trunk (Ubuntu 24.04 Noble) |
| 内核    | Linux 6.1.115-vendor-rk35xx aarch64        |
| Python  | 3.12.3                                     |
| Node.js | v24.11.1（通过 nvm）                       |
| 网络    | Clash TUN 模式全局代理                     |

这块板子原本用于轻量服务。实测下来，4GB 内存跑这种“网络请求驱动型”AI Bot 完全够用，瓶颈主要不在算力，而在网络质量和 API 稳定性。

## 二、架构总览

最终部署架构：

```text
Telegram 用户
    │
    ▼ (Long Polling)
┌──────────────────────────┐
│  telegram-adapter.py     │ ← systemd 托管
│  (Python 3.12)           │
│                          │
│  ┌─ /chat 聊天模式 ─────┐│
│  │  Gemini 3 Flash/Pro  ││
│  │  GPT-5.2 / 5-Mini    ││
│  │  Claude Code (本地)   ││
│  └──────────────────────┘│
│  ┌─ /agent 代理模式 ────┐│
│  │  Gemini Function Call -> model think -> openClaw do ││
│  │  → shell / file / web ││
│  └──────────────────────┘│
│  ┌─ 图片生成 ───────────┐│
│  │  Gemini 2.5 Flash    ││
│  │  Image（自动检测）    ││
│  └──────────────────────┘│
└──────────────────────────┘
    │                  │
    ▼                  ▼
 SQLite DB        审计日志
 (状态/历史/Key)   /var/log/openclaw-agent/
```

核心设计决策：

- 使用 **Long Polling**：无需公网 IP、无需 HTTPS 证书，部署成本最低。
- 支持 **多模型热切换**：`/model gpt-5.2` 直接切换，无需重启。
- 支持 **图片生成自动路由**：识别“生成图片 / 画一张”类指令自动走图像模型。
- 代理模式使用 **Function Calling**：AI 自主规划工具调用。
- 使用 **SQLite 统一存储**：聊天历史、状态、API Key、任务审计集中管理。

## 三、部署步骤

### 3.1 目录结构

```bash
mkdir -p /opt/openclaw/{scripts,config,work}
mkdir -p /var/log/openclaw-agent
```

```text
/opt/openclaw/
├── config/
│   └── .env
├── scripts/
│   └── telegram-adapter.py
└── work/
```

### 3.2 创建 Telegram Bot

1. 在 Telegram 搜索 `@BotFather`，发送 `/newbot`。
2. 按提示创建 Bot，拿到 `Bot Token`。
3. 通过 `@userinfobot` 获取自己的 `User ID`。
4. 将 Token 和 User ID 写入环境变量。

### 3.3 环境变量配置

```bash
cat > /opt/openclaw/config/.env << 'EOF'
TELEGRAM_BOT_TOKEN=你的Bot_Token
TELEGRAM_ADMIN_USER_ID=你的User_ID
GEMINI_API_KEY=你的Gemini_Key
OPENCLAW_WORK_DIR=/opt/openclaw/work
OPENCLAW_LOG_DIR=/var/log/openclaw-agent
EOF

chmod 600 /opt/openclaw/config/.env
```

### 3.4 安装 Python 依赖

```bash
pip3 install --break-system-packages requests google-genai
```

> Ubuntu 24.04 + Python 3.12 默认受 PEP 668 约束。要么使用 venv，要么加 `--break-system-packages` 做系统级安装。

### 3.5 部署主程序

```bash
chmod +x /opt/openclaw/scripts/telegram-adapter.py
```

脚本首行为 `#!/usr/bin/env python3`，可直接执行。

### 3.6 systemd 服务

```bash
cat > /etc/systemd/system/openclaw-telegram.service << 'EOF'
[Unit]
Description=OpenClaw Telegram Agent
After=network-online.target
Wants=network-online.target
StartLimitIntervalSec=60
StartLimitBurst=3

[Service]
Type=simple
User=root
WorkingDirectory=/opt/openclaw/work
EnvironmentFile=/opt/openclaw/config/.env
ExecStart=/opt/openclaw/scripts/telegram-adapter.py
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=openclaw-telegram

MemoryMax=500M
CPUQuota=50%

PrivateTmp=yes
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/opt/openclaw/work /var/log/openclaw-agent

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable openclaw-telegram
systemctl start openclaw-telegram
```

### 3.7 验证

```bash
systemctl status openclaw-telegram
journalctl -u openclaw-telegram -f
```

在 Telegram 发送 `/ping`，应收到 `pong + 主机名 + 时间`。

## 四、踩坑全记录（重点）

从“能跑”到“稳定可用”，这 6 个坑最关键。

### 坑 1：`google-generativeai` 已废弃，必须换 `google-genai`

现象：启动后出现 `FutureWarning`，提示旧 SDK 停止维护。  
结论：直接切换到新 SDK，避免后续兼容问题。

```bash
pip3 install --break-system-packages google-genai
```

```python
import google.genai as genai
from google.genai import types

client = genai.Client(api_key=api_key)
```

### 坑 2：新 SDK 没有 `genai.configure()`

现象：调用 `genai.configure(api_key=...)` 报 `AttributeError`。  
原因：这是旧 SDK 写法。  
修复：初始化时直接传 API Key。

```python
# 错误（旧写法）
genai.configure(api_key=api_key)
client = genai.Client()

# 正确（新写法）
client = genai.Client(api_key=api_key)
```

### 坑 3：Gemini API 地理位置限制（数据中心出口 IP）

现象：Key 正确、代码正确，仍报 `User location is not supported for the API use.`  
原因：出口 IP 不在可用策略范围内。  
修复：通过 Cloudflare Worker 做中转，再在 SDK 指定 `base_url`。

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = 'generativelanguage.googleapis.com';
    return fetch(new Request(url, request));
  },
};
```

```python
client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(
        base_url='https://your-worker.your-domain.workers.dev'
    )
)
```

### 坑 4：Telegram Markdown 解析炸裂

现象：AI 返回里只要含不规范 Markdown（如 `*`、`_`、`` ` ``、`[` 未闭合），Telegram 直接 400。  
风险：业务代码以为“已发送”，用户却收不到消息。  
修复：发送失败后自动降级纯文本重试。

```python
def send_message(chat_id, text, reply_markup=None):
    data = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }
    resp = requests.post(url, json=data, timeout=10)
    if resp.status_code == 400:
        logger.warning('Markdown parse failed, retrying as plain text')
        data.pop('parse_mode', None)
        resp = requests.post(url, json=data, timeout=10)
```

同样逻辑也要覆盖 `send_photo` 的 caption。

### 坑 5：Gemini 图片生成 `temperature` 必须为 `1.0`

现象：复用聊天参数（如 `temperature=0.7`）会导致图片接口异常或空响应。  
修复：图像模式固定 `temperature=1.0`，并声明 `response_modalities`。

```python
config = types.GenerateContentConfig(
    temperature=1.0,
    max_output_tokens=2048,
    response_modalities=['TEXT', 'IMAGE'],
)
```

### 坑 6：GPT-5 系列参数兼容变更

现象：`max_tokens` 不生效。  
修复：改用 `max_completion_tokens`。

```python
response = requests.post(
    'https://api.openai.com/v1/chat/completions',
    json={
        'model': 'gpt-5-mini-2025-08-07',
        'messages': messages,
        'max_completion_tokens': 2048,
    },
    headers={'Authorization': f'Bearer {api_key}'},
)
```

## 五、最终能力与安全策略

### 基础命令

| 命令                   | 功能                                |
| ---------------------- | ----------------------------------- |
| `/ping`                | 返回 pong + 主机名 + 时间           |
| `/chat`                | 进入 AI 聊天模式                    |
| `/agent`               | 进入代理模式（AI 操作系统OpenClaw） |
| `/model`               | 查看/切换模型                       |
| `/setkey gemini <key>` | 设置 API Key                        |
| `/clear`               | 清空对话历史                        |
| `/help`                | 显示帮助                            |

### 主要能力

- 多轮对话与上下文记忆
- 多模型热切换（Gemini / GPT-5 / Claude）
- 图片生成与继续编辑
- 代理模式下的 shell / file / web 工具调用
- 危险命令拦截与审计日志记录

### 安全机制

- **用户白名单**：仅允许配置的管理员 User ID 操作。
- **命令黑名单**：默认拦截 `rm -rf`、`dd`、`mkfs` 等高危命令。
- **审计追踪**：SQLite + 文件日志双轨记录。
- **资源限制**：`MemoryMax=500M`、`CPUQuota=50%`。
- **最小权限运行**：`ProtectSystem=strict`、`ProtectHome=yes`、`NoNewPrivileges=true`。

## 六、经验总结

给准备在 ARM 板上跑 AI Bot 的同学几个建议：

1. **ARM 兼容性不是问题**：真正的问题是网络、API 和异常处理。
2. **Long Polling 是边缘部署最优解**：简单、稳定、低成本。
3. **先做失败兜底，再做功能扩展**：特别是 Telegram Markdown fallback。
4. **尽早切到新 SDK**：别在废弃 SDK 上继续堆逻辑。
5. **资源限制必须上**：边缘设备内存和 CPU 都是硬约束。

## 七、踩坑速查表

| 问题                 | 症状                             | 解决                       |
| -------------------- | -------------------------------- | -------------------------- |
| 旧 SDK 废弃          | `google.generativeai has ended`  | 切换 `google-genai`        |
| `configure()` 不存在 | `AttributeError`                 | `Client(api_key=key)`      |
| 地理限制             | `User location is not supported` | Cloudflare Worker 中转     |
| Markdown 失败        | Telegram 400                     | 降级纯文本重试             |
| 图片参数异常         | 空响应或报错                     | 固定 `temperature=1.0`     |
| GPT-5 参数不兼容     | `max_tokens` 无效                | 改 `max_completion_tokens` |

## 八、结语

个人感觉, openClaw 还是挺好用的。
如果你能忽略它以下几个缺点

- 不能开箱即用(指写完配置就能跑)
- 费钱, 帮我改了个很小的需求，烧了我的gemini 3刀....

感觉当当玩具还是不错的.
最后放上使用截图啦！
![部署完成](/img/img_11.png)
![开始使用](/img/img_12.png)
