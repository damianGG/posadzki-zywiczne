/**
 * Neon helper functions for Realizacje
 * Provides CRUD operations for realizacje in the Neon Postgres database
 */

import { insertRow, isDatabaseConfigured, query, queryOne, updateRow } from './db';

export interface RealizacjaData {
  id?: string;
  slug: string;
  title: string;
  h1?: string;
  description: string;
  short_description?: string;
  location: string;
  surface_area?: string;
  project_type: string;
  technology?: string;
  color?: string;
  duration?: string;
  keywords?: string[];
  tags?: string[];
  features?: string[];
  benefits?: string[];
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  images: {
    main?: string;
    gallery?: Array<{
      url: string;
      alt?: string;
      hidden?: boolean;
    }>;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;

  content?: {
    intro?: string;
    whenToUse?: string;
    advantages?: string;
    disadvantages?: string;
    execution?: string;
    durability?: string;
    pricing?: string;
    commonMistakes?: string;
    forWho?: string;
    localService?: string;
  };

  cloudinary_folder?: string;
  created_at?: string;
  updated_at?: string;
}

const NOT_CONFIGURED = 'Baza danych Neon nie jest skonfigurowana';

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error';
}

export async function createRealizacja(data: RealizacjaData): Promise<{ success: boolean; data?: RealizacjaData; error?: string }> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };

  try {
    const result = await insertRow<RealizacjaData & Record<string, unknown>>('realizacje', {
      slug: data.slug,
      title: data.title,
      h1: data.h1,
      description: data.description,
      short_description: data.short_description,
      location: data.location,
      surface_area: data.surface_area,
      project_type: data.project_type,
      technology: data.technology,
      color: data.color,
      duration: data.duration,
      keywords: data.keywords || [],
      tags: data.tags || [],
      features: data.features || [],
      benefits: data.benefits || [],
      meta_description: data.meta_description,
      og_title: data.og_title,
      og_description: data.og_description,
      images: data.images,
      faq: data.faq || [],
      content: data.content,
      cloudinary_folder: data.cloudinary_folder,
    });

    return { success: true, data: result };
  } catch (err) {
    console.error('Error creating realizacja:', err);
    return { success: false, error: errorMessage(err) };
  }
}

export async function updateRealizacja(slug: string, data: Partial<RealizacjaData>): Promise<{ success: boolean; data?: RealizacjaData; error?: string }> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };

  try {
    const result = await updateRow<RealizacjaData & Record<string, unknown>>('realizacje', 'slug', slug, {
      ...data,
      updated_at: new Date().toISOString(),
    });

    if (!result) return { success: false, error: 'Realizacja nie znaleziona' };
    return { success: true, data: result };
  } catch (err) {
    console.error('Error updating realizacja:', err);
    return { success: false, error: errorMessage(err) };
  }
}

export async function deleteRealizacja(slug: string): Promise<{ success: boolean; error?: string }> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };

  try {
    await query('delete from realizacje where slug = $1', [slug]);
    return { success: true };
  } catch (err) {
    console.error('Error deleting realizacja:', err);
    return { success: false, error: errorMessage(err) };
  }
}

export async function getRealizacjaBySlug(slug: string): Promise<{ success: boolean; data?: RealizacjaData; error?: string }> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };

  try {
    const row = await queryOne<RealizacjaData & Record<string, unknown>>('select * from realizacje where slug = $1', [slug]);
    if (!row) return { success: false, error: 'Realizacja nie znaleziona' };
    return { success: true, data: row };
  } catch (err) {
    console.error('Error getting realizacja:', err);
    return { success: false, error: errorMessage(err) };
  }
}

export async function listRealizacje(options?: {
  limit?: number;
  offset?: number;
  projectType?: string;
  orderBy?: 'created_at' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}): Promise<{ success: boolean; data?: RealizacjaData[]; count?: number; error?: string }> {
  if (!isDatabaseConfigured()) return { success: false, error: NOT_CONFIGURED };

  try {
    const orderBy = options?.orderBy === 'updated_at' ? 'updated_at' : 'created_at';
    const direction = options?.orderDirection === 'asc' ? 'asc' : 'desc';

    const params: unknown[] = [];
    let where = '';
    if (options?.projectType) {
      params.push(options.projectType);
      where = `where project_type = $${params.length}`;
    }

    const countRow = await queryOne<{ count: number }>(`select count(*) as count from realizacje ${where}`, params);

    let sql = `select * from realizacje ${where} order by ${orderBy} ${direction}`;
    if (options?.limit) {
      params.push(options.limit);
      sql += ` limit $${params.length}`;
    }
    if (options?.offset) {
      params.push(options.offset);
      sql += ` offset $${params.length}`;
    }

    const rows = await query<RealizacjaData & Record<string, unknown>>(sql, params);
    return { success: true, data: rows, count: countRow?.count ?? 0 };
  } catch (err) {
    console.error('Error listing realizacje:', err);
    return { success: false, error: errorMessage(err) };
  }
}

export async function slugExists(slug: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;

  try {
    const row = await queryOne('select 1 from realizacje where slug = $1', [slug]);
    return row !== null;
  } catch {
    return false;
  }
}
