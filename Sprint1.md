<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 🏗️ **SPRINT 1: DATABASE MODERNIZATION \& INTEGRATION**

## **Timeline: Week 1-2 (16 hours) | Priority: Critical Foundation**


***

## 📋 **SPRINT OVERVIEW**

**Objective**: Transform legacy MySQL structure into modern, scalable database foundation with proper translation support

**Success Criteria**:

- ✅ Prisma schema updated with translation tables
- ✅ Legacy data migrated successfully
- ✅ Database connection established
- ✅ Translation foundation working
- ✅ Basic CRUD operations functional

***

# 🎯 **TASK 1: PRISMA SETUP \& CONFIGURATION**

## **Duration: 3 hours | Priority: Critical**

### **1.1 Install Database Dependencies**

```bash
# Navigate to your project root
cd TheBrainyInsightsReplatform

# Install Prisma and MySQL dependencies
pnpm add prisma @prisma/client mysql2
pnpm add -D prisma

# Initialize Prisma (if not already done)
npx prisma init
```


### **1.2 Configure Environment Variables**

**Update `.env.local`:**

```bash
# Database Configuration
DATABASE_URL="mysql://root:your_password@localhost:3306/tbi_db"

# Legacy Database (for migration)
LEGACY_DB_HOST="localhost"
LEGACY_DB_USER="root" 
LEGACY_DB_PASSWORD="your_password"
LEGACY_DB_NAME="tbi_db"

# Application Settings
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-here"

# Development
NODE_ENV="development"
```

**Update `.env.production`:**

```bash
# Production Database
DATABASE_URL="mysql://prod_user:prod_password@prod_host:3306/tbi_db"

# Production Settings
NEXT_PUBLIC_BASE_URL="https://thebrainyinsights.com"
NEXTAUTH_URL="https://thebrainyinsights.com"
NEXTAUTH_SECRET="production-super-secret-key"

NODE_ENV="production"
```


### **1.3 Update Project Structure**

**Create database package structure:**

```bash
mkdir -p packages/database/prisma
mkdir -p packages/database/src
mkdir -p scripts/migration
```


### **1.4 Create Enhanced Prisma Schema**

**Create `packages/database/prisma/schema.prisma`:**

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// ================================================================
// CORE CONTENT MODELS WITH TRANSLATION SUPPORT
// ================================================================

model Category {
  id          String   @id @default(cuid()) @map("category_id")
  shortcode   String   @unique @db.VarChar(16)
  slug        String   @unique @db.VarChar(128)
  icon        String?  @db.VarChar(64)
  featured    Boolean  @default(false)
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Base language content (English)
  title       String   @db.VarChar(128)
  description String?  @db.Text

  // Relationships
  translations CategoryTranslation[]
  reports      Report[]
  blogs        Blog[]
  press        Press[]
  media        Media[]

  // Indexes for performance
  @@index([status, featured])
  @@index([shortcode])
  @@map("tbl_category")
}

model CategoryTranslation {
  id          String @id @default(cuid())
  categoryId  String @map("category_id")
  locale      String @db.VarChar(5) // en, de, es, fr, it, ja, ko
  title       String @db.VarChar(128)
  description String? @db.Text
  slug        String @db.VarChar(128)
  
  // Metadata
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  // Relations
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([categoryId, locale])
  @@index([locale])
  @@index([slug])
  @@map("tbl_category_translations")
}

model Report {
  id              String    @id @default(cuid()) @map("report_id")
  categoryId      String?   @map("category_id")
  adminId         String?   @map("admin_id")
  sku             String?   @unique @db.VarChar(24)
  picture         String?   @db.VarChar(256)
  slug            String    @unique @db.VarChar(255) // Reduced from 2048 for index
  publishedDate   DateTime  @map("published_date") @db.Date
  pages           String    @db.VarChar(64)
  baseYear        Int?      @map("base_year")
  historicalData  String?   @map("historical_data") @db.VarChar(128)
  reportLink      String    @map("report_link") @db.VarChar(300)
  ratings         Float?    @db.Float
  reviews         Int?      @db.Int
  featured        Boolean   @default(false)
  status          Status    @default(ACTIVE)
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  // Base language content (English)
  title           String    @db.Text
  description     String    @db.LongText
  toc             String    @map("table_of_contents") @db.LongText
  tof             String?   @map("table_of_figures") @db.LongText
  segmentation    String?   @db.Text
  companies       String?   @db.Text
  types           String?   @db.Text
  applications    String?   @db.Text
  keywords        String    @db.Text
  metaTitle       String    @map("meta_title") @db.Text
  metaKeyword     String    @map("meta_keyword") @db.Text
  metaDescription String    @map("meta_description") @db.Text

  // Pricing in USD
  price           Float?    @db.Float // Single user license
  mprice          Float?    @db.Float // Multi user license  
  cprice          Float?    @db.Float // Corporate license

  // Relationships
  category      Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  admin         Admin?    @relation(fields: [adminId], references: [id], onDelete: SetNull)
  translations  ReportTranslation[]
  faqs          FAQ[]
  enquiries     Enquiry[]
  requests      Request[]
  orderItems    OrderItem[]

  // Indexes for performance
  @@index([categoryId, status, featured])
  @@index([publishedDate])
  @@index([sku])
  @@index([slug])
  @@fulltext([title, description, keywords])
  @@map("tbl_report")
}

model ReportTranslation {
  id              String @id @default(cuid())
  reportId        String @map("report_id")
  locale          String @db.VarChar(5)
  title           String @db.Text
  description     String @db.LongText
  toc             String @map("table_of_contents") @db.LongText
  tof             String? @map("table_of_figures") @db.LongText
  segmentation    String? @db.Text
  companies       String? @db.Text
  types           String? @db.Text
  applications    String? @db.Text
  metaTitle       String @map("meta_title") @db.Text
  metaKeyword     String @map("meta_keyword") @db.Text
  metaDescription String @map("meta_description") @db.Text
  slug            String @db.VarChar(255)
  
  // Translation metadata
  translatedAt    DateTime @default(now()) @map("translated_at")
  translatedBy    String?  @map("translated_by") // Admin ID who created translation
  reviewedAt      DateTime? @map("reviewed_at")
  reviewedBy      String?  @map("reviewed_by") // Admin ID who reviewed
  translationStatus TranslationStatus @default(DRAFT) @map("translation_status")
  
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([reportId, locale])
  @@index([locale])
  @@index([slug])
  @@index([translationStatus])
  @@fulltext([title, description])
  @@map("tbl_report_translations")
}

model Blog {
  id            String    @id @default(cuid()) @map("blog_id")
  categoryId    String?   @map("category_id")
  slug          String    @unique @db.VarChar(128)
  publishedDate DateTime? @map("published_date") @db.Date
  status        Status    @default(ACTIVE)
  featured      Boolean   @default(false)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Base language content
  title         String    @db.VarChar(128)
  description   String?   @db.Text
  content       String?   @db.LongText
  metaTitle     String?   @map("meta_title") @db.VarChar(128)
  metaKeyword   String?   @map("meta_keyword") @db.VarChar(256)
  metaDescription String? @map("meta_description") @db.VarChar(256)

  // Relations
  category     Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  translations BlogTranslation[]

  @@index([categoryId, status, featured])
  @@index([publishedDate])
  @@map("tbl_blog")
}

