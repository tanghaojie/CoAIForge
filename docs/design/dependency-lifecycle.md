---
title: 运行时与依赖升级策略
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 运行时与依赖升级策略

## 目标与边界

维护仓库和三种生成工程允许兼容版本升级，不再以精确直接依赖或固定 Node/pnpm 补丁版本限制长期迭代。环境按实际兼容下界声明，无需特别新的 Node/pnpm。0.2.1 的 CLI 与模板提供较低环境下界、Nest 11 和 pnpm 无上限声明；历史 0.2.0 以其发布记录为准。不改既有生成工程、应用模块或 HTTP 契约。

## 环境与版本范围

Node engines 为 ^20.19.0 || ^22.13.0 || >=24.0.0，.node-version 推荐 22，已有兼容环境即可，不要求最新补丁。Node 20.19 是 Vite 8 与 ESLint 10 的共同下界；22 系列下界由 ESLint 10 的 ^22.13.0 决定。pnpm engines 为 >=10.26.0，10.26 是当前 allowBuilds 配置的首次支持版本。用户明确要求去掉 <13，不以未经验证的大版本上限阻止安装；目前实际验证覆盖 10/11/12，未来版本的兼容性仍需执行本工程检查。保留无 packageManager、devEngines.packageManager 和 pmOnFail 的行为，不自动下载或切换工具。组合器复制 engines，依赖说明从实际 engines 生成。CI 覆盖 Node 20.19.0 / pnpm 10.26.0、Node 22.13.0 / pnpm 11.13.1 与 Node 24 / pnpm 12，推荐版本与兼容下界分开。

应用/工具直接依赖继续使用 ^兼容版本范围；workspace:* 保持内部契约链接。TypeScript 7.0.2 超出 typescript-eslint 8.71.1 的 >=4.8.4 <6.1.0 peer 范围，因此使用兼容版本 ^6.0.3。@types/node 对齐最低支持的 Node 20，避免声明较新运行时才提供的 API。

后端选择 Nest 11 的 ^11.2.7 兼容系列，Fastify 5 保持不变。Nest 12.1.2 虽声明 core 支持 Node >=20，但 common 的 file-type 22.1.1 要求 Node >=22；Nest 11.2.7 使用支持 Node >=20 的 file-type 21.3.4。模板未使用 Nest 12 专属 API，因此为支持 Node 20 同步调整 common/core/platform-fastify，不用 overrides 强行替换框架内部依赖。后端仍产出 CommonJS，保留 NodeNext 编译与解析、契约条件导出及现有 HTTP 行为。

pnpm-workspace.yaml 集中配置 engineStrict: true、savePrefix: '^'、minimumReleaseAge: 1440 和受控 allowBuilds。pnpm 10 从 .npmrc 读取 engine-strict，因此 .npmrc 同时声明 engine-strict=true；这是兼容桥接，pnpm 11/12 使用 YAML。不降低安装权限或发行等待时间来扩大支持范围。锁文件使用 pnpm 10 可读取的 v9 YAML，不附带环境锁；所有支持系列使用冻结安装验证。

## 锁文件与更新路径

版本范围表达允许升级的边界，锁文件记录验证过的精确依赖图。日常与发布验证继续使用 pnpm install --frozen-lockfile；依赖更新使用 pnpm update -r，跨大版本更新需审查兼容性并执行完整验证。维护者修改根与模板声明后，通过 pnpm templates:locks 刷新三套锁文件，再验证实际 tarball 的三种输出。CI 检查兼容下界与推荐环境，但应用依赖仍从提交的锁文件安装。

## 数据流与失败模式

根环境/工具依赖与模板应用依赖进入组合器，产出 package.json、workspace 设置、依赖许可表与预设锁文件，再进入发布快照。pnpm 12 可能改变启动入口和锁文件格式；验证脚本必须支持原生 exe。依赖 peer 冲突、TypeScript 迁移、构建失败或 manifest/锁文件失配均阻止交付，不通过关闭检查掩盖问题。

## 验证与证据

Node 20 的测试运行器不展开 scripts/**/*.test.mjs 这类 glob 参数，而 Node 22.13 不接受目录发现入口。维护仓库和模板统一通过 scripts/lib/run-tests.mjs 收集指定目录中的 .test.mjs/.test.cjs/.test.js，再以显式文件参数调用当前 Node 的 --test；未找到测试时报错，子进程失败码向上传递。保持治理、后端和契约测试范围，不添加前端自动化测试。

执行维护仓库格式、Lint、治理测试、文档/模块/归档检查，刷新根与三套锁文件并验证实际 npm tarball 的 frontend/backend/fullstack 安装、格式、Lint、类型、构建及后端/契约测试。前端不运行浏览器或组件自动化；升级后的浏览器功能由维护者人工验收。Linux CI 已更新，但本轮仅将实际运行的平台登记为通过。

初次升级证据见维护仓库 docs/reference/dependency-upgrade-validation.md；本轮扩大环境范围见维护仓库 docs/reference/toolchain-compatibility-validation.md。生成工程不携带维护历史，环境说明由组合器从实际 engines 生成。锁文件刷新和两类模板验证入口显式使用 --strict-peer-dependencies，peer 失配不能被默默接受。
