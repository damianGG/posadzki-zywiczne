/**
 * Supabase helper functions for Realizacje
 * Provides CRUD operations for realizacje in Supabase database
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Realizacja type matching database schema
export interface RealizacjaData {
  id?: string;
  slug: string;
  title: string;
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
    }>;
  };
  faq?: Array<{
    question: string;
    answer: string;
  }>;
  cloudinary_folder?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get Supabase client with service role key
 * Service role key bypasses RLS for admin operations
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
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
 * Get public Supabase client (for read-only operations)
 */
export function getSupabasePublic(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Fallback to service role if anon key not set
    return getSupabaseAdmin();
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Create new realizacja in Supabase
 */
export async function createRealizacja(data: RealizacjaData): Promise<{ success: boolean; data?: RealizacjaData; error?: string }> {
  const supabase = getSupabaseAdmin();
  
  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  try {
    const { data: result, error } = await supabase
      .from('realizacje')
      .insert({
        slug: data.slug,
        title: data.title,
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
        cloudinary_folder: data.cloudinary_folder,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  } catch (err) {
    console.error('Error creating realizacja:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Update existing realizacja in Supabase
 */
export async function updateRealizacja(slug: string, data: Partial<RealizacjaData>): Promise<{ success: boolean; data?: RealizacjaData; error?: string }> {
  const supabase = getSupabaseAdmin();
  
  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  try {
    const updateData: any = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('Updating realizacja in Supabase:', {
      slug,
      fields: Object.keys(updateData),
      updateDataSample: {
        title: updateData.title,
        project_type: updateData.project_type,
        location: updateData.location,
        hasImages: !!updateData.images,
        imageCount: updateData.images?.gallery?.length || 0,
      }
    });

    const { data: result, error } = await supabase
      .from('realizacje')
      .update(updateData)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      
      // Return more detailed error message
      let errorMessage = error.message;
      if (error.details) {
        errorMessage += ` | Details: ${error.details}`;
      }
      if (error.hint) {
        errorMessage += ` | Hint: ${error.hint}`;
      }
      if (error.code) {
        errorMessage += ` | Code: ${error.code}`;
      }
      
      return { success: false, error: errorMessage };
    }

    console.log('Supabase update successful');
    return { success: true, data: result };
  } catch (err) {
    console.error('Error updating realizacja:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Delete realizacja from Supabase
 */
export async function deleteRealizacja(slug: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  
  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  try {
    const { error } = await supabase
      .from('realizacje')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Error deleting realizacja:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Get single realizacja by slug
 */
export async function getRealizacjaBySlug(slug: string): Promise<{ success: boolean; data?: RealizacjaData; error?: string }> {
  const supabase = getSupabasePublic();
  
  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  try {
    const { data, error } = await supabase
      .from('realizacje')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, error: 'Realizacja nie znaleziona' };
      }
      console.error('Supabase select error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error getting realizacja:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * List all realizacje (with optional filters)
 */
export async function listRealizacje(options?: {
  limit?: number;
  offset?: number;
  projectType?: string;
  orderBy?: 'created_at' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}): Promise<{ success: boolean; data?: RealizacjaData[]; count?: number; error?: string }> {
  const supabase = getSupabasePublic();
  
  if (!supabase) {
    return { success: false, error: 'Supabase nie jest skonfigurowany' };
  }

  try {
    let query = supabase
      .from('realizacje')
      .select('*', { count: 'exact' });

    // Apply filters
    if (options?.projectType) {
      query = query.eq('project_type', options.projectType);
    }

    // Apply ordering
    const orderBy = options?.orderBy || 'created_at';
    const orderDirection = options?.orderDirection || 'desc';
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });

    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase list error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [], count: count || 0 };
  } catch (err) {
    console.error('Error listing realizacje:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Check if slug already exists
 */
export async function slugExists(slug: string): Promise<boolean> {
  const supabase = getSupabasePublic();
  
  if (!supabase) {
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('realizacje')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    return !error && data !== null;
  } catch {
    return false;
  }
}
