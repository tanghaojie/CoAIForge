# CoAIForge

以 AGENTS.md 与 docs 为核心的人与 AI 协作启动模板。公共基础、前端/后端片段和全栈 health 补充按选择组合，工程独立维护。

| 预设      | 工程                          | 起始能力                   |
| --------- | ----------------------------- | -------------------------- |
| frontend  | Vue 3 / Vite / TypeScript     | 最小启动页面               |
| backend   | NestJS / Fastify / TypeScript | 可启动与关闭的空应用       |
| fullstack | 两个应用 + Zod 契约包         | GET /health 与最小状态展示 |

## 创建项目

使用 Node 24.18.0 或更新的 Node 24，生成工程统一使用 pnpm 11.13.1。

```sh
npm create coaiforge@latest
```

按提示选择项目目录、前端/后端/全栈及项目名。也可以直接指定：

```sh
npm create coaiforge@latest my-project -- --preset frontend
npm create coaiforge@latest my-project -- --preset backend
npm create coaiforge@latest my-project -- --preset fullstack
```

项目名使用小写字母、数字和连字符，以字母开头。目录名不符合规则时使用 `--name my-project`。已有非空目录不会覆盖。默认初始化 Git 和本地 hooks，不安装依赖、不创建首提交；`--no-git` 跳过 Git，`--no-interactive` 用于完全由参数创建。

```sh
cd my-project
pnpm install --frozen-lockfile
pnpm dev:frontend
```

后端使用 `pnpm dev:backend`；全栈在两个终端分别启动前后端。首提交和真实归档基线按生成工程的[启动指南](docs/guides/getting-started.md)操作。前端功能由人类验收。

## 维护模板与发布

源码维护使用 Node 24.18.0、pnpm 11.13.1。安装后运行 `pnpm test` 验证治理与 CLI，`pnpm package:verify` 从实际 npm tarball 验证三种输出。

维护者仍可直接组合：

```sh
pnpm install --frozen-lockfile
pnpm template:compose -- --preset fullstack --target ../my-project --name my-project
```

组合工具只生成文件，不安装依赖或操作 Git。发布包为 `create-coaiforge`，通过打包白名单和模板资源快照携带公共规范、应用片段及固定锁文件。发布步骤见[发布指南](docs/guides/npm-release.md)。

规范从 [AGENTS.md](AGENTS.md) 与[文档入口](docs/README.md)开始。公共文档与治理脚本为单一源；模板维护历史不进入输出。MIT 来源声明见 LICENSE。
