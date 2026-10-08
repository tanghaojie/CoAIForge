# P2 CLI 与 npm 发布验证

2026-10-08（Asia/Singapore）。本地 Windows，Node v24.19.0、pnpm 11.13.1；Node 在 >=24.18.0 <25 的声明范围内。远端 CI 仍使用固定 Node 24.18.0。

## 已完成技术检查

- 根 CLI、组合与治理测试 29/29，通过实际 readline 流覆盖交互创建、Ctrl+C 和输入清理。
- 三种结果从实际 npm tarball 安装的 CLI 创建；frontend/backend/fullstack 的冻结安装、格式、Lint、类型、模块、文档、生产构建、治理与适用后端/契约测试、bootstrap 均通过。
- tarball 文件严格限定为 LICENSE、README、package.json、bin 入口、CLI、组合器、公共文件工具和资源 JSON 八项；不携带维护历史或环境变量。
- 生成结果包含 .gitignore、.npmrc、hooks 和冻结锁文件；不泄漏发布命令或 CLI 运行时依赖到应用依赖。源模板组合依旧支持三种预设。
- 实际终端选择 backend 并创建工程，Git 配置本地 hooks 且无首提交；真实 readline 流测试覆盖输入清理。最终 Windows 原生终端检查发现取消后控制台读句柄仍可能驻留，bin 入口在所有操作结束且输出流刷新后显式退出交互进程。Ctrl+C 原生复验立即退出，独立进程检查确认无残留；最终 tarball 随修正后的提交重建。
- 前端模板界面未修改；没有创建或运行前端单元、组件、E2E、浏览器自动化测试。P1 人类验收仅证明既有界面，未替代 CLI 验证。

## 发布与跨平台状态

最终发布源码为 61efd9afc00b22733486d45a87f3f62ad0d8868d。最终 tarball 的三个工程已再次通过全部适用检查，完整性为 `sha512-n2G+RZcQS0g9Rf9ML8/eg55ExXwZT5awylBN/UDmOsWi2TgWn6kCzX96ZZakCMPLZOr0bwoQZs2ay1fluyLs6w==`，发布文件 8 个，压缩后约 110.4 kB。

维护者完成 npm 官方身份验证后，2026-10-08 10:52（Asia/Singapore）npm publish 返回成功并接受 create-coaiforge@0.1.0，tag latest、public。首次处理期间版本查询为 E404；10:57 registry 登记 0.1.0，随后实际查询确认版本、bin、Prettier 3.9.6 依赖和完整性与验证产物完全一致。[公开 npm 包](https://www.npmjs.com/package/create-coaiforge)的 latest 已指向 0.1.0。

在维护仓库之外的独立系统临时目录，通过 npm create --yes coaiforge@0.1.0 分别创建 frontend（--no-git）和 backend，通过 npm create --yes coaiforge@latest 创建 fullstack；三次均成功。三份生成清单的 CLI/模板版本均为 0.1.0，sourceCommit 均为上述最终源码；backend/fullstack 的 .githooks 配置生效且没有首提交，frontend 没有 .git。公开包与已验证 tarball 完整性相同，因此复用三套工程的完整验证证据，消费复验聚焦公开下载、参数转发、生成清单和 Git 生命周期。

维护仓库内使用与根包完全相同的固定版本时，npm 会优先解析本地包，尚未安装根 bin 链接时可能报命令不存在；仓库外固定版本复验成功。这一维护环境现象不归因于公开包。发布指南要求在维护仓库之外消费验证，避免本地包掩盖公开下载。

CI 已将 Windows/Linux × 三种预设切换为实际 tarball 独立验证。[首次 P2 CI](https://github.com/tanghaojie/CoAIForge/actions/runs/37719064080) 对实施提交 97e3d90ebf220e9e99f5bb489b017e8621063734 完成 7 个成功任务；[最终发布源码 CI](https://github.com/tanghaojie/CoAIForge/actions/runs/37719616478) 对 61efd9afc00b22733486d45a87f3f62ad0d8868d 也完成 7 个成功任务，包括治理与两个系统的三个预设。

正常授权环境中的 Windows 交互创建成功且立即退出；受限终端环境曾出现 I/O 驻留，不能将其直接认作项目失败。Ctrl+C 原生退出及正常终端创建均有实际复验。
