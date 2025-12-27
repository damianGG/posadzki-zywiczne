'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Plus, LogOut, Globe, Instagram, Facebook, Linkedin, Music, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import type { SocialMediaPost } from '@/types/social-media';

const PLATFORM_ICONS = {
  google_business: Globe,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music,
  pinterest: ImageIcon,
  linkedin: Linkedin,
};

const PLATFORM_NAMES = {
  google_business: 'Google Business',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
};

const STATUS_LABELS = {
  draft: '📝 Szkic',
  scheduled: '⏰ Zaplanowano',
  published: '✅ Opublikowano',
  failed: '❌ Niepowodzenie',
};

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  scheduled: 'bg-blue-100 text-blue-800',
  published: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};

export default function SocialMediaListPage() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [oauthConnected, setOauthConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);

    // Check OAuth connection
    checkOAuthConnection();
    
    // Fetch posts list
    fetchPosts();
  }, [router]);

  const checkOAuthConnection = async () => {
    try {
      const response = await fetch('/api/admin/social-media/posts?limit=1');
      if (response.ok) {
        // Check if we have Google Business token
        const { data } = await response.json();
        // For now, assume connected if we can fetch posts
        setOauthConnected(true);
      }
    } catch (err) {
      console.log('OAuth check failed', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (filterPlatform !== 'all') params.append('platform', filterPlatform);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/admin/social-media/posts?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || 'Nie udało się pobrać listy postów');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/social-media/posts/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Post został usunięty pomyślnie');
        fetchPosts(); // Refresh list
      } else {
        alert(data.error || 'Nie udało się usunąć posta');
      }
    } catch (err) {
      alert('Błąd podczas usuwania posta');
    }
  };

  const handlePublish = async (id: string) => {
    if (!confirm('Czy opublikować ten post na platformie?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/social-media/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: id }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Post został opublikowany pomyślnie!');
        fetchPosts(); // Refresh list
      } else {
        alert(data.error || 'Nie udało się opublikować posta');
      }
    } catch (err) {
      alert('Błąd podczas publikacji posta');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    router.push('/admin/realizacje/dodaj');
  };

  const handleConnectGoogle = () => {
    window.location.href = '/api/admin/social-media/oauth/google';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Social Media
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                Zarządzaj postami w social mediach
              </p>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Link href="/admin/social-media/dodaj" className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Dodaj Nowy Post</span>
                  <span className="sm:hidden">Dodaj</span>
                </Button>
              </Link>
              <Link href="/admin" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full sm:w-auto">
                  Powrót
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex-1 sm:flex-none border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                Wyloguj
              </Button>
            </div>
          </div>

          {/* OAuth Connection Card */}
          {!oauthConnected && (
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Połącz z Google Business
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Połącz swoje konto Google aby publikować posty
                  </p>
                </div>
                <Button onClick={handleConnectGoogle} className="bg-blue-600 hover:bg-blue-700">
                  <Globe className="w-4 h-4 mr-2" />
                  Połącz
                </Button>
              </div>
            </Card>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterPlatform}
              onChange={(e) => {
                setFilterPlatform(e.target.value);
                setTimeout(fetchPosts, 100);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="all">Wszystkie platformy</option>
              <option value="google_business">Google Business</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="pinterest">Pinterest</option>
              <option value="linkedin">LinkedIn</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setTimeout(fetchPosts, 100);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="draft">Szkice</option>
              <option value="scheduled">Zaplanowane</option>
              <option value="published">Opublikowane</option>
              <option value="failed">Niepowodzenia</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Ładowanie postów...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</p>
          </Card>
        )}

        {/* Posts List */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {posts.length === 0 ? (
              <Card className="col-span-full p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  Brak postów do wyświetlenia
                </p>
                <Link href="/admin/social-media/dodaj">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj Pierwszy Post
                  </Button>
                </Link>
              </Card>
            ) : (
              posts.map((post) => {
                const PlatformIcon = PLATFORM_ICONS[post.platform as keyof typeof PLATFORM_ICONS];
                return (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4 sm:p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {PlatformIcon && <PlatformIcon className="w-5 h-5 text-blue-600" />}
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {PLATFORM_NAMES[post.platform as keyof typeof PLATFORM_NAMES]}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[post.status as keyof typeof STATUS_COLORS]}`}>
                          {STATUS_LABELS[post.status as keyof typeof STATUS_LABELS]}
                        </span>
                      </div>

                      {/* Content Preview */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                        {post.content}
                      </p>

                      {/* Metadata */}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 space-y-1">
                        {post.scheduled_at && (
                          <div>📅 Zaplanowano: {new Date(post.scheduled_at).toLocaleString('pl-PL')}</div>
                        )}
                        {post.published_at && (
                          <div>✅ Opublikowano: {new Date(post.published_at).toLocaleString('pl-PL')}</div>
                        )}
                        <div>🕒 Utworzono: {new Date(post.created_at).toLocaleString('pl-PL')}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link href={`/admin/social-media/edytuj/${post.id}`} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm" size="sm">
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            Edytuj
                          </Button>
                        </Link>
                        {(post.status === 'draft' || post.status === 'failed') && (
                          <Button
                            onClick={() => handlePublish(post.id)}
                            className="bg-green-600 hover:bg-green-700 px-3"
                            size="sm"
                          >
                            Publikuj
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(post.id)}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50 px-2.5"
                          size="sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
