# SPRINT 1.4: BUILD STABILIZATION \& ERROR RESOLUTION

**Duration:** 5-7 days | **Priority:** CRITICAL | **Prerequisite for all future sprints**

## Current State Analysis

Based on your codebase at https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform, you have:

- ✅ Next.js 15 with App Router setup
- ✅ PostgreSQL schema implemented
- ✅ Monorepo structure with pnpm workspaces
- ❌ **Build errors after PostgreSQL migration**
- ❌ **Type mismatches between legacy and new schema**
- ❌ **Import path issues in monorepo**


## SPRINT OBJECTIVE

Fix all build errors, type issues, and ensure stable development environment before proceeding with new features.

***

## DAY 1: ENVIRONMENT VALIDATION \& DEPENDENCY RESOLUTION

### Step 1.1: Clean Environment Setup

```bash
# Navigate to project root
cd TheBrainyInsightsReplatform

# Clean all caches and dependencies
rm -rf node_modules packages/*/node_modules .next
rm -rf packages/database/src/generated
rm pnpm-lock.yaml

# Clean pnpm cache
pnpm cache clean

# Verify local services are running
psql -U tbi_user -d tbi_db -c "SELECT 1;" # Should connect successfully
redis-cli ping # Should return PONG
curl http://localhost:9200 # Elasticsearch health check
```


### Step 1.2: Fix Root Package.json

**File: `package.json`**

```json
{
  "name": "thebrainyinsights-replatform",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:generate": "pnpm --filter @tbi/database db:generate",
    "db:push": "pnpm --filter @tbi/database db:push",
    "db:migrate": "pnpm --filter @tbi/database db:migrate",
    "db:studio": "pnpm --filter @tbi/database db:studio",
    "db:seed": "pnpm --filter @tbi/database db:seed",
    "clean": "rm -rf .next node_modules packages/*/node_modules packages/*/dist",
    "postinstall": "pnpm db:generate"
  },
  "dependencies": {
    "@tbi/database": "workspace:*",
    "next": "15.0.3",
    "next-auth": "^4.24.11",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.12",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "15.0.3",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```


### Step 1.3: Fix Database Package Configuration

**File: `packages/database/package.json`**

```json
{
  "name": "@tbi/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "prisma generate --schema=./prisma/schema.prisma",
    "db:push": "prisma db push --schema=./prisma/schema.prisma --accept-data-loss",
    "db:migrate": "prisma migrate dev --schema=./prisma/schema.prisma",
    "db:studio": "prisma studio --schema=./prisma/schema.prisma",
    "db:seed": "tsx ./src/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "prisma": "^5.7.1"
  },
  "devDependencies": {
    "tsx": "^4.6.0",
    "@types/node": "^20.10.0"
  }
}
```


### Step 1.4: Install Dependencies

```bash
# Install all dependencies
pnpm install

# Verify installation
pnpm list --depth=0
```


***

## DAY 2: DATABASE SCHEMA FIXES \& PRISMA CLIENT GENERATION

### Step 2.1: Fix Prisma Schema for PostgreSQL

