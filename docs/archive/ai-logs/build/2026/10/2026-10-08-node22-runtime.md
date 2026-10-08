---
title: 收敛 Node 运行时范围协作记录
status: completed
change_type: build
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 收敛 Node 运行时范围协作记录

## 用户目标、授权与关键指令

用户在比较 Node 20.0、22.0 与现有依赖限制后，明确选择保留现有依赖，将 engines.node 收敛为 ^22.13.0 || >=24.0.0。

## 假设、选择与实际改动

起始 HEAD ef3e16a93db182be20ec3a966a259b4884ca25bf，工作区和暂存区为空；归档 NOT_DUE。组合器已复制根 engines，无需修改生成器实现。将原 Node 20 / pnpm 10 的 CI 组合改为 Node 22.13 / pnpm 10，保留 pnpm 10/11/12 的覆盖。保持所有依赖、锁文件、.node-version、pnpm 范围与 engineStrict；更新现行设计及 ADR，保留已发布版本的历史事实。

## 验证、偏差、未决事项和提交

Windows / Node 24.18.0 / pnpm 11.13.1：冻结且严格 peer 安装、格式化、Lint、文档及模块检查通过；34 项治理测试中 33 通过、1 项 Unix 专属测试跳过，包括三种组合及 bundled CLI。重建快照后从真实 CLI 创建三种预设，核对 engines、推荐版本、说明与预设锁文件通过，报告 .generated/node22-range-proof.json。通过原始 package.json 和 Git diff 确认依赖及根/模板锁文件不变。

没有依赖升级或应用行为变更，未重复应用构建和 Node 22.13 下安装；不运行前端自动化。计划和日志已归档，最终格式、文档及归档 CI 门禁通过，随本轮自动提交交付。远端 CI 未运行，npm 未发布，未推送。

关联提交：build(runtime): require Node 22.13 or 24 and newer；本记录随该提交归档，SHA 以 Git 历史为准。
