const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'source', '_posts');
const markdownFiles = [];
const problems = [];
const warnings = [];
const abbrlinks = new Map();

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

function valueOf(frontMatter, key) {
  const match = frontMatter.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

function hasKey(frontMatter, key) {
  return new RegExp(`^${key}:\\s*.+$`, 'm').test(frontMatter);
}

function hasListValue(frontMatter, key) {
  const direct = valueOf(frontMatter, key);
  if (direct) return true;

  const lines = frontMatter.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start === -1) return false;

  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\S/.test(line)) break;
    if (/^\s*-\s+\S/.test(line)) return true;
  }

  return false;
}

function postAssetFolderFor(file) {
  return path.join(path.dirname(file), path.basename(file, '.md'));
}

function imageTargetFrom(markdownTarget) {
  const withoutTitle = markdownTarget.trim().replace(/\s+["'][^"']+["']$/, '');
  const withoutHash = withoutTitle.split('#')[0];
  const withoutQuery = withoutHash.split('?')[0];
  try {
    return decodeURIComponent(withoutQuery);
  } catch {
    return withoutQuery;
  }
}

function isExternalOrAbsolute(target) {
  return /^(https?:)?\/\//i.test(target) || target.startsWith('/') || target.startsWith('#') || target.startsWith('data:');
}

walk(postsDir);

for (const file of markdownFiles) {
  const relative = path.relative(root, file).replace(/\\/g, '/');
  const text = fs.readFileSync(file, 'utf8');
  if (!text.trim()) {
    warnings.push(`${relative}: empty markdown file is ignored by the checker`);
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

  if (!hasListValue(frontMatter, 'categories')) {
    warnings.push(`${relative}: missing category; use one broad section such as Embedded, IC, Linux, Tools, or Notes`);
  }

  if (!hasListValue(frontMatter, 'tags')) {
    warnings.push(`${relative}: missing tags; add searchable technology keywords when the post is ready`);
  }

  const title = valueOf(frontMatter, 'title');
  if (!title) {
    problems.push(`${relative}: title is empty`);
  }

  const abbrlink = valueOf(frontMatter, 'abbrlink');
  if (abbrlink) {
    if (abbrlinks.has(abbrlink)) {
      problems.push(`${relative}: duplicate abbrlink "${abbrlink}" also used by ${abbrlinks.get(abbrlink)}`);
    } else {
      abbrlinks.set(abbrlink, relative);
    }
  }

  for (const match of text.matchAll(/!\[\[[^\]]+\]\]/g)) {
    problems.push(`${relative}:${lineOf(text, match.index)}: Obsidian embedded attachment should be standard markdown image syntax`);
  }

  for (const match of text.matchAll(/\[\[([^\]]+)\]\]/g)) {
    problems.push(`${relative}:${lineOf(text, match.index)}: Obsidian wiki link is not valid Hexo markdown: [[${match[1]}]]`);
  }

  for (const match of text.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = imageTargetFrom(match[1]);
    if (!target || isExternalOrAbsolute(target)) continue;

    const candidates = [
      path.resolve(path.dirname(file), target),
      path.resolve(postAssetFolderFor(file), target)
    ];

    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      problems.push(`${relative}:${lineOf(text, match.index)}: image file not found: ${target}`);
    }
  }
}

if (warnings.length) {
  console.warn('Post check warnings:\n');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
  console.warn('');
}

if (problems.length) {
  console.error('Post checks failed:\n');
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} markdown posts. No blocking issues found.`);
