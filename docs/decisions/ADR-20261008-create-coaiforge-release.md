---
title: create-coaiforge 发布名称与模板资源快照
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# create-coaiforge 发布名称与模板资源快照

维护者确认发布包名为 create-coaiforge，用户入口为 npm create coaiforge@latest。仓库及产品保持 CoAIForge，首次版本 0.1.0。CLI 提供三种工程选择，默认只初始化 Git，不安装依赖或首提交；允许参数化非交互创建和显式跳过 Git。

采用现有组合器与显式发布文件白名单。模板清单选择的资源构建为 JSON 快照，保证 .gitignore/.npmrc/hooks 完整且不把来源历史或秘密放入包。Prettier 是 CLI 运行时依赖，生成工程继续作为开发依赖使用；治理和应用依赖与包的发布命令隔离。

CLI 不覆盖已有项目；未来升级仍采用版本说明与显式迁移。通过实际 tarball 隔离验证和 registry 发布核验后才声明交付。该决定不增加业务、Geo SDK、模板升级器或产品迁移。

详细边界见[CLI 与发布设计](../design/cli-and-npm-release.md)。
