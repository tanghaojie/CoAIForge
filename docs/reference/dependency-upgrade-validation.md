# 依赖升级验证

2026-10-08（Asia/Singapore），本地 Windows。使用项目忽略目录中的官方 Node v24.21.0（SHA256 校验通过）和 pnpm 12.10.1 执行验证。系统级工具不作为本轮升级验证环境。

| 能力                              | 升级后的声明                                             |
| --------------------------------- | -------------------------------------------------------- |
| Node                              | 最新 LTS；最低 >=24.21.0，.node-version 为 lts/*         |
| pnpm                              | ^12.10.1，devEngines.packageManager + pmOnFail: download |
| Prettier                          | ^3.9.9                                                   |
| ESLint / Vue 插件                 | ^10.12.0 / ^10.11.1                                      |
| typescript-eslint                 | ^8.71.1                                                  |
| TypeScript                        | ^6.0.3                                                   |
| Vue / Vite / plugin-vue / vue-tsc | ^3.5.43 / ^8.3.3 / ^6.0.9 / ^3.3.12                      |
| Nest / Fastify                    | ^12.1.2 / ^5.12.5                                        |
| Zod                               | ^4.6.5                                                   |

其他直接依赖也采用兼容范围；没有新版的包保持当前最新版本作为范围下界。TypeScript 最新 7.0.2 超出 typescript-eslint 的 <6.1.0 peer 要求，选用最新兼容 6.0.3。@types/node 保持对齐 Node LTS 的 ^24.19.1。

## 实际检查

维护仓库的格式、Lint、29 项治理/CLI/组合测试、文档、模块与归档 CI 检查通过。三种预设的实际 tarball 消费验证包含安装、格式、Lint、类型、模块、文档、生产构建、治理与适用后端/契约测试、无首提交的归档 bootstrap 检查；各预设均已通过。最终使用严格 peer 安装参数重跑三种预设，全部通过；报告保存为 .generated/package-verification-win32-all.json，时间为 2026-10-08 11:26（Asia/Singapore）。

初次验证发现并修正两处真实迁移问题：npm 不接受 devEngines 中的 download 失败策略，因此使用 warn 并把下载配置放到 pnpm workspace；Nest 12 的 ESM 包不被 Node16 编译模式接受，后端改为 NodeNext，并通过实际监听/关闭测试。旧测试对 Prettier 精确版本的断言改为校验维护依赖是否正确传播。

CI 与生成 CI 跟随最新 LTS，pnpm 使用兼容范围。锁文件仍用于安装已验证的组合；pnpm update -r 更新兼容依赖后需重新验证。pnpm 12 使用环境和应用两个 YAML 文档记录包管理器及应用依赖，这两部分均由 pnpm 生成，未手写锁文件。

## 验收边界

本轮没有执行 Linux CI 或前端浏览器测试。升级后的前端启动与全栈成功/失败状态需维护者人工验收，活动计划保持 pending_human_acceptance。公开 npm 0.1.0 未重新发布；本轮报告针对本地升级源码的 tarball，不代表 registry 包已升级。
