import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import pg from 'pg'

const withoutSslMode = (url) => url && url.replace(/([?&])sslmode=[^&]*&?/, '$1').replace(/[?&]$/, '')

const neonUrl = withoutSslMode(process.env.NEON_DATABASE_URL_UNPOOLED || process.env.NEON_DATABASE_URL)
const supabaseUrl = withoutSslMode(process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL)

if (!neonUrl) throw new Error('NEON_DATABASE_URL is not set')

const mode = process.argv[2] || 'all'
const neon = new pg.Client({ connectionString: neonUrl, ssl: { rejectUnauthorized: false } })
await neon.connect()

function sanitize(sql) {
  return sql
    .replace(/ALTER TABLE\s+\S+\s+ENABLE ROW LEVEL SECURITY;/gi, '')
    .replace(/CREATE POLICY[\s\S]*?;/gi, '')
    .replace(/GRANT[\s\S]*?;/gi, '')
}

async function applySchema() {
  const dir = join(process.cwd(), 'db', 'migrations')
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()
  for (const file of files) {
    console.log('applying', file)
    await neon.query(sanitize(readFileSync(join(dir, file), 'utf8')))
  }
}

const TABLE_ORDER = [
  'realizacje',
  'contest_entries',
  'offer_links',
  'offer_visits',
  'social_media_posts',
  'oauth_tokens',
  'social_media_logs',
  'calculator_surface_types',
  'calculator_colors',
  'calculator_services',
  'calculator_room_types',
  'calculator_concrete_states',
  'calculator_step_config',
  'shop_products',
  'shop_bundles',
  'shop_recommendation_rules',
  'shop_configurations',
]

async function copyData() {
  if (!supabaseUrl) throw new Error('Supabase connection string is not set')
  const src = new pg.Client({ connectionString: supabaseUrl, ssl: { rejectUnauthorized: false } })
  await src.connect()

  const existing = new Set(
    (await src.query(`select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'`)).rows.map(
      (r) => r.table_name,
    ),
  )

  for (const table of TABLE_ORDER) {
    if (!existing.has(table)) {
      console.log('skip (not in supabase):', table)
      continue
    }
    const cols = (
      await neon.query(
        `select column_name, data_type from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position`,
        [table],
      )
    ).rows
    const srcCols = new Set(
      (await src.query(`select column_name from information_schema.columns where table_schema='public' and table_name=$1`, [table])).rows.map(
        (r) => r.column_name,
      ),
    )
    const shared = cols.filter((c) => srcCols.has(c.column_name))
    const rows = (await src.query(`select ${shared.map((c) => `"${c.column_name}"`).join(', ')} from "${table}"`)).rows

    await neon.query(`truncate "${table}" cascade`)
    if (table === 'social_media_logs') await neon.query('truncate social_media_logs')

    for (const row of rows) {
      const values = shared.map((c) => {
        const v = row[c.column_name]
        if (v !== null && v !== undefined && (c.data_type === 'jsonb' || c.data_type === 'json')) return JSON.stringify(v)
        return v
      })
      await neon.query(
        `insert into "${table}" (${shared.map((c) => `"${c.column_name}"`).join(', ')}) values (${shared.map((_, i) => `$${i + 1}`).join(', ')})`,
        values,
      )
    }
    console.log(`copied ${rows.length} rows -> ${table}`)
  }
  await src.end()
}

try {
  if (mode === 'all' || mode === 'schema') await applySchema()
  if (mode === 'all' || mode === 'data') await copyData()
} finally {
  await neon.end()
}
