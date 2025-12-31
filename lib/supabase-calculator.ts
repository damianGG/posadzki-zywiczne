/**
 * Supabase helper functions for Calculator Settings
 * Provides CRUD operations for calculator configuration in Supabase database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types matching database schema
export interface SurfaceType {
  id?: string;
  type_id: string;
  name: string;
  description: string;
  price_per_m2: number;
  price_ranges?: Array<{
    min_m2: number;
    max_m2: number | null; // null means infinity
    price_per_m2: number;
  }>;
  image_url?: string;
  properties?: string[];
  display_order?: number;
  is_active?: boolean;
}

export interface ColorOption {
  id?: string;
  color_id: string;
  name: string;
  ral_code: string;
  additional_price: number;
  thumbnail_url?: string;
  preview_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface Service {
  id?: string;
  service_id: string;
  name: string;
  description: string;
  category: string;
  price_per_m2?: number;
  price_per_mb?: number;
  price_fixed?: number;
  is_included_in_floor_price?: boolean;
  image_url?: string;
  is_mandatory?: boolean;
  is_default?: boolean;
  display_order?: number;
  is_active?: boolean;
}

export interface RoomType {
  id?: string;
  room_id: string;
  name: string;
  description: string;
  icon?: string;
  is_available?: boolean;
  display_order?: number;
}

export interface ConcreteState {
  id?: string;
  state_id: string;
  name: string;
  description: string;
  additional_price: number;
  show_price_in_label?: boolean;
  display_order?: number;
}

export interface StepConfig {
  id?: string;
  step_id: string;
  step_name: string;
  description?: string;
  is_visible: boolean;
  display_order?: number;
  can_be_hidden?: boolean;
}

/**
 * Get Supabase client with service role key
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase configuration missing');
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

/**
 * Get public Supabase client
 */
export function getSupabasePublic(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return getSupabaseAdmin();
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// ========== Surface Types ==========

export async function getAllSurfaceTypes() {
  const supabase = getSupabasePublic();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_surface_types')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateSurfaceType(type_id: string, updates: Partial<SurfaceType>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_surface_types')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('type_id', type_id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ========== Colors ==========

export async function getAllColors() {
  const supabase = getSupabasePublic();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_colors')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateColor(color_id: string, updates: Partial<ColorOption>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_colors')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('color_id', color_id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ========== Services ==========

export async function getAllServices() {
  const supabase = getSupabasePublic();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_services')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateService(service_id: string, updates: Partial<Service>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_services')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('service_id', service_id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ========== Room Types ==========

export async function getAllRoomTypes() {
  const supabase = getSupabasePublic();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_room_types')
    .select('*')
    .order('display_order');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateRoomType(room_id: string, updates: Partial<RoomType>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_room_types')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('room_id', room_id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ========== Concrete States ==========

export async function getAllConcreteStates() {
  const supabase = getSupabasePublic();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_concrete_states')
    .select('*')
    .order('display_order');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateConcreteState(state_id: string, updates: Partial<ConcreteState>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_concrete_states')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('state_id', state_id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// ========== Create Functions ==========

export async function createSurfaceType(data: SurfaceType) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data: result, error } = await supabase
    .from('calculator_surface_types')
    .insert(data)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: result };
}

export async function createColor(data: ColorOption) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data: result, error } = await supabase
    .from('calculator_colors')
    .insert(data)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: result };
}

export async function createService(data: Service) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data: result, error } = await supabase
    .from('calculator_services')
    .insert(data)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: result };
}

export async function createRoomType(data: RoomType) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data: result, error } = await supabase
    .from('calculator_room_types')
    .insert(data)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: result };
}

export async function createConcreteState(data: ConcreteState) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data: result, error } = await supabase
    .from('calculator_concrete_states')
    .insert(data)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: result };
}

// ========== Step Config ==========

export async function getAllStepConfigs() {
  const supabase = getSupabasePublic();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_step_config')
    .select('*')
    .order('display_order');

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function updateStepConfig(step_id: string, updates: Partial<StepConfig>) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { success: false, error: 'Supabase not configured' };

  const { data, error } = await supabase
    .from('calculator_step_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('step_id', step_id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