**File: `packages/database/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Core Models with proper PostgreSQL types
model Category {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  shortcode   String   @unique @db.VarChar(20)
  slug        String   @unique @db.VarChar(100)
  title       String   @db.VarChar(200)
  description String?  @db.Text
  icon        String?  @db.VarChar(100)
  featured    Boolean  @default(false)
  sortOrder   Int      @default(0) @map("sort_order")
  
  // SEO fields
  metaTitle       String? @map("meta_title") @db.VarChar(200)
  metaDescription String? @map("meta_description") @db.VarChar(300)
  
  // Status and analytics
  status    ContentStatus @default(PUBLISHED)
  viewCount BigInt        @default(0) @map("view_count")
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  translations CategoryTranslation[]
  reports      Report[]
  blogs        Blog[]

  @@index([status, featured, sortOrder])
  @@index([shortcode])
  @@map("categories")
}

model CategoryTranslation {
  id         String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId String @map("category_id") @db.Uuid
  locale     String @db.VarChar(5)
  
  title       String  @db.VarChar(200)
  description String? @db.Text
  slug        String  @db.VarChar(100)
  
  metaTitle       String? @map("meta_title") @db.VarChar(200)
  metaDescription String? @map("meta_description") @db.VarChar(300)
  
  status TranslationStatus @default(PUBLISHED)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([categoryId, locale])
  @@index([locale, status])
  @@map("category_translations")
}

model Report {
  id         String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId String? @map("category_id") @db.Uuid
  
  // Identifiers
  sku  String? @unique @db.VarChar(50)
  slug String  @unique @db.VarChar(150)
  
  // Basic Info
  title       String @db.VarChar(500)
  description String @db.Text
  summary     String? @db.Text
  
  // Report Details
  pages           Int       @default(0)
  publishedDate   DateTime  @map("published_date") @db.Date
  baseYear        Int?      @map("base_year")
  forecastPeriod  String?   @map("forecast_period") @db.VarChar(50)
  
  // Content
  tableOfContents String?   @map("table_of_contents") @db.Text
  methodology     String?   @db.Text
  keyFindings     String[]  @map("key_findings")
  
  // Market Data (JSON)
  marketData Json? @map("market_data") @db.JsonB
  keyPlayers String[] @map("key_players")
  regions    String[]
  
  // Categorization
  industryTags String[] @map("industry_tags")
  reportType   String?  @map("report_type") @db.VarChar(50)
  
  // SEO
  keywords        String[] 
  metaTitle       String @map("meta_title") @db.VarChar(500)
  metaDescription String @map("meta_description") @db.VarChar(500)
  
  // Pricing (USD)
  singlePrice    Decimal? @map("single_price") @db.Decimal(10,2)
  multiPrice     Decimal? @map("multi_price") @db.Decimal(10,2)
  corporatePrice Decimal? @map("corporate_price") @db.Decimal(10,2)
  
  // Status & Features
  status   ContentStatus @default(DRAFT)
  featured Boolean       @default(false)
  priority Int           @default(0)
  
  // Analytics
  viewCount     BigInt @default(0) @map("view_count")
  downloadCount BigInt @default(0) @map("download_count")
  
  // Ratings
  avgRating   Decimal? @map("avg_rating") @db.Decimal(3,2)
  reviewCount Int      @default(0) @map("review_count")
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  category     Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  translations ReportTranslation[]
  reviews      ReportReview[]
  enquiries    Enquiry[]
  orderItems   OrderItem[]

  @@index([categoryId, status, featured])
  @@index([publishedDate, status])
  @@index([avgRating, reviewCount])
  @@index([industryTags], type: Gin)
  @@index([keywords], type: Gin)
  @@map("reports")
}

model ReportTranslation {
  id       String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId String @map("report_id") @db.Uuid
  locale   String @db.VarChar(5)
  
  title       String @db.VarChar(500)
  description String @db.Text
  summary     String? @db.Text
  slug        String @db.VarChar(150)
  
  tableOfContents String?   @map("table_of_contents") @db.Text
  methodology     String?   @db.Text
  keyFindings     String[]  @map("key_findings")
  
  metaTitle       String @map("meta_title") @db.VarChar(500)
  metaDescription String @map("meta_description") @db.VarChar(500)
  keywords        String[]
  
  status TranslationStatus @default(DRAFT)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@unique([reportId, locale])
  @@index([locale, status])
  @@map("report_translations")
}

// User Management Models
model User {
  id        String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String @unique @db.VarChar(255)
  firstName String? @map("first_name") @db.VarChar(100)
  lastName  String? @map("last_name") @db.VarChar(100)
  phone     String? @db.VarChar(20)
  company   String? @db.VarChar(200)
  country   String? @db.VarChar(100)
  
  // Auth
  password      String?  @db.VarChar(255)
  emailVerified Boolean  @default(false) @map("email_verified")
  
  // Preferences
  preferredLanguage String? @map("preferred_language") @db.VarChar(5)
  newsletter        Boolean @default(true)
  
  status      UserStatus @default(ACTIVE)
  lastLoginAt DateTime?  @map("last_login_at")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  orders    Order[]
  enquiries Enquiry[]
  reviews   ReportReview[]

  @@index([email, status])
  @@map("users")
}

model Admin {
  id        String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String @unique @db.VarChar(255)
  username  String @unique @db.VarChar(100)
  firstName String? @map("first_name") @db.VarChar(100)
  lastName  String? @map("last_name") @db.VarChar(100)
  
  password String @db.VarChar(255)
  role     AdminRole
  
  status      ContentStatus @default(ACTIVE)
  lastLoginAt DateTime?     @map("last_login_at")
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([email, status])
  @@map("admins")
}

// E-commerce Models
model Order {
  id          String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String? @map("user_id") @db.Uuid
  orderNumber String @unique @map("order_number") @db.VarChar(50)
  
  // Customer Info
  customerEmail String @map("customer_email") @db.VarChar(255)
  customerName  String @map("customer_name") @db.VarChar(200)
  customerPhone String? @map("customer_phone") @db.VarChar(20)
  
  // Amounts
  subtotal Decimal @db.Decimal(12,2)
  discount Decimal @default(0) @db.Decimal(12,2)
  total    Decimal @db.Decimal(12,2)
  currency String  @default("USD") @db.VarChar(3)
  
  // Payment
  paymentMethod   String? @map("payment_method") @db.VarChar(50)
  paymentStatus   String? @map("payment_status") @db.VarChar(50)
  transactionId   String? @map("transaction_id") @db.VarChar(100)
  
  status OrderStatus @default(PENDING)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  user  User? @relation(fields: [userId], references: [id])
  items OrderItem[]

  @@index([customerEmail, status])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id       String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  orderId  String @map("order_id") @db.Uuid
  reportId String @map("report_id") @db.Uuid
  
  licenseType LicenseType @map("license_type")
  price       Decimal     @db.Decimal(10,2)
  quantity    Int         @default(1)

  order  Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  report Report @relation(fields: [reportId], references: [id])

  @@index([orderId])
  @@index([reportId])
  @@map("order_items")
}

// Customer Engagement Models
model Enquiry {
  id       String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId String? @map("report_id") @db.Uuid
  
  firstName String  @map("first_name") @db.VarChar(100)
  lastName  String? @map("last_name") @db.VarChar(100)
  email     String  @db.VarChar(255)
  phone     String? @db.VarChar(20)
  company   String? @db.VarChar(200)
  country   String? @db.VarChar(100)
  
  message     String? @db.Text
  enquiryType String? @map("enquiry_type") @db.VarChar(50)
  
  status EnquiryStatus @default(NEW)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  report Report? @relation(fields: [reportId], references: [id])

  @@index([reportId, status])
  @@index([email])
  @@map("enquiries")
}

model ReportReview {
  id       String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId String  @map("report_id") @db.Uuid
  userId   String? @map("user_id") @db.Uuid
  
  rating  Int     @db.SmallInt
  title   String? @db.VarChar(200)
  content String? @db.Text
  
  // Anonymous reviewer info
  reviewerName    String? @map("reviewer_name") @db.VarChar(100)
  reviewerCompany String? @map("reviewer_company") @db.VarChar(200)
  
  status   ContentStatus @default(PUBLISHED)
  verified Boolean       @default(false)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)
  user   User?  @relation(fields: [userId], references: [id])

  @@index([reportId, status])
  @@index([rating, verified])
  @@map("report_reviews")
}

// Content Models
model Blog {
  id         String  @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId String? @map("category_id") @db.Uuid
  
  title   String  @db.VarChar(300)
  slug    String  @unique @db.VarChar(150)
  excerpt String? @db.VarChar(500)
  content String  @db.Text
  
  tags String[]
  
  metaTitle       String? @map("meta_title") @db.VarChar(300)
  metaDescription String? @map("meta_description") @db.VarChar(500)
  
  status    ContentStatus @default(DRAFT)
  featured  Boolean       @default(false)
  viewCount BigInt        @default(0) @map("view_count")
  
  publishedAt DateTime? @map("published_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  category     Category? @relation(fields: [categoryId], references: [id])
  translations BlogTranslation[]

  @@index([categoryId, status])
  @@index([publishedAt])
  @@index([tags], type: Gin)
  @@map("blogs")
}

model BlogTranslation {
  id     String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  blogId String @map("blog_id") @db.Uuid
  locale String @db.VarChar(5)
  
  title   String  @db.VarChar(300)
  slug    String  @db.VarChar(150)
  excerpt String? @db.VarChar(500)
  content String  @db.Text
  
  tags String[]
  
  metaTitle       String? @map("meta_title") @db.VarChar(300)
  metaDescription String? @map("meta_description") @db.VarChar(500)
  
  status TranslationStatus @default(DRAFT)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  blog Blog @relation(fields: [blogId], references: [id], onDelete: Cascade)

  @@unique([blogId, locale])
  @@index([locale, status])
  @@map("blog_translations")
}

// Enums
enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED

  @@map("content_status")
}

enum UserStatus {
  PENDING
  ACTIVE
  INACTIVE
  SUSPENDED

  @@map("user_status")
}

enum AdminRole {
  SUPERADMIN
  MANAGER
  EDITOR

  @@map("admin_role")
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED

  @@map("order_status")
}

enum LicenseType {
  SINGLE
  MULTIPLE
  CORPORATE

  @@map("license_type")
}

enum EnquiryStatus {
  NEW
  CONTACTED
  QUALIFIED
  CONVERTED
  CLOSED

  @@map("enquiry_status")
}

enum TranslationStatus {
  DRAFT
  REVIEW
  APPROVED
  PUBLISHED

  @@map("translation_status")
}
```


