---
title: health 最小调用模块
status: accepted
created: '{{DATE}}'
updated: '{{DATE}}'
owner: project maintainers
---

# health 最小调用模块

## 职责与边界

唯一示例是 GET /health 的进程存活状态，响应为 `{ status: 0, data: { status: 'ok', timestamp: '<ISO datetime>' } }`。不表示数据库或外部服务就绪，无请求参数、认证或持久化。不预装管理 UI、路由或状态管理。

## 公共文件与依赖

- 前端 src/modules/health/health.api.ts：请求、超时及响应校验。
- 后端 src/modules/health/health.module.ts：应用组装入口；Controller、Service 和异常适配器为模块内部。
- 契约 src/modules/health/health.schema.ts：通过 @{{PROJECT_NAME}}/api-contract/health 显式子路径导出；同一源码生成 dist/esm 与 dist/cjs 的 js/d.ts，import/require 条件分别供前端与后端使用，无根 barrel。

跨层模块名均为 health，无其他模块依赖。Zod Schema 是唯一响应结构来源，类型由 z.infer 推导。控制器只委派，服务生成并校验状态。无输入时不添加未用校验基础设施；未来输入必须运行时校验。

## 数据流与失败模式

Vue 展示层 → health API → GET /health → Controller → Service → Zod Schema；前端再次校验。5 秒超时、不可达、HTTP 失败和非法响应均进入失败状态；卸载或替换请求会取消，旧请求不能覆盖新状态。手动刷新，不轮询。

全栈注册异常适配器，未找到资源输出 HTTP404/1004，内部异常输出 HTTP500/1500，内部详情不送给前端；其他状态按通用 HTTP 规范映射。错误码见[登记表](../../reference/error-codes.md)。

开发 Vite 同源代理 /health 到 127.0.0.1:3000。生产构建可用 VITE_API_BASE_URL；不自动开放跨域来源。后端 HOST/PORT 的 .env.example 仅为配置参考，实际由运行环境注入，不自动加载 dotenv。

## 验证

后端测试真实 HTTP、注入响应、时间格式、异常结构及关闭；契约测试真实 ESM/CommonJS dist 子路径与非法数据。前端仅静态检查和构建；加载/成功/失败、刷新、网络超时与部署调用由人类验收。
