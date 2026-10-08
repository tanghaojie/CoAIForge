---
title: 前端滚动动画项目介绍
status: accepted
created: 2026-10-08
updated: 2026-10-08
owner: project maintainers
---

# 前端滚动动画项目介绍

## 目标、当前事实与非目标

用户要求修改 CoAIForge 前端 UI，以动画展示 AI + 人、合体构建和项目目录。frontend 和 fullstack 启动页已共用 introduction 动画介绍模块；fullstack 通过 service 插槽保留 health 状态和刷新。不增加动画依赖，不修改后端、health 契约、CLI 或发布版本。本轮不发布 npm；已有安装包不会因此自动更新。

## 职责、边界与公共文件

在 templates/frontend/apps/frontend/src/modules/introduction/ 提供公共组件 introduction.vue，由 App.vue 组装。组件接受 projectName 和 preset（frontend/fullstack），通过 service 插槽承载全栈现有 health 状态与刷新按钮。模块只依赖 Vue 和浏览器原生 API，不调用 health、不请求外部资源、不保存状态。Vue 文件的 ESLint 环境显式登记使用的 window、HTMLElement、ResizeObserver 和 MediaQueryList；保留 no-undef 检查。注册到前端与全栈的模块清单；生成工程携带对应模块设计。

## 视觉、数据流和失败模式

暖白纸面、黑色展示字、橙色人类轨迹与深色 AI 轨迹。首屏明确 AI + 人；粘性构建舞台随滚动使两个节点汇合成项目；下一段让目录逐行出现并突出协作规则、应用、契约与文档。目录随预设裁剪，frontend 不展示后端或共享契约；页面中的名称来自组合参数。

滚动监听只调度 requestAnimationFrame，由章节几何位置计算 0..1 进度；ResizeObserver 处理布局变化。反向滚动同步倒播；卸载移除事件、媒体查询监听、observer 与待执行帧。prefers-reduced-motion 下显示最终构建与全部目录行，关闭渐变位移和平滑滚动。窄屏缩小舞台并重排目录说明；高度不超过 570px 的短视口也显示完整静态内容，避免粘性舞台遮挡。键盘可用原生锚点到达目录，焦点有明确样式。

## 验证与人工验收

维护仓库运行格式、Lint、文档、模块、治理测试及归档 CI 检查。生成 frontend/fullstack 独立工程，分别冻结安装、类型和生产构建、文档与模块检查；现有后端/契约测试按全栈验证入口运行。不得运行前端自动化或浏览器测试。

人工验收检查桌面/手机宽度、顺向与反向滚动、AI 与人汇合、目录逐行展开、减少动画偏好、键盘锚点，以及全栈 health 加载/成功/失败/重试。本轮静态检查不能代替这些验收。

## 实际验证结果

2026-10-08 Windows：维护仓库 Lint、29 项现有治理/CLI/组合测试、文档与模块检查通过。使用已有官方 Node 24.21.0 与 pnpm 12 工具链，frontend/fullstack 分别在独立临时工程执行冻结且严格 peer 安装、格式、Lint、类型、模块、文档、生产构建、适用治理/后端/契约测试及首提交前 bootstrap 检查，全部通过。生成工程的 Vue 样式规则存在与 Prettier 格式重叠的 warning；Lint 零 error，不关闭语义检查。最终维护仓库格式与归档 CI 结果在实施计划记录。

初次尝试受系统默认 Node 24.19.0 的 engine 校验阻止，切换仓库已有工具链后验证；没有降低最低版本或修改系统安装。独立生成检查暴露 Vue 浏览器 globals 未登记，已在 Vue 规则块补足后重跑通过。

本轮人工验收待维护者，计划及日志保持 pending_human_acceptance，不归档为 completed。预览通过 Vite preview 在本机 127.0.0.1:4173 提供；这是打开待验收产物，不是浏览器验收通过。

## 关联

- [实施计划](../plans/active/2026-10-08-frontend-introduction.md)

最终维护仓库 pnpm format:check、docs:check、git diff --check 全部通过，pnpm docs:archive:check:ci 为 NOT_DUE。技术交付已验证，浏览器人工验收待维护者。
