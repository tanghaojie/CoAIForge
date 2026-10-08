---
title: CLI 实现与 create-coaiforge 首次 npm 发布
status: completed
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# CLI 实现与首次 npm 发布

## 目标、授权与依据

维护者授权实现交互 CLI 并将 create-coaiforge 发布到 npm。依据[CLI 设计](../../design/cli-and-npm-release.md)，保留 P1 三种模板和协作协议，不迁移 Geo 或桀士排版。

## 步骤与退出条件

- [x] 暂存区为空、工作区干净，首次修改前归档审计 NOT_DUE；准备设计、ADR 和日志。
- [x] 实现 CLI、参数验证、取消和 Git 生命周期，补充行为测试，根测试 29/29。
- [x] 实现白名单资源快照和 npm 打包，首次实际 tarball 的独立生成与三种工程均通过。
- [x] 格式、Lint、测试、文档、模块和归档 CI 门禁通过；最终发布源码 Windows/Linux 七项 CI 成功。
- [x] 发布并核验 registry 版本/完整性，维护仓库外三种预设均通过公开 npm 包实际创建。
- [x] 更新现行设计、验证证据、索引，完成记录归档；按模型身份规则提交并推送收尾文档。

## 实际结果、偏差、遗留与提交

依赖已安装；首次归档审计通过。包名查询返回 E404，维护者完成登录后身份核验成功。Windows/Node v24.19.0 上根测试和三种打包结果通过；输入清理修正经真实 readline 流和原生终端确认。技术交付形成独立提交以提供实际发布源码，公开 registry 消费和远端 CI 核验均完成。详细结果见[验证记录](../../reference/p2-release-validation.md)。

实施提交 97e3d90，终端修正及最终发布源码 61efd9a，均已推送并核验真实 GPT-6 trailer。两轮跨平台 CI 均七项成功。npm 0.1.0 已公开可用且 latest 指向该版本，完整性与已验证 tarball 一致；三种创建入口、来源清单和 Git 生命周期均实际复验成功。固定版本消费在维护仓库外完成，避免 npm 解析同名根包。没有遗留发布阻塞；后续 Geo/桀士排版迁移另行规划。收尾提交以 docs(release): record create-coaiforge 0.1.0 publication 在 Git 历史关联，避免在自身内容写入无法预先确定的 SHA。