### Step 2.2: Generate Prisma Client

```bash
cd packages/database
pnpm db:generate
cd ../..
```


### Step 2.3: Create Database Index File

**File: `packages/database/src/index.ts`**

```typescript
export { PrismaClient } from './generated';
export type * from './generated';

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
} from './generated';

import { PrismaClient } from './generated';

// Create singleton instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```


***

## DAY 3: TYPESCRIPT CONFIGURATION \& IMPORT FIXES

### Step 3.1: Fix Root TypeScript Configuration

**File: `tsconfig.json`**

```json
{
  "compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "es6"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@/components/*": [
        "./src/components/*"
      ],
      "@/lib/*": [
        "./src/lib/*"
      ],
      "@/types/*": [
        "./src/types/*"
      ],
      "@tbi/database": [
        "./packages/database/src"
      ],
      "@tbi/database/*": [
        "./packages/database/src/*"
      ],
      "@tbi/ui": [
        "./packages/ui/src"
      ],
      "@tbi/ui/*": [
        "./packages/ui/src/*"
      ]
    },
    "target": "ES2017"
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "packages/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "dist"
  ]
}
```


### Step 3.2: Fix Next.js Configuration

**File: `next.config.js`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tbi/database', '@tbi/ui'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  i18n: {
    locales: ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};

