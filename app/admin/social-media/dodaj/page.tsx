'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Save } from 'lucide-react';
import Link from 'next/link';

const PLATFORMS = [
  { value: 'google_business', label: 'Google Business', maxLength: 1500 },
  { value: 'instagram', label: 'Instagram', maxLength: 2200 },
  { value: 'facebook', label: 'Facebook', maxLength: 300 },
  { value: 'tiktok', label: 'TikTok', maxLength: 150 },
  { value: 'pinterest', label: 'Pinterest', maxLength: 500 },
  { value: 'linkedin', label: 'LinkedIn', maxLength: 1300 },
];

const CALL_TO_ACTIONS = [
  'CALL', 'BOOK', 'ORDER', 'SHOP', 'LEARN_MORE', 'SIGN_UP',
];

export default function AddSocialMediaPostPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [realizacje, setRealizacje] = useState<any[]>([]);
  
  // Form state
  const [platform, setPlatform] = useState('google_business');
  const [content, setContent] = useState('');
  const [realizacjaId, setRealizacjaId] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  
  // Platform-specific metadata
  const [callToAction, setCallToAction] = useState('CALL');
  const [locationTag, setLocationTag] = useState('');
  const [isReel, setIsReel] = useState(false);
  const [link, setLink] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);
    fetchRealizacje();
  }, [router]);

  const fetchRealizacje = async () => {
    try {
      const response = await fetch('/api/admin/list-realizacje');
      const data = await response.json();
      if (response.ok) {
        setRealizacje(data.realizacje || []);
      }
    } catch (err) {
      console.error('Failed to fetch realizacje', err);
    }
  };

  const handleGenerateAI = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/admin/social-media/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          realizacja_id: realizacjaId || undefined,
          custom_prompt: customPrompt || undefined,
          preferences: {
            tone,
            length,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent(data.content || '');
        alert('Treść wygenerowana przez AI! ✨');
      } else {
        alert(data.error || 'Nie udało się wygenerować treści');
      }
    } catch (err) {
      alert('Błąd podczas generowania treści');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!content.trim()) {
      alert('Treść posta jest wymagana');
      return;
    }

    setLoading(true);
    try {
      // Build platform metadata
      let platformMetadata: any = {};
      if (platform === 'google_business') {
        platformMetadata.call_to_action = callToAction;
      } else if (platform === 'instagram') {
        if (locationTag) platformMetadata.location_tag = locationTag;
        platformMetadata.is_reel = isReel;
      } else if (platform === 'facebook') {
        if (link) platformMetadata.link = link;
      }

      // Create post
      const createResponse = await fetch('/api/admin/social-media/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          content,
          realizacja_id: realizacjaId || undefined,
          platform_metadata: platformMetadata,
          status: 'draft',
        }),
      });

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        alert(createData.error || 'Nie udało się utworzyć posta');
        setLoading(false);
        return;
      }

      // If publish requested, publish immediately
      if (publish) {
        const publishResponse = await fetch('/api/admin/social-media/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ post_id: createData.post.id }),
        });

        const publishData = await publishResponse.json();

        if (publishResponse.ok) {
          alert('Post został opublikowany pomyślnie! ✅');
          router.push('/admin/social-media');
        } else {
          alert(`Post utworzony, ale publikacja nie powiodła się: ${publishData.error}`);
          router.push('/admin/social-media');
        }
      } else {
        alert('Post zapisany jako szkic ✅');
        router.push('/admin/social-media');
      }
    } catch (err) {
      alert('Błąd podczas zapisywania posta');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const maxLength = PLATFORMS.find(p => p.value === platform)?.maxLength || 1000;
  const charCount = content.length;
  const isOverLimit = charCount > maxLength;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/social-media">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dodaj Nowy Post
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
            Wygeneruj treść AI lub utwórz ręcznie
          </p>
        </div>

        {/* AI Generator Section */}
        <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Generator AI
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Platforma *</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {PLATFORMS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Realizacja (opcjonalnie)</label>
              <select
                value={realizacjaId}
                onChange={(e) => setRealizacjaId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="">-- Wybierz realizację --</option>
                {realizacje.map(r => (
                  <option key={r.slug} value={r.slug}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ton</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="professional">Profesjonalny</option>
                <option value="casual">Casualowy</option>
                <option value="friendly">Przyjazny</option>
                <option value="formal">Formalny</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Długość</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="short">Krótka</option>
                <option value="medium">Średnia</option>
                <option value="long">Długa</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Dodatkowe instrukcje (opcjonalnie)</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="np. 'Podkreśl szybkość wykonania i profesjonalizm'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              rows={2}
            />
          </div>

          <Button
            onClick={handleGenerateAI}
            disabled={aiLoading}
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
          >
            {aiLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generowanie...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generuj Treść AI
              </>
            )}
          </Button>
        </Card>

        {/* Post Editor Section */}
        <Card className="p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Treść Posta</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Treść *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Wpisz treść posta lub wygeneruj AI..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              rows={8}
            />
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className={isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                {charCount} / {maxLength} znaków
              </span>
              {isOverLimit && (
                <span className="text-red-600">⚠️ Przekroczono limit!</span>
              )}
            </div>
          </div>

          {/* Platform-specific fields */}
          {platform === 'google_business' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Call to Action</label>
              <select
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {CALL_TO_ACTIONS.map(cta => (
                  <option key={cta} value={cta}>{cta}</option>
                ))}
              </select>
            </div>
          )}

          {platform === 'instagram' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Lokalizacja (opcjonalnie)</label>
                <input
                  type="text"
                  value={locationTag}
                  onChange={(e) => setLocationTag(e.target.value)}
                  placeholder="np. Warszawa, Polska"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isReel}
                  onChange={(e) => setIsReel(e.target.checked)}
                  id="isReel"
                  className="w-4 h-4"
                />
                <label htmlFor="isReel" className="text-sm font-medium">To jest Reel</label>
              </div>
            </>
          )}

          {platform === 'facebook' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Link (opcjonalnie)</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => handleSave(false)}
            disabled={loading || !content.trim() || isOverLimit}
            variant="outline"
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Zapisz jako Szkic
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={loading || !content.trim() || isOverLimit}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Zapisz i Opublikuj
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
