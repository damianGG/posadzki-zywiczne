import fs from 'fs';
import path from 'path';
import { listDatabaseBlogPosts, getDatabaseBlogPostBySlug, mapBlogRowToPost } from '@/lib/supabase-blog';

export interface BlogPost {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  readTime: string;
  image: {
    url: string;
    alt: string;
    caption: string;
  };
  cover?: string;
  gallery?: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    canonicalUrl: string;
    ogTitle?: string;
    ogDescription?: string;
  };
  featured: boolean;
  status: 'published' | 'draft';
}

const dataBlogDirectory = path.join(process.cwd(), 'data/blog');
const contentPostsDirectory = path.join(process.cwd(), 'content/posts');

function readFileSystemBlogPosts(): BlogPost[] {
  try {
    const allPostsData: BlogPost[] = [];

    if (fs.existsSync(dataBlogDirectory)) {
      const dataFileNames = fs.readdirSync(dataBlogDirectory);
      const dataPosts = dataFileNames
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => {
          const id = fileName.replace(/\.json$/, '');
          const fullPath = path.join(dataBlogDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const postData = JSON.parse(fileContents) as BlogPost;

          return {
            ...postData,
            id,
          };
        });
      allPostsData.push(...dataPosts);
    }

    if (fs.existsSync(contentPostsDirectory)) {
      const contentFileNames = fs.readdirSync(contentPostsDirectory);
      const contentPosts = contentFileNames
        .filter((fileName) => fileName.endsWith('.json'))
        .map((fileName) => {
          const id = fileName.replace(/\.json$/, '');
          const fullPath = path.join(contentPostsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const postData = JSON.parse(fileContents) as BlogPost;

          return {
            ...postData,
            id,
          };
        });
      allPostsData.push(...contentPosts);
    }

    return allPostsData.filter((post) => post.status === 'published');
  } catch (error) {
    console.error('Error reading file-system blog posts:', error);
    return [];
  }
}

function mergeBlogPosts(databasePosts: BlogPost[], filePosts: BlogPost[]) {
  const postMap = new Map<string, BlogPost>();

  [...filePosts, ...databasePosts].forEach((post) => {
    postMap.set(post.slug || post.id, post);
  });

  return Array.from(postMap.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const databaseRows = await listDatabaseBlogPosts({ status: 'published' });
  const databasePosts = databaseRows.map(mapBlogRowToPost);
  const filePosts = readFileSystemBlogPosts();

  return mergeBlogPosts(databasePosts, filePosts);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const databasePost = await getDatabaseBlogPostBySlug(slug);

  if (databasePost) {
    return mapBlogRowToPost(databasePost);
  }

  try {
    let fullPath = path.join(dataBlogDirectory, `${slug}.json`);

    if (!fs.existsSync(fullPath)) {
      fullPath = path.join(contentPostsDirectory, `${slug}.json`);

      if (!fs.existsSync(fullPath) && fs.existsSync(contentPostsDirectory)) {
        const contentFiles = fs.readdirSync(contentPostsDirectory);
        const matchingFile = contentFiles.find((file) => file.endsWith(`-${slug}.json`) || file === `${slug}.json`);

        if (matchingFile) {
          fullPath = path.join(contentPostsDirectory, matchingFile);
        }
      }
    }

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const postData = JSON.parse(fileContents) as BlogPost;

    if (postData.status !== 'published') {
      return null;
    }

    return {
      ...postData,
      id: slug,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.featured).slice(0, limit);
}

export async function getLatestBlogPosts(limit = 3): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.slice(0, limit);
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts();
  return allPosts.filter((post) => post.category === category);
}

export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllBlogPosts();
  return Array.from(new Set(allPosts.map((post) => post.category)));
}

export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllBlogPosts();
  return Array.from(new Set(allPosts.flatMap((post) => post.tags)));
}

export async function getBlogPostsByCategories(): Promise<Record<string, BlogPost[]>> {
  const allPosts = await getAllBlogPosts();
  const categories = Array.from(new Set(allPosts.map((post) => post.category)));

  return categories.reduce(
    (acc, category) => {
      acc[category] = allPosts.filter((post) => post.category === category);
      return acc;
    },
    {} as Record<string, BlogPost[]>,
  );
}
