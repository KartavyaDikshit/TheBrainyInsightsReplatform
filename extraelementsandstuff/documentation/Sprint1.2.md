<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 🚀 **CLEAN SETUP ROADMAP: PostgreSQL + TypeScript Fix**

## **Local Development | Fresh Database | No Migration**


***

# 🔧 **PHASE 1: RESOLVE TYPESCRIPT ISSUES**

## **Duration: 2-3 hours | Priority: Critical**

### **Step 1: Clean Project Reset**

```bash
# 1. Clean all dependencies and cache
rm -rf node_modules
rm -rf .next
rm -rf packages/*/node_modules
rm -rf packages/*/dist
rm pnpm-lock.yaml

# 2. Clear npm/pnpm cache
pnpm cache clean
npm cache clean --force

# 3. Remove any existing Prisma client
rm -rf packages/database/src/generated
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma
```


### **Step 2: Rebuild TypeScript Configuration**

**Create `tsconfig.json` (root):**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
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
      "@/*": ["./src/*"],
      "@/db/*": ["./src/lib/db/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@tbi/database": ["./packages/database/src"],
      "@tbi/database/*": ["./packages/database/src/*"]
    }
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

**Create `packages/database/tsconfig.json`:**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "emitDeclarationOnly": false,
    "noEmit": false
  },
  "include": [
    "src/**/*",
    "prisma/schema.prisma"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```


### **Step 3: Fix Package Structure**

**Update root `package.json`:**

```json
{
  "name": "thebrainyinsights-replatform",
  "version": "0.1.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "pnpm --filter @tbi/database db:generate",
    "db:push": "pnpm --filter @tbi/database db:push",
    "db:migrate": "pnpm --filter @tbi/database db:migrate",
    "db:studio": "pnpm --filter @tbi/database db:studio",
    "postinstall": "pnpm db:generate"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tbi/database": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "15.0.3",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**Create `packages/database/package.json`:**

```json
{
  "name": "@tbi/database",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "prisma generate --schema=./prisma/schema.prisma",
    "db:push": "prisma db push --schema=./prisma/schema.prisma",
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


***

# 🗄️ **PHASE 2: FINAL POSTGRESQL SCHEMA**

## **Clean, Optimized, Production-Ready**

### **Final Schema Architecture**

**Create `packages/database/prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ================================================================
// CORE CONTENT MODELS
// ================================================================

model Category {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  shortcode   String   @unique @db.VarChar(20)
  slug        String   @unique @db.VarChar(100)
  title       String   @db.VarChar(200)
  description String?  @db.Text
  icon        String?  @db.VarChar(100)
  featured    Boolean  @default(false)
  sortOrder   Int      @default(0) @map("sort_order")
  
  // SEO
  metaTitle       String? @map("meta_title") @db.VarChar(200)
  metaDescription String? @map("meta_description") @db.VarChar(300)
  
  // Status
  status      ContentStatus @default(PUBLISHED)
  
  // Analytics
  viewCount   BigInt   @default(0) @map("view_count")
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  translations CategoryTranslation[]
  reports      Report[]
  blogs        Blog[]

  @@index([status, featured, sortOrder])
  @@index([shortcode])
  @@map("categories")
}

model CategoryTranslation {
  id          String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId  String @map("category_id") @db.Uuid
  locale      String @db.VarChar(5)
  
  title       String @db.VarChar(200)
  description String? @db.Text
  slug        String @db.VarChar(100)
  
  metaTitle       String? @map("meta_title") @db.VarChar(200)
  metaDescription String? @map("meta_description") @db.VarChar(300)
  
  status      TranslationStatus @default(PUBLISHED)
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([categoryId, locale])
  @@index([locale, status])
  @@map("category_translations")
}

model Report {
  id              String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId      String?   @map("category_id") @db.Uuid
  
  // Identifiers
  sku             String?   @unique @db.VarChar(50)
  slug            String    @unique @db.VarChar(150)
  
  // Basic Info
  title           String    @db.VarChar(500)
  description     String    @db.Text
  summary         String?   @db.Text
  
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
  marketData      Json?     @map("market_data") @db.JsonB
  keyPlayers      String[]  @map("key_players")
  regions         String[]
  
  // Categorization
  industryTags    String[]  @map("industry_tags")
  reportType      String?   @map("report_type") @db.VarChar(50)
  
  // SEO
  keywords        String[]
  metaTitle       String    @map("meta_title") @db.VarChar(500)
  metaDescription String    @map("meta_description") @db.VarChar(500)
  
  // Pricing (USD)
  singlePrice     Decimal?  @map("single_price") @db.Decimal(10,2)
  multiPrice      Decimal?  @map("multi_price") @db.Decimal(10,2)
  corporatePrice  Decimal?  @map("corporate_price") @db.Decimal(10,2)
  
  // Status & Features
  status          ContentStatus @default(DRAFT)
  featured        Boolean   @default(false)
  priority        Int       @default(0)
  
  // Analytics
  viewCount       BigInt    @default(0) @map("view_count")
  downloadCount   BigInt    @default(0) @map("download_count")
  
  // Ratings
  avgRating       Decimal?  @map("avg_rating") @db.Decimal(3,2)
  reviewCount     Int       @default(0) @map("review_count")
  
  // Timestamps
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Relations
  category      Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  translations  ReportTranslation[]
  reviews       ReportReview[]
  enquiries     Enquiry[]
  orderItems    OrderItem[]

  @@index([categoryId, status, featured])
  @@index([publishedDate, status])
  @@index([avgRating, reviewCount])
  @@index([industryTags], type: Gin)
  @@index([keywords], type: Gin)
  @@map("reports")
}

model ReportTranslation {
  id              String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId        String @map("report_id") @db.Uuid
  locale          String @db.VarChar(5)
  
  title           String @db.VarChar(500)
  description     String @db.Text
  summary         String? @db.Text
  slug            String @db.VarChar(150)
  
  tableOfContents String? @map("table_of_contents") @db.Text
  methodology     String? @db.Text
  keyFindings     String[] @map("key_findings")
  
  metaTitle       String @map("meta_title") @db.VarChar(500)
  metaDescription String @map("meta_description") @db.VarChar(500)
  keywords        String[]
  
  status          TranslationStatus @default(DRAFT)
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@unique([reportId, locale])
  @@index([locale, status])
  @@map("report_translations")
}

// ================================================================
// USER MANAGEMENT
// ================================================================

model User {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email       String     @unique @db.VarChar(255)
  firstName   String?    @map("first_name") @db.VarChar(100)
  lastName    String?    @map("last_name") @db.VarChar(100)
  phone       String?    @db.VarChar(20)
  company     String?    @db.VarChar(200)
  country     String?    @db.VarChar(100)
  
  // Auth
  password    String?    @db.VarChar(255)
  emailVerified Boolean  @default(false) @map("email_verified")
  
  // Preferences
  preferredLanguage String? @map("preferred_language") @db.VarChar(5)
  newsletter  Boolean    @default(true)
  
  status      UserStatus @default(ACTIVE)
  lastLoginAt DateTime?  @map("last_login_at")
  
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  // Relations
  orders      Order[]
  enquiries   Enquiry[]
  reviews     ReportReview[]

  @@index([email, status])
  @@map("users")
}

model Admin {
  id           String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email        String     @unique @db.VarChar(255)
  username     String     @unique @db.VarChar(100)
  firstName    String?    @map("first_name") @db.VarChar(100)
  lastName     String?    @map("last_name") @db.VarChar(100)
  
  password     String     @db.VarChar(255)
  role         AdminRole
  
  status       ContentStatus @default(ACTIVE)
  lastLoginAt  DateTime?  @map("last_login_at")
  
  createdAt    DateTime   @default(now()) @map("created_at")
  updatedAt    DateTime   @updatedAt @map("updated_at")

  @@index([email, status])
  @@map("admins")
}

// ================================================================
// E-COMMERCE
// ================================================================

model Order {
  id          String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String?     @map("user_id") @db.Uuid
  orderNumber String      @unique @map("order_number") @db.VarChar(50)
  
  // Customer Info
  customerEmail String   @map("customer_email") @db.VarChar(255)
  customerName  String   @map("customer_name") @db.VarChar(200)
  customerPhone String?  @map("customer_phone") @db.VarChar(20)
  
  // Amounts
  subtotal    Decimal     @db.Decimal(12, 2)
  discount    Decimal     @default(0) @db.Decimal(12, 2)
  total       Decimal     @db.Decimal(12, 2)
  currency    String      @default("USD") @db.VarChar(3)
  
  // Payment
  paymentMethod String?   @map("payment_method") @db.VarChar(50)
  paymentStatus String?   @map("payment_status") @db.VarChar(50)
  transactionId String?   @map("transaction_id") @db.VarChar(100)
  
  status      OrderStatus @default(PENDING)
  
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  // Relations
  user       User?       @relation(fields: [userId], references: [id])
  items      OrderItem[]

  @@index([customerEmail, status])
  @@index([createdAt])
  @@map("orders")
}

model OrderItem {
  id       String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  orderId  String      @map("order_id") @db.Uuid
  reportId String      @map("report_id") @db.Uuid
  
  licenseType LicenseType @map("license_type")
  price       Decimal     @db.Decimal(10, 2)
  quantity    Int         @default(1)

  order  Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  report Report @relation(fields: [reportId], references: [id])

  @@index([orderId])
  @@index([reportId])
  @@map("order_items")
}

// ================================================================
// CUSTOMER ENGAGEMENT
// ================================================================

model Enquiry {
  id        String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId  String?       @map("report_id") @db.Uuid
  
  firstName String        @map("first_name") @db.VarChar(100)
  lastName  String?       @map("last_name") @db.VarChar(100)
  email     String        @db.VarChar(255)
  phone     String?       @db.VarChar(20)
  company   String?       @db.VarChar(200)
  country   String?       @db.VarChar(100)
  
  message   String?       @db.Text
  enquiryType String?     @map("enquiry_type") @db.VarChar(50)
  
  status      EnquiryStatus @default(NEW)
  
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  report Report? @relation(fields: [reportId], references: [id])

  @@index([reportId, status])
  @@index([email])
  @@map("enquiries")
}

model ReportReview {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId  String   @map("report_id") @db.Uuid
  userId    String?  @map("user_id") @db.Uuid
  
  rating    Int      @db.SmallInt
  title     String?  @db.VarChar(200)
  content   String?  @db.Text
  
  // Anonymous reviewer info
  reviewerName    String? @map("reviewer_name") @db.VarChar(100)
  reviewerCompany String? @map("reviewer_company") @db.VarChar(200)
  
  status    ContentStatus @default(PUBLISHED)
  verified  Boolean  @default(false)
  
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)
  user   User?  @relation(fields: [userId], references: [id])

  @@index([reportId, status])
  @@index([rating, verified])
  @@map("report_reviews")
}

// ================================================================
// CONTENT MODELS
// ================================================================

model Blog {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId    String?   @map("category_id") @db.Uuid
  
  title         String    @db.VarChar(300)
  slug          String    @unique @db.VarChar(150)
  excerpt       String?   @db.VarChar(500)
  content       String    @db.Text
  
  tags          String[]
  
  metaTitle       String? @map("meta_title") @db.VarChar(300)
  metaDescription String? @map("meta_description") @db.VarChar(500)
  
  status        ContentStatus @default(DRAFT)
  featured      Boolean   @default(false)
  
  viewCount     BigInt    @default(0) @map("view_count")
  
  publishedAt   DateTime? @map("published_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  category     Category? @relation(fields: [categoryId], references: [id])
  translations BlogTranslation[]

  @@index([categoryId, status])
  @@index([publishedAt])
  @@index([tags], type: Gin)
  @@map("blogs")
}

model BlogTranslation {
  id          String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  blogId      String @map("blog_id") @db.Uuid
  locale      String @db.VarChar(5)
  
  title       String @db.VarChar(300)
  slug        String @db.VarChar(150)
  excerpt     String? @db.VarChar(500)
  content     String @db.Text
  
  tags        String[]
  
  metaTitle       String? @map("meta_title") @db.VarChar(300)
  metaDescription String? @map("meta_description") @db.VarChar(500)
  
  status      TranslationStatus @default(DRAFT)
  
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  blog Blog @relation(fields: [blogId], references: [id], onDelete: Cascade)

  @@unique([blogId, locale])
  @@index([locale, status])
  @@map("blog_translations")
}

// ================================================================
// ENUMS
// ================================================================

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


***

# 🛠️ **PHASE 3: LOCAL POSTGRESQL SETUP**

## **Duration: 1 hour**

### **Step 1: Install PostgreSQL Locally**

```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download and install from https://www.postgresql.org/download/windows/
```


### **Step 2: Create Database and User**

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# In PostgreSQL console:
CREATE DATABASE tbi_db;
CREATE USER tbi_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE tbi_db TO tbi_user;

# Enable required extensions
\c tbi_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

\q
```


### **Step 3: Environment Configuration**

**Create `.env.local`:**

```bash
# Database
DATABASE_URL="postgresql://tbi_user:secure_password_123@localhost:5432/tbi_db"

# App
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Development
NODE_ENV="development"
```


***

# 🔄 **PHASE 4: REBUILD AND INSTALL**

## **Duration: 30 minutes**

### **Step-by-Step Rebuild**

```bash
# 1. Fresh install
pnpm install

# 2. Generate Prisma client
cd packages/database
pnpm db:generate

# 3. Push schema to database
pnpm db:push

# 4. Back to root and test
cd ../..
pnpm dev
```


***

# 📊 **PHASE 5: DATABASE SEEDING**

## **Duration: 2 hours**

### **Create Seed Data Script**

**Create `packages/database/src/seed.ts`:**

```typescript
import { PrismaClient } from './generated'

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  // 1. Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        shortcode: 'tech',
        slug: 'technology',
        title: 'Technology',
        description: 'Technology and IT market research reports',
        icon: '💻',
        featured: true,
        sortOrder: 1,
        metaTitle: 'Technology Market Research Reports',
        metaDescription: 'Comprehensive technology market analysis and research reports'
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'health',
        slug: 'healthcare',
        title: 'Healthcare',
        description: 'Healthcare and pharmaceutical market research',
        icon: '🏥',
        featured: true,
        sortOrder: 2,
        metaTitle: 'Healthcare Market Research Reports',
        metaDescription: 'In-depth healthcare industry analysis and market reports'
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'auto',
        slug: 'automotive',
        title: 'Automotive',
        description: 'Automotive industry market research and analysis',
        icon: '🚗',
        featured: true,
        sortOrder: 3
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'energy',
        slug: 'energy',
        title: 'Energy',
        description: 'Energy sector market research and trends',
        icon: '⚡',
        featured: true,
        sortOrder: 4
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'food',
        slug: 'food-beverage',
        title: 'Food & Beverage',
        description: 'Food and beverage industry market analysis',
        icon: '🍕',
        featured: true,
        sortOrder: 5
      }
    })
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // 2. Create Category Translations (Japanese)
  for (const category of categories) {
    await prisma.categoryTranslation.create({
      data: {
        categoryId: category.id,
        locale: 'ja',
        title: `${category.title} (JP)`, // In real scenario, use actual Japanese
        description: `${category.description} (Japanese version)`,
        slug: `${category.slug}-ja`,
        metaTitle: `${category.metaTitle} (JP)`,
        metaDescription: `${category.metaDescription} (JP)`,
        status: 'PUBLISHED'
      }
    })
  }

  console.log('✅ Created Japanese category translations')

  // 3. Create Sample Reports
  const sampleReports = [
    {
      categoryId: categories[^0].id, // Technology
      title: 'Artificial Intelligence Market Analysis 2025',
      description: 'Comprehensive analysis of the global AI market including machine learning, deep learning, and neural networks. This report covers market size, growth trends, competitive landscape, and future projections for the AI industry.',
      summary: 'The AI market is expected to reach $1.8 trillion by 2030, driven by increased adoption across industries.',
      sku: 'AI-2025-001',
      slug: 'artificial-intelligence-market-analysis-2025',
      pages: 250,
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
      singlePrice: 4500,
      multiPrice: 6750,
      corporatePrice: 9000,
      featured: true,
      priority: 100
    },
    {
      categoryId: categories[^1].id, // Healthcare
      title: 'Global Telemedicine Market Report 2025',
      description: 'In-depth analysis of the telemedicine market covering virtual consultations, remote monitoring, and digital health platforms. Market size, trends, and growth opportunities.',
      summary: 'Telemedicine market accelerated by COVID-19, expected to maintain strong growth through 2030.',
      sku: 'TELE-2025-001',
      slug: 'global-telemedicine-market-report-2025',
      pages: 180,
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
      singlePrice: 3800,
      multiPrice: 5700,
      corporatePrice: 7600,
      featured: true,
      priority: 95
    },
    {
      categoryId: categories[^2].id, // Automotive
      title: 'Electric Vehicle Battery Market Analysis',
      description: 'Comprehensive study of the EV battery market including lithium-ion, solid-state, and emerging battery technologies. Market dynamics, supply chain analysis, and future outlook.',
      summary: 'EV battery market driven by automotive electrification and energy storage demand.',
      sku: 'EV-BAT-2025',
      slug: 'electric-vehicle-battery-market-analysis',
      pages: 220,
      baseYear: 2024,
      keyFindings: [
        'Lithium-ion dominates current market',
        'Solid-state batteries emerging by 2028',
        'China leads production capacity'
      ],
      keyPlayers: ['CATL', 'LG Energy', 'BYD', 'Panasonic', 'Tesla'],
      regions: ['Global', 'Asia Pacific', 'Europe'],
      industryTags: ['EV Battery', 'Lithium-ion', 'Electric Vehicles'],
      keywords: ['EV battery', 'lithium-ion', 'electric vehicle'],
      singlePrice: 4200,
      multiPrice: 6300,
      corporatePrice: 8400,
      featured: true,
      priority: 90
    }
  ]

  const reports = []
  for (const reportData of sampleReports) {
    const report = await prisma.report.create({
      data: {
        ...reportData,
        publishedDate: new Date(),
        metaTitle: reportData.title,
        metaDescription: reportData.description.substring(0, 300),
        status: 'PUBLISHED',
        marketData: {
          marketSize: {
            2024: Math.floor(Math.random() * 50 + 10),
            2025: Math.floor(Math.random() * 60 + 20),
            2030: Math.floor(Math.random() * 100 + 50)
          },
          cagr: Math.floor(Math.random() * 20 + 10)
        }
      }
    })
    reports.push(report)
  }

  console.log(`✅ Created ${reports.length} sample reports`)

  // 4. Create Admin User
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@thebrainyinsights.com',
      username: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.', // password123
      role: 'SUPERADMIN',
      status: 'PUBLISHED'
    }
  })

  console.log(`✅ Created admin user: ${admin.email}`)

  // 5. Create Sample Reviews
  for (const report of reports) {
    await prisma.reportReview.create({
      data: {
        reportId: report.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        title: 'Excellent Market Analysis',
        content: 'Very comprehensive and well-researched report. Great insights into market trends.',
        reviewerName: 'John Smith',
        reviewerCompany: 'Tech Solutions Inc',
        status: 'PUBLISHED',
        verified: true
      }
    })
  }

  console.log('✅ Created sample reviews')

  // 6. Update report review counts
  for (const report of reports) {
    await prisma.report.update({
      where: { id: report.id },
      data: {
        reviewCount: 1,
        avgRating: 4.5
      }
    })
  }

  console.log('🎉 Database seeding completed successfully!')
}

