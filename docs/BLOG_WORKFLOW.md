# Blog Workflow

This repository uses `source/` as both the Hexo source directory and the Obsidian vault.

## Daily Writing Flow

1. Open the `source/` folder in Obsidian.
2. Create public posts under `source/_posts/`.
3. Use the template at `source/_template/tp-hexo-post-init.md`.
4. Put images in an asset folder with the same name as the post.
5. Use standard Markdown image links:

```md
![scope capture](Post Title/image.png)
```

Avoid Obsidian-only embeds such as `![[image.png]]` and wiki links such as `[[note]]` in published posts, because Hexo will not render them as normal web links.

## Local Commands

```bash
npm run check
npm run build
npm run server
```

`npm run check` catches missing front matter and Obsidian-only links before publishing.
Completely empty Markdown files are ignored by the checker, but they should be renamed, completed, moved to drafts, or removed before publishing.

## Content Model

Recommended front matter:

```yaml
---
title: Article title
date: 2026-05-20 20:00:00
updated: 2026-05-20 20:00:00
categories:
  - Embedded
tags:
  - C
  - Linux
mathjax: false
---
```

Use categories as broad sections and tags as specific technologies. A practical split for this site:

- `Embedded`
- `IC`
- `Linux`
- `Tools`
- `Notes`

## Publishing

Push the Hexo source branch to `hexo`. GitHub Actions installs dependencies with `npm ci`, runs the post checker, builds the static site, and deploys the generated output through `hexo-deployer-git`.
