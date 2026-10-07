---
title: 开发与启动流程
status: accepted
created: 2026-10-07
updated: 2026-10-07
owner: project maintainers
---

# 开发与启动流程

使用 Node 24.18.0、pnpm 11.13.1；packageManager、engines、.node-version 与锁文件共同固定环境。`pnpm install --frozen-lockfile` 安装，`pnpm prepare` 安装本地 hooks。无独立 Git 根时 prepare 明确跳过，不修改父仓库。

`pnpm format`、`pnpm format:check`、`pnpm lint`、`pnpm typecheck`、`pnpm build` 使用所选 workspace。`pnpm test` 只执行治理脚本以及存在的后端/契约测试。

前端项目使用 pnpm dev:frontend；后端项目使用 pnpm dev:backend。全栈先构建共享契约，再在两个终端分别启动。前端开发代理把 /health 转发到 127.0.0.1:3000；后端默认绑定 127.0.0.1，不默认暴露公网。生产前端由静态服务器托管，部署同源 /health 代理或在构建前配置 VITE_API_BASE_URL。跨域部署需在后端明确配置 CORS，不预设通配来源。

生产后端执行 pnpm build 后 pnpm start:backend。HOST 和 PORT 为后端配置；PORT 必须为 1..65535 整数，非法输入退出并报告。SIGINT/SIGTERM 触发 Nest 生命周期关闭。无首提交按文档治理初始化，不把 bootstrap 当长期 CI 豁免。
