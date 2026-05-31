'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogEditor from '@/components/admin/blog-editor';
import { Card, CardContent } from '@/components/ui/card';
import type { BlogPostRow } from '@/lib/supabase-blog';

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/blog/posts/${params.id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Nie udało się pobrać wpisu');
        }

        setPost(result.post);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Błąd pobierania wpisu');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-xl w-full border-red-300 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-6 text-red-700 dark:text-red-200">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return <BlogEditor mode="edit" postId={params.id} initialData={post} />;
}
