---
title: 修复 pnpm 原生启动器
status: completed
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 实施计划

## 目标、授权与设计依据

用户授权修复 Ubuntu / pnpm 12 的 CI 失败。依据运行时与依赖升级设计，保留 Node/pnpm 兼容范围及验证矩阵，不发布新 npm 版本。

## 实施步骤和退出条件

- [x] 暂存区与工作区为空，归档审计 NOT_DUE，先更新设计和协作记录。
- [x] 修复 JavaScript 与原生入口识别，覆盖 npm_execpath 和 PATH。
- [x] 启动器回归测试、根治理检查及实际 tarball 三种预设验证通过。
- [x] 更新证据并归档；本次交付提交通过本文件 Git 历史定位，Linux 原生路径以 CI 实际结果为准。

## 实际结果、偏差、遗留与提交

原 CI 37751546113 的三个 Ubuntu / Node 24 / pnpm 12 任务将 ELF 交给 Node，安装阶段退出。修复后 Windows / Node 24.18.0 / pnpm 11.13.1 下根测试 33 PASS、1 项 Unix PATH 测试 SKIP；Lint、格式、文档、模块、提交规范通过。实际 tarball 的三种预设完成冻结且严格 peer 安装、格式、Lint、类型、模块、文档、生产构建、适用测试和 bootstrap 审计，全部 PASS；报告 .generated/package-verification-win32-all.json，完成时间 2026-10-08T12:12:01.830Z。产物基于含未提交修复的工作区，sourceCommit 记录当时 HEAD 966899b，不作为已公开发布证据。

本次没有发布 npm、推送远端或执行前端浏览器自动化；Linux 原生入口与完整 CI 矩阵需远端执行确认。完成计划触发归档复核，见同日 launcher-archive-review 计划。