model BlogTranslation {
  id          String @id @default(cuid())
  blogId      String @map("blog_id")
  locale      String @db.VarChar(5)
  title       String @db.VarChar(128)
  description String? @db.Text
  content     String? @db.LongText
  slug        String @db.VarChar(128)
  metaTitle     String? @map("meta_title") @db.VarChar(128)
  metaKeyword   String? @map("meta_keyword") @db.VarChar(256)
  metaDescription String? @map("meta_description") @db.VarChar(256)
  
  translationStatus TranslationStatus @default(DRAFT)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  blog Blog @relation(fields: [blogId], references: [id], onDelete: Cascade)

  @@unique([blogId, locale])
  @@index([locale])
  @@map("tbl_blog_translations")
}

// ================================================================
// USER MANAGEMENT MODELS
// ================================================================

model User {
  id        String     @id @default(cuid()) @map("user_id")
  firstName String?    @map("first_name") @db.VarChar(128)
  lastName  String?    @map("last_name") @db.VarChar(128)
  email     String     @unique @db.VarChar(128)
  phone     String?    @db.VarChar(16)
  password  String?    @db.VarChar(256)
  status    UserStatus @default(PENDING)
  
  // Profile info
  country   String?    @db.VarChar(100)
  timezone  String?    @db.VarChar(50)
  language  String?    @db.VarChar(5) // Preferred language
  
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  // Relations
  orders    Order[]
  enquiries Enquiry[]
  requests  Request[]

  @@index([email])
  @@index([status])
  @@map("tbl_user")
}

model Admin {
  id           String     @id @default(cuid()) @map("admin_id")
  role         AdminRole
  profileImage String?    @map("profile_image") @db.VarChar(128)
  firstName    String?    @map("first_name") @db.VarChar(64)
  lastName     String?    @map("last_name") @db.VarChar(64)
  username     String     @unique @db.VarChar(128)
  email        String     @unique @db.VarChar(128)
  password     String     @db.VarChar(256)
  status       Status
  
  // Admin specific fields
  permissions  Json?      // Store permissions as JSON
  lastLoginAt  DateTime?  @map("last_login_at")
  
  createdAt    DateTime   @default(now()) @map("created_at")
  updatedAt    DateTime   @updatedAt @map("updated_at")

  // Relations
  reports      Report[]

  @@index([email, status])
  @@index([role])
  @@map("tbl_admin")
}

// ================================================================
// SUPPORTING MODELS
// ================================================================

model FAQ {
  id        String   @id @default(cuid()) @map("faq_id")
  reportId  String?  @map("report_id")
  locale    String   @default("en") @db.VarChar(5)
  question  String   @db.VarChar(512)
  answer    String   @db.Text
  sortOrder Int?     @map("sort_order") @default(0)
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  report Report? @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@index([reportId, locale])
  @@map("tbl_faq")
}

model Country {
  id        String @id @default(cuid()) @map("country_id")
  region    String? @db.VarChar(64)
  name      String @db.VarChar(150)
  shortname String @unique @db.VarChar(3)
  phonecode Int    @db.Int
  currency  String? @db.VarChar(3)
  timezone  String? @db.VarChar(50)

  @@index([shortname])
  @@index([region])
  @@map("tbl_country")
}

// ================================================================
// E-COMMERCE MODELS
// ================================================================

model Order {
  id          String      @id @default(cuid()) @map("order_id")
  userId      String?     @map("user_id")
  ipAddress   String      @map("ip_address") @db.VarChar(45) // Support IPv6
  subtotal    Decimal     @db.Decimal(10, 2)
  discount    Decimal     @default(0.00) @db.Decimal(10, 2)
  total       Decimal     @db.Decimal(10, 2)
  items       Int         @db.Int
  orderDate   DateTime    @map("order_date") @db.Date
  paymentMode String?     @map("payment_mode") @db.VarChar(64)
  txnId       String?     @map("txn_id") @db.VarChar(64)
  payerId     String?     @map("payer_id") @db.VarChar(64)
  
  // Customer info
  firstName   String?     @map("fname") @db.VarChar(64)
  lastName    String?     @map("lname") @db.VarChar(64)
  email       String?     @db.VarChar(128)
  phone       String?     @db.VarChar(25)
  country     String?     @db.VarChar(100)
  state       String?     @db.VarChar(100)
  city        String?     @db.VarChar(100)
  zipcode     String?     @db.VarChar(20)
  address     String?     @db.Text
  
  paymentDate DateTime?   @map("payment_date") @db.Date
  error       String?     @db.VarChar(256)
  status      OrderStatus @default(PENDING)
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  // Relations
  user       User?       @relation(fields: [userId], references: [id])
  orderItems OrderItem[]

  @@index([userId])
  @@index([status, orderDate])
  @@index([email])
  @@map("tbl_order")
}

model OrderItem {
  id       String      @id @default(cuid()) @map("order_item_id")
  orderId  String?     @map("order_id")
  reportId String?     @map("report_id")
  license  LicenseType
  price    Decimal     @db.Decimal(10, 2)
  quantity Int         @default(1) @db.Int

  // Relations
  order  Order?  @relation(fields: [orderId], references: [id], onDelete: SetNull)
  report Report? @relation(fields: [reportId], references: [id], onDelete: SetNull)

  @@index([orderId])
  @@index([reportId])
  @@map("tbl_order_item")
}

model Enquiry {
  id        String        @id @default(cuid()) @map("enquiry_id")
  reportId  String?       @map("report_id")
  firstName String        @map("fname") @db.VarChar(64)
  email     String        @db.VarChar(128)
  phone     String        @db.VarChar(25)
  jobTitle  String?       @map("job_title") @db.VarChar(100)
  company   String?       @db.VarChar(100)
  comment   String?       @db.Text
  status    EnquiryStatus @default(UNSEEN)
  createdAt DateTime      @default(now()) @map("created_at")
  updatedAt DateTime      @updatedAt @map("updated_at")

  // Relations
  report Report? @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@index([reportId, status])
  @@index([email])
  @@map("tbl_enquiry")
}

model Request {
  id          String        @id @default(cuid()) @map("request_id")
  reportId    String?       @map("report_id")
  fullName    String        @map("full_name") @db.VarChar(128)
  email       String        @db.VarChar(128)
  phone       String?       @db.VarChar(25)
  designation String?       @db.VarChar(100)
  company     String?       @db.VarChar(100)
  comment     String?       @db.Text
  publisher   String?       @db.VarChar(64)
  type        String?       @db.VarChar(128)
  country     String?       @db.VarChar(128)
  region      String?       @db.VarChar(50)
  phonecode   String?       @db.VarChar(10)
  shortname   String?       @db.VarChar(10)
  status      EnquiryStatus @default(UNSEEN)
  processed   Boolean?      @default(false)
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  // Relations
  report Report? @relation(fields: [reportId], references: [id], onDelete: SetNull)

  @@index([reportId, status])
  @@index([email])
  @@map("tbl_request")
}

// ================================================================
// CONTENT MANAGEMENT MODELS
// ================================================================

model Press {
  id            String    @id @default(cuid()) @map("press_id")
  categoryId    String?   @map("category_id")
  title         String    @db.VarChar(128)
  slug          String    @unique @db.VarChar(128)
  description   String    @db.Text
  publishedDate DateTime? @map("published_date") @db.Date
  metaTitle     String?   @map("meta_title") @db.VarChar(128)
  metaKeyword   String?   @map("meta_keyword") @db.VarChar(256)
  metaDescription String? @map("meta_description") @db.VarChar(256)
  status        Status    @default(ACTIVE)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([categoryId, status])
  @@index([publishedDate])
  @@map("tbl_press")
}

model Media {
  id            String    @id @default(cuid()) @map("media_id")
  categoryId    String?   @map("category_id")
  title         String    @db.VarChar(128)
  link          String    @db.VarChar(512)
  description   String    @db.Text
  publishedDate DateTime? @map("published_date") @db.Date
  metaTitle     String?   @map("meta_title") @db.VarChar(128)
  metaKeyword   String?   @map("meta_keyword") @db.VarChar(256)
  metaDescription String? @map("meta_description") @db.VarChar(256)
  status        Status    @default(ACTIVE)
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([categoryId, status])
  @@map("tbl_media")
}

