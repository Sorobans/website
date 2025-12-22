---
title: 配置 Codex 自定义三方API
date: 2025-10-22 10:00:00
tags:
  - CodeX
  - AI
  - 配置
categories: 技术教程
---

最近在用 Claude Code,换了成本更低的Codex,记录一下配置过程。方便以后查看，快速配置。

## 配置路径

配置文件位置:
- **macOS/Linux**: `~/.codex/config.toml`
- **Windows**: `C:\Users\你的用户名\.codex\config.toml`

## 配置文件

直接上配置:

```toml
model_provider = "codex"
model = "gpt-4.1-mini"
model_reasoning_effort = "medium"
disable_response_storage = true
windows_wsl_setup_acknowledged = true

[model_providers.codex]
name = "codex"
base_url="https://api.burn.hair/v1" #使用官方或第三方的
wire_api = "responses"
env_key = "K_CODEX" #不要改成自己的密钥,在系统环境变量中设置
```

## 参数说明

几个关键配置:

- `model_provider`: 设置成 `"codex"` 就行
- `model`: 用的模型,这里是 `gpt-4.1-mini`
- `model_reasoning_effort`: 推理强度,`low`/`medium`/`high` 三档,medium 够用
- `disable_response_storage`: 不保存历史记录,开启更安全
- `base_url`: API 地址,换成你自己的
- `env_key`: 环境变量名,**密钥别直接写配置文件里**

## 设置步骤

### 1. 修改配置文件

找到配置文件,把上面的配置复制进去,改一下 `base_url` 和 `model`。

### 2. 设置环境变量

**macOS/Linux** 在 `~/.zshrc` 或 `~/.bashrc` 加一行:
```bash
export K_CODEX="your-api-key-here"
```

然后 `source ~/.zshrc` 生效。

**Windows** PowerShell 执行:
```powershell
[System.Environment]::SetEnvironmentVariable('K_CODEX', 'your-api-key-here', 'User')
```

### 3. 重启终端

重启终端就能用了。
