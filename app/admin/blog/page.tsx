'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AdminBlogPost {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  featured: boolean;
  updated_at: string;
  published_at: string | null;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }

    setIsAuthenticated(true);

    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/admin/blog/posts');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Nie udało się pobrać wpisów');
        }

        setPosts(result.posts || []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Błąd pobierania wpisów');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    router.push('/admin/realizacje/dodaj');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten wpis blogowy?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Nie udało się usunąć wpisu');
      }

      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (deleteError) {
      alert(deleteError instanceof Error ? deleteError.message : 'Błąd usuwania wpisu');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">Twórz, edytuj i publikuj artykuły generowane przez AI.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/blog/dodaj">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />Nowy artykuł
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Powrót</Button>
            </Link>
            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />Wyloguj
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && !loading && (
          <Card className="p-6 border-red-300 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-200">{error}</Card>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {posts.length === 0 ? (
              <Card className="p-8 text-center col-span-full">
                <p className="text-gray-600 dark:text-gray-300 mb-4">Nie masz jeszcze żadnych wpisów blogowych.</p>
                <Link href="/admin/blog/dodaj">
                  <Button className="bg-blue-600 hover:bg-blue-700">Dodaj pierwszy artykuł</Button>
                </Link>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {post.status === 'published' ? 'Opublikowany' : 'Szkic'}
                        </span>
                        {post.featured && <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Wyróżniony</span>}
                      </div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{post.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <div>Aktualizacja: {new Date(post.updated_at).toLocaleString('pl-PL')}</div>
                    {post.published_at && <div>Publikacja: {new Date(post.published_at).toLocaleString('pl-PL')}</div>}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/blog/edytuj/${post.id}`} className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Pencil className="w-4 h-4 mr-2" />Edytuj
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
