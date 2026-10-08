---
title: 收敛 Node 运行时范围
status: completed
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 收敛 Node 运行时范围

## 目标、授权与设计依据

用户明确要求保留现有依赖，将 engines.node 改为 ^22.13.0 || >=24.0.0。以[依赖策略](../../design/dependency-lifecycle.md)和[依赖范围 ADR](../../decisions/ADR-20261008-dependency-ranges.md)为依据；仅修改 CoAIForge 与今后从当前源码生成的工程，不发布或修改既有项目。

## 实施步骤和退出条件

- [x] 暂存区与工作区为空，归档审计 NOT_DUE，准备设计和协作记录。
- [x] 修改根声明、CI 与当前说明，保留依赖、锁文件及推荐 Node 22。
- [x] 执行冻结安装、根适用检查，验证三种输出与打包快照的范围。
- [x] 更新结果、归档计划和日志；最终格式、文档与归档 CI 门禁通过，随本轮提交交付。

## 实际结果、偏差、遗留与提交

Windows / Node 24.18.0 / pnpm 11.13.1：冻结且严格 peer 安装、格式化、Lint、文档与模块检查通过；治理测试 34 项，33 通过，1 项 Unix 专属测试跳过。既有测试覆盖三种组合及 bundled CLI。另重建快照并从真实 CLI 创建三种预设，逐项确认 Node 范围、pnpm 下界、推荐版本、生成说明及锁文件一致，报告 .generated/node22-range-proof.json。Git diff 与原 package.json 比较确认所有依赖、根及三种锁文件均未变化。

本轮仅收敛运行时声明，未重复应用构建或 Node 22.13 安装验证；此前 Node 22.13 证据见[兼容验证](../../reference/toolchain-compatibility-validation.md)。前端行为未改变，不新增浏览器验收；已有前端待验收计划保留。远端 CI 尚未运行，npm 未发布。

关联提交：build(runtime): require Node 22.13 or 24 and newer；本记录随该提交归档，SHA 以 Git 历史为准。
