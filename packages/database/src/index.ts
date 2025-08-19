export { PrismaClient } from './generated'
export type * from './generated'

// Re-export commonly used types
export type {
  Category,
  CategoryTranslation,
  Report,
  ReportTranslation,
  User,
  Admin,
  Order,
  OrderItem,
  Enquiry,
  ReportReview,
  Blog,
  BlogTranslation,
  ContentStatus,
  UserStatus,
  AdminRole,
  OrderStatus,
  LicenseType,
  EnquiryStatus,
  TranslationStatus
} from './generated'

import { PrismaClient } from './generated'

// Create singleton instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

console.log('DEBUG: process.env.DATABASE_URL =', process.env.DATABASE_URL);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
