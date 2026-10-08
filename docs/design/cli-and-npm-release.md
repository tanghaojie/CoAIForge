---
title: create-coaiforge CLI 与 npm 发布
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# create-coaiforge CLI 与 npm 发布

## 目标与状态

维护者明确指定发布包名 create-coaiforge，并授权完成 CLI 和 npm 发布。首次版本 0.1.0 已于 2026-10-08 公开发布，latest 指向该版本；仓库和产品名仍为 CoAIForge。三种预设均已通过公开 npm 包实际创建，Windows/Linux 打包验证通过；P1 前端人工验收保持既有证据边界。完整证据见[发布验证](../reference/p2-release-validation.md)。

用户进一步授权发布 0.2.0：包含当前依赖范围、兼容环境要求与已提交的前端动画介绍页。环境不追新，只接受经验证的兼容范围。发布准备和本轮验证见[0.2.0 记录](../reference/v0.2.0-release-validation.md)；实际发布前不声明 registry 已更新。前端人工验收计划仍保留。

## 入口、依赖与数据流

源码模板的后续依赖调整见[升级策略](dependency-lifecycle.md)。已发布 0.1.0 的 tarball 与历史发布验证保持发布时事实；2026-10-08 的依赖升级尚未公开发布。

根包提供 bin/create-coaiforge.mjs，入口只调用 scripts/cli/create-project.mjs 的 runCli。CLI 是模板维护工具，不是生成应用的业务模块；公共边界沿用 scripts/templates/compose.mjs 的 compose。发布资源构建入口为 scripts/release/build.mjs 的 buildBundle。CLI 依赖组合器和 Node 内建交互/Git/文件接口，不引入交互框架；Prettier 为组合器运行时依赖，生成工程仍将其作为开发依赖。

用户可运行 npm create coaiforge@latest，选择 frontend/backend/fullstack、项目目录和项目名。支持位置目录、--preset、--name、--no-git、--no-interactive、--help 和 --version。无交互终端时必须提供目录和预设，缺失参数立即失败。Ctrl+C 正常取消，不写未确认项目。默认只 git init 并配置本地 hooks，不安装依赖、不创建首提交；--no-git 明确跳过初始化。已有非空目录不可覆盖，非法名称、预设及参数在写入前拒绝；Git 缺失在生成前报告，生成后初始化失败保留工程并报告人工恢复步骤。

服务层关闭 readline 并暂停/释放输入。Windows 原生控制台仍可能保留读句柄，因此 bin 在全部项目操作已结束、stdout/stderr 已刷新后显式结束交互进程；非交互调用使用正常退出码和自然退出，不截断管道输出。

CLI → 已打包的模板快照 → 临时资源目录 → 现有 compose → 独立目标工程 → 可选 Git 初始化。临时资源只包含清单指定的公共规则、治理源码、模板片段与固定锁文件，结束后清理。输出目录参数不作为 shell 字符串拼接；Git 由参数数组调用。

## npm 包边界与溯源

根 package.json 改为可发布的 create-coaiforge，登记 bin、files、repository、homepage、bugs、description 和公开 registry。npm 发布只包含 CLI、组合器所需实现、LICENSE/README 及 dist/template-bundle.json。资源以 JSON 快照保存，确保 .gitignore、.npmrc、.githooks 等模板文件不受 npm 打包忽略规则影响；不包含来源 .git、环境变量、凭据、node_modules、维护历史或测试目录。

快照记录模板版本和来源真实提交；生成清单额外记录 CLI 版本。组合器只选择生成工程的治理命令，不将打包/发布命令或 CLI 运行时依赖泄漏到生成工程。生成工程不复制来源计划、日志和审计台账基线。

发布以实际打包产物为单位：核对文件清单，在脱离源码的临时目录安装 tarball，运行三种 CLI 生成与工程检查，再 npm publish 该 tarball。核对 npm 实际版本、bin、依赖和完整性，使用已发布包创建工程。npm 身份或 2FA 由维护者在官方登录/授权流程完成，日志不记录凭据。发布失败保留已验证产物与准确状态，不声明发布成功。

## 验证与失败模式

CLI 测试覆盖三种选择、交互参数、无终端缺参、非法参数、取消、已有目录、Git 初始化且无首提交、--no-git 以及快照版本来源。发布验证覆盖 tarball 文件白名单、隐藏模板文件、隔离安装及三种生成结果适用的格式/Lint/类型/模块/文档/构建/治理与后端契约测试。前端不新增或运行浏览器自动化；模板界面未修改，P1 人类验收不扩展为新功能验收。运行仓库格式、Lint、治理测试、文档、模块和归档 CI 门禁；CI 增加 Windows/Linux 的打包隔离验证。

## 关联

- [完成计划](../archive/plans/2026-10-08-cli-npm-release.md)
- [发布决策](../decisions/ADR-20261008-create-coaiforge-release.md)
