---
title: CenOS-7.6搭建pptp服务
date: 2023-02-05 10:36:58
tags: 技术分享
---

## 参考教程

<a href="https://help.aliyun.com/document_detail/41345.html" target="_blank">见阿里云教程</a>

## 防火墙配置问题

按照阿里云步骤走完，如果提醒远程连接计算机端口已关闭的话。可能是没开放端口。

需要更改防火墙的策略。

```bash
# 查看防火墙当前配置
iptables -L -n

# 允许所有请求
iptables -P INPUT ACCEPT

# 清空默认所有规则
iptables -F

# 清空自定义所有规则
iptables -X

# 计数器置0
iptables -Z

# 允许127.0.0.1访问本地服务
iptables -A INPUT -i lo -j ACCEPT

# 允许访问外部服务
iptables -A INPUT -m state --state ESTABLISHED -j ACCEPT

# 允许 ping
iptables -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

# 开启 ssh 端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 开启 pptpd 端口
iptables -A INPUT -p tcp --dport 1723 -j ACCEPT
```

## 注意事项

哎嘿,昨天我搞了半天连不上。后来看了很多教程。才知道是我防火墙未放行。

很多网上的教程并未提及防火墙放行这一步步骤。

### 补充说明

每次如果更改了DNS和ip段配置后。都要运行这个命令来生效哦：

```bash
sysctl -p              # 生效配置
service iptables save  # 保存防火墙配置
service iptables restart  # 重启防火墙
```

如果更改，或添加pptpd账号。也是需要重启pptp的。

```bash
service pptpd restart  # 重启pptp
```
