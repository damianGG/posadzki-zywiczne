'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Material {
  id: string;
  name: string;
  unit: string;
  quantity_available: number;
  is_active: boolean;
}

export default function MagazynPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newQuantity, setNewQuantity] = useState('');

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/magazyn');
    const data = await res.json();
    if (res.ok) {
      setMaterials(data.materials || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);
    fetchMaterials();
  }, [router, fetchMaterials]);

  const addMaterial = async () => {
    const res = await fetch('/api/admin/magazyn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newName,
        unit: newUnit,
        quantity_available: Number(newQuantity || 0),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Nie udało się dodać materiału');
      return;
    }

    setNewName('');
    setNewUnit('kg');
    setNewQuantity('');
    fetchMaterials();
  };

  const updateMaterial = async (id: string, quantity_available: number, is_active: boolean) => {
    if (Number.isNaN(quantity_available) || quantity_available < 0) {
      alert('Stan magazynowy musi być liczbą większą lub równą 0');
      return;
    }

    const res = await fetch('/api/admin/magazyn', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity_available, is_active }),
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Nie udało się zaktualizować materiału');
      return;
    }

    fetchMaterials();
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Magazyn</h1>
            <p className="text-gray-600 dark:text-gray-300">Definiuj rodzaje materiałów i stan magazynowy</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Powrót</Button>
          </Link>
        </div>

        <Card className="p-4 mb-6">
          <h2 className="font-semibold mb-3">Dodaj materiał</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Nazwa materiału" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input placeholder="Jednostka (np. kg)" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} />
            <Input placeholder="Stan początkowy" type="number" min="0" step="0.01" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} />
            <Button onClick={addMaterial}>Dodaj</Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-3">Materiały</h2>
          {loading ? (
            <p>Ładowanie...</p>
          ) : (
            <div className="space-y-3">
              {materials.map((material) => (
                <div key={material.id} className="border rounded-lg p-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Stan: {material.quantity_available} {material.unit} {material.is_active ? '' : '(nieaktywny)'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={material.quantity_available}
                        onBlur={(e) => updateMaterial(material.id, Number(e.target.value), material.is_active)}
                        className="w-32"
                      />
                      <Button
                        variant={material.is_active ? 'outline' : 'default'}
                        onClick={() => updateMaterial(material.id, material.quantity_available, !material.is_active)}
                      >
                        {material.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {!materials.length && <p>Brak materiałów.</p>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
