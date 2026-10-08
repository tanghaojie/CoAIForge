# 环境兼容范围验证

2026-10-08（Asia/Singapore），Windows。本轮核实与修改仅在 CoAIForge，不修改 Cyber-Sight、已有生成工程或系统工具，不发布 npm。

## 下界依据

| 项目      | 原要求                 | 本轮要求及依据                                                                                             |
| --------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| Node      | ^22.13.0 \|\| >=24.0.0 | ^20.19.0 \|\| ^22.13.0 \|\| >=24.0.0；Vite 8 与 ESLint 10 的共同交集，推荐 Node 22                         |
| pnpm      | >=11.13.1 <13          | >=10.26.0 <13；allowBuilds 在 10.26 首次提供，保留现有安装安全设置                                         |
| Nest      | ^12.1.2                | ^11.2.7；Nest 12 common 锁定 file-type 22.1.1（Node >=22），Nest 11.2.7 使用 file-type 21.3.4（Node >=20） |
| Node 类型 | ^22.20.5               | ^20.19.43；对齐最低运行时                                                                                  |

官方依据：[Vite](https://vite.dev/guide/)、[ESLint 10 package.json](https://github.com/eslint/eslint/blob/v10.12.0/package.json)、[pnpm 10.26](https://pnpm.io/blog/releases/10.26)、[pnpm 环境兼容表](https://pnpm.io/installation)、[Node 20.19 require(esm)](https://nodejs.org/en/blog/release/v20.19.0)。Nest 和类型版本从 npm 官方 registry 实时查询，并核对提交锁文件。

## 实际验证

Node 20.19.0 从 Node 官方下载，ZIP 的 SHA256 与官方 SHASUMS256.txt 一致。pnpm 10.26.0 安装于项目忽略目录。Node 20 不展开 glob，Node 22.13 不接受测试目录参数；最终使用 run-tests.mjs 将目录转换为显式测试文件列表，治理、后端、契约测试均保留，未运行前端自动化。

维护仓库 Node 20.19.0 / pnpm 10.26.0：严格 peer 安装、格式、Lint、29 项测试、文档、模块和归档 CI 检查通过。根与三种模板锁文件逐个检查 engines，全部锁定包声明支持 Node 20.19.0，无 override 或忽略 engine 检查。

Node 20.19.0 / pnpm 10.26.0：实际 tarball 的 frontend/backend/fullstack 均完成冻结且严格 peer 安装、格式、Lint、类型、模块、文档、构建、适用测试和首提交前 bootstrap 检查，全部通过。后端包括真实监听与关闭，全栈包括 health 响应及契约实际导出测试。

本地验证产物为 C:\\Users\\thj_3\\AppData\\Local\\Temp\\coaiforge-package-jt3Vrl\\create-coaiforge-0.2.0.tgz，integrity 为 sha512-8gI+ArOu++3TaamWwtC8RfM8YCEUhYTmjlzzNJyOJQ15AKgitx5mYj1LldYZLUO/ZHr4JXdSwkTvvQdQ01wfRQ==。这是本轮工作树快照；包内 sourceCommit 为打包时的 HEAD 06278527c31e250938df47ec3ffe8029c9356b10，包含尚未提交的本轮实现，不能用此 SHA 或 0.2.0 文件名声称公开包已更新。报告为 .generated/toolchain-compatibility-node20.json。

Node 22.13.0 / pnpm 11.13.1、Node 24.21.0 / pnpm 12.10.1：维护仓库冻结且严格 peer 安装通过；各自的实际 tarball fullstack 输出完成上述全部适用检查。报告分别为 .generated/toolchain-compatibility-node22.json、.generated/toolchain-compatibility-node24.json。pnpm 12 使用原生 exe，三组工具链均在项目忽略目录，不修改系统级版本。

CI 已加入 Node 20.19.0 / pnpm 10.26.0 的 Windows/Linux 三种预设与治理矩阵；远端尚未执行。前端人工验收沿用既有待验收计划。公开 create-coaiforge@0.2.0 保持原范围，本轮不发布新版本。

收尾维护仓库格式、Lint、文档、模块和归档 CI 门禁通过，归档状态 NOT_DUE。本轮计划与协作记录标记 completed 后归档，设计与 ADR 描述最终范围；关联提交为本记录所在 build(compat) 提交，可通过 Git 文件历史定位。
