---
title: 收拢根目录工程工具
status: completed
type: documentation-archive-review
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 实施计划

## 目标、授权与设计依据

用户明确要求按评估建议调整：hooks 与模块注册表收到 scripts，CLI 入口移入 scripts/cli，.npmrc 保留根目录。依据[布局设计](../../design/project-layout.md)，不减少既有协作治理功能，不修改已生成项目，不自动发布 npm。

## 实施步骤和退出条件

- [x] 暂存区门禁与工作区检查通过；启动归档审计 NOT_DUE；准备设计、ADR 与协作记录。
- [x] 移动文件，同步安装器、创建器、检查器、组合清单、发布白名单、测试与现行文档。
- [x] 执行根格式、Lint、治理测试及文档/模块检查；验证实际打包三种输出。
- [x] 完成模块边界移位触发的归档复核，归档计划/日志并更新索引；基线登记与台账提交按下述两阶段协议执行。

## 实际结果、偏差、遗留与提交

模块边界旧文件删除、新文件增加和现行模块设计更新触发 DUE；本计划同时承担该事项的归档复核，避免重复计划。核对三种预设注册表、共享清单、CLI、hooks、归档策略与 Git 历史，不改已发布版本证据或既有两份待人工验收计划。提交通过本计划 Git 历史定位。

按治理设计两阶段收尾：所有工程验证通过并完成复核内容归档后先提交；该时点的归档 CI 预期 DUE，保留证据。干净工作区使用真实完整提交 SHA 执行 docs:archive:complete，最终 docs:archive:check:ci 通过后提交台账，不提前写入未提交基线。

Windows Node 24.18.0 / pnpm 11.13.1 根检查与三种实际 tarball 输出验证通过，实际 hooks 及 npm 可执行命令通过，详见[验证记录](../../reference/project-layout-validation.md)。首次 hook 格式断言预期错误已修正并复验；根 .npmrc 未改。未执行 Linux、浏览器或 npm 发布；既有待人工验收计划不变。
