---
title: 兼容环境与 npm 发布协作记录
status: in_progress
change_type: build
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# AI 协作记录

## 用户目标、授权与关键指令

Node、pnpm 不用特别新，兼容就好；修改后发布 npm。已明确授权发布，不需重复请求发布许可。目标为 CoAIForge；已有前端介绍页已提交，纳入下一版本快照，保持实现和人工验收边界。

## 假设、选择与实际改动

直接/传递依赖 engines 显示 Node 22.13.0 是当前共同下界。声明 ^22.13.0 || >=24.0.0，推荐 Node 24 的任意兼容版本；pnpm >=11.13.1 <13。只通过 engines 检查环境，移除强制下载指定版本的 devEngines 与 pmOnFail。锁文件使用兼容的 pnpm 11 生成，再验证 pnpm 12 消费。@types/node 对齐最低 Node 22 能力。registry latest 为 0.1.0，下一发布使用 0.2.0，包含已提交的依赖升级与介绍页。

## 验证、偏差、未决事项和提交

git diff --cached --quiet 通过，工作区为空，任务前审计 NOT_DUE。npm whoami 返回可用发布身份；不读取/输出凭据。环境兼容和公开消费的实际结果完成后补充。旧浏览器人工验收计划保持 pending_human_acceptance。

发布源码阶段：29 项测试与全部维护门禁通过，Node 22 / pnpm 11 三种实际 tarball 工程全部通过；现有 Node 24.19.0 / pnpm 12.10.1 的 fullstack 检查通过。发布前提交经验证的源码，再对其快照验证最终发布 tarball。npm 10 打包 JSON 前的 prepare 输出已适配，没有降低检查。
