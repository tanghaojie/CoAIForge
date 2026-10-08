---
title: 根目录与工程工具布局
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 根目录与工程工具布局

## 目标与边界

根目录保留应用入口、文档入口、workspace 与工具默认发现所需的配置；已有工程工具统一放入 scripts，不增加新的根目录。收拢文件位置，保留提交门禁、模块边界检查、归档审计和环境兼容策略。

## 文件与公共入口

- Git hooks 放入 scripts/git/hooks/pre-commit 与 commit-msg；Git 的 core.hooksPath 为 scripts/git/hooks。scripts/git/install-hooks.mjs 负责安装，pnpm prepare 是维护仓库及生成工程的公共入口。
- 模块注册表放入 scripts/architecture/module-boundaries.json；pnpm modules:check 使用该位置。各路径仍相对工程根目录，注册内容与模块设计保持一致。
- 仅 CoAIForge 维护仓库保留 scripts/cli/create-coaiforge.mjs 可执行入口，package.json 的 bin、cli 命令和发布白名单指向它；生成工程不包含 CLI。
- 根 .npmrc 保留 engine-strict=true，维持 pnpm 10 兼容；pnpm-workspace.yaml 保留现有环境与安装策略。

## 数据流、迁移与失败模式

组合清单将 hooks、检查器及布局设计复制到工程；architecture 仅显式选取检查器及其测试，不复制维护仓库注册表。base 层提供独立空注册表，frontend/backend 合并片段，全栈显式覆盖完整表。CLI 初始化 Git 时指定新 hooks 路径，后续 pnpm prepare 重新安装。维护仓库移位后也执行 pnpm prepare，避免本地 Git 继续引用旧目录。

已生成工程不自动移动文件；后续使用明确版本说明迁移。归档策略即时触发路径同时保留旧 .module-boundaries.json 和新路径，以便审计迁移及旧基线，阈值不变。发布产物使用显式文件白名单，不能携带 CLI 测试或维护历史。

旧 hooks 配置会丢失提交门禁，旧注册表引用会导致模块检查失败，发布入口失配会导致安装后无法执行命令；不能通过忽略错误或取消检查处理。

## 验证策略

执行格式、Lint、治理测试、文档/模块检查；从实际 npm tarball 在隔离目录创建 frontend/backend/fullstack，执行冻结安装、类型、构建及适用测试。验证 Git 初始化、pnpm prepare 重装、实际 hooks 拒绝非法提交以及保留暂存格式化。根目录不再含 .githooks、bin、.module-boundaries.json，生成工程仍不含 CLI。

模块边界移位触发归档复核，完成后先提交已复核内容，再按真实提交登记基线，最终执行 docs:archive:check:ci。前端不执行浏览器自动化；本次不改应用行为。npm 发布和远端 CI 以实际执行证据为准。
