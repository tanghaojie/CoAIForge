# create-coaiforge 发布

使用最新 Node LTS（最低 24.21.0）、pnpm ^12.10.1。包名为 create-coaiforge，仓库名称仍为 CoAIForge；npm create coaiforge@latest 调用包的 bin 入口。

1. 更新根 package.json 版本和发布记录。模板与 CLI 版本保持同一发布版本，检查用户可见变化和生成工程依赖。
2. 执行 pnpm install --frozen-lockfile、pnpm format、pnpm format:check、pnpm lint、pnpm test、pnpm docs:check、pnpm modules:check、pnpm docs:archive:check:ci。
3. 执行 pnpm package:verify。它打包到系统临时目录，检查包文件白名单，脱离源码安装该 tarball，然后通过已安装 CLI 生成三个工程并运行适用检查。报告保存到 .generated/package-verification-<platform>-all.json，包含准确 tarball、integrity、来源提交和工程目录。CI 使用 --preset 分别验证 Windows/Linux 的三种结果。
4. 检查报告和实际 tarball，使用 npm whoami 确认发布账号。登录和 2FA 通过 npm 官方流程完成，不能把令牌或验证码写入仓库、日志或聊天。
5. 使用 npm publish <已验证 tarball 的绝对路径> --access public --registry=https://registry.npmjs.org/ 发布该产物。发布失败不擅自增加版本或声明成功；原版本已经存在时先检查实际 registry 状态。
6. 使用 npm view create-coaiforge@<版本> version bin dependencies dist.integrity --json 验证与报告一致，再在维护仓库之外的独立目录通过 npm create coaiforge@<版本> 创建工程，确认其清单中的 CLI/模板版本和来源。维护仓库内的同名同版本根包可能被 npm 优先采用，不能作为公开消费证据。平台提示处理中时，等实际版本可查询后继续验证，不重复发布。
7. 补充实际发布证据，完成计划与日志归档、索引和提交。保留本地验证与远端 CI 的实际边界。

prepack 重建 dist/template-bundle.json。快照只纳入清单登记的模板资源，不纳入本机环境、来源历史或凭据；发布目录中的根 bin、组合器实现和运行时依赖由 package.json files/dependencies 控制。维护者发布实际已验证 tarball，不在验证后重新打包不同产物。
