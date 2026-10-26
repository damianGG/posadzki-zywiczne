/**
 * Neon helper functions for Calculator Settings
 * Provides CRUD operations for calculator configuration in the Neon Postgres database
 */

import { insertRow, isDatabaseConfigured, query, updateRow } from './db';

export interface SurfaceType {
  id?: string;
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

interface FetchOptions {
  includeInactive?: boolean;
  useAdmin?: boolean;
}

const NOT_CONFIGURED = 'Neon database not configured';

type Result<T> = { success: boolean; data?: T; error?: string };

async function listTable<T>(table: string, activeOnly: boolean): Promise<Result<T[]>> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };
  try {
    const where = activeOnly ? 'where is_active = true' : '';
    const rows = await query(`select * from ${table} ${where} order by display_order`);
    return { success: true, data: rows as T[] };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

async function updateTable<T>(table: string, keyColumn: string, keyValue: string, updates: Record<string, unknown>): Promise<Result<T>> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };
  try {
    const row = await updateRow(table, keyColumn, keyValue, updates);
    if (!row) return { success: false, error: 'Record not found' };
    return { success: true, data: row as T };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

async function createInTable<T>(table: string, data: Record<string, unknown>): Promise<Result<T>> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };
  try {
    const row = await insertRow(table, data);
    return { success: true, data: row as T };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// ========== Surface Types ==========

export async function getAllSurfaceTypes(options: FetchOptions = {}) {
  return listTable<SurfaceType>('calculator_surface_types', !options.includeInactive);
}

export async function updateSurfaceType(type_id: string, updates: Partial<SurfaceType>) {
  return updateTable<SurfaceType>('calculator_surface_types', 'type_id', type_id, updates);
}

// ========== Colors ==========

export async function getAllColors(options: FetchOptions = {}) {
  return listTable<ColorOption>('calculator_colors', !options.includeInactive);
}

export async function updateColor(color_id: string, updates: Partial<ColorOption>) {
  return updateTable<ColorOption>('calculator_colors', 'color_id', color_id, updates);
}

// ========== Services ==========

export async function getAllServices(options: FetchOptions = {}) {
  return listTable<Service>('calculator_services', !options.includeInactive);
}

export async function updateService(service_id: string, updates: Partial<Service>) {
  return updateTable<Service>('calculator_services', 'service_id', service_id, updates);
}

// ========== Room Types ==========

export async function getAllRoomTypes() {
  return listTable<RoomType>('calculator_room_types', false);
}

export async function updateRoomType(room_id: string, updates: Partial<RoomType>) {
  return updateTable<RoomType>('calculator_room_types', 'room_id', room_id, updates);
}

// ========== Concrete States ==========

export async function getAllConcreteStates() {
  return listTable<ConcreteState>('calculator_concrete_states', false);
}

export async function updateConcreteState(state_id: string, updates: Partial<ConcreteState>) {
  return updateTable<ConcreteState>('calculator_concrete_states', 'state_id', state_id, updates);
}

// ========== Create Functions ==========

export async function createSurfaceType(data: SurfaceType) {
  return createInTable<SurfaceType>('calculator_surface_types', { ...data });
}

export async function createColor(data: ColorOption) {
  return createInTable<ColorOption>('calculator_colors', { ...data });
}

export async function createService(data: Service) {
  return createInTable<Service>('calculator_services', { ...data });
}

export async function createRoomType(data: RoomType) {
  return createInTable<RoomType>('calculator_room_types', { ...data });
}

export async function createConcreteState(data: ConcreteState) {
  return createInTable<ConcreteState>('calculator_concrete_states', { ...data });
}

// ========== Step Config ==========

export async function getAllStepConfigs() {
  return listTable<StepConfig>('calculator_step_config', false);
}

export async function updateStepConfig(step_id: string, updates: Partial<StepConfig>) {
  return updateTable<StepConfig>('calculator_step_config', 'step_id', step_id, updates);
}
