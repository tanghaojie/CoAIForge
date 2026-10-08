---
title: 启动器修复收尾归档复核
status: completed
type: documentation-archive-review
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 实施计划

## 目标、授权与设计依据

启动器修复计划完成后，新增完成计划达到策略阈值 3；按单项目文档治理设计复核，不改变策略阈值。

## 实施步骤和退出条件

- [x] 对照 pnpm 启动器、打包验证入口、CI 矩阵和 Git 历史复核运行时与发布设计。
- [x] 保留已公开发布证据与已有待人工前端验收计划；Linux 新修复不记为已验证。
- [x] 修复验证完成后归档本计划与协作记录；真实复核提交通过本文件 Git 历史定位。
- [x] 基线登记与台账提交按下述两阶段收尾协议执行，实际 SHA 记录于 archive-ledger.json。

## 实际结果、偏差、遗留与提交

现行设计已补充 Unix 原生入口规则。原发布证据描述发布时实际验证，不覆盖本次 Linux CI；不归档仍待人工验收的前端计划，不改已发布 tarball。根与三种产物本地验证通过，详见同日启动器修复计划。

按治理设计先提交本次修复与已归档复核内容，再在干净工作区使用该提交完整 SHA 执行 docs:archive:complete，最终 docs:archive:check:ci 通过后提交台账。登记前的 DUE 是完成计划阈值触发，不能通过放宽策略或伪造基线跳过。最终基线及其提交通过 archive-ledger.json 与 Git 历史核对。