model Testimonial {
  id        String   @id @default(cuid()) @map("testimonial_id")
  content   String   @db.Text
  name      String   @db.VarChar(128)
  logo      String?  @db.VarChar(128)
  place     String   @db.VarChar(128)
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([status])
  @@map("tbl_testimonial")
}

model UrlRedirect {
  id        String   @id @default(cuid()) @map("url_id")
  sourceUrl String   @map("source_url") @db.VarChar(512)
  targetUrl String   @map("target_url") @db.VarChar(512)
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([sourceUrl])
  @@map("tbl_url")
}

// ================================================================
// ENUMS
// ================================================================

enum Status {
  ACTIVE
  INACTIVE
}

enum UserStatus {
  PENDING
  ACTIVE
  INACTIVE
  SUSPENDED
}

enum AdminRole {
  SUPERADMIN
  MANAGER
  USER
}

enum OrderStatus {
  PENDING
  PROCESSING
  CANCEL
  COMPLETED
  FAILURE
  REFUNDED
}

enum LicenseType {
  SINGLE
  MULTIPLE
  CORPORATE
}

enum EnquiryStatus {
  SEEN
  UNSEEN
}

enum TranslationStatus {
  DRAFT
  IN_REVIEW
  APPROVED
  PUBLISHED
}
```


***

# 🎯 **TASK 2: DATABASE MIGRATION SYSTEM**

## **Duration: 4 hours | Priority: Critical**

### **2.1 Create Migration Utilities**

**Create `packages/database/src/migration-utils.ts`:**

```typescript
import mysql from 'mysql2/promise'
import { PrismaClient } from './generated/client'

export interface MigrationConfig {
  legacyHost: string
  legacyUser: string
  legacyPassword: string
  legacyDatabase: string
  batchSize: number
  verbose: boolean
}

export interface MigrationStats {
  processed: number
  successful: number
  failed: number
  skipped: number
  errors: string[]
}

export class LegacyMigrator {
  private legacyDb: mysql.Connection
  private prisma: PrismaClient
  private config: MigrationConfig
  private stats: Record<string, MigrationStats> = {}

  constructor(config: MigrationConfig) {
    this.config = config
    this.prisma = new PrismaClient()
  }

