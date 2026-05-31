'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, Save, Sparkles, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CloudinaryUploadWidget from '@/components/admin/cloudinary-upload-widget';
import {
  buildPromptFromTemplate,
  createBlogFaqId,
  DEFAULT_BLOG_PROMPT_TEMPLATE,
  normalizeArticleSections,
  normalizeFaqItems,
  slugifyBlogText,
  type BlogArticleSections,
  type BlogFaqItem,
  type BlogImageItem,
  type BlogPromptContext,
} from '@/lib/blog-content';
import type { BlogPostRow } from '@/lib/supabase-blog';

type BlogStatus = 'draft' | 'published';

interface BlogEditorProps {
  mode: 'create' | 'edit';
  postId?: string;
  initialData?: BlogEditorInitialData | null;
}

type BlogEditorInitialData = Partial<BlogPostRow>;

interface BlogEditorState {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  status: BlogStatus;
  featured: boolean;
  tagsInput: string;
  keywordsInput: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  imageAlt: string;
  imageCaption: string;
  promptTemplate: string;
  promptContext: BlogPromptContext;
  articleSections: BlogArticleSections;
  faqItems: BlogFaqItem[];
  images: BlogImageItem[];
}

const SECTION_FIELDS: Array<{ key: keyof BlogArticleSections; label: string }> = [
  { key: 'quickAnswer', label: '1. Krótka odpowiedź na pytanie klienta' },
  { key: 'whyClientsAsk', label: '2. Dlaczego klienci o to pytają' },
  { key: 'experienceFromProjects', label: '3. Co pokazuje nasze doświadczenie z realizacji' },
  { key: 'numbersAndCosts', label: '4. Konkretne liczby, parametry i koszty' },
  { key: 'whenRecommended', label: '5. Kiedy dane rozwiązanie jest dobrym wyborem' },
  { key: 'whenNotRecommended', label: '6. Kiedy nie polecamy tego rozwiązania' },
  { key: 'alternativesComparison', label: '7. Alternatywy i porównanie' },
  { key: 'investorMistakes', label: '8. Najczęstsze błędy inwestorów' },
  { key: 'faqLead', label: '9. Wprowadzenie do sekcji FAQ' },
  { key: 'summaryRecommendation', label: '10. Podsumowanie i rekomendacja' },
];

function createInitialState(data?: BlogEditorInitialData | null): BlogEditorState {
  const gallery = Array.isArray(data?.gallery) ? data.gallery : [];
  const mainUrl = data?.image?.url;
  const normalizedFaqItems = normalizeFaqItems(data?.faq_items);
  const images = gallery.length > 0
    ? gallery.map((image: BlogImageItem) => ({ ...image, isMain: image.url === mainUrl }))
    : data?.image?.url
      ? [{ ...data.image, isMain: true }]
      : [];

  return {
    slug: data?.slug || '',
    title: data?.title || '',
    excerpt: data?.excerpt || '',
    category: data?.category || 'Porady',
    status: data?.status === 'published' ? 'published' : 'draft',
    featured: Boolean(data?.featured),
    tagsInput: Array.isArray(data?.tags) ? data.tags.join(', ') : '',
    keywordsInput: Array.isArray(data?.seo?.keywords) ? data.seo.keywords.join(', ') : '',
    metaTitle: data?.seo?.metaTitle || '',
    metaDescription: data?.seo?.metaDescription || '',
    ogTitle: data?.seo?.ogTitle || data?.seo?.metaTitle || '',
    ogDescription: data?.seo?.ogDescription || data?.seo?.metaDescription || '',
    imageAlt: data?.image?.alt || '',
    imageCaption: data?.image?.caption || '',
    promptTemplate: data?.prompt_template || DEFAULT_BLOG_PROMPT_TEMPLATE,
    promptContext: {
      topic: data?.prompt_context?.topic || '',
      targetAudience: data?.prompt_context?.targetAudience || '',
      realizationsCount: data?.prompt_context?.realizationsCount || '',
      location: data?.prompt_context?.location || '',
      system: data?.prompt_context?.system || '',
      surfaceArea: data?.prompt_context?.surfaceArea || '',
      cost: data?.prompt_context?.cost || '',
      clientProblems: data?.prompt_context?.clientProblems || '',
      executionMistakes: data?.prompt_context?.executionMistakes || '',
      photosDescription: data?.prompt_context?.photosDescription || '',
      yearsInUse: data?.prompt_context?.yearsInUse || '',
      observations: data?.prompt_context?.observations || '',
      author: data?.prompt_context?.author || '',
      company: data?.prompt_context?.company || '',
      additionalNotes: data?.prompt_context?.additionalNotes || '',
    },
    articleSections: normalizeArticleSections(data?.article_sections),
    faqItems: normalizedFaqItems.length > 0 ? normalizedFaqItems : [{ id: createBlogFaqId(), question: '', answer: '' }],
    images,
  };
}

