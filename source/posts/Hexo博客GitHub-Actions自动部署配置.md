---
title: Hexo博客GitHub Actions自动部署配置
date: 2025-10-18 04:00:00
tags:
  - Hexo
  - CI/CD
  - GitHub Actions
  - 自动化部署
categories: 技术教程
---

## 前言

作为一个使用 Hexo 搭建博客的开发者，每次写完文章都要手动执行 
```bash
hexo clean && hexo generate && hexo deploy
```
这一系列命令是不是很麻烦？今天就教大家如何使用 GitHub Actions 实现 Hexo 博客的自动化部署。

## 什么是 GitHub Actions

GitHub Actions 是 GitHub 提供的持续集成和持续部署（CI/CD）服务。它可以在代码仓库发生特定事件时自动执行预定义的工作流程，比如代码提交、PR 创建等。

## 自动部署方案

我们的方案是：
1. 源代码仓库：存放 Hexo 源文件（Markdown 文章、配置文件等）
2. GitHub Pages 仓库：存放编译后的静态网站文件
3. GitHub Actions：自动构建并部署到 GitHub Pages 仓库

## 配置步骤

### 1. 创建 GitHub Actions 工作流

在 Hexo 博客源码仓库根目录下创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy Hexo to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'source/_posts/**'
      - 'source/**'
      - 'themes/**'
      - '_config*.yml'
      - 'package.json'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source
        uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Clean and generate static files
        run: |
          npm run clean
          npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.DEPLOY_TOKEN }}
          external_repository: 你的用户名/你的用户名.github.io
          publish_branch: main
          publish_dir: ./public
          user_name: 'github-actions[bot]'
          user_email: 'github-actions[bot]@users.noreply.github.com'
          commit_message: ${{ github.event.head_commit.message }}
```

### 2. 配置触发条件

在上述配置中，工作流会在以下情况触发：
- 推送到 `main` 分支
- 修改了 `source/_posts/**`、`source/**`、`themes/**` 目录下的文件
- 修改了配置文件 `_config*.yml` 或 `package.json`
- 手动触发（`workflow_dispatch`）

### 3. 创建 GitHub Personal Access Token

1. 访问 GitHub 设置页面：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写以下信息：
   - **Note**: `Hexo Blog Deploy`（或其他描述）
   - **Expiration**: 选择过期时间（建议 1 year 或 No expiration）
   - **Select scopes**: 勾选 **repo**（完整的仓库权限）
4. 点击 "Generate token"
5. **立即复制生成的 token**（只会显示一次，关闭页面后无法再次查看）

### 4. 添加 Secret 到源码仓库

1. 进入你的 Hexo 源码仓库
2. 点击 `Settings` → `Secrets and variables` → `Actions`
3. 点击 "New repository secret"
4. 填写：
   - **Name**: `DEPLOY_TOKEN`
   - **Secret**: 粘贴刚才复制的 token
5. 点击 "Add secret"

### 5. 修改配置中的仓库名

将 `deploy.yml` 中的 `external_repository` 改为你的 GitHub Pages 仓库名：

```yaml
external_repository: 你的用户名/你的用户名.github.io
```

## 使用流程

配置完成后，使用流程变得非常简单：

1. 在 `source/_posts` 目录下创建或修改 Markdown 文章
2. 提交代码到 Git 仓库：
   ```bash
   git add .
   git commit -m "新增文章：Hexo 自动部署配置"
   git push origin main
   ```
3. GitHub Actions 自动触发，构建并部署
4. 几分钟后，访问你的 GitHub Pages 网站即可看到更新

## 查看部署状态

1. 进入源码仓库的 `Actions` 页面
2. 查看最新的工作流运行状态
3. 点击查看详细日志，排查问题

## 优势总结

使用 GitHub Actions 自动部署有以下优势：

1. **省时省力**: 不需要手动执行构建和部署命令
2. **环境一致**: 在云端统一的环境中构建，避免本地环境问题
3. **随时随地**: 只要能提交代码就能发布文章，甚至可以在 GitHub 网页端直接编辑
4. **版本管理**: 源文件和部署文件分离，源码有完整的 Git 历史记录
5. **免费使用**: GitHub Actions 对公开仓库完全免费

## 常见问题

### Q: 部署失败怎么办？
A: 查看 Actions 页面的详细日志，常见问题包括：
- Token 权限不足或过期
- 仓库名配置错误
- 依赖安装失败

### Q: 能否部署到自定义域名？
A: 可以，在 `source` 目录下添加 `CNAME` 文件，内容为你的域名即可。

### Q: 构建时间太长怎么办？
A: 可以使用 `npm ci` 代替 `npm install`，并启用 npm 缓存（配置中已包含）。

## 总结

通过 GitHub Actions，我们实现了 Hexo 博客的全自动部署。从此以后，写博客只需要专注于内容创作，提交代码后坐等自动部署完成即可。

