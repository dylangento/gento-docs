# Gento 技术文档

[English](README.md) | 简体中文

Gento 产品文档网站源码，已发布于 https://docs.gentorobotics.ai。使用 Docusaurus 3.10.2 构建，涵盖 Marvin Pro、Marvin 和 Luna，Skye 即将推出。

## 本地运行

安装 Node.js 20 或更新版本及 npm（已在 Node 24 验证）。

```bash
npm ci
npm start -- --locale zh-CN
```

同时预览中英文及本地搜索：

```bash
npm run check:content
npm run build
npm run serve
```

网站地址为 http://localhost:3000/。如需在局域网内的其他设备上访问，请改用 `npm run start:lan` 或 `npm run serve:lan`。生产构建支持中英文切换，本地搜索索引在构建时生成，不需要外部搜索账号。

## 文档维护

英文正文位于 `docs/`；中文对应页面位于 `i18n/zh-CN/docusaurus-plugin-content-docs/current/`，两者路径保持一致。导航由 `sidebars.js` 管理，样式位于 `src/css/custom.css`，页面组件位于 `src/components/`。

中英文版本如有差异，以中文版本为准。更新流程及翻译指纹说明见 [CONTRIBUTING.md](CONTRIBUTING.md)。

`npm run check:content` 检查每个页面是否具备中英文版本、英文是否与当前中文内容同步，以及引用的图片是否存在。生产构建会在内部链接失效时报错。

## 发布

每次推送到 `main` 分支都会自动构建并发布到 GitHub Pages（`.github/workflows/deploy.yml`）。首次设置：

1. 仓库 **Settings → Pages**：将 **Source** 设为 **GitHub Actions**，**Custom domain** 填写 `docs.gentorobotics.ai`，可用后开启 **Enforce HTTPS**。
2. DNS（Dynadot）：为 `docs` 子域名添加 `CNAME` 记录，指向 `dylangento.github.io`。

## 权利声明

© 2026 Gento Robotics。文档、图片及产品资料未授予开源许可。依赖包的许可归其各自所有者。
