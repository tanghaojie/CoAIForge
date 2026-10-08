---
title: 扩大 Node 与 pnpm 环境兼容范围
status: completed
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 扩大 Node 与 pnpm 环境兼容范围

## 目标、授权与设计依据

用户要求重新核实过高的 Node/pnpm 下限，兼容更多已有电脑环境。依据[依赖策略](../../design/dependency-lifecycle.md)，覆盖维护仓库、生成模板、安装设置、锁文件和 CI；不修改已有生成工程，不执行 npm 发布。起始工作区与暂存区为空，归档审计 NOT_DUE。

## 实施步骤和退出条件

- [x] 查询官方兼容说明、registry 和已锁定依赖，更新设计与记录
- [x] 支持 Node 20.19 与 pnpm 10.26，调整 Nest 11 与 Node 20 类型定义
- [x] 用最低环境验证维护仓库和 tarball 三种预设，检查较新环境
- [x] 更新最终证据、索引与归档；最终门禁通过后随本轮提交交付

## 实际结果、偏差、遗留与提交

Node 20.19.0 / pnpm 10.26.0 下，维护仓库 29 项测试和适用门禁通过，三种 tarball 预设的全部适用检查通过。Node 22.13.0 / pnpm 11.13.1 与 Node 24.21.0 / pnpm 12.10.1 的根冻结且严格 peer 安装与 fullstack 全部检查通过。Node 20 不展开测试 glob、Node 22 不接受目录参数，最终增加通用文件列表入口，失败码保留。详见[验证记录](../../reference/toolchain-compatibility-validation.md)。

前端浏览器人工验收沿用既有待验收计划；本轮无前端源码改动。远端 CI 与 npm 发布未执行。关联提交为包含本计划的 build(compat) 交付提交，由 Git 文件历史定位。
