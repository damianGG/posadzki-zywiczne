'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Material {
  id: string;
  name: string;
  unit: string;
  quantity_available: number;
  is_active: boolean;
}

interface Project {
  slug: string;
  title: string;
  location: string;
  images?: {
    main?: string;
    gallery?: Array<{ url: string }>;
  };
}

interface Usage {
  id: string;
  project_name: string;
  quantity_used: number;
  usage_date: string;
  notes?: string;
  material?: { name: string; unit: string };
}

export default function ProjektyPage() {
  const today = new Date().toISOString().split('T')[0];
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [usageEntries, setUsageEntries] = useState<Usage[]>([]);
  const [projectSlug, setProjectSlug] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantityUsed, setQuantityUsed] = useState('');
  const [usageDate, setUsageDate] = useState(today);
  const [notes, setNotes] = useState('');

  const fetchData = useCallback(async () => {
    const [materialsRes, usageRes, projectsRes] = await Promise.all([
      fetch('/api/admin/magazyn'),
      fetch('/api/admin/projekty'),
      fetch('/api/admin/list-realizacje'),
    ]);

    const materialsData = await materialsRes.json();
    const usageData = await usageRes.json();
    const projectsData = await projectsRes.json();

    if (materialsRes.ok) {
      const activeMaterials = (materialsData.materials || []).filter((material: Material) => material.is_active);
      setMaterials(activeMaterials);
      setMaterialId((currentMaterialId) => {
        if (currentMaterialId || !activeMaterials[0]) return currentMaterialId;
        return activeMaterials[0].id;
      });
    }

    if (projectsRes.ok) {
      const availableProjects = projectsData.realizacje || [];
      setProjects(availableProjects);
      setProjectSlug((currentProjectSlug) => {
        if (currentProjectSlug || !availableProjects[0]) return currentProjectSlug;
        return availableProjects[0].slug;
      });
    }

    if (usageRes.ok) {
      setUsageEntries(usageData.usage || []);
    }
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/realizacje/dodaj');
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, [router, fetchData]);

  const addUsage = async () => {
    const selectedProject = projects.find((project) => project.slug === projectSlug);
    if (!selectedProject) {
      alert('Najpierw dodaj projekt w sekcji Realizacje.');
      return;
    }

    const res = await fetch('/api/admin/projekty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_name: selectedProject.title,
        material_id: materialId,
        quantity_used: Number(quantityUsed),
        usage_date: usageDate,
        notes,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Nie udało się zapisać zużycia');
      return;
    }

    setQuantityUsed('');
    setNotes('');
    fetchData();
  };

  if (!isAuthenticated) return null;
  const selectedProject = projects.find((project) => project.slug === projectSlug);
  const previewImage = selectedProject?.images?.gallery?.[0]?.url || selectedProject?.images?.main;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projekty</h1>
            <p className="text-gray-600 dark:text-gray-300">Dodawaj zużycie materiałów per dzień realizacji</p>
          </div>
          <Link href="/admin">
            <Button variant="outline">Powrót</Button>
          </Link>
        </div>

        <Card className="p-4 mb-6">
          <h2 className="font-semibold mb-3">Dodaj wpis zużycia</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <select
              value={projectSlug}
              onChange={(e) => setProjectSlug(e.target.value)}
              className="border rounded-md px-3 py-2 bg-white dark:bg-gray-900"
            >
              {projects.map((project) => (
                <option key={project.slug} value={project.slug}>
                  {project.title}
                </option>
              ))}
            </select>
            <Input type="date" value={usageDate} onChange={(e) => setUsageDate(e.target.value)} />
          </div>
          <div className="mb-3 p-3 border rounded-md bg-gray-50 dark:bg-gray-900/40">
            <p className="text-sm">
              <span className="font-medium">Adres inwestycji:</span>{' '}
              {!selectedProject
                ? 'Brak projektu. Dodaj projekt w sekcji Realizacje.'
                : selectedProject.location || 'Nie uzupełniono adresu inwestycji'}
            </p>
            {previewImage && (
              <img src={previewImage} alt={selectedProject?.title || 'Projekt'} className="mt-2 h-24 rounded-md object-cover" />
            )}
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              Projekty ze zdjęciami tworzysz w{' '}
              <Link href="/admin/realizacje/dodaj" className="underline">
                /admin/realizacje/dodaj
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <select
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="border rounded-md px-3 py-2 bg-white dark:bg-gray-900"
            >
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} (stan: {material.quantity_available} {material.unit})
                </option>
              ))}
            </select>
            <Input type="number" min="0.01" step="0.01" placeholder="Ilość zużyta" value={quantityUsed} onChange={(e) => setQuantityUsed(e.target.value)} />
          </div>
          <Textarea placeholder="Notatka (opcjonalnie)" value={notes} onChange={(e) => setNotes(e.target.value)} className="mb-3" />
          <Button onClick={addUsage}>Dodaj wpis</Button>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-3">Historia wpisów</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Data</th>
                  <th className="text-left py-2">Projekt</th>
                  <th className="text-left py-2">Materiał</th>
                  <th className="text-left py-2">Ilość</th>
                  <th className="text-left py-2">Notatka</th>
                </tr>
              </thead>
              <tbody>
                {usageEntries.map((entry) => (
                  <tr key={entry.id} className="border-b">
                    <td className="py-2">{entry.usage_date}</td>
                    <td className="py-2">{entry.project_name}</td>
                    <td className="py-2">{entry.material?.name || '-'}</td>
                    <td className="py-2">{entry.quantity_used} {entry.material?.unit || ''}</td>
                    <td className="py-2">{entry.notes || '-'}</td>
                  </tr>
                ))}
                {!usageEntries.length && (
                  <tr>
                    <td className="py-2" colSpan={5}>Brak wpisów.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
