import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    try {
      prisma = new PrismaClient();
    } catch (error) {
      console.error('Failed to initialize Prisma Client:', error);
      throw new Error('Database connection not available.');
    }
  }
  return prisma;
}

// Placeholder for JSON stub data (e.g., from /seed/demo/*.json)
// In a real scenario, you would load these from files or a mock service.
export const getStubData = (entity: string) => {
  switch (entity) {
    case 'categories':
      return [
        { id: 'cat1', slug: 'technology', translations: [{ locale: 'EN', name: 'Technology' }] },
        { id: 'cat2', slug: 'healthcare', translations: [{ locale: 'EN', name: 'Healthcare' }] },
      ];
    case 'reports':
      return [
        { id: 'rep1', slug: 'ai-chipset', categoryId: 'cat1', translations: [{ locale: 'EN', title: 'Global AI Chipset Market' }] },
        { id: 'rep2', slug: 'ev-battery', categoryId: 'cat1', translations: [{ locale: 'EN', title: 'EV Battery Market Trends' }] },
      ];
    case 'leads':
      return [
        { id: 'lead1', name: 'John Doe', email: 'john@example.com', message: 'Inquiry', locale: 'EN', createdAt: new Date() },
      ];
    case 'aiGenerationQueue':
      return [
        { id: 'ai1', prompt: 'Generate report summary', status: 'PENDING_REVIEW', locale: 'EN' },
      ];
    default:
      return [];
  }
};
