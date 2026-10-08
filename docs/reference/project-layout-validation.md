# 根目录工具收拢验证

2026-10-08，在 Windows、Node 24.18.0、pnpm 11.13.1 上验证当前源码。

## 源码与产物

hooks 位于 scripts/git/hooks，模块注册表位于 scripts/architecture/module-boundaries.json，维护仓库 CLI 位于 scripts/cli/create-coaiforge.mjs。维护仓库根目录不再含 .githooks、bin、.module-boundaries.json；根 .npmrc 未改。生成工程不含上述旧根路径及 scripts/cli。

运行 pnpm prepare 后本地 Git core.hooksPath 为 scripts/git/hooks。pnpm format、format:check、lint、docs:check、modules:check 和 git diff --check 均通过。治理与组合测试共 34 项，33 通过、1 项仅适用于 Unix 原生 PATH 的测试在 Windows 跳过，无失败。

pnpm package:verify 检查实际 tarball 白名单，隔离安装 CLI 并分别创建 frontend/backend/fullstack。三种工程冻结安装（含 strict-peer-dependencies）、格式、Lint、类型、模块、文档、生产构建、治理及适用后端/契约测试、首提交前 bootstrap 均通过。报告为 .generated/package-verification-win32-all.json，完整输出为 .generated/layout-package-validation.log。

backend 产物完成真实 Git hooks 验证：模拟旧 hooksPath 后 pnpm prepare 重装成功；非法提交标题被拒绝；未格式化 JSON 的工作文件和暂存内容均被格式化；合法提交成功。CLI 测试亦验证默认 Git 初始化且无首提交。隔离 consumer 中通过 npm exec --offline -- create-coaiforge 实际执行 --help 与 --version，均通过；证据为 .generated/layout-bin-proof.json。

首次新增 hook 断言错误地预期多行 JSON；实际唯一 Prettier 配置输出单行对象。修正验证预期后重新运行全部三种产物验证通过，未修改格式规则或跳过 hooks。

## 归档与交付边界

模块注册表旧、新路径及模块设计更新均触发 DUE，同一实施计划承担 documentation-archive-review。复核当前设计、ADR、模板声明、公共工具、测试及 Git 历史；旧发布证据与两份待人工前端验收计划保留。先提交已验证的变更和归档复核内容，再在干净工作区使用该真实完整 SHA 执行 docs:archive:complete，最终执行 docs:archive:check:ci 并提交台账。准确基线以 archive-ledger.json 与本记录 Git 历史核对。

本地测试 tarball 沿用 0.2.1 版本号，其快照 sourceCommit 为验证时 HEAD b5f5bf07d9a66fc114b66c95522abe2e9a2d2c3a，资源包含本轮未提交源码，不能作为已公开发布或可发布溯源证据。正式发布须从已提交源码重新打包验证。本轮未发布 npm、未推送远端、未执行 Linux 或浏览器自动化；三种产物的技术检查不扩展为前端人工验收。