  async connect(): Promise<void> {
    try {
      this.legacyDb = await mysql.createConnection({
        host: this.config.legacyHost,
        user: this.config.legacyUser,
        password: this.config.legacyPassword,
        database: this.config.legacyDatabase,
        charset: 'utf8mb4',
        timezone: '+00:00'
      })
      
      await this.legacyDb.execute('SET SESSION sql_mode = "TRADITIONAL"')
      
      if (this.config.verbose) {
        console.log('✅ Connected to legacy database')
      }
    } catch (error) {
      console.error('❌ Failed to connect to legacy database:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    await this.legacyDb?.end()
    await this.prisma.$disconnect()
  }

  private initStats(tableName: string): void {
    this.stats[tableName] = {
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: []
    }
  }

  private logProgress(tableName: string, message: string): void {
    if (this.config.verbose) {
      console.log(`[${tableName}] ${message}`)
    }
  }

  private addError(tableName: string, error: string): void {
    this.stats[tableName].errors.push(error)
    if (this.config.verbose) {
      console.error(`[${tableName}] Error: ${error}`)
    }
  }

  // Utility functions
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single
      .trim()
      .substring(0, 100)        // Limit length
  }

  parseDate(dateString: any): Date {
    if (!dateString) return new Date()
    if (dateString instanceof Date) return dateString
    
    try {
      return new Date(dateString)
    } catch {
      return new Date()
    }
  }

  cleanText(text: any): string {
    if (!text) return ''
    return String(text).trim().substring(0, 10000) // Prevent extremely long strings
  }

  // Get migration statistics
  getStats(): Record<string, MigrationStats> {
    return this.stats
  }

  printSummary(): void {
    console.log('\n📊 MIGRATION SUMMARY')
    console.log('='.repeat(50))
    
    let totalProcessed = 0
    let totalSuccessful = 0
    let totalFailed = 0
    
    Object.entries(this.stats).forEach(([table, stats]) => {
      console.log(`\n${table}:`)
      console.log(`  Processed: ${stats.processed}`)
      console.log(`  Successful: ${stats.successful}`)
      console.log(`  Failed: ${stats.failed}`)
      console.log(`  Skipped: ${stats.skipped}`)
      
      if (stats.errors.length > 0) {
        console.log(`  Errors: ${stats.errors.length}`)
      }
      
      totalProcessed += stats.processed
      totalSuccessful += stats.successful
      totalFailed += stats.failed
    })
    
    console.log('\n' + '='.repeat(50))
    console.log(`TOTAL - Processed: ${totalProcessed}, Successful: ${totalSuccessful}, Failed: ${totalFailed}`)
    console.log('='.repeat(50))
  }
}

// Export utility functions
export const migrationUtils = {
  generateSlug: (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  },
  
  parseDate: (dateString: any): Date => {
    if (!dateString) return new Date()
    if (dateString instanceof Date) return dateString
    try {
      return new Date(dateString)
    } catch {
      return new Date()
    }
  },
  
  cleanText: (text: any): string => {
    if (!text) return ''
    return String(text).trim()
  },
  
  generateCUID: (): string => {
    // Simple CUID generation for consistent IDs
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `${timestamp}${randomStr}`
  }
}
```


### **2.2 Create Category Migration**

**Create `scripts/migration/01-migrate-categories.ts`:**

```typescript
import { LegacyMigrator, MigrationConfig } from '../../packages/database/src/migration-utils'
import { PrismaClient } from '../../packages/database/src/generated/client'

interface LegacyCategory {
  category_id: number
  shortcode: string
  slug: string | null
  title: string
  description: string | null
  icon: string | null
  featured: 'Yes' | 'No'
  status: 'Active' | 'Inactive'
  created_at: Date
  updated_at: Date
}

export async function migrateCategories(migrator: LegacyMigrator): Promise<void> {
  const prisma = new PrismaClient()
  
  try {
    console.log('📂 Starting category migration...')
    migrator['initStats']('categories')

    // Step 1: Fetch all English categories
    const [englishCategories] = await migrator['legacyDb'].execute(`
      SELECT * FROM tbl_category 
      WHERE status = 'Active' 
      ORDER BY category_id ASC
    `) as [LegacyCategory[], any]

    migrator['logProgress']('categories', `Found ${englishCategories.length} English categories`)

    // Step 2: Fetch all Japanese categories for translation mapping
    const [japaneseCategories] = await migrator['legacyDb'].execute(`
      SELECT * FROM tbl_category_jp 
      WHERE status = 'Active' 
      ORDER BY category_id ASC
    `) as [LegacyCategory[], any]

    migrator['logProgress']('categories', `Found ${japaneseCategories.length} Japanese categories`)

    // Create mapping of shortcode to Japanese category
    const japaneseMap = new Map<string, LegacyCategory>()
    japaneseCategories.forEach(cat => {
      japaneseMap.set(cat.shortcode, cat)
    })

    // Step 3: Process each English category
    for (const engCategory of englishCategories) {
      try {
        migrator['stats']['categories'].processed++

        // Generate consistent ID
        const categoryId = `cat_${engCategory.shortcode}_${engCategory.category_id}`

        // Create main category record
        const category = await prisma.category.upsert({
          where: { shortcode: engCategory.shortcode },
          update: {
            title: migrator.cleanText(engCategory.title),
            description: migrator.cleanText(engCategory.description),
            slug: engCategory.slug || migrator.generateSlug(engCategory.title),
            icon: engCategory.icon,
            featured: engCategory.featured === 'Yes',
            status: engCategory.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
            updatedAt: migrator.parseDate(engCategory.updated_at)
          },
          create: {
            id: categoryId,
            shortcode: engCategory.shortcode,
            title: migrator.cleanText(engCategory.title),
            description: migrator.cleanText(engCategory.description),
            slug: engCategory.slug || migrator.generateSlug(engCategory.title),
            icon: engCategory.icon,
            featured: engCategory.featured === 'Yes',
            status: engCategory.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
            createdAt: migrator.parseDate(engCategory.created_at),
            updatedAt: migrator.parseDate(engCategory.updated_at)
          }
        })

        // Step 4: Add Japanese translation if available
        const japaneseCategory = japaneseMap.get(engCategory.shortcode)
        if (japaneseCategory) {
          await prisma.categoryTranslation.upsert({
            where: {
              categoryId_locale: {
                categoryId: category.id,
                locale: 'ja'
              }
            },
            update: {
              title: migrator.cleanText(japaneseCategory.title),
              description: migrator.cleanText(japaneseCategory.description),
              slug: japaneseCategory.slug || migrator.generateSlug(japaneseCategory.title),
              updatedAt: migrator.parseDate(japaneseCategory.updated_at)
            },
            create: {
              categoryId: category.id,
              locale: 'ja',
              title: migrator.cleanText(japaneseCategory.title),
              description: migrator.cleanText(japaneseCategory.description),
              slug: japaneseCategory.slug || migrator.generateSlug(japaneseCategory.title),
              createdAt: migrator.parseDate(japaneseCategory.created_at),
              updatedAt: migrator.parseDate(japaneseCategory.updated_at)
            }
          })

          migrator['logProgress']('categories', `✅ Migrated category with JA translation: ${engCategory.title}`)
        } else {
          migrator['logProgress']('categories', `✅ Migrated category (EN only): ${engCategory.title}`)
        }

        migrator['stats']['categories'].successful++

      } catch (error) {
        migrator['stats']['categories'].failed++
        migrator['addError']('categories', `Failed to migrate category ${engCategory.shortcode}: ${error}`)
      }
    }

    migrator['logProgress']('categories', `✅ Category migration completed`)

  } catch (error) {
    console.error('❌ Category migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Standalone execution
if (require.main === module) {
  const config: MigrationConfig = {
    legacyHost: process.env.LEGACY_DB_HOST || 'localhost',
    legacyUser: process.env.LEGACY_DB_USER || 'root',
    legacyPassword: process.env.LEGACY_DB_PASSWORD || '',
    legacyDatabase: process.env.LEGACY_DB_NAME || 'tbi_db',
    batchSize: 100,
    verbose: true
  }

  const migrator = new LegacyMigrator(config)

  async function run() {
    try {
      await migrator.connect()
      await migrateCategories(migrator)
      migrator.printSummary()
    } catch (error) {
      console.error('Migration failed:', error)
      process.exit(1)
    } finally {
      await migrator.disconnect()
    }
  }

  run()
}
```


### **2.3 Create Report Migration**

**Create `scripts/migration/02-migrate-reports.ts`:**

```typescript
import { LegacyMigrator, MigrationConfig } from '../../packages/database/src/migration-utils'
import { PrismaClient } from '../../packages/database/src/generated/client'

interface LegacyReport {
  report_id: number
  category_id: number | null
  sku: string | null
  picture: string | null
  slug: string
  keywords: string
  title: string
  description: string
  toc: string
  tof: string | null
  segmentation: string | null
  price: number | null
  mprice: number | null
  cprice: number | null
  published_date: Date
  pages: string
  base_year: number | null
  historical_data: string | null
  report_link: string
  companies: string | null
  types: string | null
  applications: string | null
  ratings: number | null
  reviews: number | null
  meta_title: string
  meta_keyword: string
  meta_description: string
  featured: 'Yes' | 'No'
  status: 'Active' | 'Inactive'
  admin_id: number | null
  created_at: Date
  updated_at: Date
  category_shortcode?: string
}

export async function migrateReports(migrator: LegacyMigrator, limit = 100): Promise<void> {
  const prisma = new PrismaClient()
  
  try {
    console.log('📊 Starting report migration...')
    migrator['initStats']('reports')

    // Step 1: Get category mapping first
    const categories = await prisma.category.findMany({
      select: { id: true, shortcode: true }
    })
    const categoryMap = new Map(categories.map(cat => [cat.shortcode, cat.id]))

    // Step 2: Fetch English reports with category info
    const [englishReports] = await migrator['legacyDb'].execute(`
      SELECT r.*, c.shortcode as category_shortcode 
      FROM tbl_report r 
      LEFT JOIN tbl_category c ON r.category_id = c.category_id 
      WHERE r.status = 'Active' 
      ORDER BY r.report_id ASC
      LIMIT ?
    `, [limit]) as [LegacyReport[], any]

    migrator['logProgress']('reports', `Found ${englishReports.length} English reports`)

    // Step 3: Fetch Japanese reports for translation mapping
    const [japaneseReports] = await migrator['legacyDb'].execute(`
      SELECT * FROM tbl_report_jp 
      WHERE status = 'Active' 
      ORDER BY report_id ASC
    `) as [LegacyReport[], any]

    // Create SKU mapping for Japanese reports
    const japaneseMap = new Map<string, LegacyReport>()
    japaneseReports.forEach(report => {
      if (report.sku) {
        japaneseMap.set(report.sku, report)
      }
    })

    migrator['logProgress']('reports', `Found ${japaneseReports.length} Japanese reports for translation`)

    // Step 4: Process each English report
    for (const engReport of englishReports) {
      try {
        migrator['stats']['reports'].processed++

        // Generate consistent ID
        const reportId = `rpt_${engReport.sku || engReport.report_id}_${engReport.report_id}`
        
        // Find category ID
        const categoryId = engReport.category_shortcode 
          ? categoryMap.get(engReport.category_shortcode) 
          : null

        // Clean and validate data
        const cleanSlug = migrator.generateSlug(engReport.title || `report-${engReport.report_id}`)
        const cleanTitle = migrator.cleanText(engReport.title)
        const cleanDescription = migrator.cleanText(engReport.description)

        // Create main report record
        const report = await prisma.report.upsert({
          where: { 
            sku: engReport.sku || reportId 
          },
          update: {
            categoryId,
            title: cleanTitle,
            description: cleanDescription,
            slug: cleanSlug,
            toc: migrator.cleanText(engReport.toc),
            tof: migrator.cleanText(engReport.tof),
            segmentation: migrator.cleanText(engReport.segmentation),
            companies: migrator.cleanText(engReport.companies),
            types: migrator.cleanText(engReport.types),
            applications: migrator.cleanText(engReport.applications),
            keywords: migrator.cleanText(engReport.keywords),
            price: engReport.price,
            mprice: engReport.mprice,
            cprice: engReport.cprice,
            pages: engReport.pages || '0',
            baseYear: engReport.base_year,
            historicalData: engReport.historical_data,
            reportLink: engReport.report_link,
            ratings: engReport.ratings,
            reviews: engReport.reviews,
            metaTitle: migrator.cleanText(engReport.meta_title),
            metaKeyword: migrator.cleanText(engReport.meta_keyword),
            metaDescription: migrator.cleanText(engReport.meta_description),
            featured: engReport.featured === 'Yes',
            status: engReport.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
            publishedDate: migrator.parseDate(engReport.published_date),
            updatedAt: migrator.parseDate(engReport.updated_at)
          },
          create: {
            id: reportId,
            sku: engReport.sku || reportId,
            categoryId,
            title: cleanTitle,
            description: cleanDescription,
            slug: cleanSlug,
            toc: migrator.cleanText(engReport.toc),
            tof: migrator.cleanText(engReport.tof),
            segmentation: migrator.cleanText(engReport.segmentation),
            companies: migrator.cleanText(engReport.companies),
            types: migrator.cleanText(engReport.types),
            applications: migrator.cleanText(engReport.applications),
            keywords: migrator.cleanText(engReport.keywords),
            price: engReport.price,
            mprice: engReport.mprice,
            cprice: engReport.cprice,
            publishedDate: migrator.parseDate(engReport.published_date),
            pages: engReport.pages || '0',
            baseYear: engReport.base_year,
            historicalData: engReport.historical_data,
            reportLink: engReport.report_link,
            ratings: engReport.ratings,
            reviews: engReport.reviews,
            metaTitle: migrator.cleanText(engReport.meta_title),
            metaKeyword: migrator.cleanText(engReport.meta_keyword),
            metaDescription: migrator.cleanText(engReport.meta_description),
            featured: engReport.featured === 'Yes',
            status: engReport.status === 'Active' ? 'ACTIVE' : 'INACTIVE',
            createdAt: migrator.parseDate(engReport.created_at),
            updatedAt: migrator.parseDate(engReport.updated_at)
          }
        })

        // Step 5: Add Japanese translation if available
        const japaneseReport = japaneseMap.get(engReport.sku || '')
        if (japaneseReport) {
          await prisma.reportTranslation.upsert({
            where: {
              reportId_locale: {
                reportId: report.id,
                locale: 'ja'
              }
            },
            update: {
              title: migrator.cleanText(japaneseReport.title),
              description: migrator.cleanText(japaneseReport.description),
              toc: migrator.cleanText(japaneseReport.toc),
              tof: migrator.cleanText(japaneseReport.tof),
              segmentation: migrator.cleanText(japaneseReport.segmentation),
              companies: migrator.cleanText(japaneseReport.companies),
              types: migrator.cleanText(japaneseReport.types),
              applications: migrator.cleanText(japaneseReport.applications),
              metaTitle: migrator.cleanText(japaneseReport.meta_title),
              metaKeyword: migrator.cleanText(japaneseReport.meta_keyword),
              metaDescription: migrator.cleanText(japaneseReport.meta_description),
              slug: migrator.generateSlug(japaneseReport.title),
              translationStatus: 'PUBLISHED',
              updatedAt: migrator.parseDate(japaneseReport.updated_at)
            },
            create: {
              reportId: report.id,
              locale: 'ja',
              title: migrator.cleanText(japaneseReport.title),
              description: migrator.cleanText(japaneseReport.description),
              toc: migrator.cleanText(japaneseReport.toc),
              tof: migrator.cleanText(japaneseReport.tof),
              segmentation: migrator.cleanText(japaneseReport.segmentation),
              companies: migrator.cleanText(japaneseReport.companies),
              types: migrator.cleanText(japaneseReport.types),
              applications: migrator.cleanText(japaneseReport.applications),
              metaTitle: migrator.cleanText(japaneseReport.meta_title),
              metaKeyword: migrator.cleanText(japaneseReport.meta_keyword),
              metaDescription: migrator.cleanText(japaneseReport.meta_description),
              slug: migrator.generateSlug(japaneseReport.title),
              translationStatus: 'PUBLISHED',
              createdAt: migrator.parseDate(japaneseReport.created_at),
              updatedAt: migrator.parseDate(japaneseReport.updated_at)
            }
          })

          migrator['logProgress']('reports', `✅ Migrated report with JA translation: ${cleanTitle.substring(0, 50)}...`)
        } else {
          migrator['logProgress']('reports', `✅ Migrated report (EN only): ${cleanTitle.substring(0, 50)}...`)
        }

        migrator['stats']['reports'].successful++

      } catch (error) {
        migrator['stats']['reports'].failed++
        migrator['addError']('reports', `Failed to migrate report ${engReport.report_id}: ${error}`)
      }
    }

    migrator['logProgress']('reports', `✅ Report migration completed`)

  } catch (error) {
    console.error('❌ Report migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Standalone execution
if (require.main === module) {
  const config: MigrationConfig = {
    legacyHost: process.env.LEGACY_DB_HOST || 'localhost',
    legacyUser: process.env.LEGACY_DB_USER || 'root',
    legacyPassword: process.env.LEGACY_DB_PASSWORD || '',
    legacyDatabase: process.env.LEGACY_DB_NAME || 'tbi_db',
    batchSize: 100,
    verbose: true
  }

  const migrator = new LegacyMigrator(config)

  async function run() {
    try {
      await migrator.connect()
      await migrateReports(migrator, 50) // Start with 50 reports for testing
      migrator.printSummary()
    } catch (error) {
      console.error('Migration failed:', error)
      process.exit(1)
    } finally {
      await migrator.disconnect()
    }
  }

  run()
}
```


***

# 🎯 **TASK 3: DATABASE CONNECTION \& SETUP**

## **Duration: 2 hours | Priority: Critical**

### **3.1 Create Database Client Configuration**

**Create `packages/database/src/client.ts`:**

```typescript
import { PrismaClient } from './generated/client'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

// Connection test utility
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Database health check
export async function getDatabaseHealth(): Promise<{
  connected: boolean
  version: string | null
  tableCount: number | null
  lastMigration: Date | null
}> {
  try {
    await prisma.$connect()
    
    const [versionResult] = await prisma.$queryRaw`SELECT VERSION() as version` as any[]
    const version = versionResult?.version || null
    
    const [tableResult] = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    ` as any[]
    const tableCount = tableResult?.count || null
    
    // Get last migration timestamp (if _prisma_migrations table exists)
    let lastMigration = null
    try {
      const [migrationResult] = await prisma.$queryRaw`
        SELECT finished_at 
        FROM _prisma_migrations 
        ORDER BY finished_at DESC 
        LIMIT 1
      ` as any[]
      lastMigration = migrationResult?.finished_at || null
    } catch {
      // Migration table doesn't exist yet
    }
    
    return {
      connected: true,
      version,
      tableCount,
      lastMigration
    }
  } catch (error) {
    return {
      connected: false,
      version: null,
      tableCount: null,
      lastMigration: null
    }
  }
}

export default prisma
```


### **3.2 Create Package Configuration**

**Create `packages/database/package.json`:**

```json
{
  "name": "@tbi/database",
  "version": "1.0.0",
  "description": "Database package for TheBrainyInsights",
  "main": "src/client.ts",
  "types": "src/client.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "prisma migrate deploy",
    "db:seed": "tsx src/seed.ts",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "prisma": "^5.7.0",
    "mysql2": "^3.6.5"
  },
  "devDependencies": {
    "tsx": "^4.6.2"
  }
}
```


### **3.3 Initialize Database**

**Run these commands in sequence:**

```bash
# Generate Prisma client
cd packages/database
pnpm install
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name init_database_schema

# Verify connection
npx prisma db push --accept-data-loss
```


***

# 🎯 **TASK 4: INTEGRATION WITH NEXT.JS APP**

## **Duration: 3 hours | Priority: High**

### **4.1 Create Database Service Layer**

**Create `src/lib/db/services/category-service.ts`:**

```typescript
import { prisma } from '@tbi/database'
import { Category, CategoryTranslation } from '@tbi/database/src/generated/client'

export interface LocalizedCategory extends Category {
  translations?: CategoryTranslation[]
  isTranslated?: boolean
  currentLocale?: string
}

export class CategoryService {
  
  // Get category by ID with translation
  static async getById(
    id: string, 
    locale = 'en'
  ): Promise<LocalizedCategory | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          translations: locale !== 'en' ? {
            where: { locale }
          } : false
        }
      })

      if (!category) return null

      // If translation exists, merge it
      if (locale !== 'en' && category.translations && category.translations.length > 0) {
        const translation = category.translations[^0]
        return {
          ...category,
          title: translation.title,
          description: translation.description,
          slug: translation.slug,
          isTranslated: true,
          currentLocale: locale
        }
      }

      return {
        ...category,
        isTranslated: locale === 'en',
        currentLocale: locale
      }
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }

  // Get category by slug with translation
  static async getBySlug(
    slug: string, 
    locale = 'en'
  ): Promise<LocalizedCategory | null> {
    try {
      let category: any

      if (locale === 'en') {
        category = await prisma.category.findUnique({
          where: { slug }
        })
      } else {
        // Look for translation first, then fall back to English
        const translation = await prisma.categoryTranslation.findFirst({
          where: { slug, locale },
          include: { category: true }
        })

        if (translation) {
          category = {
            ...translation.category,
            title: translation.title,
            description: translation.description,
            slug: translation.slug,
            isTranslated: true
          }
        } else {
          // Fallback to English
          category = await prisma.category.findUnique({
            where: { slug }
          })
          if (category) {
            category.isTranslated = false
          }
        }
      }

      return category ? { ...category, currentLocale: locale } : null
    } catch (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }
  }

  // Get all categories with translations
  static async getAll(
    locale = 'en', 
    filters: {
      featured?: boolean
      status?: 'ACTIVE' | 'INACTIVE'
      limit?: number
      offset?: number
    } = {}
  ): Promise<LocalizedCategory[]> {
    try {
      const { featured, status = 'ACTIVE', limit = 50, offset = 0 } = filters

      const categories = await prisma.category.findMany({
        where: {
          status,
          ...(featured !== undefined && { featured })
        },
        include: {
          translations: locale !== 'en' ? {
            where: { locale }
          } : false,
          _count: {
            select: {
              reports: {
                where: { status: 'ACTIVE' }
              }
            }
          }
        },
        orderBy: [
          { featured: 'desc' },
          { updatedAt: 'desc' }
        ],
        skip: offset,
        take: limit
      })

      return categories.map(category => {
        const translation = category.translations?.[^0]
        
        return {
          ...category,
          ...(translation && {
            title: translation.title,
            description: translation.description,
            slug: translation.slug
          }),
          isTranslated: !!translation || locale === 'en',
          currentLocale: locale,
          reportCount: category._count.reports
        }
      })
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Create category
  static async create(data: {
    shortcode: string
    title: string
    description?: string
    icon?: string
    featured?: boolean
  }): Promise<Category | null> {
    try {
      return await prisma.category.create({
        data: {
          shortcode: data.shortcode,
          title: data.title,
          description: data.description,
          slug: this.generateSlug(data.title),
          icon: data.icon,
          featured: data.featured || false
        }
      })
    } catch (error) {
      console.error('Error creating category:', error)
      return null
    }
  }

  // Update category
  static async update(
    id: string, 
    data: Partial<{
      title: string
      description: string
      icon: string
      featured: boolean
      status: 'ACTIVE' | 'INACTIVE'
    }>
  ): Promise<Category | null> {
    try {
      const updateData: any = { ...data }
      
      if (data.title) {
        updateData.slug = this.generateSlug(data.title)
      }

      return await prisma.category.update({
        where: { id },
        data: updateData
      })
    } catch (error) {
      console.error('Error updating category:', error)
      return null
    }
  }

  // Create or update translation
  static async saveTranslation(
    categoryId: string,
    locale: string,
    data: {
      title: string
      description?: string
    }
  ): Promise<CategoryTranslation | null> {
    try {
      return await prisma.categoryTranslation.upsert({
        where: {
          categoryId_locale: {
            categoryId,
            locale
          }
        },
        update: {
          title: data.title,
          description: data.description,
          slug: this.generateSlug(data.title)
        },
        create: {
          categoryId,
          locale,
          title: data.title,
          description: data.description,
          slug: this.generateSlug(data.title)
        }
      })
    } catch (error) {
      console.error('Error saving category translation:', error)
      return null
    }
  }

  // Utility function
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  }
}
```


### **4.2 Create Report Service**

**Create `src/lib/db/services/report-service.ts`:**

```typescript
import { prisma } from '@tbi/database'
import { Report, ReportTranslation, Category } from '@tbi/database/src/generated/client'

export interface LocalizedReport extends Report {
  category?: Category | null
  translations?: ReportTranslation[]
  isTranslated?: boolean
  currentLocale?: string
}

export class ReportService {
  
  // Get report by ID with translation
  static async getById(
    id: string, 
    locale = 'en'
  ): Promise<LocalizedReport | null> {
    try {
      const report = await prisma.report.findUnique({
        where: { id },
        include: {
          category: true,
          translations: locale !== 'en' ? {
            where: { locale }
          } : false,
          faqs: {
            where: { locale },
            orderBy: { sortOrder: 'asc' }
          }
        }
      })

      if (!report) return null

      // Apply translation if available
      if (locale !== 'en' && report.translations && report.translations.length > 0) {
        const translation = report.translations[^0]
        return {
          ...report,
          title: translation.title,
          description: translation.description,
          toc: translation.toc,
          tof: translation.tof,
          segmentation: translation.segmentation,
          companies: translation.companies,
          types: translation.types,
          applications: translation.applications,
          metaTitle: translation.metaTitle,
          metaKeyword: translation.metaKeyword,
          metaDescription: translation.metaDescription,
          slug: translation.slug,
          isTranslated: true,
          currentLocale: locale
        }
      }

      return {
        ...report,
        isTranslated: locale === 'en',
        currentLocale: locale
      }
    } catch (error) {
      console.error('Error fetching report:', error)
      return null
    }
  }

  // Get report by slug with translation
  static async getBySlug(
    slug: string, 
    locale = 'en'
  ): Promise<LocalizedReport | null> {
    try {
      let report: any

      if (locale === 'en') {
        report = await prisma.report.findUnique({
          where: { slug },
          include: {
            category: true,
            faqs: {
              where: { locale },
              orderBy: { sortOrder: 'asc' }
            }
          }
        })
      } else {
        // Look for translation first
        const translation = await prisma.reportTranslation.findFirst({
          where: { 
            slug, 
            locale,
            translationStatus: 'PUBLISHED'
          },
          include: { 
            report: {
              include: {
                category: true,
                faqs: {
                  where: { locale },
                  orderBy: { sortOrder: 'asc' }
                }
              }
            }
          }
        })

        if (translation) {
          report = {
            ...translation.report,
            title: translation.title,
            description: translation.description,
            toc: translation.toc,
            tof: translation.tof,
            segmentation: translation.segmentation,
            companies: translation.companies,
            types: translation.types,
            applications: translation.applications,
            metaTitle: translation.metaTitle,
            metaKeyword: translation.metaKeyword,
            metaDescription: translation.metaDescription,
            slug: translation.slug,
            isTranslated: true
          }
        } else {
          // Fallback to English
          report = await prisma.report.findUnique({
            where: { slug },
            include: {
              category: true,
              faqs: {
                where: { locale: 'en' },
                orderBy: { sortOrder: 'asc' }
              }
            }
          })
          if (report) {
            report.isTranslated = false
          }
        }
      }

      return report ? { ...report, currentLocale: locale } : null
    } catch (error) {
      console.error('Error fetching report by slug:', error)
      return null
    }
  }

  // Get reports with filters and pagination
  static async getAll(
    locale = 'en',
    filters: {
      categoryId?: string
      featured?: boolean
      status?: 'ACTIVE' | 'INACTIVE'
      search?: string
      priceMin?: number
      priceMax?: number
      publishedAfter?: Date
      limit?: number
      offset?: number
      orderBy?: 'publishedDate' | 'title' | 'price' | 'updatedAt'
      orderDir?: 'asc' | 'desc'
    } = {}
  ): Promise<{
    reports: LocalizedReport[]
    total: number
    hasMore: boolean
  }> {
    try {
      const {
        categoryId,
        featured,
        status = 'ACTIVE',
        search,
        priceMin,
        priceMax,
        publishedAfter,
        limit = 24,
        offset = 0,
        orderBy = 'publishedDate',
        orderDir = 'desc'
      } = filters

      // Build where clause
      const where: any = {
        status,
        ...(categoryId && { categoryId }),
        ...(featured !== undefined && { featured }),
        ...(publishedAfter && { publishedDate: { gte: publishedAfter } }),
        ...(priceMin !== undefined && { price: { gte: priceMin } }),
        ...(priceMax !== undefined && { price: { lte: priceMax } }),
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { keywords: { contains: search } }
          ]
        })
      }

      // Get total count
      const total = await prisma.report.count({ where })

      // Get reports
      const reports = await prisma.report.findMany({
        where,
        include: {
          category: true,
          translations: locale !== 'en' ? {
            where: { 
              locale,
              translationStatus: 'PUBLISHED'
            }
          } : false
        },
        orderBy: { [orderBy]: orderDir },
        skip: offset,
        take: limit
      })

      // Apply translations
      const localizedReports = reports.map(report => {
        const translation = report.translations?.[^0]
        
        return {
          ...report,
          ...(translation && {
            title: translation.title,
            description: translation.description,
            slug: translation.slug,
            metaTitle: translation.metaTitle,
            metaDescription: translation.metaDescription
          }),
          isTranslated: !!translation || locale === 'en',
          currentLocale: locale
        }
      })

      return {
        reports: localizedReports,
        total,
        hasMore: offset + limit < total
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      return {
        reports: [],
        total: 0,
        hasMore: false
      }
    }
  }

  // Search reports
  static async search(
    query: string,
    locale = 'en',
    filters: {
      categoryId?: string
      limit?: number
    } = {}
  ): Promise<LocalizedReport[]> {
    try {
      const { categoryId, limit = 20 } = filters

      const reports = await prisma.report.findMany({
        where: {
          status: 'ACTIVE',
          ...(categoryId && { categoryId }),
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { keywords: { contains: query } },
            { companies: { contains: query } },
            { applications: { contains: query } }
          ]
        },
        include: {
          category: true,
          translations: locale !== 'en' ? {
            where: { 
              locale,
              translationStatus: 'PUBLISHED'
            }
          } : false
        },
        orderBy: [
          { featured: 'desc' },
          { publishedDate: 'desc' }
        ],
        take: limit
      })

      return reports.map(report => {
        const translation = report.translations?.[^0]
        
        return {
          ...report,
          ...(translation && {
            title: translation.title,
            description: translation.description,
            slug: translation.slug
          }),
          isTranslated: !!translation || locale === 'en',
          currentLocale: locale
        }
      })
    } catch (error) {
      console.error('Error searching reports:', error)
      return []
    }
  }
}
```


***

# 🎯 **TASK 5: DATABASE INTEGRATION TESTING**

## **Duration: 2 hours | Priority: High**

### **5.1 Create Database Test Suite**

**Create `scripts/test-database-integration.ts`:**

```typescript
import { testDatabaseConnection, getDatabaseHealth, prisma } from '../packages/database/src/client'
import { CategoryService } from '../src/lib/db/services/category-service'
import { ReportService } from '../src/lib/db/services/report-service'

async function testDatabaseIntegration() {
  console.log('🧪 Starting database integration tests...\n')

  try {
    // Test 1: Connection
    console.log('1️⃣  Testing database connection...')
    const connectionResult = await testDatabaseConnection()
    if (!connectionResult) {
      throw new Error('Database connection failed')
    }

    // Test 2: Health check
    console.log('2️⃣  Testing database health...')
    const health = await getDatabaseHealth()
    console.log('   Database version:', health.version)
    console.log('   Table count:', health.tableCount)
    console.log('   Last migration:', health.lastMigration)
    console.log('   Connected:', health.connected ? '✅' : '❌')

    // Test 3: Category operations
    console.log('\n3️⃣  Testing category operations...')
    
    // Get all categories
    const categories = await CategoryService.getAll('en', { limit: 5 })
    console.log(`   Found ${categories.length} categories`)
    
    if (categories.length > 0) {
      const firstCategory = categories
      console.log(`   First category: ${firstCategory.title}`)
      
      // Test getting by ID
      const categoryById = await CategoryService.getById(firstCategory.id, 'en')
      console.log(`   Get by ID: ${categoryById ? '✅' : '❌'}`)
      
      // Test getting by slug
      const categoryBySlug = await CategoryService.getBySlug(firstCategory.slug, 'en')
      console.log(`   Get by slug: ${categoryBySlug ? '✅' : '❌'}`)
      
      // Test Japanese translation if available
      const categoryJA = await CategoryService.getById(firstCategory.id, 'ja')
      console.log(`   Japanese translation: ${categoryJA?.isTranslated ? '✅' : '📝 (not available)'}`)
    }

    // Test 4: Report operations
    console.log('\n4️⃣  Testing report operations...')
    
    const { reports, total } = await ReportService.getAll('en', { limit: 5 })
    console.log(`   Found ${reports.length} reports (${total} total)`)
    
    if (reports.length > 0) {
      const firstReport = reports[^0]
      console.log(`   First report: ${firstReport.title.substring(0, 50)}...`)
      
      // Test getting by ID
      const reportById = await ReportService.getById(firstReport.id, 'en')
      console.log(`   Get by ID: ${reportById ? '✅' : '❌'}`)
      
      // Test getting by slug
      const reportBySlug = await ReportService.getBySlug(firstReport.slug, 'en')
      console.log(`   Get by slug: ${reportBySlug ? '✅' : '❌'}`)
      
      // Test Japanese translation
      const reportJA = await ReportService.getById(firstReport.id, 'ja')
      console.log(`   Japanese translation: ${reportJA?.isTranslated ? '✅' : '📝 (not available)'}`)
      
      // Test search
      const searchResults = await ReportService.search('market', 'en', { limit: 3 })
      console.log(`   Search results: ${searchResults.length} found`)
    }

    // Test 5: Raw query test
    console.log('\n5️⃣  Testing raw queries...')
    
    const categoryCount = await prisma.category.count({
      where: { status: 'ACTIVE' }
    })
    console.log(`   Active categories: ${categoryCount}`)
    
    const reportCount = await prisma.report.count({
      where: { status: 'ACTIVE' }
    })
    console.log(`   Active reports: ${reportCount}`)
    
    const translationCount = await prisma.reportTranslation.count({
      where: { locale: 'ja' }
    })
    console.log(`   Japanese report translations: ${translationCount}`)

    console.log('\n✅ All database integration tests passed!')
    
    return {
      success: true,
      stats: {
        categories: categoryCount,
        reports: reportCount,
        translations: translationCount
      }
    }

  } catch (error) {
    console.error('\n❌ Database integration test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  } finally {
    await prisma.$disconnect()
  }
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Running performance tests...')
  
  const startTime = Date.now()
  
  // Test concurrent queries
  const promises = [
    CategoryService.getAll('en', { limit: 10 }),
    ReportService.getAll('en', { limit: 10 }),
    CategoryService.getAll('ja', { limit: 10 }),
    ReportService.getAll('ja', { limit: 10 })
  ]
  
  await Promise.all(promises)
  
  const endTime = Date.now()
  const duration = endTime - startTime
  
  console.log(`   Concurrent queries completed in ${duration}ms`)
  console.log(`   Performance: ${duration < 1000 ? '✅ Good' : duration < 2000 ? '⚠️  Acceptable' : '❌ Slow'}`)
  
  return duration
}

// Main execution
async function main() {
  const testResult = await testDatabaseIntegration()
  
  if (testResult.success) {
    await performanceTest()
    
    console.log('\n📊 Integration Summary:')
    console.log('='.repeat(40))
    console.log(`Categories: ${testResult.stats?.categories}`)
    console.log(`Reports: ${testResult.stats?.reports}`) 
    console.log(`Translations: ${testResult.stats?.translations}`)
    console.log('='.repeat(40))
    
    process.exit(0)
  } else {
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { testDatabaseIntegration, performanceTest }
```


### **5.2 Create Integration Scripts**

**Create `package.json` scripts (add to root package.json):**

```json
{
  "scripts": {
    "db:generate": "cd packages/database && pnpm db:generate",
    "db:migrate": "cd packages/database && pnpm db:migrate",
    "db:push": "cd packages/database && pnpm db:push",
    "db:studio": "cd packages/database && pnpm db:studio",
    "db:test": "tsx scripts/test-database-integration.ts",
    "db:migrate-legacy": "tsx scripts/migration/01-migrate-categories.ts && tsx scripts/migration/02-migrate-reports.ts",
    "db:health": "tsx -e \"import { getDatabaseHealth } from './packages/database/src/client'; getDatabaseHealth().then(console.log)\""
  }
}
```


***

# 🎯 **TASK 6: UPDATE EXISTING PAGES**

## **Duration: 2 hours | Priority: Medium**

### **6.1 Update Homepage to Use Database**

**Update `src/app/[locale]/page.tsx`:**

```typescript
import { notFound } from 'next/navigation'
import { CategoryService } from '@/lib/db/services/category-service'
import { ReportService } from '@/lib/db/services/report-service'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

const SUPPORTED_LOCALES = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko']

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  return generateSEOMetadata({
    title: 'TheBrainyInsights - Market Research & Business Intelligence Platform',
    description: 'Leading global platform for comprehensive market research reports, industry analysis, and business intelligence across 200+ industries.',
    keywords: ['market research', 'business intelligence', 'industry reports', 'market analysis'],
    locale: locale as any,
    canonicalUrl: `https://thebrainyinsights.com/${locale}`
  })
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale)) {
    notFound()
  }

  // Fetch data from database
  const [featuredCategories, featuredReports] = await Promise.all([
    CategoryService.getAll(locale, { 
      featured: true, 
      limit: 6 
    }),
    ReportService.getAll(locale, { 
      featured: true, 
      limit: 8 
    })
  ])

  const stats = {
    totalReports: await prisma.report.count({ where: { status: 'ACTIVE' } }),
    totalCategories: await prisma.category.count({ where: { status: 'ACTIVE' } }),
    totalLanguages: SUPPORTED_LOCALES.length
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              TheBrainyInsights
              <span className="block text-2xl md:text-3xl lg:text-4xl text-blue-200 mt-2">
                Market Research Platform
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              Access comprehensive market research reports with AI-powered insights, 
              multilingual support, and real-time business intelligence across {stats.totalCategories}+ industries.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">{stats.totalReports.toLocaleString()}</div>
                <div className="text-blue-100">Reports</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">{stats.totalCategories}+</div>
                <div className="text-blue-100">Industries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-200">{stats.totalLanguages}</div>
                <div className="text-blue-100">Languages</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`/${locale}/reports`}
                className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
              >
                Browse Reports
              </a>
              <a 
                href={`/${locale}/categories`}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors text-lg"
              >
                Explore Industries
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Industry Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive market research across key industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <a
                key={category.id}
                href={`/${locale}/category/${category.slug}`}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="flex items-center mb-4">
                  {category.icon && (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>
                </div>
                {category.description && (
                  <p className="text-gray-600 mb-4">
                    {category.description.substring(0, 120)}...
                  </p>
                )}
                <div className="text-sm text-blue-600 font-medium">
                  {category.reportCount || 0} reports available →
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={`/${locale}/categories`}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Categories
            </a>
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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recently published market research with comprehensive analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {featuredReports.reports.slice(0, 8).map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {report.category?.title}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    <a 
                      href={`/${locale}/report/${report.slug}`}
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
                        {report.price ? `$${report.price.toLocaleString()}` : 'Contact us'}
                      </div>
                    </div>
                    <a
                      href={`/${locale}/report/${report.slug}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      View Report
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href={`/${locale}/reports`}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Reports
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

// Import the prisma client for stats query
import { prisma } from '@tbi/database'
```


***

# 📋 **SPRINT 1 EXECUTION CHECKLIST**

## **Day 1 (4 hours)**

- [ ] **Setup Prisma \& Dependencies** (1 hour)
    - [ ] Install packages: `pnpm add prisma @prisma/client mysql2`
    - [ ] Create environment variables
    - [ ] Set up project structure
- [ ] **Create Enhanced Schema** (3 hours)
    - [ ] Copy `schema.prisma` with all models
    - [ ] Run `npx prisma generate`
    - [ ] Run `npx prisma migrate dev --name init_schema`
    - [ ] Verify database structure


## **Day 2 (4 hours)**

- [ ] **Build Migration System** (3 hours)
    - [ ] Create `LegacyMigrator` class
    - [ ] Implement category migration
    - [ ] Implement report migration
    - [ ] Test migration scripts
- [ ] **Database Integration** (1 hour)
    - [ ] Create database client
    - [ ] Create service layer
    - [ ] Test connections


## **Day 3 (4 hours)**

- [ ] **Service Layer Development** (3 hours)
    - [ ] Complete `CategoryService`
    - [ ] Complete `ReportService`
    - [ ] Add error handling
- [ ] **Integration Testing** (1 hour)
    - [ ] Run database tests
    - [ ] Verify translations work
    - [ ] Check performance


## **Day 4 (4 hours)**

- [ ] **Application Integration** (3 hours)
    - [ ] Update homepage with database
    - [ ] Test all pages load
    - [ ] Verify translation fallbacks
- [ ] **Final Testing \& Documentation** (1 hour)
    - [ ] Run full test suite
    - [ ] Document any issues
    - [ ] Prepare for Sprint 2


## **SUCCESS CRITERIA**

- ✅ Database schema deployed successfully
- ✅ Legacy data migrated (categories + reports)
- ✅ Translation system working with fallbacks
- ✅ Services layer functional
- ✅ Homepage showing real data
- ✅ Performance under 2 seconds page load
- ✅ No database connection errors


## **ROLLBACK PLAN**

If issues occur:

1. Backup current database: `mysqldump tbi_db > backup.sql`
2. Restore previous state: `mysql tbi_db < backup.sql`
3. Document errors in GitHub issues
4. Proceed with debugging

***

**This Sprint 1 plan provides everything you need to establish a solid database foundation. Execute each task sequentially and verify success before moving to the next phase. Ready to start? 🚀**

<div style="text-align: center">⁂</div>

[^1]: image.jpg

[^2]: WhatsApp-Image-2025-08-17-at-06.43.24_f1c1d95c.jpg

[^3]: image.jpg

[^4]: tbi_db.sql

