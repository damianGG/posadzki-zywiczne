import { Pool, types, type QueryResultRow } from 'pg'

// Keep the same value shapes the app received from the Supabase REST client.
types.setTypeParser(1184, (value) => new Date(value).toISOString())
types.setTypeParser(1700, (value) => parseFloat(value))
types.setTypeParser(20, (value) => parseInt(value, 10))

const globalForPool = globalThis as unknown as { neonPool?: Pool }

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.NEON_DATABASE_URL)
}

export function getPool(): Pool {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set')
  }
  if (!globalForPool.neonPool) {
    globalForPool.neonPool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      max: 5,
    })
  }
  return globalForPool.neonPool
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await getPool().query<T>(text, params)
  return result.rows
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/

interface ColumnInfo {
  isJson: boolean
}

const columnCache = new Map<string, Map<string, ColumnInfo>>()

async function getColumns(table: string): Promise<Map<string, ColumnInfo>> {
  if (!IDENTIFIER.test(table)) throw new Error(`Invalid table name: ${table}`)
  const cached = columnCache.get(table)
  if (cached) return cached

  const rows = await query<{ column_name: string; data_type: string }>(
    `select column_name, data_type from information_schema.columns where table_schema = 'public' and table_name = $1`,
    [table],
  )
  if (rows.length === 0) throw new Error(`Unknown table: ${table}`)

  const columns = new Map<string, ColumnInfo>()
  for (const row of rows) {
    columns.set(row.column_name, { isJson: row.data_type === 'jsonb' || row.data_type === 'json' })
  }
  columnCache.set(table, columns)
  return columns
}

async function pickColumns(table: string, data: Record<string, unknown>) {
  const columns = await getColumns(table)
  const names: string[] = []
  const values: unknown[] = []
  for (const [key, value] of Object.entries(data)) {
    const info = columns.get(key)
    if (!info || value === undefined) continue
    names.push(key)
    values.push(info.isJson && value !== null ? JSON.stringify(value) : value)
  }
  return { names, values, columns }
}

export async function insertRow<T extends QueryResultRow = QueryResultRow>(table: string, data: Record<string, unknown>): Promise<T> {
  const { names, values } = await pickColumns(table, data)
  const sql =
    names.length === 0
      ? `insert into "${table}" default values returning *`
      : `insert into "${table}" (${names.map((n) => `"${n}"`).join(', ')}) values (${names.map((_, i) => `$${i + 1}`).join(', ')}) returning *`
  const rows = await query<T>(sql, values)
  return rows[0]
}

export async function updateRow<T extends QueryResultRow = QueryResultRow>(
  table: string,
  keyColumn: string,
  keyValue: unknown,
  data: Record<string, unknown>,
): Promise<T | null> {
  if (!IDENTIFIER.test(keyColumn)) throw new Error(`Invalid column name: ${keyColumn}`)
  const payload = { ...data }
  delete payload[keyColumn]
  delete payload.id
  const { names, values, columns } = await pickColumns(table, payload)

  const assignments = names.map((n, i) => `"${n}" = $${i + 1}`)
  if (columns.has('updated_at') && !names.includes('updated_at')) assignments.push('"updated_at" = now()')
  if (assignments.length === 0) {
    return queryOne<T>(`select * from "${table}" where "${keyColumn}" = $1`, [keyValue])
  }

  return queryOne<T>(
    `update "${table}" set ${assignments.join(', ')} where "${keyColumn}" = $${names.length + 1} returning *`,
    [...values, keyValue],
  )
}
