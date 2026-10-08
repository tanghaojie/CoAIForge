# 历史归档

- [扩大环境兼容范围计划](plans/2026-10-08-toolchain-compatibility.md)与[协作记录](ai-logs/build/2026/10/2026-10-08-toolchain-compatibility.md)：Node 20 / pnpm 10 的三种预设、Node 22/24 的全栈验证通过；当前来源为[依赖策略](../design/dependency-lifecycle.md)与[兼容验证](../reference/toolchain-compatibility-validation.md)。

- [0.2.0 发布归档复核](plans/2026-10-08-release-archive-review.md)与[协作记录](ai-logs/docs/2026/10/2026-10-08-release-archive-review.md)：完成计划阈值触发，复核现行设计、公开发布和历史验收边界；真实基线以 archive-ledger.json 为准。

- [兼容环境与 0.2.0 发布计划](plans/2026-10-08-compatible-environment-release.md)与[协作记录](ai-logs/build/2026/10/2026-10-08-compatible-environment-release.md)：0.2.0 已公开发布，Node 22/24 与 pnpm 11/12 实际兼容验证、三种预设公开创建通过；现行来源为[依赖策略](../design/dependency-lifecycle.md)及[0.2.0 发布验证](../reference/v0.2.0-release-validation.md)。

- [CLI 与 npm 发布完成计划](plans/2026-10-08-cli-npm-release.md)与[协作记录](ai-logs/feat/2026/10/2026-10-08-cli-npm-release.md)：create-coaiforge@0.1.0 已公开发布，三种预设消费与 Windows/Linux CI 通过，现行来源为[CLI 设计](../design/cli-and-npm-release.md)及[发布验证](../reference/p2-release-validation.md)。
- [P1 完成计划](plans/2026-10-07-starter-p1.md)与[人工验收记录](ai-logs/docs/2026/10/2026-10-07-p1-acceptance.md)：维护者确认通过，全部 P1 退出条件满足。
- [P1 远端推送与跨平台验证](ai-logs/ci/2026/10/2026-10-07-p1-remote-validation.md)：master 已推送，Windows/Linux 全矩阵与治理 CI 通过。
- [P1 技术实施记录](ai-logs/feat/2026/10/2026-10-07-starter-p1.md)：三种工程与治理技术验证完成。

先从现行设计和活动计划获取事实；仅在历史查证时读取历史。

策略 archive-policy.json、台账 archive-ledger.json、即时触发 archive-triggers.json。台账初始未登记，不能复制其他项目 SHA。生成项目不携带维护仓库的历史。
