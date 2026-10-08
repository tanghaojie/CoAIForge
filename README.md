# CoAIForge

以 AGENTS.md 与 docs 为核心的人与 AI 协作启动模板。公共基础、前端/后端片段和全栈 health 补充按选择组合，工程独立维护。

| 预设      | 工程                          | 起始能力                   |
| --------- | ----------------------------- | -------------------------- |
| frontend  | Vue 3 / Vite / TypeScript     | 最小启动页面               |
| backend   | NestJS / Fastify / TypeScript | 可启动与关闭的空应用       |
| fullstack | 两个应用 + Zod 契约包         | GET /health 与最小状态展示 |

## 创建项目

Node 支持 22.13 起的 22 系列，以及 24 或更新版本；推荐 Node 24。pnpm 支持 >=11.13.1 <13，使用已有兼容版本即可。直接依赖采用兼容版本范围，锁文件记录验证过的依赖组合。

当前 npm latest 为 0.2.0，包含依赖版本范围、兼容环境策略与前端动画介绍页。

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

源码维护使用上述兼容环境，不要求最新补丁，也不自动下载指定 pnpm。安装后运行 `pnpm test` 验证治理与 CLI，`pnpm package:verify` 从实际 npm tarball 验证三种输出。

生成工程通过 `pnpm update -r` 更新兼容依赖，重新验证后提交锁文件。维护仓库修改根与模板依赖声明后，运行 `pnpm update`、`pnpm templates:locks` 和 `pnpm package:verify`；跨大版本升级先检查兼容性。Node/pnpm 的兼容范围和 TypeScript 兼容限制见[依赖策略](docs/design/dependency-lifecycle.md)。

维护者仍可直接组合：

```sh
pnpm install --frozen-lockfile
pnpm template:compose -- --preset fullstack --target ../my-project --name my-project
```

组合工具只生成文件，不安装依赖或操作 Git。发布包为 `create-coaiforge`，通过打包白名单和模板资源快照携带公共规范、应用片段及固定锁文件。发布步骤见[发布指南](docs/guides/npm-release.md)。

规范从 [AGENTS.md](AGENTS.md) 与[文档入口](docs/README.md)开始。公共文档与治理脚本为单一源；模板维护历史不进入输出。MIT 来源声明见 LICENSE。
