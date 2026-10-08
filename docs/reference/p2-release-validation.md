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

发布账户登录已核验，发布名称为 create-coaiforge，目标版本 0.1.0。实施提交后重建最终 tarball，记录其完整性并完成发布与 registry 消费核验；当前仍待执行，不声明已发布。

CI 已将 Windows/Linux × 三种预设切换为实际 tarball 独立验证。[首次 P2 CI](https://github.com/tanghaojie/CoAIForge/actions/runs/37719064080) 对实施提交 97e3d90ebf220e9e99f5bb489b017e8621063734 完成 7 个成功任务，包括治理与两个系统的三个预设。原生终端退出修正后的 CI 与实际发布仍待最终核验。
