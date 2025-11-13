import { getAllPosts } from './mdx';

export const PAGE_SIZE = 10;

export function getPage(page: number) {
  const all = getAllPosts();
  const total = Math.ceil(all.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const items = all.slice(start, start + PAGE_SIZE);
  return { items, page, total };
}
