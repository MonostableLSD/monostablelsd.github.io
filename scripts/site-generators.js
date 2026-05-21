'use strict';

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function fullUrl(hexo, item) {
  if (item.permalink) return item.permalink;
  const base = hexo.config.url || '';
  const path = item.path || '';
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

function toArray(collection) {
  if (!collection) return [];
  if (typeof collection.toArray === 'function') return collection.toArray();
  return Array.from(collection);
}

hexo.extend.generator.register('local_atom_feed', function generateFeed(locals) {
  const config = Object.assign({
    path: 'atom.xml',
    limit: 20,
    contentLimit: 240
  }, this.config.feed || {});

  const posts = toArray(locals.posts)
    .filter((post) => post.published !== false)
    .sort((left, right) => right.date.valueOf() - left.date.valueOf())
    .slice(0, config.limit);

  const siteUrl = (this.config.url || '').replace(/\/$/, '');
  const updated = posts[0] ? posts[0].updated || posts[0].date : new Date();

  const entries = posts.map((post) => {
    const url = fullUrl(this, post);
    const summarySource = post.description || post.excerpt || post.content || '';
    const summary = String(summarySource).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, config.contentLimit);

    return [
      '  <entry>',
      `    <title>${escapeXml(post.title)}</title>`,
      `    <link href="${escapeXml(url)}"/>`,
      `    <id>${escapeXml(url)}</id>`,
      `    <published>${post.date.toISOString()}</published>`,
      `    <updated>${(post.updated || post.date).toISOString()}</updated>`,
      `    <summary>${escapeXml(summary)}</summary>`,
      '  </entry>'
    ].join('\n');
  }).join('\n');

  const data = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <title>${escapeXml(this.config.title)}</title>`,
    `  <subtitle>${escapeXml(this.config.subtitle)}</subtitle>`,
    `  <link href="${escapeXml(siteUrl)}/"/>`,
    `  <link href="${escapeXml(siteUrl)}/${escapeXml(config.path)}" rel="self"/>`,
    `  <id>${escapeXml(siteUrl)}/</id>`,
    `  <updated>${updated.toISOString()}</updated>`,
    `  <author><name>${escapeXml(this.config.author)}</name></author>`,
    entries,
    '</feed>'
  ].join('\n');

  return { path: config.path, data };
});

hexo.extend.generator.register('local_sitemap', function generateSitemap(locals) {
  const config = Object.assign({ path: 'sitemap.xml' }, this.config.sitemap || {});
  const posts = toArray(locals.posts).filter((post) => post.published !== false);
  const pages = toArray(locals.pages).filter((page) => page.sitemap !== false);
  const items = posts.concat(pages)
    .filter((item) => item.path && !item.path.startsWith('_'))
    .sort((left, right) => String(left.path).localeCompare(String(right.path)));

  const urls = items.map((item) => {
    const updated = item.updated || item.date || new Date();
    return [
      '  <url>',
      `    <loc>${escapeXml(fullUrl(this, item))}</loc>`,
      `    <lastmod>${updated.toISOString()}</lastmod>`,
      '  </url>'
    ].join('\n');
  }).join('\n');

  const data = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>'
  ].join('\n');

  return { path: config.path, data };
});
