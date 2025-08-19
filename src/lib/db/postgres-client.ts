import { Client, Pool } from 'pg'
import { PrismaClient } from '@prisma/client'

declare global {
  var __pg_pool__: Pool | undefined
  var __prisma__: PrismaClient | undefined
}

// PostgreSQL connection pool
export const pgPool = globalThis.__pg_pool__ ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pg_pool__ = pgPool
}

// Prisma client with optimizations
export const prisma = globalThis.__prisma__ ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty'
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma__ = prisma
}

// Database health check
export async function checkDatabaseHealth() {
  try {
    const client = await pgPool.connect()
    const result = await client.query('SELECT NOW() as current_time, version() as version')
    client.release()
    
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      version: result.rows[0].version,
      connections: {
        total: pgPool.totalCount,
        idle: pgPool.idleCount,
        waiting: pgPool.waitingCount
      }
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Advanced search function
export async function searchReports(
  query: string,
  locale: string = 'en',
  filters: {
    categoryId?: string
    priceMin?: number
    priceMax?: number
    limit?: number
    offset?: number
  } = {}
) {
  const client = await pgPool.connect()
  
  try {
    const result = await client.query(`
      SELECT * FROM search_reports($1, $2, $3, $4, $5)
    `, [
      query,
      locale,
      filters.categoryId || null,
      filters.limit || 20,
      filters.offset || 0
    ])
    
    return result.rows
  } finally {
    client.release()
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await pgPool.end()
  await prisma.$disconnect()
})