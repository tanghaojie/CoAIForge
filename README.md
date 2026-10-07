# CoAIForge

以 AGENTS.md 与 docs 为核心的人与 AI 协作启动模板。公共基础、前端/后端片段和全栈 health 补充按选择组合，工程独立维护。

| 预设      | 工程                          | 起始能力                   |
| --------- | ----------------------------- | -------------------------- |
| frontend  | Vue 3 / Vite / TypeScript     | 最小启动页面               |
| backend   | NestJS / Fastify / TypeScript | 可启动与关闭的空应用       |
| fullstack | 两个应用 + Zod 契约包         | GET /health 与最小状态展示 |

Node 24.18.0、pnpm 11.13.1。安装后运行 `pnpm test` 验证治理，`pnpm templates:verify` 在独立目录验证三种输出。前端功能由人类验收。

P1 提供维护者组合命令：

```sh
pnpm install --frozen-lockfile
pnpm template:compose -- --preset fullstack --target ../my-project --name my-project
```

目标必须不存在或为空。组合工具只生成文件，不安装依赖或操作 Git；面向用户的交互 CLI、npm 包名与发布属于后续阶段。生成工程按自己的[启动指南](docs/guides/getting-started.md)安装、首提交和显式登记归档基线。

规范从 [AGENTS.md](AGENTS.md) 与[文档入口](docs/README.md)开始。公共文档与治理脚本为单一源；模板维护历史不进入输出。MIT 来源声明见 LICENSE。
