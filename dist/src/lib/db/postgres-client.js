var _a, _b;
import { Pool } from 'pg';
import { PrismaClient } from '@tbi/database';
// PostgreSQL connection pool
export const pgPool = (_a = globalThis.__pg_pool__) !== null && _a !== void 0 ? _a : new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
if (process.env.NODE_ENV !== 'production') {
    globalThis.__pg_pool__ = pgPool;
}
// Prisma client with optimizations
export const prisma = (_b = globalThis.__prisma__) !== null && _b !== void 0 ? _b : new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty'
});
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma__ = prisma;
}
// Database health check
export async function checkDatabaseHealth() {
    try {
        const client = await pgPool.connect();
        const result = await client.query('SELECT NOW() as current_time, version() as version');
        client.release();
        return {
            status: 'healthy',
            timestamp: result.rows[0].current_time,
            version: result.rows[0].version,
            connections: {
                total: pgPool.totalCount,
                idle: pgPool.idleCount,
                waiting: pgPool.waitingCount
            }
        };
    }
    catch (error) {
        return {
            status: 'unhealthy',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
// Advanced search function
export async function searchReports(query, locale = 'en', filters = {}) {
    const client = await pgPool.connect();
    try {
        const result = await client.query(`
      SELECT * FROM search_reports($1, $2, $3, $4, $5)
    `, [
            query,
            locale,
            filters.categoryId || null,
            filters.limit || 20,
            filters.offset || 0
        ]);
        return result.rows;
    }
    finally {
        client.release();
    }
}
// Graceful shutdown
process.on('beforeExit', async () => {
    await pgPool.end();
    await prisma.$disconnect();
});
