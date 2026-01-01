'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Save, RefreshCw, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import CloudinaryUploadWidget from '@/components/admin/cloudinary-upload-widget';

interface SurfaceType {
  id: string;
  type_id: string;
  name: string;
  description: string;
  price_per_m2: number;
  price_ranges?: Array<{
    min_m2: number;
    max_m2: number | null;
    price_per_m2: number;
    is_flat_rate?: boolean;
  }>;
  image_url?: string;
  properties?: string[];
  display_order: number;
  is_active: boolean;
}

interface ColorOption {
  id: string;
  color_id: string;
  name: string;
  ral_code: string;
  additional_price: number;
  thumbnail_url?: string;
  preview_url?: string;
  display_order: number;
  is_active: boolean;
}

interface Service {
  id: string;
  service_id: string;
  name: string;
  description: string;
  category: string;
  price_per_m2?: number;
  price_per_mb?: number;
  price_fixed?: number;
  is_included_in_floor_price?: boolean;
  image_url?: string;
  is_mandatory: boolean;
  is_default: boolean;
  display_order: number;
  is_active: boolean;
}

interface RoomType {
  id: string;
  room_id: string;
  name: string;
  description: string;
  icon?: string;
  is_available: boolean;
  display_order: number;
}

interface ConcreteState {
  id: string;
  state_id: string;
  name: string;
  description: string;
  additional_price: number;
  show_price_in_label?: boolean;
  display_order: number;
}

interface StepConfig {
  id: string;
  step_id: string;
  step_name: string;
  description?: string;
  is_visible: boolean;
  display_order: number;
  can_be_hidden: boolean;
}

