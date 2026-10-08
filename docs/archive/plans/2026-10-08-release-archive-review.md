---
title: 0.2.0 发布后的文档归档复核
status: completed
type: documentation-archive-review
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 0.2.0 发布后的文档归档复核

## 目标、授权与设计依据

按[文档治理](../../design/documentation-governance.md)完成发布收尾。原基线为 6ae8374cee41f34fd432e759a0ea3e5b61d4683c；0.2.0 发布计划归档后审计为 DUE：completedPlans 3 >= 3。没有已有复核计划，不更改阈值或跳过门禁。

## 实施步骤和退出条件

- [x] 根据当前源码、最终 tarball、公开生成清单与 Git 历史核对现行设计和 ADR
- [x] 同步发布状态、兼容环境和前端介绍页的发布事实，保留实际人工验收边界
- [x] 核对索引、文档结构与适用门禁，完成计划与日志归档
- [x] 确认两步收尾路径：提交真实复核内容后登记该提交为基线，最终 CI 结果由台账提交补记

## 实际结果、偏差、遗留与提交

当前实现来源为发布源码 d07a9fcac33cbc1d40e57ab2c9de46cfaa8c80f9，0.2.0 registry 完整性匹配。组合器、锁文件、CI 与环境策略一致；三种预设的 CLI/模板版本、来源和环境范围通过公开包验证。CLI/环境两份 ADR 仍有效，不新增重复决策。模板组合、模块边界和 API health 契约不变；已有治理及后端/契约测试继续适用。

0.1.0 与初次依赖升级验证保留当时事实，通过现行来源链接说明后续变化，不重写历史。两份前端相关计划保持 pending_human_acceptance，没有把发布认证或自动化门禁写成人工功能验收。

收尾提交与台账需要两步：先提交已完成并归档的复核内容，再对干净工作区的真实完整 SHA 执行 docs:archive:complete；台账变更经最终 CI 通过后另行提交。

复核阶段实际结果：格式、Lint、29 项测试、文档结构、模块、提交规范与 git diff --check 均通过。活动复核审计为 IN_PROGRESS；按协议先提交本计划的完成归档内容，再登记真实 SHA，不能在提交复核内容前伪造 NOT_DUE。

收尾已完成：复核内容提交 e6c43b6a22cfb46b8a4af629a45a65bf4b8fa844，AI trailer 已核验；在干净工作区登记该真实 SHA 为基线。2026-10-08T04:42:42.353Z 台账记录覆盖当前 3 份有效 ADR 和 4 份完成计划，docs:archive:check:ci 输出 NOT_DUE，无活动复核、无待处理触发。台账及本收尾证据由后续 docs(governance) 提交保存。
