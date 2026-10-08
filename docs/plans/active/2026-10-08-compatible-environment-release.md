---
title: 兼容环境与 0.2.0 npm 发布
status: in_progress
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 兼容环境与 0.2.0 npm 发布

## 目标、授权与设计依据

用户明确要求 Node 和 pnpm 环境不必特别新，兼容即可，并授权修改后发布 npm。依据[依赖策略](../../design/dependency-lifecycle.md)和[发布设计](../../design/cli-and-npm-release.md)，放宽环境要求、保留应用依赖兼容范围、发布 create-coaiforge@0.2.0。包含已提交的介绍页，不改动其实现，也不将发布授权写为前端人工验收通过。

## 实施步骤和退出条件

- [x] 空暂存区/工作区检查，归档审计 NOT_DUE，核实 registry latest 为 0.1.0
- [x] 修改环境、类型定义、组合逻辑、CI 与现行文档
- [x] 以 Node 22.13.0 / pnpm 11.13.1 验证完整 tarball，在现有 Node 24 / pnpm 12 下验证兼容
- [ ] 提交发布源码，核验实际已提交源码 tarball 并发布相同产物
- [ ] 核验 registry 完整性、公开消费与发布记录，完成归档和适用归档复核

## 实际结果、偏差、遗留与提交

不更新系统全局工具，不改人类前端实现。前端人工验收沿用两份已有 pending_human_acceptance 计划。本发布任务以环境兼容、打包、发布和公开消费为退出条件。

发布源码阶段：29 项测试与全部维护门禁通过，Node 22 / pnpm 11 三种实际 tarball 工程全部通过；现有 Node 24.19.0 / pnpm 12.10.1 的 fullstack 检查通过。发布前提交经验证的源码，再对其快照验证最终发布 tarball。npm 10 打包 JSON 前的 prepare 输出已适配，没有降低检查。
