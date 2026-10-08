---
title: 依赖升级与非固定版本声明
status: pending_human_acceptance
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 依赖升级与非固定版本声明

## 目标、授权与设计依据

用户确认 CoAIForge 功能正常，要求先升级当前依赖，再使用非固定版本构建。依据[升级策略](../../design/dependency-lifecycle.md)，覆盖维护仓库、三种模板及 CI。暂存区与工作区为空；首次归档审计 NOT_DUE。

## 实施步骤和退出条件

- [x] 核实官方最新版本与 peer 兼容范围，准备设计与协作记录
- [x] 升级声明、环境、模板与锁文件
- [x] 完成维护仓库及实际 tarball 三种输出技术验证
- [x] 更新最终证据和索引；允许检查通过后创建技术交付提交
- [ ] 维护者验收升级后的前端页面、全栈 health 成功/失败；完成后归档计划和日志

## 实际结果、偏差、遗留与提交

TypeScript 使用最新兼容 6.0.3；Node 使用最新 LTS 24.21.0，类型定义对齐 Node 24。前端浏览器人工验收与 Linux CI 本轮尚未执行；不自动发布 npm。

维护仓库 29 项测试通过，三种 tarball 消费检查通过。Nest 12 迁移到 NodeNext，npm/pnpm 分别使用 warn/download 失败策略，严格 peer 参数进入锁文件刷新和消费验证。详见[验证记录](../../reference/dependency-upgrade-validation.md)。关联提交为包含本计划的 build(deps) 技术交付提交，可由 Git 文件历史定位；不将尚未创建的 SHA 写入记录。
