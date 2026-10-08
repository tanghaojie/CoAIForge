---
title: 兼容依赖范围与可复现构建
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 兼容依赖范围与可复现构建

用户要求长期迭代不固定运行时、包管理器与直接依赖版本。Node 跟随最新 LTS，pnpm 使用 devEngines.packageManager 兼容范围，直接依赖默认使用 ^ 范围。锁文件保留已验证的依赖图；日常/CI/发布安装使用冻结锁文件，更新依赖通过显式升级后重新验证和提交锁文件。

最新版本需同时满足依赖 peer 与运行时约束；无法兼容时记录最新兼容版本和限制，不强行关闭 peer/类型检查。跨大版本升级通过独立审查实施。本轮版本与验证入口见[运行时与依赖升级策略](../design/dependency-lifecycle.md)。
