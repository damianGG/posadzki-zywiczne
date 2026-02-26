import { getSupabaseAdmin } from '@/lib/supabase-realizacje';

export interface MagazynMaterial {
  id: string;
  name: string;
  unit: string;
  quantity_available: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectMaterialUsage {
  id: string;
  project_name: string;
  material_id: string;
  quantity_used: number;
  usage_date: string;
  notes?: string | null;
  created_at: string;
  material?: { name: string; unit: string } | null;
}

type ProjectMaterialUsageRow = Omit<ProjectMaterialUsage, 'material'> & {
  material?: Array<{ name: string; unit: string }> | null;
};

export async function listMagazynMaterials() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase nie jest skonfigurowany' };

  const { data, error } = await supabase
    .from('magazyn_materials')
    .select('*')
    .order('name', { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, data: (data || []) as MagazynMaterial[] };
}

export async function createMagazynMaterial(payload: {
  name: string;
  unit?: string;
  quantity_available?: number;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase nie jest skonfigurowany' };

  const name = payload.name?.trim();
  if (!name) return { success: false, error: 'Nazwa materiału jest wymagana' };

  const { data, error } = await supabase
    .from('magazyn_materials')
    .insert({
      name,
      unit: (payload.unit || 'kg').trim() || 'kg',
      quantity_available: Number(payload.quantity_available || 0),
      is_active: true,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as MagazynMaterial };
}

export async function updateMagazynMaterial(
  id: string,
  updates: Partial<Pick<MagazynMaterial, 'name' | 'unit' | 'quantity_available' | 'is_active'>>
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase nie jest skonfigurowany' };

  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('magazyn_materials')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as MagazynMaterial };
}

export async function deleteMagazynMaterial(id: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase nie jest skonfigurowany' };

  const { error } = await supabase.from('magazyn_materials').delete().eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function listProjectMaterialUsage() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase nie jest skonfigurowany' };

  const { data, error } = await supabase
    .from('projekty_material_usage')
    .select(`
      id,
      project_name,
      material_id,
      quantity_used,
      usage_date,
      notes,
      created_at,
      material:magazyn_materials(name, unit)
    `)
    .order('usage_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return { success: false, error: error.message };

  const normalizedData = ((data || []) as ProjectMaterialUsageRow[]).map((row) => ({
    ...row,
    material: row.material?.[0] || null,
  }));

  return { success: true, data: normalizedData };
}

export async function addProjectMaterialUsage(payload: {
  project_name: string;
  material_id: string;
  quantity_used: number;
  usage_date?: string;
  notes?: string;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase nie jest skonfigurowany' };

  const { data, error } = await supabase.rpc('register_project_material_usage', {
    p_project_name: payload.project_name,
    p_material_id: payload.material_id,
    p_quantity_used: Number(payload.quantity_used),
    p_usage_date: payload.usage_date,
    p_notes: payload.notes || null,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, usageId: data as string };
}
