# Blog Workflow

This repository uses `source/` as both the Hexo source directory and the Obsidian vault.

## Daily Writing Flow

1. Open the `source/` folder in Obsidian.
2. Keep private notes under `source/_notes/`.
3. Draft publishable articles under `source/_drafts/`.
4. Move ready articles into `source/_posts/`.
5. Use the template at `source/_template/tp-hexo-post-init.md`.
6. Put images in an asset folder with the same name as the post.
7. Use standard Markdown image links:

```md
![scope capture](Post Title/image.png)
```

Avoid Obsidian-only embeds such as `![[image.png]]` and wiki links such as `[[note]]` in published posts, because Hexo will not render them as normal web links.

## Local Commands

```bash
npm run check
npm run build
npm run preview
npm run server
```

`npm run check` catches missing front matter, duplicate explicit `abbrlink` values, Obsidian-only links, and missing local images before publishing.
Completely empty Markdown files are ignored by the checker, but they should be renamed, completed, moved to drafts, or removed before publishing.

## Content Model

Recommended front matter:

```yaml
---
title: Article title
date: 2026-05-20 20:00:00
updated: 2026-05-20 20:00:00
categories:
  - 嵌入式软件
tags:
  - C
  - Linux
mathjax: false
---
```

Use categories as broad sections and tags as specific technologies. Keep categories aligned with the `/start/` reading entry:

- `嵌入式软件`
- `芯片 Bring-up`
- `量产测试`
- `Linux 与工具链`
- `数字花园`

Keep categories broad. Use tags for searchable details such as `UART`, `I2C`, `SPI`, `OpenOCD`, `FPGA`, `Bring-up`, `ATE`, `Linux`, `Git`, and `Flash`.

## Article Shape

Use this structure for engineering notes when it fits:

```md
## Background
## Symptom
## Environment
## Debugging Process
## Key Takeaways
## Reusable Commands
## References
```

The point is to make each post useful after the immediate problem has faded from memory.

## Publishing

Push the Hexo source branch to `hexo`. GitHub Actions installs dependencies with `npm ci`, runs the post checker, builds the static site, and deploys the generated output through `hexo-deployer-git`.

The Hexo build generates `atom.xml` and `sitemap.xml` through `scripts/site-generators.js`, without extra npm dependencies.
