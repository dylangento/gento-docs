# Gento documentation

English | [简体中文](README.zh-CN.md)

Source for the Gento product documentation website, published at https://docs.gentorobotics.ai. Built with Docusaurus 3.10.2. Covers Marvin Pro, Marvin, and Luna; Skye is coming soon.

## Run locally

Use Node.js 20 or newer (validated on Node 24) and npm.

```bash
npm ci
npm start
```

The development server starts the English site. For Chinese:

```bash
npm start -- --locale zh-CN
```

To preview both languages and the local search index:

```bash
npm run check:content
npm run build
npm run serve
```

The site opens at http://localhost:3000/. To view it from another device on your network, use `npm run start:lan` or `npm run serve:lan` instead. The language switch works across both languages in the production build. Local search is generated at build time; it needs no external search account.

## Edit content

| Location | Purpose |
| --- | --- |
| `docs/` | English MDX pages |
| `i18n/zh-CN/docusaurus-plugin-content-docs/current/` | Chinese counterparts with identical paths |
| `static/img/` | Images |
| `src/components/` | Page components (for example the video cards) |
| `sidebars.js` | Navigation structure |
| `src/css/custom.css` | Site styling |

If the English and Chinese versions differ, the Chinese version applies. See [CONTRIBUTING.md](CONTRIBUTING.md) for the update workflow and translation fingerprints.

`npm run check:content` confirms every page has both languages, that English pages match the current Chinese text, and that referenced images exist. The production build fails on broken internal links.

## Publishing

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/deploy.yml`). One-time setup:

1. Repository **Settings → Pages**: set **Source** to **GitHub Actions** and **Custom domain** to `docs.gentorobotics.ai`, then turn on **Enforce HTTPS** once it's available.
2. DNS (Dynadot): a `CNAME` record for the `docs` subdomain pointing to `dylangento.github.io`.

## Rights

© 2026 Gento Robotics. No open-source license is granted for the documentation, images, or product materials. Dependency licenses remain with their respective packages.
