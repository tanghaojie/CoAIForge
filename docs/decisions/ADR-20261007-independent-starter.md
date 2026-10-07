---
title: 独立组合模板与协作治理
status: accepted
created: 2026-10-07
updated: 2026-10-07
owner: project maintainers
---

# 独立组合模板与协作治理

CoAIForge 独立维护公共基础、前端/后端片段和全栈 health 补充，统一 pnpm；AGENTS 和公共规范只维护一份。单选为空应用，全栈只演示 health 与 Zod 契约。不预置业务、数据库、管理 UI 或同步机制。

沿用严格文档门禁、真实模型 AI trailer、验证后默认提交和前端人类验收。单项目归档默认 20/3/3/30，保留即时触发。MIT 来源署名保留。

未来 CLI 默认只 git init，不自动首提交；首个真实提交后显式登记基线。P1 是模板与治理阶段，CLI 交互、npm 名称与发布以及产品迁移另行实施。版本化发布、变更记录与显式迁移是未来升级方向，生成工具不能覆盖既有工程。
