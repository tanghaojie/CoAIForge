---
title: 兼容依赖范围与可复现构建
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 兼容依赖范围与可复现构建

用户要求长期迭代不固定运行时、包管理器与直接依赖版本，并明确环境版本无需特别新，兼容即可。Node 和 pnpm 只通过 engines 声明经验证的兼容范围；推荐环境用于便捷选版，不强制最新补丁或自动下载特定包管理器。直接依赖默认使用 ^ 范围。锁文件保留已验证的依赖图；日常/CI/发布安装使用冻结锁文件，更新依赖通过显式升级后重新验证和提交锁文件。

最新版本需同时满足依赖 peer 与运行时约束；无法兼容时记录最新兼容版本和限制，不强行关闭 peer/类型检查。2026-10-08 进一步核实后支持 Node ^20.19.0 || ^22.13.0 || >=24.0.0 与 pnpm >=10.26.0 <13，推荐 Node 22。模板选择 Nest 11 以避免 Nest 12 的 file-type 22 传递依赖排除 Node 20；不以强行 override 或忽略 engines 实现兼容。pnpm 下界由 allowBuilds 首次支持版本约束，保留安装脚本权限与 minimumReleaseAge。跨大版本升级通过独立审查实施。本轮版本与验证入口见[运行时与依赖升级策略](../design/dependency-lifecycle.md)。
