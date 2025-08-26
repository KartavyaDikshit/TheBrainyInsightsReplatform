var _a;
export { PrismaClient } from './generated';
import { PrismaClient } from './generated';
// Create singleton instance
const globalForPrisma = globalThis;
export const prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
