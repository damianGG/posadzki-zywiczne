import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;          // ISO
  updated?: string;      // ISO
  tags?: string[];
  canonical?: string;
  cover?: string;
  slug?: string;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;      // MDX source
};

export function getAllPostSlugs() {
  return fs.readdirSync(CONTENT_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx?$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  return {
    slug: fm.slug ?? slug,
    frontmatter: fm,
    content,
  };
}

export function getAllPosts(): Post[] {
  return getAllPostSlugs().map(s => getPostBySlug(s)!)
    .filter(Boolean)
    .sort((a,b)=> +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date));
}
