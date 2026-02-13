'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2, Wallet, Warehouse } from 'lucide-react';

const PROJECTS_STORAGE_KEY = 'admin_project_costs_v1';
const INVENTORY_STORAGE_KEY = 'admin_inventory_items_v1';

interface ProjectCostEntry {
  id: string;
  name: string;
  revenue: number;
  materialCost: number;
  travelCost: number;
  fuelCost: number;
  otherCost: number;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

const emptyProjectForm = {
  name: '',
  revenue: '',
  materialCost: '',
  travelCost: '',
  fuelCost: '',
  otherCost: '',
};

const emptyInventoryForm = {
  name: '',
  quantity: '',
  unitCost: '',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);

const formatNumber = (value: number) =>
  new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 2 }).format(value);

const toNumber = (value: string) => {
  const normalized = value.replace(',', '.').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const createId = () => {
  if (typeof crypto !== 'undefined') {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }
    if (crypto.getRandomValues) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const random = crypto.getRandomValues(new Uint8Array(1))[0] & 0x0f;
        const value = char === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
      });
    }
  }
  return `legacy-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export default function AdminKosztyPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<ProjectCostEntry[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [inventoryForm, setInventoryForm] = useState(emptyInventoryForm);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
      return;
    }
    setIsAuthenticated(true);

    const storedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch {
        setProjects([]);
      }
    }

    const storedInventory = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (storedInventory) {
      try {
        setInventoryItems(JSON.parse(storedInventory));
      } catch {
        setInventoryItems([]);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [isAuthenticated, projects]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventoryItems));
  }, [inventoryItems, isAuthenticated]);

  const totalProjectRevenue = useMemo(
    () => projects.reduce((sum, project) => sum + project.revenue, 0),
    [projects],
  );
  const totalProjectCosts = useMemo(
    () =>
      projects.reduce(
        (sum, project) =>
          sum +
          project.materialCost +
          project.travelCost +
          project.fuelCost +
          project.otherCost,
        0,
      ),
    [projects],
  );
  const totalProjectProfit = useMemo(
    () => totalProjectRevenue - totalProjectCosts,
    [totalProjectCosts, totalProjectRevenue],
  );
  const profitMargin = useMemo(() => {
    if (totalProjectRevenue === 0) return null;
    return ((totalProjectProfit / totalProjectRevenue) * 100).toFixed(1);
  }, [totalProjectProfit, totalProjectRevenue]);
  const inventoryEntries = useMemo(
    () =>
      inventoryItems.map((item) => ({
        ...item,
        totalValue: item.quantity * item.unitCost,
      })),
    [inventoryItems],
  );
  const totalInventoryValue = useMemo(
    () => inventoryEntries.reduce((sum, item) => sum + item.totalValue, 0),
    [inventoryEntries],
  );

  const addProject = () => {
    if (!projectForm.name.trim()) return;

    const newProject: ProjectCostEntry = {
      id: createId(),
      name: projectForm.name.trim(),
      revenue: toNumber(projectForm.revenue),
      materialCost: toNumber(projectForm.materialCost),
      travelCost: toNumber(projectForm.travelCost),
      fuelCost: toNumber(projectForm.fuelCost),
      otherCost: toNumber(projectForm.otherCost),
    };

    setProjects((prev) => [newProject, ...prev]);
    setProjectForm(emptyProjectForm);
  };

  const addInventoryItem = () => {
    if (!inventoryForm.name.trim()) return;

    const newItem: InventoryItem = {
      id: createId(),
      name: inventoryForm.name.trim(),
      quantity: toNumber(inventoryForm.quantity),
      unitCost: toNumber(inventoryForm.unitCost),
    };

    setInventoryItems((prev) => [newItem, ...prev]);
    setInventoryForm(emptyInventoryForm);
  };

  const projectCosts = (project: ProjectCostEntry) =>
    project.materialCost + project.travelCost + project.fuelCost + project.otherCost;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Finanse i magazyn
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Wprowadzaj koszty materiałów, dojazdów i paliwa, aby szybko sprawdzić realny zysk
              z projektu oraz stan zapasów.
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Powrót do panelu
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                  Koszty i zyski projektów
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Dodawaj koszty materiału, dojazdu i paliwa dla każdej realizacji.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-gray-500">Łączny zysk</p>
                <p
                  className={`text-lg font-semibold ${
                    totalProjectProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {formatCurrency(totalProjectProfit)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="projectName">Nazwa projektu</Label>
                  <Input
                    id="projectName"
                    placeholder="np. Hala produkcyjna - Warszawa"
                    value={projectForm.name}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectRevenue">Przychód (PLN)</Label>
                  <Input
                    id="projectRevenue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={projectForm.revenue}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, revenue: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectMaterial">Materiały (PLN)</Label>
                  <Input
                    id="projectMaterial"
                    type="number"
                    min="0"
                    step="0.01"
                    value={projectForm.materialCost}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, materialCost: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectTravel">Dojazd (PLN)</Label>
                  <Input
                    id="projectTravel"
                    type="number"
                    min="0"
                    step="0.01"
                    value={projectForm.travelCost}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, travelCost: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectFuel">Paliwo (PLN)</Label>
                  <Input
                    id="projectFuel"
                    type="number"
                    min="0"
                    step="0.01"
                    value={projectForm.fuelCost}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, fuelCost: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="projectOther">Pozostałe koszty (PLN)</Label>
                  <Input
                    id="projectOther"
                    type="number"
                    min="0"
                    step="0.01"
                    value={projectForm.otherCost}
                    onChange={(event) =>
                      setProjectForm((prev) => ({ ...prev, otherCost: event.target.value }))
                    }
                  />
                </div>
              </div>
              <Button
                className="w-full gap-2"
                onClick={addProject}
                disabled={!projectForm.name.trim()}
              >
                <Plus className="h-4 w-4" />
                Dodaj projekt
              </Button>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border bg-white/70 px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Przychody</p>
                  <p className="text-lg font-semibold">{formatCurrency(totalProjectRevenue)}</p>
                </div>
                <div className="rounded-lg border bg-white/70 px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Koszty</p>
                  <p className="text-lg font-semibold">{formatCurrency(totalProjectCosts)}</p>
                </div>
                <div className="rounded-lg border bg-white/70 px-3 py-2 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Marża</p>
                  <p className="text-lg font-semibold">
                    {profitMargin !== null ? `${profitMargin}%` : '—'}
                  </p>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500 dark:border-gray-700">
                  Brak zapisanych projektów. Dodaj pierwszą realizację, aby zacząć analizę kosztów.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="py-2 pr-4">Projekt</th>
                        <th className="py-2 pr-4 text-right">Przychód</th>
                        <th className="py-2 pr-4 text-right">Koszt łączny</th>
                        <th className="py-2 pr-4 text-right">Zysk</th>
                        <th className="py-2 text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => {
                        const totalCost = projectCosts(project);
                        const profit = project.revenue - totalCost;
                        return (
                          <tr key={project.id} className="border-b last:border-b-0">
                            <td className="py-2 pr-4 font-medium text-gray-900 dark:text-gray-100">
                              {project.name}
                            </td>
                            <td className="py-2 pr-4 text-right">
                              {formatCurrency(project.revenue)}
                            </td>
                            <td className="py-2 pr-4 text-right">
                              {formatCurrency(totalCost)}
                              <p className="text-xs text-gray-500">
                                Mat: {formatCurrency(project.materialCost)} | Dojazd:{' '}
                                {formatCurrency(project.travelCost)} | Paliwo:{' '}
                                {formatCurrency(project.fuelCost)} | Inne:{' '}
                                {formatCurrency(project.otherCost)}
                              </p>
                            </td>
                            <td
                              className={`py-2 pr-4 text-right font-semibold ${
                                profit >= 0 ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {formatCurrency(profit)}
                            </td>
                            <td className="py-2 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setProjects((prev) => prev.filter((item) => item.id !== project.id))
                                }
                                aria-label={`Usuń projekt ${project.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  Magazyn materiałów
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Kontroluj zapasy i orientacyjną wartość magazynu.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-gray-500">Wartość zapasów</p>
                <p className="text-lg font-semibold">{formatCurrency(totalInventoryValue)}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="inventoryName">Materiał / produkt</Label>
                  <Input
                    id="inventoryName"
                    placeholder="np. Żywica epoksydowa"
                    value={inventoryForm.name}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventoryQuantity">Ilość</Label>
                  <Input
                    id="inventoryQuantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={inventoryForm.quantity}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({ ...prev, quantity: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventoryCost">Cena jednostkowa (PLN)</Label>
                  <Input
                    id="inventoryCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={inventoryForm.unitCost}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({ ...prev, unitCost: event.target.value }))
                    }
                  />
                </div>
              </div>
              <Button
                className="w-full gap-2"
                onClick={addInventoryItem}
                disabled={!inventoryForm.name.trim()}
              >
                <Plus className="h-4 w-4" />
                Dodaj pozycję magazynową
              </Button>

              {inventoryItems.length === 0 ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500 dark:border-gray-700">
                  Brak zapisanych materiałów. Dodaj pierwszą pozycję magazynową.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                        <th className="py-2 pr-4">Produkt</th>
                        <th className="py-2 pr-4 text-right">Ilość</th>
                        <th className="py-2 pr-4 text-right">Cena jednostkowa</th>
                        <th className="py-2 pr-4 text-right">Wartość</th>
                        <th className="py-2 text-right">Akcje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryEntries.map((item) => (
                        <tr key={item.id} className="border-b last:border-b-0">
                          <td className="py-2 pr-4 font-medium text-gray-900 dark:text-gray-100">
                            {item.name}
                          </td>
                          <td className="py-2 pr-4 text-right">{formatNumber(item.quantity)}</td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(item.unitCost)}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(item.totalValue)}
                          </td>
                          <td className="py-2 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setInventoryItems((prev) =>
                                  prev.filter((entry) => entry.id !== item.id),
                                )
                              }
                              aria-label={`Usuń pozycję ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