export default nextConfig;
```


### Step 3.3: Create Type Definitions

**File: `src/types/database.ts`**

```typescript
import type { 
  Category as PrismaCategory,
  CategoryTranslation as PrismaCategoryTranslation,
  Report as PrismaReport,
  ReportTranslation as PrismaReportTranslation,
  ContentStatus,
  TranslationStatus
} from '@tbi/database';

// Enhanced types with computed properties
export interface CategoryWithTranslations extends PrismaCategory {
  translations?: PrismaCategoryTranslation[];
  _count?: {
    reports: number;
  };
}

export interface ReportWithTranslations extends PrismaReport {
  translations?: PrismaReportTranslation[];
  category?: PrismaCategory;
  _count?: {
    reviews: number;
    enquiries: number;
  };
}

// Legacy to new status mapping
export type LegacyStatus = 'Active' | 'Inactive';
export type LegacyFeatured = 'Yes' | 'No';

export function mapLegacyStatus(legacy: LegacyStatus): ContentStatus {
  return legacy === 'Active' ? 'PUBLISHED' : 'DRAFT';
}

export function mapLegacyFeatured(legacy: LegacyFeatured): boolean {
  return legacy === 'Yes';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```


***

## DAY 4: APPLICATION COMPONENT FIXES

### Step 4.1: Fix Database Service Layer

**File: `src/lib/db/categories.ts`**

```typescript
import { prisma } from '@tbi/database';
import type { CategoryWithTranslations } from '@/types/database';

export class CategoryService {
  static async getAll(
    locale: string = 'en',
    options: {
      featured?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<CategoryWithTranslations[]> {
    try {
      const categories = await prisma.category.findMany({
        where: {
          status: 'PUBLISHED',
          ...(options.featured !== undefined && { featured: options.featured }),
        },
        include: {
          translations: locale !== 'en' ? {
            where: { locale, status: 'PUBLISHED' }
          } : false,
          _count: {
            select: { reports: true }
          }
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        ...(options.limit && { take: options.limit }),
        ...(options.offset && { skip: options.offset }),
      });

      return categories.map(category => {
        if (locale !== 'en' && category.translations && category.translations.length > 0) {
          const translation = category.translations[^0];
          return {
            ...category,
            title: translation.title,
            description: translation.description,
            slug: translation.slug,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
          };
        }
        return category;
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  static async getBySlug(
    slug: string, 
    locale: string = 'en'
  ): Promise<CategoryWithTranslations | null> {
    try {
      let category;
      
      if (locale === 'en') {
        category = await prisma.category.findUnique({
          where: { slug },
          include: {
            _count: { select: { reports: true } }
          }
        });
      } else {
        // First try to find by translation slug
        const translation = await prisma.categoryTranslation.findFirst({
          where: { slug, locale, status: 'PUBLISHED' },
          include: {
            category: {
              include: {
                _count: { select: { reports: true } }
              }
            }
          }
        });

        if (translation) {
          category = {
            ...translation.category,
            title: translation.title,
            description: translation.description,
            slug: translation.slug,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
          };
        } else {
          // Fallback to English slug
          category = await prisma.category.findUnique({
            where: { slug },
            include: {
              translations: { where: { locale, status: 'PUBLISHED' } },
              _count: { select: { reports: true } }
            }
          });

          if (category && category.translations && category.translations.length > 0) {
            const trans = category.translations[^0];
            category = {
              ...category,
              title: trans.title,
              description: trans.description,
              slug: trans.slug,
              metaTitle: trans.metaTitle,
              metaDescription: trans.metaDescription,
            };
          }
        }
      }

      return category;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }
}
```


### Step 4.2: Fix Reports Service

**File: `src/lib/db/reports.ts`**

```typescript
import { prisma } from '@tbi/database';
import type { ReportWithTranslations } from '@/types/database';

export class ReportService {
  static async getAll(
    locale: string = 'en',
    options: {
      categoryId?: string;
      featured?: boolean;
      limit?: number;
      offset?: number;
      sortBy?: 'createdAt' | 'publishedDate' | 'title';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<{
    reports: ReportWithTranslations[];
    total: number;
  }> {
    try {
      const whereClause = {
        status: 'PUBLISHED' as const,
        ...(options.categoryId && { categoryId: options.categoryId }),
        ...(options.featured !== undefined && { featured: options.featured }),
      };

      const [reports, total] = await Promise.all([
        prisma.report.findMany({
          where: whereClause,
          include: {
            category: true,
            translations: locale !== 'en' ? {
              where: { locale, status: 'PUBLISHED' }
            } : false,
            _count: {
              select: { 
                reviews: true,
                enquiries: true 
              }
            }
          },
          orderBy: [
            { [options.sortBy || 'publishedDate']: options.sortOrder || 'desc' }
          ],
          ...(options.limit && { take: options.limit }),
          ...(options.offset && { skip: options.offset }),
        }),
        prisma.report.count({ where: whereClause })
      ]);

      const processedReports = reports.map(report => {
        if (locale !== 'en' && report.translations && report.translations.length > 0) {
          const translation = report.translations[^0];
          return {
            ...report,
            title: translation.title,
            description: translation.description,
            summary: translation.summary,
            slug: translation.slug,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
            keywords: translation.keywords,
          };
        }
        return report;
      });

      return {
        reports: processedReports,
        total
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  static async getBySlug(
    slug: string, 
    locale: string = 'en'
  ): Promise<ReportWithTranslations | null> {
    try {
      let report;
      
      if (locale === 'en') {
        report = await prisma.report.findUnique({
          where: { slug },
          include: {
            category: true,
            _count: {
              select: { 
                reviews: true,
                enquiries: true 
              }
            }
          }
        });
      } else {
        // First try to find by translation slug
        const translation = await prisma.reportTranslation.findFirst({
          where: { slug, locale, status: 'PUBLISHED' },
          include: {
            report: {
              include: {
                category: true,
                _count: {
                  select: { 
                    reviews: true,
                    enquiries: true 
                  }
                }
              }
            }
          }
        });

        if (translation) {
          report = {
            ...translation.report,
            title: translation.title,
            description: translation.description,
            summary: translation.summary,
            slug: translation.slug,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription,
            keywords: translation.keywords,
          };
        }
      }

      return report;
    } catch (error) {
      console.error('Error fetching report by slug:', error);
      return null;
    }
  }
}
```


### Step 4.3: Fix Homepage Component

**File: `src/app/[locale]/page.tsx`**

```typescript
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CategoryService } from '@/lib/db/categories';
import { ReportService } from '@/lib/db/reports';

const SUPPORTED_LOCALES = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko'];

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    title: 'TheBrainyInsights - Market Research & Business Intelligence Platform',
    description: 'Leading global platform for comprehensive market research reports, industry analysis, and business intelligence across 200+ industries.',
    keywords: 'market research, business intelligence, industry reports, market analysis',
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  
  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound();
  }

  try {
    // Fetch data from database
    const [featuredCategories, featuredReportsData] = await Promise.all([
      CategoryService.getAll(locale, { featured: true, limit: 6 }),
      ReportService.getAll(locale, { featured: true, limit: 8 })
    ]);

    return (
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Market Research & Business Intelligence
            </h1>
            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              Leading global platform for comprehensive market research reports, 
              industry analysis, and business intelligence across 200+ industries.
            </p>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Industry Categories
              </h2>
              <p className="text-xl text-gray-600">
                Explore comprehensive research across major industries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {category._count?.reports} reports
                    </span>
                    <a 
                      href={`/${locale}/categories/${category.slug}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Reports →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Reports */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Latest Research Reports
              </h2>
              <p className="text-xl text-gray-600">
                Recently published market research with comprehensive analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {featuredReportsData.reports.slice(0, 8).map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {report.category?.title}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      <a 
                        href={`/${locale}/reports/${report.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {report.title}
                      </a>
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{report.pages} pages</span>
                      <span>{new Date(report.publishedDate).getFullYear()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Starting from</div>
                        <div className="text-lg font-bold text-gray-900">
                          {report.singlePrice ? `$${report.singlePrice.toLocaleString()}` : 'Contact us'}
                        </div>
                      </div>
                      <a
                        href={`/${locale}/reports/${report.slug}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        View Report
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Homepage error:', error);
    throw new Error('Failed to load homepage data');
  }
}
```


***

## DAY 5: API ROUTES \& FINAL TESTING

### Step 5.1: Fix API Routes

**File: `src/app/api/categories/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/db/categories';
import type { ApiResponse } from '@/types/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const categories = await CategoryService.getAll(locale, {
      featured,
      limit,
      offset
    });

    const response: ApiResponse<typeof categories> = {
      success: true,
      data: categories,
      message: `Found ${categories.length} categories`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Categories API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
```

**File: `src/app/api/categories/[slug]/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/db/categories';
import type { ApiResponse } from '@/types/database';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const category = await CategoryService.getBySlug(slug, locale);

    if (!category) {
      const notFoundResponse: ApiResponse<null> = {
        success: false,
        error: 'Category not found',
        message: `No category found with slug: ${slug}`
      };
      return NextResponse.json(notFoundResponse, { status: 404 });
    }

    const response: ApiResponse<typeof category> = {
      success: true,
      data: category
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Category API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch category',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
```


### Step 5.2: Create Environment Configuration

**File: `.env.local`**

```env
# Database
DATABASE_URL="postgresql://tbi_user:password@localhost:5432/tbi_db"

# Application
NEXTAUTH_SECRET="your-development-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Services (Optional)
REDIS_URL="redis://localhost:6379"
ELASTICSEARCH_URL="http://localhost:9200"

# Development
NODE_ENV="development"
```


### Step 5.3: Create Validation Script

**File: `scripts/validate-build.ts`**

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function validateBuild() {
  console.log('🔍 Starting build validation...\n');

  try {
    // 1. Type checking
    console.log('1️⃣ Running TypeScript type check...');
    await execAsync('pnpm typecheck');
    console.log('✅ TypeScript validation passed\n');

    // 2. Linting
    console.log('2️⃣ Running ESLint...');
    await execAsync('pnpm lint');
    console.log('✅ Linting passed\n');

    // 3. Database generation
    console.log('3️⃣ Generating Prisma client...');
    await execAsync('pnpm db:generate');
    console.log('✅ Prisma client generated\n');

    // 4. Build
    console.log('4️⃣ Building application...');
    await execAsync('pnpm build');
    console.log('✅ Build completed successfully\n');

    console.log('🎉 All validations passed! Sprint 1.4 is complete.');
    
  } catch (error) {
    console.error('❌ Validation failed:');
    console.error(error);
    process.exit(1);
  }
}

validateBuild();
```


### Step 5.4: Create Database Seed Data

**File: `packages/database/src/seed.ts`**

```typescript
import { PrismaClient } from './generated';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create sample categories
    const techCategory = await prisma.category.create({
      data: {
        shortcode: 'tech',
        slug: 'technology',
        title: 'Technology',
        description: 'Technology and IT market research reports',
        icon: '💻',
        featured: true,
        sortOrder: 1,
        metaTitle: 'Technology Market Research Reports',
        metaDescription: 'Comprehensive technology market analysis and research reports',
        status: 'PUBLISHED'
      }
    });

    const healthCategory = await prisma.category.create({
      data: {
        shortcode: 'health',
        slug: 'healthcare',
        title: 'Healthcare',
        description: 'Healthcare and pharmaceutical market research',
        icon: '🏥',
        featured: true,
        sortOrder: 2,
        metaTitle: 'Healthcare Market Research Reports',
        metaDescription: 'In-depth healthcare industry analysis and market reports',
        status: 'PUBLISHED'
      }
    });

    // Create sample reports
    await prisma.report.create({
      data: {
        categoryId: techCategory.id,
        sku: 'AI-2025-001',
        slug: 'artificial-intelligence-market-analysis-2025',
        title: 'Artificial Intelligence Market Analysis 2025',
        description: 'Comprehensive analysis of the global AI market including machine learning, deep learning, and neural networks.',
        summary: 'The AI market is expected to reach $1.8 trillion by 2030, driven by increased adoption across industries.',
        pages: 250,
        publishedDate: new Date(),
        baseYear: 2024,
        forecastPeriod: '2025-2030',
        keyFindings: [
          'AI market growing at 35% CAGR',
          'Healthcare AI segment fastest growing',
          'North America leads adoption'
        ],
        keyPlayers: ['Google', 'Microsoft', 'IBM', 'Amazon', 'NVIDIA'],
        regions: ['North America', 'Europe', 'Asia Pacific'],
        industryTags: ['AI', 'Machine Learning', 'Deep Learning'],
        keywords: ['artificial intelligence', 'machine learning', 'AI market'],
        metaTitle: 'Artificial Intelligence Market Analysis 2025',
        metaDescription: 'Comprehensive AI market research report with detailed analysis of trends, growth, and opportunities.',
        singlePrice: 4500,
        multiPrice: 6750,
        corporatePrice: 9000,
        featured: true,
        priority: 100,
        status: 'PUBLISHED'
      }
    });

    await prisma.report.create({
      data: {
        categoryId: healthCategory.id,
        sku: 'TELE-2025-001',
        slug: 'global-telemedicine-market-report-2025',
        title: 'Global Telemedicine Market Report 2025',
        description: 'In-depth analysis of the telemedicine market covering virtual consultations, remote monitoring, and digital health platforms.',
        summary: 'Telemedicine market accelerated by COVID-19, expected to maintain strong growth through 2030.',
        pages: 180,
        publishedDate: new Date(),
        baseYear: 2024,
        forecastPeriod: '2025-2030',
        keyFindings: [
          'Market size reached $83 billion in 2024',
          'Remote monitoring fastest growing segment',
          'Regulatory support driving adoption'
        ],
        keyPlayers: ['Teladoc', 'Amwell', 'MDLive', 'Doxy.me'],
        regions: ['Global'],
        industryTags: ['Telemedicine', 'Digital Health', 'Healthcare IT'],
        keywords: ['telemedicine', 'telehealth', 'digital health'],
        metaTitle: 'Global Telemedicine Market Report 2025',
        metaDescription: 'Comprehensive telemedicine market analysis with growth projections and competitive landscape.',
        singlePrice: 3800,
        multiPrice: 5700,
        corporatePrice: 7600,
        featured: true,
        priority: 95,
        status: 'PUBLISHED'
      }
    });

    // Create admin user
    await prisma.admin.create({
      data: {
        email: 'admin@thebrainyinsights.com',
        username: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.',
        role: 'SUPERADMIN',
        status: 'PUBLISHED'
      }
    });

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
```


***

## FINAL TESTING \& VALIDATION

### Step 6.1: Run Complete Validation

```bash
# Create and run validation script
npx tsx scripts/validate-build.ts
```


### Step 6.2: Test Database Operations

```bash
# Push schema to database
pnpm db:push

# Seed database
pnpm db:seed

# Start development server
pnpm dev
```


### Step 6.3: Manual Testing Checklist

1. **✅ Visit http://localhost:3000** - Homepage loads without errors
2. **✅ Visit http://localhost:3000/en** - English locale works
3. **✅ Visit http://localhost:3000/en/categories** - Categories page works
4. **✅ Visit http://localhost:3000/api/categories** - API endpoint works
5. **✅ Check browser console** - No JavaScript errors
6. **✅ Check terminal** - No server errors

***

## SPRINT 1.4 SUCCESS CRITERIA

### ✅ Build Requirements Met

- [ ] `pnpm build` completes without errors
- [ ] `pnpm typecheck` passes with no TypeScript errors
- [ ] `pnpm lint` passes with no ESLint errors
- [ ] Database schema deployed successfully
- [ ] Prisma client generates without issues


### ✅ Functionality Requirements Met

- [ ] Homepage loads and displays categories/reports
- [ ] API routes return proper JSON responses
- [ ] Database queries execute successfully
- [ ] TypeScript imports resolve correctly
- [ ] Development server runs stable


### ✅ Code Quality Requirements Met

- [ ] All imports use correct monorepo paths
- [ ] Type definitions are properly exported
- [ ] Error handling implemented
- [ ] Environment variables configured

***

