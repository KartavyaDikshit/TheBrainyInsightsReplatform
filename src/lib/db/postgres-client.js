var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
import { Pool } from 'pg';
import { PrismaClient } from '@prisma/client';
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
export function checkDatabaseHealth() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield pgPool.connect();
            const result = yield client.query('SELECT NOW() as current_time, version() as version');
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
    });
}
// Advanced search function
export function searchReports(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, locale = 'en', filters = {}) {
        const client = yield pgPool.connect();
        try {
            const result = yield client.query(`
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
    });
}
// Graceful shutdown
process.on('beforeExit', () => __awaiter(void 0, void 0, void 0, function* () {
    yield pgPool.end();
    yield prisma.$disconnect();
}));
