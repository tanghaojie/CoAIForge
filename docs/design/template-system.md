---
title: 模板组合与 P1 实施
status: accepted
created: 2026-10-07
updated: 2026-10-07
owner: project maintainers
---

# 模板组合与 P1 实施

## 目标与当前状态

CoAIForge 是独立协作启动模板维护仓库。P1 技术实施已完成并通过 Windows 独立验证；前端人类验收和远端 Linux CI 尚待执行。来源方案及确认选择来自 Cyber-Sight 的 P0 设计和引用会话；不迁移来源业务或历史。

## 组合边界

公共规则与治理脚本只维护一份：根 AGENTS.md、docs 中的公共现行规范与模板、scripts 下的治理实现。组合清单显式选择这些文件进入输出。templates/base 提供公共配置，templates/frontend 和 templates/backend 提供空应用，templates/fullstack 补充唯一 health 示例。JSON 配置按清单合并；覆盖文件必须显式登记，禁止静默覆盖。

输出预设为 frontend、backend、fullstack。统一 pnpm workspace；单选不生成未选 workspace 或空能力目录。全栈含 packages/api-contract 的 Zod Schema、Nest/Fastify GET /health 及 Vue 状态显示；空后端没有默认业务路由。

P1 提供维护者组合工具和三套固定锁文件，供独立验证；不实现面向用户的交互 CLI，不确定 npm 包名，不发布 npm，不迁移 Geo 或公众号编辑器。创建工具不得覆盖已有项目。项目名与包作用域参数化；模板清单记录模板版本、预设与参数，CLI 版本在 P1 为空，不伪装已发布 CLI。

## 生命周期与验证

生成结果没有来源 Git 历史、计划、日志或 ledger SHA。初始 ledger 未登记；首个真实提交后显式登记基线。未来 CLI 默认仅 git init，不自动首提交。

治理脚本覆盖模块依赖、文档结构、提交规范和归档审计。三种组合分别在系统临时目录中安装、格式/Lint/类型/构建及适用测试，脱离来源和模板仓库均通过。契约由同一源码生成 ESM/CommonJS 条件导出，实际 import/require 与生产前端打包均通过。模块检查包含别名、动态导入、条件包导出、私有依赖、循环和应用 workspace 互导。前端验收由人类执行。Windows/Linux 成功与未执行项分别记录，不推断跨平台结果。

治理工具的公共维护入口为 scripts/docs/check.mjs 的 checkDocs、archive-audit.mjs 的 audit/recordBaseline、scripts/architecture/check-modules.mjs 的 checkModules、scripts/git/commit-message.mjs 的 checkCommitMessage、scripts/templates/compose.mjs 的 compose。工具不是生成应用的业务模块；应用边界仍由 src/modules 与注册表执行。组合器按唯一 Prettier 配置规范化最终输出；直接依赖和许可文档只列所选能力，三套锁文件冻结传递依赖。详细证据见[验证记录](../reference/p1-validation.md)。

## 来源与风险

来源提取基线为 19646b40de73e114bf5447cfc14166af2c84bb47，方案确认提交为 68d655d863301abdf6406bc1829cca08923406f1。MIT 来源声明保留 2026 JTLab。隐式授权、数据库和所有权审计依赖不进入目标。组合漂移、首提交循环门禁和私有依赖漏检通过独立测试处理。
