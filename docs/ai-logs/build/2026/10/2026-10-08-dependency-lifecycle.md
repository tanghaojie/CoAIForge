---
title: 依赖升级与构建环境范围
status: pending_human_acceptance
change_type: build
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# AI 协作记录

## 用户目标、授权与关键指令

用户测试功能正常，要求 Node、pnpm 和依赖不再固定版本，先升级到最新。修改范围为 CoAIForge，未要求修改 Cyber-Sight、已有生成项目或发布 npm。

## 假设、选择与实际改动

非固定版本解释为兼容版本范围与浮动最新 LTS，保留已验证锁文件用于可复现构建。官方 registry 查询确认 pnpm 12.10.1、Vite 8.3.3、Nest 12.1.2；TypeScript 7.0.2 与最新版 typescript-eslint 的 peer 不兼容，选择 6.0.3。按官方文档用 devEngines.packageManager 声明 pnpm 范围，并迁移工程设置到 workspace YAML。

## 验证、偏差、未决事项和提交

本记录保留初次依赖升级的实际环境和选择；后续 Node 20 / pnpm 10 与 Nest 11 调整见[当前依赖策略](../../../../design/dependency-lifecycle.md)及[兼容验证](../../../../reference/toolchain-compatibility-validation.md)。既有前端人工验收仍待维护者确认。

开始时 git diff --cached --quiet 通过，工作区为空，归档审计 NOT_DUE。pnpm 在沙箱无法打开版本数据库，在正常环境原样重跑通过。实际升级与验证结果记录如下。浏览器人工验收和 Linux 运行不得由静态检查推断。

实际改动覆盖环境/直接依赖范围、根与三套锁文件、组合器环境与依赖表传播、CI、模板和验证入口。安装使用项目内 Node 24.21.0 与原生 pnpm 12.10.1，不改系统级工具。根严格 peer 安装、29 项测试及工程门禁通过，三种 tarball 消费验证通过。npm 对 download 声明拒绝和 Nest 12 的 Node16 ESM 错误已修正；没有关闭类型/peer 检查。

最终证据位于[验证记录](../../../../reference/dependency-upgrade-validation.md)。本记录随 build(deps) 技术交付提交，具体 SHA 由 Git 文件历史定位。前端人工验收待维护者执行，因此按 AGENTS 保留计划与日志为 pending_human_acceptance，不提前归档；Linux CI 与 npm 发布不宣称已执行。
