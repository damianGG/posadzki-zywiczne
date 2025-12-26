/**
 * Migration Script: Move Realizacje from File System to Supabase
 * 
 * Run with: npx tsx scripts/migrate-realizacje-to-supabase.ts
 * 
 * This script:
 * 1. Reads all JSON files from data/realizacje/
 * 2. Inserts them into Supabase database
 * 3. Keeps original files as backup
 */

import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const REALIZACJE_DIR = path.join(process.cwd(), 'data', 'realizacje');

interface RealizacjaFile {
  title: string;
  description: string;
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
  images?: {
    main?: string;
    gallery?: Array<{ url: string; alt?: string }>;
  };
  faq?: Array<{ question: string; answer: string }>;
  cloudinary_folder?: string;
}

async function main() {
  console.log('🚀 Starting Realizacje migration to Supabase...\n');

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
    console.error('   Get these from your Supabase project settings');
    process.exit(1);
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('✅ Supabase client initialized');
  console.log(`📁 Reading from: ${REALIZACJE_DIR}\n`);

  try {
    // Read all JSON files
    const files = await readdir(REALIZACJE_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log('ℹ️  No realizacje files found in data/realizacje/');
      return;
    }

    console.log(`📊 Found ${jsonFiles.length} realizacje to migrate\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Process each file
    for (const file of jsonFiles) {
      const slug = path.basename(file, '.json');
      const filePath = path.join(REALIZACJE_DIR, file);

      try {
        // Read file content
        const content = await readFile(filePath, 'utf-8');
        const data: RealizacjaFile = JSON.parse(content);

        // Check if already exists
        const { data: existing } = await supabase
          .from('realizacje')
          .select('slug')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) {
          console.log(`⏭️  Skipping ${slug} (already exists)`);
          skipCount++;
          continue;
        }

        // Insert into Supabase
        const { error } = await supabase
          .from('realizacje')
          .insert({
            slug,
            title: data.title,
            description: data.description,
            short_description: data.description?.substring(0, 200),
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
            images: data.images || { gallery: [] },
            faq: data.faq || [],
            cloudinary_folder: data.cloudinary_folder,
          });

        if (error) {
          console.error(`❌ Error migrating ${slug}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Migrated ${slug}`);
          successCount++;
        }

      } catch (err) {
        console.error(`❌ Error processing ${file}:`, err);
        errorCount++;
      }
    }

    // Summary
    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${successCount}`);
    console.log(`   ⏭️  Skipped (already exist): ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📊 Total processed: ${jsonFiles.length}`);

    if (successCount > 0) {
      console.log('\n✨ Migration completed successfully!');
      console.log('💡 Original JSON files remain as backup in data/realizacje/');
    }

  } catch (err) {
    console.error('\n❌ Fatal error during migration:', err);
    process.exit(1);
  }
}

// Run migration
main().catch(console.error);
