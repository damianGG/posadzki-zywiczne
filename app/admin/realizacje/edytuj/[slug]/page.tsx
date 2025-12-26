'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Loader2, CheckCircle2, Trash2, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';
import GoogleDrivePicker from '@/components/admin/google-drive-picker';

interface FormData {
  title: string;
  description: string;
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
  testimonialContent: string;
  testimonialAuthor: string;
  date: string;
}

interface ExistingImage {
  url: string;
  publicId: string;
  filename: string;
}

export default function EdytujRealizacjePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
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
    testimonialContent: '',
    testimonialAuthor: '',
    date: '',
  });

  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);
    fetchRealizacja();
  }, [slug, router]);

  const fetchRealizacja = async () => {
    try {
      const response = await fetch(`/api/admin/get-realizacja?slug=${slug}`);
      const data = await response.json();

      if (response.ok && data.realizacja) {
        const r = data.realizacja;
        setFormData({
          title: r.title || '',
          description: r.description || '',
          location: r.location || '',
          area: r.surface_area || '',
          technology: r.technology || '',
          category: r.project_type || 'domy-mieszkania',
          type: r.type || 'indywidualna',
          color: r.color || '',
          duration: r.duration || '',
          tags: r.tags?.join(', ') || '',
          features: r.features?.join('\n') || '',
          keywords: r.keywords?.join('\n') || '',
          testimonialContent: r.clientTestimonial?.content || '',
          testimonialAuthor: r.clientTestimonial?.author || '',
          date: r.date || r.created_at || '',
        });

        // Map images.gallery to existingImages format
        if (r.images?.gallery && Array.isArray(r.images.gallery)) {
          const mappedImages = r.images.gallery.map((img: any, index: number) => {
            // Extract publicId from Cloudinary URL
            // URL format: https://res.cloudinary.com/[cloud]/image/upload/v[version]/[folder]/[publicId].[ext]
            let publicId = `image-${index}`;
            if (img.url && img.url.includes('cloudinary.com')) {
              try {
                const urlParts = img.url.split('/');
                const versionIndex = urlParts.findIndex((part: string) => part.startsWith('v'));
                if (versionIndex > 0 && versionIndex < urlParts.length - 1) {
                  // Get everything after version
                  const pathAfterVersion = urlParts.slice(versionIndex + 1).join('/');
                  // Remove file extension
                  publicId = pathAfterVersion.replace(/\.[^.]+$/, '');
                }
              } catch (e) {
                console.warn('Could not extract publicId from URL:', img.url);
              }
            }
            
            return {
              url: img.url || '',
              publicId: publicId,
              filename: img.alt || `image-${index}.jpg`,
            };
          });
          setExistingImages(mappedImages);
        }
      } else {
        setSubmitError(data.error || 'Nie znaleziono realizacji');
      }
    } catch (err) {
      setSubmitError('Błąd ładowania realizacji');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeleteExistingImage = (publicId: string) => {
    setImagesToDelete(prev => [...prev, publicId]);
    setExistingImages(prev => prev.filter(img => img.publicId !== publicId));
  };

  const handleSetAsMainImage = (index: number) => {
    setExistingImages(prev => {
      const newImages = [...prev];
      const [selectedImage] = newImages.splice(index, 1);
      return [selectedImage, ...newImages];
    });
  };

  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    addNewImages(files);
  };

  const handleGoogleDriveFiles = (files: File[]) => {
    addNewImages(files);
  };

  const addNewImages = (files: File[]) => {
    setNewImages(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetNewImageAsMain = (index: number) => {
    setNewImages(prev => {
      const newArr = [...prev];
      const [selectedImage] = newArr.splice(index, 1);
      return [selectedImage, ...newArr];
    });
    setNewImagePreviews(prev => {
      const newArr = [...prev];
      const [selectedPreview] = newArr.splice(index, 1);
      return [selectedPreview, ...newArr];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      if (!formData.title || !formData.description) {
        throw new Error('Tytuł i opis są wymagane');
      }

      const uploadData = new FormData();
      newImages.forEach(image => {
        uploadData.append('newImages', image);
      });
      uploadData.append('formData', JSON.stringify(formData));
      uploadData.append('slug', slug);
      uploadData.append('imagesToDelete', JSON.stringify(imagesToDelete));

      const response = await fetch('/api/admin/update-realizacja', {
        method: 'PUT',
        body: uploadData,
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.details 
          ? `${result.error}\n\n${result.details}\n\n${result.instructions || ''}`
          : result.error || 'Błąd podczas aktualizacji realizacji';
        throw new Error(errorMessage);
      }

      setSubmitSuccess(true);
      
      setTimeout(() => {
        router.push('/admin/realizacje');
      }, 2000);

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Wystąpił błąd');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center gap-4 mb-2">
              <Link href="/admin/realizacje">
                <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Powrót
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Edytuj Realizację</h1>
                <p className="text-blue-100 text-sm">Zaktualizuj dane i zdjęcia realizacji</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Podstawowe informacje</h3>
                
                <div>
                  <Label htmlFor="title">Tytuł realizacji *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="np. Posadzka żywiczna w garażu - Warszawa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Opis realizacji *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Szczegółowy opis projektu (2-3 zdania)"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Lokalizacja</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="np. Warszawa, Mokotów"
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">Powierzchnia</Label>
                    <Input
                      id="area"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="np. 40 m²"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategoria *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
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
                    <Label htmlFor="type">Typ projektu *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
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
                <h3 className="font-semibold text-lg">Szczegóły techniczne</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="technology">Technologia</Label>
                    <Input
                      id="technology"
                      value={formData.technology}
                      onChange={(e) => handleInputChange('technology', e.target.value)}
                      placeholder="np. Epoksyd z posypką kwarcową"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color">Kolor</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      placeholder="np. Szary RAL 7037"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Czas realizacji</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="np. 3 dni"
                    />
                  </div>
                </div>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Obecne zdjęcia</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Kliknij <Star className="w-3 h-3 inline" /> aby ustawić zdjęcie jako główne
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={image.publicId} className="relative group">
                        <img
                          src={image.url}
                          alt={`Zdjęcie ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {index !== 0 && (
                            <Button
                              type="button"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-500 hover:bg-yellow-600"
                              onClick={() => handleSetAsMainImage(index)}
                              title="Ustaw jako główne"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteExistingImage(image.publicId)}
                            title="Usuń zdjęcie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" />
                            Główne
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dodaj nowe zdjęcia</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Local file upload */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                    <input
                      type="file"
                      id="new-images"
                      multiple
                      accept="image/*"
                      onChange={handleNewImageSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="new-images"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
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

                {newImagePreviews.length > 0 && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {existingImages.length === 0 
                        ? 'Nowe zdjęcia - Kliknij ' 
                        : 'Nowe zdjęcia - Kliknij '
                      }
                      <Star className="w-3 h-3 inline" /> aby ustawić jako główne
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {newImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Nowe ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {existingImages.length === 0 && index !== 0 && (
                              <Button
                                type="button"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-500 hover:bg-yellow-600"
                                onClick={() => handleSetNewImageAsMain(index)}
                                title="Ustaw jako główne"
                              >
                                <Star className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeNewImage(index)}
                              title="Usuń zdjęcie"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          {existingImages.length === 0 && index === 0 && (
                            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              Główne
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dodatkowe informacje</h3>
                
                <div>
                  <Label htmlFor="tags">Tagi</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="np. garaż, epoksyd, antypoślizg"
                  />
                </div>

                <div>
                  <Label htmlFor="features">Cechy/Zalety</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => handleInputChange('features', e.target.value)}
                    placeholder="Każda cecha w nowej linii"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="keywords">Słowa kluczowe SEO</Label>
                  <Textarea
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                    placeholder="Każde słowo w nowej linii"
                    rows={3}
                  />
                </div>
              </div>

              {/* Testimonial */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Opinia klienta (opcjonalnie)</h3>
                
                <div>
                  <Label htmlFor="testimonialContent">Treść opinii</Label>
                  <Textarea
                    id="testimonialContent"
                    value={formData.testimonialContent}
                    onChange={(e) => handleInputChange('testimonialContent', e.target.value)}
                    placeholder="Jestem bardzo zadowolony..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="testimonialAuthor">Autor opinii</Label>
                  <Input
                    id="testimonialAuthor"
                    value={formData.testimonialAuthor}
                    onChange={(e) => handleInputChange('testimonialAuthor', e.target.value)}
                    placeholder="np. Pan Tomasz, Warszawa"
                  />
                </div>
              </div>

              {/* Error/Success Messages */}
              {submitError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                  <div className="font-semibold mb-2">Błąd</div>
                  <pre className="whitespace-pre-wrap text-sm font-mono">{submitError}</pre>
                </div>
              )}

              {submitSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Realizacja została zaktualizowana pomyślnie! Przekierowanie...
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Aktualizowanie...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Zaktualizuj Realizację
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