export default function CalculatorAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const [surfaceTypes, setSurfaceTypes] = useState<SurfaceType[]>([]);
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [concreteStates, setConcreteStates] = useState<ConcreteState[]>([]);
  const [stepConfigs, setStepConfigs] = useState<StepConfig[]>([]);
  
  const [activeTab, setActiveTab] = useState<'surface-types' | 'colors' | 'services' | 'rooms' | 'concrete' | 'steps'>('surface-types');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<string>('');
  const [newItem, setNewItem] = useState<any>({});

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);
    fetchAllSettings();
  }, [router]);

  const fetchAllSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/calculator-settings');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setSurfaceTypes(data.surfaceTypes || []);
      setColors(data.colors || []);
      setServices(data.services || []);
      setRoomTypes(data.roomTypes || []);
      setConcreteStates(data.concreteStates || []);
      setStepConfigs(data.stepConfigs || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Błąd wczytywania ustawień' });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (type: string, id: string, updates: any) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/calculator-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, updates }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Błąd zapisu');
      }

      setMessage({ type: 'success', text: 'Zapisano pomyślnie' });
      setTimeout(() => setMessage(null), 3000);

      // Update local state instead of reloading
      if (data.data) {
        switch (type) {
          case 'surface-type':
            setSurfaceTypes(prev => prev.map(item => item.type_id === id ? data.data : item));
            break;
          case 'color':
            setColors(prev => prev.map(item => item.color_id === id ? data.data : item));
            break;
          case 'service':
            setServices(prev => prev.map(item => item.service_id === id ? data.data : item));
            break;
          case 'room-type':
            setRoomTypes(prev => prev.map(item => item.room_id === id ? data.data : item));
            break;
          case 'concrete-state':
            setConcreteStates(prev => prev.map(item => item.state_id === id ? data.data : item));
            break;
          case 'step-config':
            setStepConfigs(prev => prev.map(item => item.step_id === id ? data.data : item));
            break;
        }
      }
    } catch (error) {
      console.error('Error saving:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Błąd zapisu' });
    } finally {
      setSaving(false);
    }
  };

  const createNewItem = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/calculator-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: createType, data: newItem }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Błąd tworzenia');
      }

      setMessage({ type: 'success', text: 'Utworzono pomyślnie' });
      setTimeout(() => setMessage(null), 3000);

      // Add to local state
      if (data.data) {
        switch (createType) {
          case 'surface-type':
            setSurfaceTypes(prev => [...prev, data.data]);
            break;
          case 'color':
            setColors(prev => [...prev, data.data]);
            break;
          case 'service':
            setServices(prev => [...prev, data.data]);
            break;
          case 'room-type':
            setRoomTypes(prev => [...prev, data.data]);
            break;
          case 'concrete-state':
            setConcreteStates(prev => [...prev, data.data]);
            break;
        }
      }

      setShowCreateModal(false);
      setNewItem({});
    } catch (error) {
      console.error('Error creating:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Błąd tworzenia' });
    } finally {
      setSaving(false);
    }
  };

  const openCreateModal = (type: string) => {
    setCreateType(type);
    setNewItem({});
    setShowCreateModal(true);
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Zarządzanie Kalkulatorem</h1>
          </div>
          <p className="text-gray-600">
            Edytuj ceny, opisy i zdjęcia dla kalkulatora posadzek żywicznych
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Manual Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
          <div className="grid grid-cols-6 gap-2">
            {[
              { key: 'surface-types', label: 'Powierzchnie' },
              { key: 'colors', label: 'Kolory' },
              { key: 'services', label: 'Usługi' },
              { key: 'rooms', label: 'Pomieszczenia' },
              { key: 'concrete', label: 'Stan betonu' },
              { key: 'steps', label: 'Widoczność kroków' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Surface Types */}
        {activeTab === 'surface-types' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => openCreateModal('surface-type')} className="gap-2">
                <Save className="w-4 h-4" />
                Dodaj nową powierzchnię
              </Button>
            </div>
            {surfaceTypes.map((surface) => (
              <Card key={surface.id} className={!surface.is_active ? 'opacity-60 bg-gray-50' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{surface.name}</span>
                      {!surface.is_active && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Wyłączone</span>
                      )}
                    </div>
                    <Switch
                      checked={surface.is_active}
                      onCheckedChange={(checked) =>
                        updateSetting('surface-type', surface.type_id, { is_active: checked })
                      }
                      disabled={saving}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nazwa</Label>
                      <Input
                        value={surface.name}
                        onChange={(e) => {
                          const updated = surfaceTypes.map((s) =>
                            s.id === surface.id ? { ...s, name: e.target.value } : s
                          );
                          setSurfaceTypes(updated);
                        }}
                        onBlur={(e) => updateSetting('surface-type', surface.type_id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Cena za m² (zł)</Label>
                      <Input
                        type="number"
                        value={surface.price_per_m2}
                        onChange={(e) => {
                          const updated = surfaceTypes.map((s) =>
                            s.id === surface.id ? { ...s, price_per_m2: Number(e.target.value) } : s
                          );
                          setSurfaceTypes(updated);
                        }}
                        onBlur={(e) =>
                          updateSetting('surface-type', surface.type_id, { price_per_m2: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Opis</Label>
                    <Textarea
                      value={surface.description}
                      onChange={(e) => {
                        const updated = surfaceTypes.map((s) =>
                          s.id === surface.id ? { ...s, description: e.target.value } : s
                        );
                        setSurfaceTypes(updated);
                      }}
                      onBlur={(e) => updateSetting('surface-type', surface.type_id, { description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Zdjęcie</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={surface.image_url || ''}
                          onChange={(e) => {
                            const updated = surfaceTypes.map((s) =>
                              s.id === surface.id ? { ...s, image_url: e.target.value } : s
                            );
                            setSurfaceTypes(updated);
                          }}
                          onBlur={(e) => updateSetting('surface-type', surface.type_id, { image_url: e.target.value })}
                          placeholder="/images/... lub URL z Cloudinary"
                        />
                        {surface.image_url && (
                          <div className="relative w-16 h-16 border rounded flex-shrink-0">
                            <Image src={surface.image_url} alt={surface.name} fill className="object-cover rounded" />
                          </div>
                        )}
                      </div>
                      <CloudinaryUploadWidget
                        onUploadComplete={(results) => {
                          if (results.length > 0) {
                            const url = results[0].url;
                            const updated = surfaceTypes.map((s) =>
                              s.id === surface.id ? { ...s, image_url: url } : s
                            );
                            setSurfaceTypes(updated);
                            updateSetting('surface-type', surface.type_id, { image_url: url });
                          }
                        }}
                        maxFiles={1}
                        disabled={saving}
                        folder="kalkulator/surface-types"
                      />
                    </div>
                  </div>
                  
                  {/* Price Ranges Section */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Zakresy cenowe (wg m²)</h4>
                      <p className="text-xs text-gray-600 mb-4">
                        Określ różne ceny w zależności od wielkości projektu. Np. do 25m² ryczałt 5000 zł, 25-35m² = 200 zł/m², pow. 35m² = 180 zł/m²
                      </p>
                    </div>
                    
                    {surface.price_ranges && surface.price_ranges.length > 0 ? (
                      <div className="space-y-3">
                        {surface.price_ranges.map((range, idx) => (
                          <div key={idx} className="flex gap-2 items-end p-3 bg-gray-50 rounded">
                            <div className="flex-1">
                              <Label className="text-xs">Od (m²)</Label>
                              <Input
                                type="number"
                                value={range.min_m2}
                                onChange={(e) => {
                                  const updated = surfaceTypes.map((s) => {
                                    if (s.id === surface.id) {
                                      const newRanges = [...(s.price_ranges || [])];
                                      newRanges[idx] = { ...range, min_m2: Number(e.target.value) };
                                      return { ...s, price_ranges: newRanges };
                                    }
                                    return s;
                                  });
                                  setSurfaceTypes(updated);
                                }}
                                onBlur={() => updateSetting('surface-type', surface.type_id, { price_ranges: surface.price_ranges })}
                                className="h-9"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs">Do (m²)</Label>
                              <Input
                                type="number"
                                value={range.max_m2 ?? ''}
                                onChange={(e) => {
                                  const updated = surfaceTypes.map((s) => {
                                    if (s.id === surface.id) {
                                      const newRanges = [...(s.price_ranges || [])];
                                      newRanges[idx] = { ...range, max_m2: e.target.value ? Number(e.target.value) : null };
                                      return { ...s, price_ranges: newRanges };
                                    }
                                    return s;
                                  });
                                  setSurfaceTypes(updated);
                                }}
                                onBlur={() => updateSetting('surface-type', surface.type_id, { price_ranges: surface.price_ranges })}
                                placeholder="Puste = bez limitu"
                                className="h-9"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs flex items-center gap-1">
                                <Switch
                                  checked={range.is_flat_rate || false}
                                  onCheckedChange={(checked) => {
                                    const updated = surfaceTypes.map((s) => {
                                      if (s.id === surface.id) {
                                        const newRanges = [...(s.price_ranges || [])];
                                        newRanges[idx] = { ...range, is_flat_rate: checked };
                                        return { ...s, price_ranges: newRanges };
                                      }
                                      return s;
                                    });
                                    setSurfaceTypes(updated);
                                    updateSetting('surface-type', surface.type_id, { price_ranges: updated.find(s => s.id === surface.id)?.price_ranges });
                                  }}
                                  className="scale-75"
                                />
                                <span>{range.is_flat_rate ? 'Ryczałt' : 'Za m²'}</span>
                              </Label>
                              <Input
                                type="number"
                                value={range.price_per_m2}
                                onChange={(e) => {
                                  const updated = surfaceTypes.map((s) => {
                                    if (s.id === surface.id) {
                                      const newRanges = [...(s.price_ranges || [])];
                                      newRanges[idx] = { ...range, price_per_m2: Number(e.target.value) };
                                      return { ...s, price_ranges: newRanges };
                                    }
                                    return s;
                                  });
                                  setSurfaceTypes(updated);
                                }}
                                onBlur={() => updateSetting('surface-type', surface.type_id, { price_ranges: surface.price_ranges })}
                                placeholder={range.is_flat_rate ? "Kwota ryczałtu" : "Cena za m²"}
                                className="h-9"
                              />
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updated = surfaceTypes.map((s) => {
                                  if (s.id === surface.id) {
                                    const newRanges = [...(s.price_ranges || [])];
                                    newRanges.splice(idx, 1);
                                    return { ...s, price_ranges: newRanges };
                                  }
                                  return s;
                                });
                                setSurfaceTypes(updated);
                                updateSetting('surface-type', surface.type_id, { price_ranges: updated.find(s => s.id === surface.id)?.price_ranges });
                              }}
                              className="h-9"
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Brak zdefiniowanych zakresów - używana będzie cena bazowa</p>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = surfaceTypes.map((s) => {
                          if (s.id === surface.id) {
                            const newRange = {
                              min_m2: 0,
                              max_m2: null,
                              price_per_m2: surface.price_per_m2,
                              is_flat_rate: false
                            };
                            return { ...s, price_ranges: [...(s.price_ranges || []), newRange] };
                          }
                          return s;
                        });
                        setSurfaceTypes(updated);
                      }}
                      className="mt-3"
                    >
                      + Dodaj zakres cenowy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Colors */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => openCreateModal('color')} className="gap-2">
                <Save className="w-4 h-4" />
                Dodaj nowy kolor
              </Button>
            </div>
            {colors.map((color) => (
              <Card key={color.id} className={!color.is_active ? 'opacity-60 bg-gray-50' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{color.name}</span>
                      {!color.is_active && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Wyłączone</span>
                      )}
                    </div>
                    <Switch
                      checked={color.is_active}
                      onCheckedChange={(checked) => updateSetting('color', color.color_id, { is_active: checked })}
                      disabled={saving}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nazwa</Label>
                      <Input
                        value={color.name}
                        onChange={(e) => {
                          const updated = colors.map((c) =>
                            c.id === color.id ? { ...c, name: e.target.value } : c
                          );
                          setColors(updated);
                        }}
                        onBlur={(e) => updateSetting('color', color.color_id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Kod RAL</Label>
                      <Input
                        value={color.ral_code}
                        onChange={(e) => {
                          const updated = colors.map((c) =>
                            c.id === color.id ? { ...c, ral_code: e.target.value } : c
                          );
                          setColors(updated);
                        }}
                        onBlur={(e) => updateSetting('color', color.color_id, { ral_code: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Dopłata (zł/m²)</Label>
                      <Input
                        type="number"
                        value={color.additional_price}
                        onChange={(e) => {
                          const updated = colors.map((c) =>
                            c.id === color.id ? { ...c, additional_price: Number(e.target.value) } : c
                          );
                          setColors(updated);
                        }}
                        onBlur={(e) => updateSetting('color', color.color_id, { additional_price: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Miniatura (thumbnail_url)</Label>
                      <div className="space-y-3">
                        <Input
                          value={color.thumbnail_url || ''}
                          onChange={(e) => {
                            const updated = colors.map((c) =>
                              c.id === color.id ? { ...c, thumbnail_url: e.target.value } : c
                            );
                            setColors(updated);
                          }}
                          onBlur={(e) => updateSetting('color', color.color_id, { thumbnail_url: e.target.value })}
                          placeholder="/images/... lub URL z Cloudinary"
                        />
                        <CloudinaryUploadWidget
                          onUploadComplete={(results) => {
                            if (results.length > 0) {
                              const url = results[0].url;
                              const updated = colors.map((c) =>
                                c.id === color.id ? { ...c, thumbnail_url: url } : c
                              );
                              setColors(updated);
                              updateSetting('color', color.color_id, { thumbnail_url: url });
                            }
                          }}
                          maxFiles={1}
                          disabled={saving}
                          folder="kalkulator/colors"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Podgląd (preview_url)</Label>
                      <div className="space-y-3">
                        <Input
                          value={color.preview_url || ''}
                          onChange={(e) => {
                            const updated = colors.map((c) =>
                              c.id === color.id ? { ...c, preview_url: e.target.value } : c
                            );
                            setColors(updated);
                          }}
                          onBlur={(e) => updateSetting('color', color.color_id, { preview_url: e.target.value })}
                          placeholder="/images/... lub URL z Cloudinary"
                        />
                        <CloudinaryUploadWidget
                          onUploadComplete={(results) => {
                            if (results.length > 0) {
                              const url = results[0].url;
                              const updated = colors.map((c) =>
                                c.id === color.id ? { ...c, preview_url: url } : c
                              );
                              setColors(updated);
                              updateSetting('color', color.color_id, { preview_url: url });
                            }
                          }}
                          maxFiles={1}
                          disabled={saving}
                          folder="kalkulator/colors"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Services */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => openCreateModal('service')} className="gap-2">
                <Save className="w-4 h-4" />
                Dodaj nową usługę
              </Button>
            </div>
            {services
              .filter(service => service.category === 'przygotowanie' || service.category === 'wykończenie' || service.category === 'logistyka')
              .map((service) => (
              <Card key={service.id} className={!service.is_active ? 'opacity-60 bg-gray-50' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>{service.name}</span>
                      {service.is_mandatory && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Obowiązkowe</span>
                      )}
                      {!service.is_active && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Wyłączone</span>
                      )}
                    </div>
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={(checked) => updateSetting('service', service.service_id, { is_active: checked })}
                      disabled={saving}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nazwa</Label>
                      <Input
                        value={service.name}
                        onChange={(e) => {
                          const updated = services.map((s) =>
                            s.id === service.id ? { ...s, name: e.target.value } : s
                          );
                          setServices(updated);
                        }}
                        onBlur={(e) => updateSetting('service', service.service_id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Kategoria</Label>
                      <Input value={service.category} disabled className="bg-gray-100" />
                    </div>
                  </div>
                  <div>
                    <Label>Opis</Label>
                    <Textarea
                      value={service.description}
                      onChange={(e) => {
                        const updated = services.map((s) =>
                          s.id === service.id ? { ...s, description: e.target.value } : s
                        );
                        setServices(updated);
                      }}
                      onBlur={(e) => updateSetting('service', service.service_id, { description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                    <Switch
                      checked={service.is_included_in_floor_price || false}
                      onCheckedChange={(checked) => {
                        const updated = services.map((s) =>
                          s.id === service.id ? { ...s, is_included_in_floor_price: checked } : s
                        );
                        setServices(updated);
                        updateSetting('service', service.service_id, { is_included_in_floor_price: checked });
                      }}
                      disabled={saving}
                    />
                    <Label className="cursor-pointer">
                      Usługa w cenie posadzki (zamiast wyświetlania ceny, pokaże &quot;w cenie posadzki&quot;)
                    </Label>
                  </div>
                  {!service.is_included_in_floor_price && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {service.price_per_m2 !== undefined && service.price_per_m2 !== null && (
                        <div>
                          <Label>Cena za m² (zł)</Label>
                          <Input
                            type="number"
                            value={service.price_per_m2}
                            onChange={(e) => {
                              const updated = services.map((s) =>
                                s.id === service.id ? { ...s, price_per_m2: Number(e.target.value) } : s
                              );
                              setServices(updated);
                            }}
                            onBlur={(e) =>
                              updateSetting('service', service.service_id, { price_per_m2: Number(e.target.value) })
                            }
                          />
                        </div>
                      )}
                      {service.price_per_mb !== undefined && service.price_per_mb !== null && (
                        <div>
                          <Label>Cena za mb (zł)</Label>
                          <Input
                            type="number"
                            value={service.price_per_mb}
                            onChange={(e) => {
                              const updated = services.map((s) =>
                                s.id === service.id ? { ...s, price_per_mb: Number(e.target.value) } : s
                              );
                              setServices(updated);
                            }}
                            onBlur={(e) =>
                              updateSetting('service', service.service_id, { price_per_mb: Number(e.target.value) })
                            }
                          />
                        </div>
                      )}
                      {service.price_fixed !== undefined && service.price_fixed !== null && (
                        <div>
                          <Label>Cena stała (zł)</Label>
                          <Input
                            type="number"
                            value={service.price_fixed}
                            onChange={(e) => {
                              const updated = services.map((s) =>
                                s.id === service.id ? { ...s, price_fixed: Number(e.target.value) } : s
                              );
                              setServices(updated);
                            }}
                            onBlur={(e) =>
                              updateSetting('service', service.service_id, { price_fixed: Number(e.target.value) })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {service.is_included_in_floor_price && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                      ℹ️ Usługa wliczona w cenę posadzki - nie wymaga ustawienia ceny
                    </div>
                  )}
                  <div>
                    <Label>Zdjęcie</Label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={service.image_url || ''}
                          onChange={(e) => {
                            const updated = services.map((s) =>
                              s.id === service.id ? { ...s, image_url: e.target.value } : s
                            );
                            setServices(updated);
                          }}
                          onBlur={(e) => updateSetting('service', service.service_id, { image_url: e.target.value })}
                          placeholder="/images/... lub URL z Cloudinary"
                        />
                        {service.image_url && (
                          <div className="relative w-16 h-16 border rounded flex-shrink-0">
                            <Image src={service.image_url} alt={service.name} fill className="object-cover rounded" />
                          </div>
                        )}
                      </div>
                      <CloudinaryUploadWidget
                        onUploadComplete={(results) => {
                          if (results.length > 0) {
                            const url = results[0].url;
                            const updated = services.map((s) =>
                              s.id === service.id ? { ...s, image_url: url } : s
                            );
                            setServices(updated);
                            updateSetting('service', service.service_id, { image_url: url });
                          }
                        }}
                        maxFiles={1}
                        disabled={saving}
                        folder="kalkulator/services"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Room Types */}
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            {roomTypes.map((room) => (
              <Card key={room.id} className={!room.is_available ? 'opacity-60 bg-gray-50' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{room.icon} {room.name}</span>
                      {!room.is_available && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Niedostępne</span>
                      )}
                    </div>
                    <Switch
                      checked={room.is_available}
                      onCheckedChange={(checked) => updateSetting('room-type', room.room_id, { is_available: checked })}
                      disabled={saving}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nazwa</Label>
                      <Input
                        value={room.name}
                        onChange={(e) => {
                          const updated = roomTypes.map((r) =>
                            r.id === room.id ? { ...r, name: e.target.value } : r
                          );
                          setRoomTypes(updated);
                        }}
                        onBlur={(e) => updateSetting('room-type', room.room_id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Ikona (emoji)</Label>
                      <Input
                        value={room.icon || ''}
                        onChange={(e) => {
                          const updated = roomTypes.map((r) =>
                            r.id === room.id ? { ...r, icon: e.target.value } : r
                          );
                          setRoomTypes(updated);
                        }}
                        onBlur={(e) => updateSetting('room-type', room.room_id, { icon: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Opis</Label>
                    <Textarea
                      value={room.description}
                      onChange={(e) => {
                        const updated = roomTypes.map((r) =>
                          r.id === room.id ? { ...r, description: e.target.value } : r
                        );
                        setRoomTypes(updated);
                      }}
                      onBlur={(e) => updateSetting('room-type', room.room_id, { description: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Concrete States */}
        {activeTab === 'concrete' && (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <Button onClick={() => openCreateModal('concrete-state')} className="gap-2">
                <Save className="w-4 h-4" />
                Dodaj nowy stan podłoża
              </Button>
            </div>
            {concreteStates.map((state) => (
              <Card key={state.id}>
                <CardHeader>
                  <CardTitle>{state.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nazwa</Label>
                      <Input
                        value={state.name}
                        onChange={(e) => {
                          const updated = concreteStates.map((s) =>
                            s.id === state.id ? { ...s, name: e.target.value } : s
                          );
                          setConcreteStates(updated);
                        }}
                        onBlur={(e) => updateSetting('concrete-state', state.state_id, { name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Dopłata (zł/m²)</Label>
                      <Input
                        type="number"
                        value={state.additional_price}
                        onChange={(e) => {
                          const updated = concreteStates.map((s) =>
                            s.id === state.id ? { ...s, additional_price: Number(e.target.value) } : s
                          );
                          setConcreteStates(updated);
                        }}
                        onBlur={(e) =>
                          updateSetting('concrete-state', state.state_id, { additional_price: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Opis</Label>
                    <Textarea
                      value={state.description}
                      onChange={(e) => {
                        const updated = concreteStates.map((s) =>
                          s.id === state.id ? { ...s, description: e.target.value } : s
                        );
                        setConcreteStates(updated);
                      }}
                      onBlur={(e) => updateSetting('concrete-state', state.state_id, { description: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Switch
                      id={`show-price-${state.id}`}
                      checked={state.show_price_in_label || false}
                      onCheckedChange={(checked) => updateSetting('concrete-state', state.state_id, { show_price_in_label: checked })}
                    />
                    <Label htmlFor={`show-price-${state.id}`} className="cursor-pointer">
                      Pokaż cenę w etykiecie (np. &quot;+25 zł&quot;)
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Step Visibility Configuration */}
        {activeTab === 'steps' && (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Możesz ukryć niektóre kroki kalkulatora przed klientami. Ukryte kroki będą automatycznie pomijane, a domyślne wartości zostaną użyte.
              </AlertDescription>
            </Alert>
            
            {stepConfigs.map((step) => (
              <Card key={step.id} className={`transition-opacity ${!step.is_visible && step.can_be_hidden ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {step.step_name}
                        {step.is_visible ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Widoczny</span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Ukryty</span>
                        )}
                      </CardTitle>
                      {step.description && (
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {step.can_be_hidden ? (
                        <>
                          <Label htmlFor={`step-visible-${step.id}`} className="text-sm font-medium">
                            {step.is_visible ? 'Widoczny' : 'Ukryty'}
                          </Label>
                          <Switch
                            id={`step-visible-${step.id}`}
                            checked={step.is_visible}
                            onCheckedChange={(checked) => updateSetting('step-config', step.step_id, { is_visible: checked })}
                          />
                        </>
                      ) : (
                        <span className="text-xs text-gray-500 italic">Krok obowiązkowy</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!step.can_be_hidden && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700">
                        Ten krok jest wymagany i nie może być ukryty.
                      </AlertDescription>
                    </Alert>
                  )}
                  {!step.is_visible && step.can_be_hidden && (
                    <Alert className="bg-gray-50 border-gray-200">
                      <AlertDescription className="text-gray-700">
                        Krok jest ukryty przed klientami. W kalkulatorze będzie automatycznie pomijany.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
