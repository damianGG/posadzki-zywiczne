import fs from 'node:fs';
import path from 'node:path';

export type PostJson = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags?: string[];
  cover?: string;
  canonical?: string;
  contentHtml: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export function getAllSlugs() {
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace(/\.json$/, ''));
}

export function getPostBySlug(slug: string): PostJson | null {
  const full = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, 'utf8');
  return JSON.parse(raw) as PostJson;
}

export function getAllPosts(): PostJson[] {
  return getAllSlugs()
    .map(s => getPostBySlug(s)!)
    .filter(Boolean)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const PAGE_SIZE = 10;

export function getPage(page: number) {
  const all = getAllPosts();
  const total = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  return { items, page, total };
}