seedDatabase()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```


### **Run Seeding**

```bash
cd packages/database
pnpm db:seed
```


***

# 📝 **PHASE 6: CREATE DATABASE INDEX FILE**

**Create `packages/database/src/index.ts`:**

```typescript
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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
```


***

# ✅ **PHASE 7: TEST AND VERIFY**

### **Create Simple Test**

**Create `src/app/test-db/page.tsx`:**

```tsx
import { prisma } from '@tbi/database'

export default async function TestDBPage() {
  const [categories, reports, users] = await Promise.all([
    prisma.category.count(),
    prisma.report.count(), 
    prisma.user.count()
  ])

  const featuredCategories = await prisma.category.findMany({
    where: { featured: true },
    include: {
      _count: {
        select: { reports: true }
      }
    },
    orderBy: { sortOrder: 'asc' }
  })

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Database Test</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h3 className="font-bold">Categories</h3>
          <p className="text-2xl">{categories}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h3 className="font-bold">Reports</h3>
          <p className="text-2xl">{reports}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <h3 className="font-bold">Users</h3>
          <p className="text-2xl">{users}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Featured Categories</h2>
      <div className="grid grid-cols-2 gap-4">
        {featuredCategories.map(category => (
          <div key={category.id} className="border p-4 rounded">
            <h3 className="font-bold">{category.icon} {category.title}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
            <p className="text-sm mt-2">Reports: {category._count.reports}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```


***

# 🎯 **EXECUTION CHECKLIST**

## **Day 1: TypeScript Fix (3 hours)**

- [ ] Clean project completely
- [ ] Rebuild package.json files
- [ ] Fix tsconfig.json
- [ ] Reinstall dependencies
- [ ] Verify compilation works


## **Day 2: Database Setup (4 hours)**

- [ ] Install PostgreSQL locally
- [ ] Create database and user
- [ ] Implement final schema
- [ ] Generate Prisma client
- [ ] Push schema to DB


## **Day 3: Seed and Test (3 hours)**

- [ ] Create seed script
- [ ] Run database seeding
- [ ] Create test page
- [ ] Verify all data loads correctly
- [ ] Test basic queries


## **Success Criteria**

- [ ] ✅ TypeScript compiles without errors
- [ ] ✅ Database connected and working
- [ ] ✅ Schema deployed successfully
- [ ] ✅ Sample data loaded
- [ ] ✅ Test page shows data correctly
- [ ] ✅ Ready for frontend development

**This clean setup eliminates all complexity and gives you a solid foundation to build upon! 🚀**

<div style="text-align: center">⁂</div>

[^1]: tbi_db.sql

