'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Plus, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Realizacja {
  slug: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  date?: string;
  images?: {
    main?: string;
    gallery?: string[];
  };
  cloudinary?: {
    images: { url: string; publicId: string; filename: string }[];
    folderName: string;
  };
}

export default function RealizacjeListPage() {
  const [realizacje, setRealizacje] = useState<Realizacja[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);

    // Fetch realizacje list
    fetchRealizacje();
  }, [router]);

  const fetchRealizacje = async () => {
    try {
      const response = await fetch('/api/admin/list-realizacje');
      const data = await response.json();
      
      if (response.ok) {
        setRealizacje(data.realizacje || []);
      } else {
        setError(data.error || 'Nie udało się pobrać listy realizacji');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę realizację?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/delete-realizacja?slug=${slug}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Realizacja została usunięta pomyślnie');
        fetchRealizacje(); // Refresh list
      } else {
        alert(data.error || 'Nie udało się usunąć realizacji');
      }
    } catch (err) {
      alert('Błąd podczas usuwania realizacji');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    router.push('/admin/realizacje/dodaj');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Zarządzaj Realizacjami
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
                Edytuj lub usuń istniejące realizacje
              </p>
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Link href="/admin/realizacje/dodaj" className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Dodaj Nową</span>
                  <span className="sm:hidden">Dodaj</span>
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="flex-1 sm:flex-none border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Wyloguj</span>
                <span className="sm:hidden">Wyloguj</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">Ładowanie realizacji...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-4 sm:p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-sm sm:text-base text-red-800 dark:text-red-200">{error}</p>
          </Card>
        )}

        {/* Realizacje List */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {realizacje.length === 0 ? (
              <Card className="col-span-full p-6 sm:p-8 text-center">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  Brak realizacji do wyświetlenia
                </p>
                <Link href="/admin/realizacje/dodaj">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj Pierwszą Realizację
                  </Button>
                </Link>
              </Card>
            ) : (
              realizacje.map((realizacja) => (
                <Card key={realizacja.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Image */}
                  {(realizacja.images?.main || realizacja.cloudinary?.images?.[0]?.url) && (
                    <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <img
                        src={realizacja.cloudinary?.images?.[0]?.url || realizacja.images?.main || ''}
                        alt={realizacja.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-base sm:text-lg mb-2 text-gray-900 dark:text-white line-clamp-2">
                      {realizacja.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {realizacja.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {realizacja.category}
                      </span>
                      {realizacja.location && (
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                          {realizacja.location}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/admin/realizacje/edytuj/${realizacja.slug}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm" size="sm">
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          Edytuj
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleDelete(realizacja.slug)}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 px-2.5 sm:px-3"
                        size="sm"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
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
