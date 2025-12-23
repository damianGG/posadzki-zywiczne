import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for type safety
export interface ContestEntry {
  id?: number
  email: string
  name: string
  code: string
  timestamp: string
  email_sent: boolean
  email_opened: boolean
  created_at?: string
}
