---
title: create-coaiforge CLI 与 npm 发布协作记录
status: in_progress
change_type: feat
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# AI 协作记录

## 用户目标、授权与指令

用户指定发布包名 create-coaiforge，授权完成 CLI 与 npm 发布；维护者回复已完成 npm 登录。产品迁移另行实施。

## 假设、选择与实际改动

首次使用现有 0.1.0。沿用 P1 compose 与三种模板，Node/pnpm 固定配置保持现状。用 Node 内建交互和 JSON 模板资源快照避免新交互依赖及 npm 隐藏文件遗漏。默认仅初始化 Git，安装和首提交由用户执行。先完成文档门禁再实现。

## 验证、偏差、未决与提交

初始暂存区及工作区为空；pnpm docs:archive:check 为 NOT_DUE。依赖安装成功，维护者登录后身份核验成功。根 CLI/治理测试 29/29；三种 tarball 消费结果的全部适用检查通过。包内文件白名单、隐藏配置、未继承历史、Git 无首提交均确认。实际 readline 流复验交互和 Ctrl+C 的输入清理。未运行前端自动化。npm 生命周期日志混入 JSON 已改为显式构建后使用 --ignore-scripts 打包；发布仍使用实际验证的 tarball。实施提交用于发布源码溯源，整体计划保持进行中直至发布核验完成。详见[验证记录](../../../../reference/p2-release-validation.md)。
