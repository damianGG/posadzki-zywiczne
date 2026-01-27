'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Share2, ArrowRight, Calculator, Images } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Panel Administracyjny
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Wybierz moduł do zarządzania
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Realizacje Card */}
          <Link href="/admin/realizacje">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Image className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Realizacje
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Zarządzaj portfolio projektów, dodawaj nowe realizacje, edytuj i usuwaj istniejące.
              </p>
            </Card>
          </Link>

          {/* Galeria Card */}
          <Link href="/admin/galeria">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <Images className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Galeria
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Przeglądaj wszystkie opublikowane zdjęcia, zarządzaj widocznością w głównej galerii.
              </p>
            </Card>
          </Link>

          {/* Social Media Card */}
          <Link href="/admin/social-media">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Share2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Social Media
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Twórz i publikuj posty na Google Business, Instagram, Facebook i innych platformach z pomocą AI.
              </p>
            </Card>
          </Link>

          {/* Calculator Card */}
          <Link href="/admin/kalkulator">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Kalkulator Posadzek
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Zarządzaj cenami, opisami i zdjęciami dla kalkulatora posadzek żywicznych.
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
