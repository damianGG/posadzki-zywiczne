'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Loader2, CheckCircle2, ImagePlus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import LoginForm from '@/components/admin/login-form';
import GoogleDrivePicker from '@/components/admin/google-drive-picker';

interface FormData {
  title: string;
  h1: string;
  description: string;
  aiPrompt: string; // Short description for AI content generation
  location: string;
  area: string;
  technology: string;
  category: string;
  type: string;
  color: string;
  duration: string;
  tags: string;
  features: string;
  keywords: string;
  faq: string; // FAQ section as JSON string
  content: string; // Content sections as JSON string
  testimonialContent: string;
  testimonialAuthor: string;
}

export default function DodajRealizacjePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    h1: '',
    description: '',
    aiPrompt: '',
    location: '',
    area: '',
    technology: '',
    category: 'domy-mieszkania',
    type: 'indywidualna',
    color: '',
    duration: '',
    tags: '',
    features: '',
    keywords: '',
    faq: '',
    content: '',
    testimonialContent: '',
    testimonialAuthor: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    addImages(files);
  };

  const handleGoogleDriveFiles = (files: File[]) => {
    addImages(files);
  };

  const addImages = (files: File[]) => {
    // Add new images to existing ones
    const newImages = [...images, ...files];
    setImages(newImages);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateWithAI = async () => {
    setIsGeneratingAI(true);
    setAiError('');

    try {
      // Validate minimum required fields
      if (!formData.location || !formData.type || !formData.category) {
        throw new Error('Wypełnij lokalizację, typ projektu i kategorię aby wygenerować treść AI');
      }

      // Create FormData for AI generation
      const aiFormData = new FormData();
      aiFormData.append('location', formData.location);
      aiFormData.append('type', formData.type);
      aiFormData.append('category', formData.category);
      if (formData.area) aiFormData.append('area', formData.area);
      if (formData.aiPrompt) aiFormData.append('aiPrompt', formData.aiPrompt);

      // Call AI generation API
      const response = await fetch('/api/admin/generate-content', {
        method: 'POST',
        body: aiFormData,
      });

      // Handle non-JSON responses (like 504 Gateway Timeout HTML pages)
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // Non-JSON response (likely an error page)
        const text = await response.text();
        throw new Error(`Serwer zwrócił błąd: ${response.status} ${response.statusText}. ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(result.error || 'Błąd podczas generowania treści AI');
      }

      // Fill form with AI-generated content
      const content = result.content;
      setFormData(prev => ({
        ...prev,
        title: content.title || prev.title,
        h1: content.h1 || prev.h1,
        description: content.intro || prev.description, // Use intro as description
        technology: content.technology || prev.technology,
        color: content.color || prev.color,
        duration: content.duration || prev.duration,
        keywords: content.keywords || prev.keywords,
        tags: content.tags || prev.tags,
        features: content.features || prev.features,
        faq: content.faq || prev.faq,
        content: content.content || prev.content,
      }));

      // Show success message
      alert('✨ Treść została wygenerowana przez AI! Możesz ją teraz edytować przed zapisaniem.');

    } catch (error) {
      let errorMsg = 'Nieznany błąd';
      
      if (error instanceof Error) {
        errorMsg = error.message;
        
        // Add helpful context for common errors
        if (error.message.includes('504') || error.message.includes('Gateway Timeout')) {
          errorMsg = 'Przekroczono limit czasu generowania (timeout). AI generuje dużo treści (900-1200 słów), co może zająć do 60 sekund. Spróbuj ponownie za chwilę.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMsg = 'Błąd połączenia z serwerem. Sprawdź połączenie internetowe i spróbuj ponownie.';
        }
      }
      
      setAiError(errorMsg);
      console.error('AI generation error:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      // Validate required fields
      if (!formData.title || !formData.description) {
        throw new Error('Tytuł i opis są wymagane');
      }

      if (images.length === 0) {
        throw new Error('Dodaj co najmniej jedno zdjęcie');
      }

      // Create FormData for file upload
      const uploadData = new FormData();
      
      // Add images
      images.forEach((image, index) => {
        uploadData.append('images', image);
      });

      // Add form data
      uploadData.append('formData', JSON.stringify(formData));

      // Submit to API
      const response = await fetch('/api/admin/upload-realizacja', {
        method: 'POST',
        body: uploadData,
      });

      const result = await response.json();

      if (!response.ok) {
        // Show detailed error with instructions if available
        const errorMessage = result.details 
          ? `${result.error}\n\n${result.details}\n\n${result.instructions || ''}`
          : result.error || 'Błąd podczas dodawania realizacji';
        throw new Error(errorMessage);
      }

      setSubmitSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          h1: '',
          description: '',
          aiPrompt: '',
          location: '',
          area: '',
          technology: '',
          category: 'domy-mieszkania',
          type: 'indywidualna',
          color: '',
          duration: '',
          tags: '',
          features: '',
          keywords: '',
          faq: '',
          content: '',
          testimonialContent: '',
          testimonialAuthor: '',
        });
        setImages([]);
        setImagePreviews([]);
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Wystąpił błąd');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl md:text-3xl">Dodaj Nową Realizację</CardTitle>
            <CardDescription className="text-blue-50">
              Wypełnij formularz i dodaj zdjęcia swojego projektu
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* AI Generation Section */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      ✨ Wygeneruj treść przez AI
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Wypełnij <strong className="text-purple-600 dark:text-purple-400">lokalizację*</strong>, <strong className="text-purple-600 dark:text-purple-400">typ projektu*</strong>, <strong className="text-purple-600 dark:text-purple-400">kategorię*</strong> i opcjonalnie <strong className="text-purple-600 dark:text-purple-400">krótki opis dla AI</strong>, 
                      a AI wygeneruje profesjonalny tytuł, opis, FAQ, słowa kluczowe i wszystkie metadane SEO!
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                      ⏱️ Generowanie treści zajmuje 30-60 sekund. Proszę czekać...
                    </p>
                    <Button
                      type="button"
                      onClick={handleGenerateWithAI}
                      disabled={isGeneratingAI || !formData.location || !formData.type || !formData.category}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generuję treść AI (może potrwać do 60s)...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Wygeneruj przez AI
                        </>
                      )}
                    </Button>
                    {aiError && (
                      <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-sm text-red-600 dark:text-red-400">
                        {aiError}
                      </div>
                    )}
                    {!formData.location || !formData.type || !formData.category ? (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        💡 Wypełnij <strong>lokalizację</strong>, <strong>typ projektu</strong> i <strong>kategorię</strong> poniżej, aby odblokować generowanie AI
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Podstawowe informacje
                </h3>
                
                <div>
                  <Label htmlFor="aiPrompt">
                    Krótki opis dla AI <span className="text-purple-600 dark:text-purple-400 text-xs">(opcjonalnie - pomaga AI lepiej zrozumieć projekt)</span>
                  </Label>
                  <Textarea
                    id="aiPrompt"
                    value={formData.aiPrompt}
                    onChange={(e) => handleInputChange('aiPrompt', e.target.value)}
                    placeholder="np. Nowoczesny garaż w kolorze szarym z posypką kwarcową, bardzo wytrzymały i łatwy w utrzymaniu"
                    rows={2}
                    className="mt-1 border-purple-200 focus:border-purple-500 dark:border-purple-700"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    💡 Ten opis pomoże AI wygenerować bardziej precyzyjną treść artykułu
                  </p>
                </div>

                <div>
                  <Label htmlFor="title">Tytuł realizacji (SEO Title) *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="np. Posadzka żywiczna w garażu - Warszawa"
                    required
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    ≤ 60 znaków, zawiera słowo kluczowe + benefit / lokalizację
                  </p>
                </div>

                <div>
                  <Label htmlFor="h1">H1 Nagłówek (opcjonalnie)</Label>
                  <Input
                    id="h1"
                    value={formData.h1}
                    onChange={(e) => handleInputChange('h1', e.target.value)}
                    placeholder="np. Profesjonalna Posadzka Garażowa w Warszawie"
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Zbliżony do Title, ale nie identyczny (50-65 znaków). Jeśli pusty, użyty zostanie Title.
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Opis realizacji *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Szczegółowy opis projektu (2-3 zdania)"
                    required
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">
                      Lokalizacja <span className="text-purple-600 dark:text-purple-400 text-xs">(wymagane do AI)</span>
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="np. Warszawa, Mokotów"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">Powierzchnia</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="np. 40 m²"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">
                      Kategoria <span className="text-red-600 dark:text-red-400">*</span> <span className="text-purple-600 dark:text-purple-400 text-xs">(wymagane do AI)</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="domy-mieszkania">Domy i mieszkania</SelectItem>
                        <SelectItem value="balkony-tarasy">Balkony i tarasy</SelectItem>
                        <SelectItem value="garaze">Garaże</SelectItem>
                        <SelectItem value="kuchnie">Kuchnie</SelectItem>
                        <SelectItem value="pomieszczenia-czyste">Pomieszczenia czyste</SelectItem>
                        <SelectItem value="schody">Schody</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">
                      Typ projektu <span className="text-red-600 dark:text-red-400">*</span> <span className="text-purple-600 dark:text-purple-400 text-xs">(wymagane do AI)</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indywidualna">Indywidualna</SelectItem>
                        <SelectItem value="komercyjna">Komercyjna</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Szczegóły techniczne
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="technology">Technologia</Label>
                    <Input
                      id="technology"
                      value={formData.technology}
                      onChange={(e) => handleInputChange('technology', e.target.value)}
                      placeholder="np. Epoksyd z posypką kwarcową"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Kolor</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="np. Szary RAL 7037"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Czas realizacji</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="np. 3 dni"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Zdjęcia *
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Local file upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <ImagePlus className="w-12 h-12 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Z urządzenia
                      </span>
                      <span className="text-xs text-gray-500">
                        Kliknij aby wybrać
                      </span>
                    </label>
                  </div>

                  {/* Google Drive picker */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex items-center justify-center">
                    <GoogleDrivePicker
                      onFilesPicked={handleGoogleDriveFiles}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Pierwsze zdjęcie będzie zdjęciem głównym
                </p>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Główne
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Dodatkowe informacje
                </h3>

                <div>
                  <Label htmlFor="tags">Tagi (oddzielone przecinkami)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="np. garaż, epoksyd, antypoślizg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="features">Cechy/Zalety (każda w nowej linii)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => handleInputChange('features', e.target.value)}
                    placeholder="Wysoka odporność na ścieranie&#10;Łatwe utrzymanie czystości&#10;Estetyczny wygląd"
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="keywords">Słowa kluczowe SEO (każde w nowej linii)</Label>
                  <Textarea
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    placeholder="posadzka żywiczna garaż&#10;epoksyd garaż Warszawa"
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="faq">FAQ - Najczęściej zadawane pytania (JSON)</Label>
                  <Textarea
                    id="faq"
                    value={formData.faq}
                    onChange={(e) => handleInputChange('faq', e.target.value)}
                    placeholder='[{"question": "Jak długo schnie posadzka?", "answer": "Posadzka schnie przez 24-48 godzin"}]'
                    rows={6}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    💡 AI może wygenerować FAQ automatycznie (min. 4-6 pytań), lub możesz wprowadzić własne w formacie JSON
                  </p>
                </div>
              </div>

              {/* SEO Content Sections */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Sekcje treści SEO (opcjonalnie - generowane przez AI)
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Te sekcje zostaną automatycznie wygenerowane przez AI. Możesz je edytować ręcznie w formacie JSON.
                  Struktura: {`{"intro": "...", "whenToUse": "...", "advantages": "...", "disadvantages": "...", "execution": "...", "durability": "...", "pricing": "...", "commonMistakes": "...", "forWho": "...", "localService": "..."}`}
                </p>

                <div>
                  <Label htmlFor="content">Sekcje treści (JSON)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder='{"intro": "Wprowadzenie...", "whenToUse": "Kiedy rozwiązanie ma sens...", ...}'
                    rows={12}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    💡 AI automatycznie wygeneruje wszystkie sekcje treści zoptymalizowane pod SEO (900-1200 słów)
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Opinia klienta (opcjonalnie)
                </h3>

                <div>
                  <Label htmlFor="testimonialContent">Treść opinii</Label>
                  <Textarea
                    id="testimonialContent"
                    value={formData.testimonialContent}
                    onChange={(e) => handleInputChange('testimonialContent', e.target.value)}
                    placeholder="Jestem bardzo zadowolony z wykonanej posadzki..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="testimonialAuthor">Autor opinii</Label>
                  <Input
                    id="testimonialAuthor"
                    value={formData.testimonialAuthor}
                    onChange={(e) => handleInputChange('testimonialAuthor', e.target.value)}
                    placeholder="np. Pan Tomasz, Warszawa"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t">
                {submitError && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                    <div className="font-semibold mb-2">Błąd</div>
                    <pre className="whitespace-pre-wrap text-sm font-mono">{submitError}</pre>
                  </div>
                )}

                {submitSuccess && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Realizacja została pomyślnie dodana!
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Dodawanie...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Dodaj Realizację
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
