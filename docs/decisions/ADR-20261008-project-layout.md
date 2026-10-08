---
title: 工程工具集中到 scripts
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 工程工具集中到 scripts

维护者确认收拢根目录。Git hooks 进入 scripts/git/hooks，模块注册表进入 scripts/architecture/module-boundaries.json，维护仓库 CLI 可执行入口进入 scripts/cli/create-coaiforge.mjs。使用现有工具目录，保留公共命令和现有治理功能。

.npmrc 保留根目录以维持 pnpm 10 兼容，不为减少单个配置文件增加安装包装命令。生成工程不携带 CLI、维护历史或本次实施记录。已发布版本与已生成工程保持原布局，未来升级采用明确迁移。

模块边界审计同时识别旧、新路径，防止路径移位绕过复核。详见[布局设计](../design/project-layout.md)。
