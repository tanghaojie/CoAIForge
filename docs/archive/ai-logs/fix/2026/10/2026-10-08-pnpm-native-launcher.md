---
title: pnpm 原生启动器修复记录
status: completed
change_type: fix
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# AI 协作记录

## 用户目标、授权与关键指令

用户要求修复已定位的 CI 失败；保留维护者内容，执行项目验证并自动提交。未授权 npm 发布。

## 假设、选择与实际改动

三个预设共享 scripts/lib/pnpm.mjs。原实现仅识别 .exe，Linux pnpm 12.10.1 的 ELF 被 Node 解析。以真实路径和平台识别启动方式，保留 Windows shim 兼容；不降低 pnpm 范围或删除失败矩阵。

## 验证、偏差、未决事项和提交

首次修改前暂存区与工作区为空，归档审计 NOT_DUE。Windows / Node 24.18.0 / pnpm 11.13.1 下根测试 33 PASS、1 Unix PATH 测试 SKIP，Lint、格式、文档、模块、提交规范通过；实际 tarball 的 frontend/backend/fullstack 完整验证全部 PASS，报告 .generated/package-verification-win32-all.json。模板共享 scripts/lib，因此产物也执行新增维护脚本回归测试，不添加前端自动化。

Linux 原生路径尚未实测，由现有 CI 矩阵验证；没有 npm 发布或远端推送。临时 tarball 来自含修复的工作区，其 sourceCommit 为当时 HEAD 966899b，不能当作 registry 更新。交付提交由本文件 Git 历史定位；完成计划触发同日归档复核。
