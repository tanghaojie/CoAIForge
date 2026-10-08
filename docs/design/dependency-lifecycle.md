---
title: 运行时与依赖升级策略
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 运行时与依赖升级策略

## 目标与边界

维护仓库和三种生成工程允许兼容版本升级，不再以精确直接依赖或固定 Node/pnpm 补丁版本限制长期迭代。本轮覆盖环境声明、模板组合、锁文件、验证入口和 CI，不发布 npm 包、不改现有生成工程，也不改变应用模块和 HTTP 契约。

## 环境与版本范围

Node 使用最新 LTS，.node-version 与 CI 使用 lts/*，engines.node 声明 >=24.21.0。pnpm 使用 devEngines.packageManager 的 ^12.10.1 范围；删除只接受精确版本的顶层 packageManager，engines.pnpm 使用相同范围。onFail: warn 允许 npm pack/publish 的发布流程，pnpm-workspace.yaml 的 pmOnFail: download 让 pnpm 自动选择符合范围的版本。组合器复制 devEngines，依赖表从实际 engines 生成，避免硬编码环境。

直接依赖使用 ^最新稳定版本；workspace:* 保持内部契约链接。TypeScript 7.0.2 超出 typescript-eslint 8.71.1 的 >=4.8.4 <6.1.0 peer 范围，因此使用最新兼容版本 ^6.0.3。@types/node 使用与 LTS 对齐的 ^24.19.1，避免声明未提供的 Node 26 API。

Nest 12 发布 ESM 包，后端仍产出 CommonJS，编译模块与解析模式改为 NodeNext，以识别当前 Node 对同步 require(ESM) 的支持；Node16 的旧解析规则会拒绝这些导入。此兼容性由最低 Node 24.21.0 和实际后端生命周期测试约束，不关闭 TypeScript 检查。契约包的 ESM/CommonJS 条件导出保持原有结构。

pnpm 12 的配置集中在 pnpm-workspace.yaml：engineStrict: true、savePrefix: '^'、pmOnFail: download，保留 minimumReleaseAge: 1440 和受控 allowBuilds。.npmrc 不再携带 pnpm 已不读取的工程设置；后续 registry/auth 配置仍可按需写入。

## 锁文件与更新路径

版本范围表达允许升级的边界，锁文件记录验证过的精确依赖图。日常与发布验证继续使用 pnpm install --frozen-lockfile；依赖更新使用 pnpm update -r，跨大版本更新需审查兼容性并执行完整验证。维护者修改根与模板声明后，通过 pnpm templates:locks 刷新三套锁文件，再验证实际 tarball 的三种输出。CI 使用浮动 LTS 和 pnpm 范围，但应用依赖仍从提交的锁文件安装。

## 数据流与失败模式

根环境/工具依赖与模板应用依赖进入组合器，产出 package.json、workspace 设置、依赖许可表与预设锁文件，再进入发布快照。pnpm 12 可能改变启动入口和锁文件格式；验证脚本必须支持原生 exe。依赖 peer 冲突、TypeScript 迁移、构建失败或 manifest/锁文件失配均阻止交付，不通过关闭检查掩盖问题。

## 验证与证据

执行维护仓库格式、Lint、治理测试、文档/模块/归档检查，刷新根与三套锁文件并验证实际 npm tarball 的 frontend/backend/fullstack 安装、格式、Lint、类型、构建及后端/契约测试。前端不运行浏览器或组件自动化；升级后的浏览器功能由维护者人工验收。Linux CI 已更新，但本轮仅将实际运行的平台登记为通过。

Windows 实际验证与兼容性修正见维护仓库 docs/reference/dependency-upgrade-validation.md；生成工程不携带维护记录。锁文件刷新和两类模板验证入口显式使用 --strict-peer-dependencies，peer 失配不能被默默接受。
