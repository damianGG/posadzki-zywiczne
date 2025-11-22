#!/usr/bin/env node

/**
 * CLI Script for scanning local realizacje folders
 * 
 * Usage:
 *   node scripts/scan-realizacje.mjs
 * 
 * This script scans public/realizacje/ for project folders and
 * creates/updates corresponding JSON files in data/realizacje/
 */

import { scanAllRealizacje, findOrphanedRealizacje } from '../lib/local-realizacje-scanner.js';

async function main() {
  console.log('\n' + '='.repeat(50));
  console.log('🔍 Skaner lokalnych realizacji');
  console.log('='.repeat(50));
  console.log('\nSkanowanie folderów w public/realizacje/...\n');

  try {
    // Skanuj wszystkie foldery
    const results = await scanAllRealizacje();

    // Znajdź osierocone realizacje
    console.log('\n🔎 Sprawdzanie osieroconych realizacji...');
    const orphaned = findOrphanedRealizacje();
    
    if (orphaned.length > 0) {
      console.log('\n⚠️  Znaleziono realizacje bez odpowiadających folderów:');
      orphaned.forEach(slug => {
        console.log(`   - ${slug}`);
      });
      console.log('\nRozważ usunięcie tych plików lub utworzenie folderów dla nich.\n');
    } else {
      console.log('✓ Brak osieroconych realizacji\n');
    }

    // Wyświetl szczegóły nowych i zaktualizowanych
    const newOnes = results.filter(r => r.status === 'new');
    const updated = results.filter(r => r.status === 'updated');

    if (newOnes.length > 0) {
      console.log('\n✨ Nowe realizacje:');
      newOnes.forEach(r => {
        console.log(`   - ${r.slug} (${r.folderName})`);
        if (r.realizacja) {
          console.log(`     ${r.realizacja.title}`);
        }
      });
    }

    if (updated.length > 0) {
      console.log('\n🔄 Zaktualizowane realizacje:');
      updated.forEach(r => {
        console.log(`   - ${r.slug} (${r.folderName})`);
        if (r.realizacja) {
          console.log(`     ${r.realizacja.title}`);
        }
      });
    }

    // Błędy
    const errors = results.filter(r => r.status === 'error');
    if (errors.length > 0) {
      console.log('\n❌ Błędy:');
      errors.forEach(r => {
        console.log(`   - ${r.folderName}: ${r.message}`);
      });
    }

    console.log('\n✅ Skanowanie zakończone!\n');

  } catch (error) {
    console.error('\n❌ Wystąpił błąd podczas skanowania:', error);
    process.exit(1);
  }
}

main();
