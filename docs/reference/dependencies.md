# 依赖与许可

Node 使用 ^20.19.0 || ^22.13.0 || >=24.0.0 范围，推荐 22；pnpm 使用 >=10.26.0。环境兼容即可，不强制最新补丁。直接依赖使用 ^ 兼容范围，锁文件保存实际验证过的依赖图。当前框架为 Vue 3、Vite 8、Nest 11、Fastify 5、TypeScript 6、Zod 4；TypeScript 7 超出 typescript-eslint 8.71.1 的 peer 范围，使用最新兼容 6.0.3；@types/node 对齐最低支持的 20 系列。安装不需要数据库或其他服务。

升级命令与兼容性边界见[依赖策略](../design/dependency-lifecycle.md)。本轮版本由 npm 官方 registry 与 Node 官方发布数据于 2026-10-08 查询；后续版本需重新核实。

直接依赖许可证已从实际安装包 package.json 核对，保留第三方包自身声明。MIT：Vue、Vite、plugin-vue、vue-tsc、Nest、Fastify、Zod、ESLint 与插件、Prettier、tsx、@types/node；TypeScript、reflect-metadata、rxjs 为 Apache-2.0；yaml 为 ISC。Node 的许可随运行时分发，不在模板中重新授权。

来源协作规范参考 Cyber-Sight 的 MIT 内容，保留 2026 JTLab 版权。模板无品牌图像、业务资源、历史会话、实际配置或凭据。详细实测版本与验证结果见维护仓库的 P1 记录；生成项目不继承该记录。
