# Aemaeth0's Notes

Personal GitHub Pages blog powered by Hexo, NexT, and an Obsidian vault stored in `source/`.

## Quick Start

```bash
npm ci
npm run check
npm run build
npm run server
```

## Repository Layout

- `source/_posts/`: published blog posts and post asset folders.
- `source/_template/`: Obsidian Templater templates.
- `source/.obsidian/`: Obsidian vault settings.
- `source/_data/`: NexT custom style hooks.
- `docs/BLOG_WORKFLOW.md`: writing and publishing workflow.

## Publish

Push the source branch `hexo`. GitHub Actions checks posts, builds the site, and deploys the generated output.
