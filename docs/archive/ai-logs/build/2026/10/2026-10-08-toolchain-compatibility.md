---
title: 扩大 Node 与 pnpm 环境兼容范围
status: completed
change_type: build
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# AI 协作记录

## 用户目标、授权与关键指令

用户认为 Node ^22.13.0 || >=24.0.0、pnpm >=11.13.1 <13 门槛过高，要求核实并降低。仅操作 CoAIForge；Cyber-Sight 与既有生成工程不在范围内。

## 假设、选择与实际改动

官方 Vite、ESLint 与 Node ESM 兼容要求允许 Node 20.19；已锁依赖除 Nest common 引入的 file-type 22.1.1 外均声明支持。Nest 11.2.7 使用 file-type 21.3.4，模板无 Nest 12 专属 API，选择共同调整三个 Nest 包而非覆盖内部依赖。pnpm allowBuilds 从 10.26 支持，因此保留当前安全配置并扩大至 >=10.26.0 <13；Node 22 为推荐，20 为已有环境兼容。Node 20 类型定义与最低环境对齐，保留直接依赖范围和冻结锁文件。

## 验证、偏差、未决事项和提交

暂存区、工作区起始为空，归档 NOT_DUE。初次 pnpm 在沙箱内 realpath 返回 EPERM，原命令在授权环境运行通过。pnpm 10 跨版本重建本项目依赖目录时需要非交互 CI 模式，未删除人类文件或修改系统工具。

Node 20.19.0 / pnpm 10.26.0：根严格 peer 安装、29 项治理/CLI/模板测试、格式、Lint、文档、模块和归档门禁通过；frontend/backend/fullstack 实际 tarball 输出均通过冻结且严格 peer 安装和全部适用检查。Node 22.13.0 / pnpm 11.13.1 与 Node 24.21.0 / pnpm 12.10.1：根冻结且严格 peer 安装与 fullstack 全部适用检查通过。根与三套锁文件的包 engines 均声明支持 Node 20.19。

第一次下界验证暴露 Node 20 无 glob 展开；目录入口虽在 Node 20 通过，却在 Node 22.13 失败。最终增加 scripts/lib/run-tests.mjs，以显式文件列表和原退出码调用当前 Node，并重跑最低全部预设及较新环境全栈。未新增或执行前端自动化；既有人工验收事项保留，远端 CI 和 npm 发布未执行。

实际证据在维护仓库 docs/reference/toolchain-compatibility-validation.md 和 .generated/toolchain-compatibility-node20/22/24.json。计划与日志完成归档，关联提交为本记录所在 build(compat) 提交，真实执行模型从本次会话 turn_context 确认为 gpt-6.1-sol，提交后核验 trailer。
