const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'source', '_posts');
const markdownFiles = [];
const problems = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function frontMatterOf(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  return text.slice(3, end).trim();
}

function hasKey(frontMatter, key) {
  const pattern = new RegExp(`^${key}:\\s*.+$`, 'm');
  return pattern.test(frontMatter);
}

walk(postsDir);

for (const file of markdownFiles) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  if (!text.trim()) {
    continue;
  }

  const frontMatter = frontMatterOf(text);

  if (!frontMatter) {
    problems.push(`${relative}: missing YAML front matter`);
    continue;
  }

  for (const key of ['title', 'date']) {
    if (!hasKey(frontMatter, key)) {
      problems.push(`${relative}: missing required front-matter key "${key}"`);
    }
  }

  const emptyTitle = /^title:\s*(['"])?\s*\1?\s*$/m.test(frontMatter);
  if (emptyTitle) {
    problems.push(`${relative}: title is empty`);
  }

  for (const match of text.matchAll(/!\[\[[^\]]+\]\]/g)) {
    problems.push(`${relative}:${lineOf(text, match.index)}: Obsidian embedded attachment should be standard markdown image syntax`);
  }

  for (const match of text.matchAll(/\[\[([^\]]+)\]\]/g)) {
    problems.push(`${relative}:${lineOf(text, match.index)}: Obsidian wiki link is not valid Hexo markdown: [[${match[1]}]]`);
  }
}

if (problems.length) {
  console.error('Post checks failed:\n');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} markdown posts. No blocking issues found.`);