export default function BlogEditor({ mode, postId, initialData }: BlogEditorProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState<BlogEditorState>(() => createInitialState(initialData));

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }

    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (initialData) {
      setFormState(createInitialState(initialData));
    }
  }, [initialData]);

  const resolvedPrompt = useMemo(
    () => buildPromptFromTemplate(formState.promptTemplate, formState.promptContext),
    [formState.promptTemplate, formState.promptContext],
  );

  const uploadFolder = useMemo(() => {
    const base = slugifyBlogText(formState.slug || formState.title || formState.promptContext.topic || 'artykul-blogowy');
    return `blog/${base}`;
  }, [formState.slug, formState.title, formState.promptContext.topic]);

  const handlePromptContextChange = (field: keyof BlogPromptContext, value: string) => {
    setFormState((prev) => ({
      ...prev,
      promptContext: {
        ...prev.promptContext,
        [field]: value,
      },
    }));
  };

  const handleSectionChange = (field: keyof BlogArticleSections, value: string) => {
    setFormState((prev) => ({
      ...prev,
      articleSections: {
        ...prev.articleSections,
        [field]: value,
      },
    }));
  };

  const handleFaqChange = (index: number, field: keyof BlogFaqItem, value: string) => {
    setFormState((prev) => ({
      ...prev,
      faqItems: prev.faqItems.map((item, currentIndex) =>
        currentIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addFaqItem = () => {
    setFormState((prev) => ({
      ...prev,
      faqItems: [...prev.faqItems, { id: createBlogFaqId(), question: '', answer: '' }],
    }));
  };

  const removeFaqItem = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      faqItems: prev.faqItems.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleUploadComplete = (results: Array<{ url: string }>) => {
    setFormState((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        ...results.map((result, index) => ({
          url: result.url,
          alt: prev.imageAlt || prev.title,
          caption: prev.imageCaption || prev.title,
          isMain: prev.images.length === 0 && index === 0,
        })),
      ],
    }));
  };

  const setMainImage = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.map((image, currentIndex) => ({
        ...image,
        isMain: currentIndex === index,
      })),
    }));
  };

  const updateImageField = (index: number, field: 'alt' | 'caption', value: string) => {
    setFormState((prev) => ({
      ...prev,
      images: prev.images.map((image, currentIndex) =>
        currentIndex === index ? { ...image, [field]: value } : image,
      ),
    }));
  };

  const removeImage = (index: number) => {
    setFormState((prev) => {
      const nextImages = prev.images.filter((_, currentIndex) => currentIndex !== index);
      if (nextImages.length > 0 && !nextImages.some((image) => image.isMain)) {
        nextImages[0] = { ...nextImages[0], isMain: true };
      }
      return {
        ...prev,
        images: nextImages,
      };
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptTemplate: formState.promptTemplate,
          promptContext: formState.promptContext,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Nie udało się wygenerować treści');
      }

      const generated = result.data;
      setFormState((prev) => ({
        ...prev,
        slug: prev.slug || slugifyBlogText(generated.title || prev.promptContext.topic),
        title: generated.title || prev.title,
        excerpt: generated.excerpt || prev.excerpt,
        category: generated.category || prev.category,
        tagsInput: Array.isArray(generated.tags) ? generated.tags.join(', ') : prev.tagsInput,
        keywordsInput: Array.isArray(generated.keywords) ? generated.keywords.join(', ') : prev.keywordsInput,
        metaTitle: generated.metaTitle || prev.metaTitle,
        metaDescription: generated.metaDescription || prev.metaDescription,
        ogTitle: generated.ogTitle || prev.ogTitle,
        ogDescription: generated.ogDescription || prev.ogDescription,
        imageAlt: generated.imageAlt || prev.imageAlt,
        imageCaption: generated.imageCaption || prev.imageCaption,
        articleSections: generated.sections || prev.articleSections,
        faqItems: Array.isArray(generated.faq) && generated.faq.length > 0 ? generated.faq : prev.faqItems,
      }));
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Błąd generowania treści');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      const payload = {
        slug: formState.slug,
        title: formState.title,
        excerpt: formState.excerpt,
        category: formState.category,
        status: formState.status,
        featured: formState.featured,
        tags: formState.tagsInput,
        keywords: formState.keywordsInput,
        metaTitle: formState.metaTitle,
        metaDescription: formState.metaDescription,
        ogTitle: formState.ogTitle,
        ogDescription: formState.ogDescription,
        imageAlt: formState.imageAlt,
        imageCaption: formState.imageCaption,
        promptTemplate: formState.promptTemplate,
        promptContext: formState.promptContext,
        articleSections: formState.articleSections,
        faqItems: formState.faqItems.filter((item) => item.question.trim() && item.answer.trim()),
        images: formState.images,
      };

      const endpoint = mode === 'edit' && postId ? `/api/admin/blog/posts/${postId}` : '/api/admin/blog/posts';
      const method = mode === 'edit' ? 'PATCH' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Nie udało się zapisać wpisu');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Błąd zapisu wpisu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!postId || !window.confirm('Czy na pewno chcesz usunąć ten wpis blogowy?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/blog/posts/${postId}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Nie udało się usunąć wpisu');
      }

      router.push('/admin/blog');
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Błąd usuwania wpisu');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isCheckingAuth || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/admin/blog">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Powrót
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {mode === 'edit' ? 'Edytuj wpis blogowy' : 'Nowy wpis blogowy'}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2">
              Prompt jest zapisany w formularzu i możesz go dowolnie zmieniać przed kolejnym generowaniem.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {mode === 'edit' && (
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Usuń
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Zapisz wpis
            </Button>
          </div>
        </div>

        {error && (
          <Card className="border-red-300 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-4 text-sm text-red-700 dark:text-red-200">{error}</CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Parametry artykułu</CardTitle>
            <CardDescription>Uzupełnij dane wejściowe, które mają zostać wstawione do promptu.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic">Temat *</Label>
              <Input id="topic" value={formState.promptContext.topic} onChange={(e) => handlePromptContextChange('topic', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="targetAudience">Typ klienta *</Label>
              <Input id="targetAudience" value={formState.promptContext.targetAudience} onChange={(e) => handlePromptContextChange('targetAudience', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="realizationsCount">Liczba realizacji</Label>
              <Input id="realizationsCount" value={formState.promptContext.realizationsCount || ''} onChange={(e) => handlePromptContextChange('realizationsCount', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="location">Miasto / lokalizacja</Label>
              <Input id="location" value={formState.promptContext.location || ''} onChange={(e) => handlePromptContextChange('location', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="system">System</Label>
              <Input id="system" value={formState.promptContext.system || ''} onChange={(e) => handlePromptContextChange('system', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="surfaceArea">Powierzchnia</Label>
              <Input id="surfaceArea" value={formState.promptContext.surfaceArea || ''} onChange={(e) => handlePromptContextChange('surfaceArea', e.target.value)} placeholder="np. 42 m2" />
            </div>
            <div>
              <Label htmlFor="cost">Koszt wykonania</Label>
              <Input id="cost" value={formState.promptContext.cost || ''} onChange={(e) => handlePromptContextChange('cost', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="yearsInUse">Czas użytkowania</Label>
              <Input id="yearsInUse" value={formState.promptContext.yearsInUse || ''} onChange={(e) => handlePromptContextChange('yearsInUse', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="clientProblems">Najczęstsze problemy klientów</Label>
              <Textarea id="clientProblems" rows={3} value={formState.promptContext.clientProblems || ''} onChange={(e) => handlePromptContextChange('clientProblems', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="executionMistakes">Najczęstsze błędy wykonawcze</Label>
              <Textarea id="executionMistakes" rows={3} value={formState.promptContext.executionMistakes || ''} onChange={(e) => handlePromptContextChange('executionMistakes', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="photosDescription">Opis zdjęć realizacji</Label>
              <Textarea id="photosDescription" rows={3} value={formState.promptContext.photosDescription || ''} onChange={(e) => handlePromptContextChange('photosDescription', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="observations">Obserwacje po latach</Label>
              <Textarea id="observations" rows={3} value={formState.promptContext.observations || ''} onChange={(e) => handlePromptContextChange('observations', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="additionalNotes">Dodatkowe notatki</Label>
              <Textarea id="additionalNotes" rows={3} value={formState.promptContext.additionalNotes || ''} onChange={(e) => handlePromptContextChange('additionalNotes', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt i generowanie AI</CardTitle>
            <CardDescription>Szablon promptu jest zapisany przy wpisie i możesz go modyfikować przed ponownym generowaniem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="promptTemplate">Szablon promptu</Label>
              <Textarea id="promptTemplate" rows={18} value={formState.promptTemplate} onChange={(e) => setFormState((prev) => ({ ...prev, promptTemplate: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="promptPreview">Podgląd promptu</Label>
              <Textarea id="promptPreview" rows={16} value={resolvedPrompt} readOnly className="bg-gray-50 dark:bg-gray-900" />
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-700">
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generuj artykuł z AI
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta dane wpisu</CardTitle>
            <CardDescription>Po wygenerowaniu możesz poprawić tytuł, excerpt i SEO ręcznie.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Tytuł wpisu *</Label>
              <Input id="title" value={formState.title} onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={formState.slug} onChange={(e) => setFormState((prev) => ({ ...prev, slug: slugifyBlogText(e.target.value) }))} />
            </div>
            <div>
              <Label htmlFor="category">Kategoria</Label>
              <Input id="category" value={formState.category} onChange={(e) => setFormState((prev) => ({ ...prev, category: e.target.value }))} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea id="excerpt" rows={3} value={formState.excerpt} onChange={(e) => setFormState((prev) => ({ ...prev, excerpt: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select id="status" value={formState.status} onChange={(e) => setFormState((prev) => ({ ...prev, status: e.target.value as BlogStatus }))} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
                <option value="draft">Szkic</option>
                <option value="published">Opublikowany</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={formState.featured} onChange={(e) => setFormState((prev) => ({ ...prev, featured: e.target.checked }))} />
                Wyróżnij wpis na stronie
              </label>
            </div>
            <div>
              <Label htmlFor="tags">Tagi</Label>
              <Input id="tags" value={formState.tagsInput} onChange={(e) => setFormState((prev) => ({ ...prev, tagsInput: e.target.value }))} placeholder="garaż, balkon, koszt" />
            </div>
            <div>
              <Label htmlFor="keywords">Słowa kluczowe</Label>
              <Input id="keywords" value={formState.keywordsInput} onChange={(e) => setFormState((prev) => ({ ...prev, keywordsInput: e.target.value }))} placeholder="posadzka żywiczna do garażu, ..." />
            </div>
            <div>
              <Label htmlFor="metaTitle">Meta title</Label>
              <Input id="metaTitle" value={formState.metaTitle} onChange={(e) => setFormState((prev) => ({ ...prev, metaTitle: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description</Label>
              <Input id="metaDescription" value={formState.metaDescription} onChange={(e) => setFormState((prev) => ({ ...prev, metaDescription: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="ogTitle">OG title</Label>
              <Input id="ogTitle" value={formState.ogTitle} onChange={(e) => setFormState((prev) => ({ ...prev, ogTitle: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="ogDescription">OG description</Label>
              <Input id="ogDescription" value={formState.ogDescription} onChange={(e) => setFormState((prev) => ({ ...prev, ogDescription: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="imageAlt">Alt zdjęcia głównego</Label>
              <Input id="imageAlt" value={formState.imageAlt} onChange={(e) => setFormState((prev) => ({ ...prev, imageAlt: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="imageCaption">Podpis zdjęcia głównego</Label>
              <Input id="imageCaption" value={formState.imageCaption} onChange={(e) => setFormState((prev) => ({ ...prev, imageCaption: e.target.value }))} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zdjęcia do artykułu</CardTitle>
            <CardDescription>Korzystamy z istniejącego uploadu Cloudinary. Jedno zdjęcie oznacz jako główne.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CloudinaryUploadWidget onUploadComplete={handleUploadComplete} folder={uploadFolder} maxFiles={12} />
            {formState.images.length > 0 && (
              <div className="space-y-4">
                {formState.images.map((image, index) => (
                  <div key={`${image.url}-${index}`} className="grid grid-cols-1 lg:grid-cols-[180px,1fr] gap-4 border rounded-lg p-4">
                    <div className="relative aspect-video overflow-hidden rounded-md bg-gray-100">
                      <Image src={image.url} alt={image.alt || `Zdjęcie ${index + 1}`} fill className="object-cover" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" variant={image.isMain ? 'default' : 'outline'} size="sm" onClick={() => setMainImage(index)}>
                          <Star className="w-4 h-4 mr-2" />
                          {image.isMain ? 'Zdjęcie główne' : 'Ustaw jako główne'}
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => removeImage(index)}>
                          <Trash2 className="w-4 h-4 mr-2" />Usuń
                        </Button>
                      </div>
                      <div>
                        <Label>Alt</Label>
                        <Input value={image.alt || ''} onChange={(e) => updateImageField(index, 'alt', e.target.value)} />
                      </div>
                      <div>
                        <Label>Podpis</Label>
                        <Input value={image.caption || ''} onChange={(e) => updateImageField(index, 'caption', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sekcje artykułu</CardTitle>
            <CardDescription>Każdą sekcję możesz dopracować ręcznie po wygenerowaniu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {SECTION_FIELDS.map((section) => (
              <div key={section.key}>
                <Label htmlFor={section.key}>{section.label}</Label>
                <Textarea id={section.key} rows={5} value={formState.articleSections[section.key]} onChange={(e) => handleSectionChange(section.key, e.target.value)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
            <CardDescription>Dodaj lub popraw pytania klientów widoczne pod artykułem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formState.faqItems.map((item, index) => (
              <div key={item.id || `${index}`} className="border rounded-lg p-4 space-y-3">
                <div>
                  <Label>Pytanie #{index + 1}</Label>
                  <Input value={item.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} />
                </div>
                <div>
                  <Label>Odpowiedź</Label>
                  <Textarea rows={4} value={item.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} />
                </div>
                {formState.faqItems.length > 1 && (
                  <Button type="button" variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => removeFaqItem(index)}>
                    Usuń pytanie
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addFaqItem}>Dodaj pytanie</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
