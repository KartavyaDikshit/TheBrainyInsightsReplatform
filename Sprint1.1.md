<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# 🚀 **SPRINT 1: POSTGRESQL FOUNDATION \& ARCHITECTURE**

## **Timeline: Week 1-2 (20 hours) | Ultimate Database Foundation**


***

## 📊 **POSTGRESQL ARCHITECTURE ANALYSIS**

### **Why PostgreSQL is Perfect for Your Use Case**

**✅ Advanced Features for Market Research Platform:**

- **JSONB Support**: Perfect for AI-generated content, flexible metadata, and multilingual data
- **Full-Text Search**: Built-in advanced search with ranking, stemming, and multi-language support
- **GIN/GiST Indexes**: Optimized for complex queries on JSON data and text search
- **Row-Level Security**: Essential for multi-tenant admin system
- **Extensions Ecosystem**: pg_trgm for fuzzy search, uuid-ossp for distributed IDs
- **Vector Extensions**: Future-ready for AI embeddings and semantic search

**✅ SEO \& Performance Advantages:**

- **Materialized Views**: For lightning-fast report aggregations
- **Partial Indexes**: For status-specific queries (active reports, featured content)
- **JSONB Aggregations**: For complex multilingual content queries
- **Window Functions**: For advanced analytics and reporting

***

# 🏗️ **TASK 1: POSTGRESQL DOCKER SETUP**

## **Duration: 2 hours | Priority: Critical**

### **1.1 Complete Docker Environment**

**Create `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: tbi_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: tbi_db
      POSTGRES_USER: tbi_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init:/docker-entrypoint-initdb.d
      - ./docker/postgres/config/postgresql.conf:/etc/postgresql/postgresql.conf
    command: postgres -c config_file=/etc/postgresql/postgresql.conf
    networks:
      - tbi_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tbi_user -d tbi_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis for Caching & Sessions
  redis:
    image: redis:7-alpine
    container_name: tbi_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./docker/redis/redis.conf:/usr/local/etc/redis/redis.conf
    command: redis-server /usr/local/etc/redis/redis.conf
    networks:
      - tbi_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Elasticsearch for Advanced Search (Optional)
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: tbi_elasticsearch
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - tbi_network
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

  # Next.js Application (Development)
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: tbi_app
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://tbi_user:${DB_PASSWORD}@postgres:5432/tbi_db
      - REDIS_URL=redis://redis:6379
      - ELASTICSEARCH_URL=http://elasticsearch:9200
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - tbi_network

  # PgAdmin for Database Management
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: tbi_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@thebrainyinsights.com
      PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - tbi_network

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  elasticsearch_data:
    driver: local
  pgadmin_data:
    driver: local

networks:
  tbi_network:
    driver: bridge
```


### **1.2 PostgreSQL Configuration**

**Create `docker/postgres/config/postgresql.conf`:**

```conf
# PostgreSQL Configuration for TheBrainyInsights
# Optimized for market research platform with multilingual content

# Connection Settings
listen_addresses = '*'
port = 5432
max_connections = 200
superuser_reserved_connections = 3

# Memory Settings (adjust based on available RAM)
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# WAL Settings
wal_level = replica
max_wal_size = 1GB
min_wal_size = 80MB
checkpoint_completion_target = 0.9

# Query Tuning
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_min_messages = warning
log_min_error_statement = error
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# Full Text Search Configuration
default_text_search_config = 'pg_catalog.english'

# JSON Optimization
gin_pending_list_limit = 4MB

# Locale and Character Set
lc_messages = 'en_US.UTF-8'
lc_monetary = 'en_US.UTF-8'
lc_numeric = 'en_US.UTF-8'
lc_time = 'en_US.UTF-8'
default_text_search_config = 'pg_catalog.english'

# Extensions
shared_preload_libraries = 'pg_stat_statements'
```


### **1.3 Database Initialization Scripts**

**Create `docker/postgres/init/01-extensions.sql`:**

```sql
-- Enable required extensions for TheBrainyInsights
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create custom types
CREATE TYPE content_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE admin_role AS ENUM ('SUPERADMIN', 'MANAGER', 'EDITOR', 'ANALYST');
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');
CREATE TYPE license_type AS ENUM ('SINGLE', 'MULTIPLE', 'CORPORATE', 'ENTERPRISE');
CREATE TYPE enquiry_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED');
CREATE TYPE translation_status AS ENUM ('PENDING', 'IN_PROGRESS', 'REVIEW', 'APPROVED', 'PUBLISHED');
CREATE TYPE ai_generation_status AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- Create function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function for full-text search
CREATE OR REPLACE FUNCTION create_search_vector(title TEXT, description TEXT, keywords TEXT DEFAULT '')
RETURNS tsvector AS $$
BEGIN
    RETURN to_tsvector('english', 
        COALESCE(title, '') || ' ' || 
        COALESCE(description, '') || ' ' || 
        COALESCE(keywords, '')
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function for slug generation
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT, max_length INTEGER DEFAULT 100)
RETURNS TEXT AS $$
BEGIN
    RETURN substring(
        lower(
            regexp_replace(
                regexp_replace(
                    unaccent(trim(input_text)), 
                    '[^a-zA-Z0-9\s\-_]', '', 'g'
                ), 
                '\s+', '-', 'g'
            )
        ), 
        1, 
        max_length
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```


***

# 🎯 **TASK 2: OPTIMIZED POSTGRESQL SCHEMA**

## **Duration: 4 hours | Priority: Critical**

### **2.1 Core Content Schema with Advanced Features**

**Create `packages/database/prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ================================================================
// CORE CONTENT MODELS WITH MULTILINGUAL SUPPORT
// ================================================================

model Category {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  shortcode   String   @unique @db.VarChar(16)
  slug        String   @unique @db.VarChar(128)
  icon        String?  @db.VarChar(64)
  featured    Boolean  @default(false)
  status      ContentStatus @default(PUBLISHED)
  sortOrder   Int      @default(0) @map("sort_order")
  
  // SEO and metadata
  seoMetadata Json?    @map("seo_metadata") @db.JsonB
  
  // Analytics
  viewCount   BigInt   @default(0) @map("view_count")
  
  // Base language content (English)
  title       String   @db.VarChar(255)
  description String?  @db.Text
  searchVector Unsupported("tsvector")? @map("search_vector")
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz
  publishedAt DateTime? @map("published_at") @db.Timestamptz

  // Relationships
  translations CategoryTranslation[]
  reports      Report[]
  blogs        Blog[]
  press        Press[]
  media        Media[]

  // Indexes
  @@index([status, featured, sortOrder])
  @@index([shortcode])
  @@index([searchVector], type: Gin)
  @@map("categories")
}

model CategoryTranslation {
  id          String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId  String @map("category_id") @db.Uuid
  locale      String @db.VarChar(5)
  
  // Translated content
  title       String @db.VarChar(255)
  description String? @db.Text
  slug        String @db.VarChar(128)
  
  // SEO for this locale
  seoMetadata Json?  @map("seo_metadata") @db.JsonB
  
  // Translation workflow
  status      TranslationStatus @default(PENDING)
  translatedBy String? @map("translated_by") @db.Uuid
  reviewedBy   String? @map("reviewed_by") @db.Uuid
  
  // Search
  searchVector Unsupported("tsvector")? @map("search_vector")
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz
  
  // Relations
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([categoryId, locale])
  @@index([locale])
  @@index([slug])
  @@index([status])
  @@index([searchVector], type: Gin)
  @@map("category_translations")
}

model Report {
  id              String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId      String?   @map("category_id") @db.Uuid
  adminId         String?   @map("admin_id") @db.Uuid
  
  // Unique identifiers
  sku             String?   @unique @db.VarChar(32)
  slug            String    @unique @db.VarChar(255)
  
  // Report metadata
  reportType      String?   @map("report_type") @db.VarChar(50) // Market Analysis, Industry Report, etc.
  industryTags    String[]  @map("industry_tags") @db.VarChar(50)
  regions         String[]  @db.VarChar(50) // Geographic coverage
  
  // Publication info
  publishedDate   DateTime  @map("published_date") @db.Date
  pages           Int       @default(0)
  baseYear        Int?      @map("base_year")
  forecastPeriod  String?   @map("forecast_period") @db.VarChar(50)
  
  // Files and links
  reportLink      String?   @map("report_link") @db.VarChar(500)
  sampleLink      String?   @map("sample_link") @db.VarChar(500)
  thumbnail       String?   @db.VarChar(500)
  
  // Ratings and reviews
  avgRating       Decimal?  @map("avg_rating") @db.Decimal(3,2)
  totalReviews    Int       @default(0) @map("total_reviews")
  
  // Status and visibility
  featured        Boolean   @default(false)
  status          ContentStatus @default(DRAFT)
  priority        Int       @default(0) // For homepage featuring
  
  // Analytics
  viewCount       BigInt    @default(0) @map("view_count")
  downloadCount   BigInt    @default(0) @map("download_count")
  enquiryCount    BigInt    @default(0) @map("enquiry_count")
  
  // Base language content (English)
  title           String    @db.VarChar(500)
  description     String    @db.Text
  summary         String?   @db.Text // Executive summary
  toc             String?   @map("table_of_contents") @db.Text
  methodology     String?   @db.Text
  keyFindings     String[]  @map("key_findings") @db.Text
  
  // Market data (structured)
  marketSize      Json?     @map("market_size") @db.JsonB // Historical and forecast data
  keyPlayers      Json?     @map("key_players") @db.JsonB // Company profiles
  marketSegments  Json?     @map("market_segments") @db.JsonB
  
  // SEO and keywords
  keywords        String[]  @db.VarChar(100)
  seoMetadata     Json?     @map("seo_metadata") @db.JsonB
  
  // Full-text search
  searchVector    Unsupported("tsvector")? @map("search_vector")

  // Pricing (USD)
  singleUserPrice Decimal?  @map("single_user_price") @db.Decimal(10,2)
  multiUserPrice  Decimal?  @map("multi_user_price") @db.Decimal(10,2)
  corporatePrice  Decimal?  @map("corporate_price") @db.Decimal(10,2)
  enterprisePrice Decimal?  @map("enterprise_price") @db.Decimal(10,2)

  // Timestamps
  createdAt       DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime  @updatedAt @map("updated_at") @db.Timestamptz
  publishedAt     DateTime? @map("published_at") @db.Timestamptz

  // Relationships
  category      Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  admin         Admin?    @relation(fields: [adminId], references: [id], onDelete: SetNull)
  translations  ReportTranslation[]
  faqs          FAQ[]
  enquiries     Enquiry[]
  requests      Request[]
  orderItems    OrderItem[]
  reviews       ReportReview[]
  aiGeneration  AIContentGeneration[]

  // Indexes for performance
  @@index([categoryId, status, featured])
  @@index([publishedDate])
  @@index([sku])
  @@index([slug])
  @@index([status, priority])
  @@index([industryTags], type: Gin)
  @@index([regions], type: Gin)
  @@index([keywords], type: Gin)
  @@index([searchVector], type: Gin)
  @@index([avgRating, totalReviews])
  @@map("reports")
}

model ReportTranslation {
  id              String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId        String @map("report_id") @db.Uuid
  locale          String @db.VarChar(5)
  
  // Translated content
  title           String @db.VarChar(500)
  description     String @db.Text
  summary         String? @db.Text
  toc             String? @map("table_of_contents") @db.Text
  methodology     String? @db.Text
  keyFindings     String[] @map("key_findings") @db.Text
  slug            String @db.VarChar(255)
  
  // Localized market data
  marketSize      Json?   @map("market_size") @db.JsonB
  keyPlayers      Json?   @map("key_players") @db.JsonB
  marketSegments  Json?   @map("market_segments") @db.JsonB
  
  // SEO for this locale
  keywords        String[] @db.VarChar(100)
  seoMetadata     Json?   @map("seo_metadata") @db.JsonB
  
  // Translation workflow
  status          TranslationStatus @default(PENDING)
  translatedBy    String? @map("translated_by") @db.Uuid
  reviewedBy      String? @map("reviewed_by") @db.Uuid
  
  // AI generation tracking
  aiGenerated     Boolean @default(false) @map("ai_generated")
  aiPrompt        String? @map("ai_prompt") @db.Text
  
  // Search
  searchVector    Unsupported("tsvector")? @map("search_vector")
  
  // Timestamps
  createdAt       DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt       DateTime @updatedAt @map("updated_at") @db.Timestamptz
  publishedAt     DateTime? @map("published_at") @db.Timestamptz

  // Relations
  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)

  // Constraints
  @@unique([reportId, locale])
  @@index([locale])
  @@index([slug])
  @@index([status])
  @@index([searchVector], type: Gin)
  @@index([keywords], type: Gin)
  @@map("report_translations")
}

// ================================================================
// AI CONTENT GENERATION SYSTEM
// ================================================================

model AIContentGeneration {
  id            String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  
  // Content targeting
  contentType   String @map("content_type") @db.VarChar(50) // report, blog, category_desc, etc.
  contentId     String? @map("content_id") @db.Uuid
  locale        String @db.VarChar(5)
  
  // Generation parameters
  prompt        String @db.Text
  model         String @db.VarChar(50) // gpt-4, claude-3, etc.
  temperature   Decimal? @db.Decimal(3,2)
  maxTokens     Int? @map("max_tokens")
  
  // Generation workflow
  status        AIGenerationStatus @default(QUEUED)
  generatedBy   String @map("generated_by") @db.Uuid // Admin who triggered
  reviewedBy    String? @map("reviewed_by") @db.Uuid
  
  // Results
  generatedContent Json? @map("generated_content") @db.JsonB
  tokenUsage       Json? @map("token_usage") @db.JsonB
  error            String? @db.Text
  
  // Metadata
  metadata      Json? @db.JsonB // Additional context, settings, etc.
  
  // Timestamps
  createdAt     DateTime @default(now()) @map("created_at") @db.Timestamptz
  startedAt     DateTime? @map("started_at") @db.Timestamptz
  completedAt   DateTime? @map("completed_at") @db.Timestamptz
  updatedAt     DateTime @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  admin    Admin @relation(fields: [generatedBy], references: [id])
  report   Report? @relation(fields: [contentId], references: [id], onDelete: SetNull)

  // Indexes
  @@index([contentType, status])
  @@index([generatedBy])
  @@index([createdAt])
  @@map("ai_content_generations")
}

// ================================================================
// USER MANAGEMENT MODELS
// ================================================================

model User {
  id          String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email       String     @unique @db.VarChar(255)
  firstName   String?    @map("first_name") @db.VarChar(100)
  lastName    String?    @map("last_name") @db.VarChar(100)
  phone       String?    @db.VarChar(20)
  
  // Authentication
  password    String?    @db.VarChar(255)
  emailVerified Boolean  @default(false) @map("email_verified")
  
  // Profile
  company     String?    @db.VarChar(200)
  jobTitle    String?    @map("job_title") @db.VarChar(100)
  industry    String?    @db.VarChar(100)
  country     String?    @db.VarChar(100)
  timezone    String?    @db.VarChar(50)
  preferredLanguage String? @map("preferred_language") @db.VarChar(5)
  
  // Preferences
  newsletter  Boolean    @default(true)
  marketingEmails Boolean @default(false) @map("marketing_emails")
  preferences Json?      @db.JsonB
  
  // Status
  status      UserStatus @default(PENDING)
  lastLoginAt DateTime?  @map("last_login_at") @db.Timestamptz
  
  // Timestamps
  createdAt   DateTime   @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime   @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  orders      Order[]
  enquiries   Enquiry[]
  requests    Request[]
  reviews     ReportReview[]

  @@index([email])
  @@index([status])
  @@index([country])
  @@index([industry])
  @@map("users")
}

model Admin {
  id           String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email        String     @unique @db.VarChar(255)
  username     String     @unique @db.VarChar(100)
  
  // Personal info
  firstName    String?    @map("first_name") @db.VarChar(100)
  lastName     String?    @map("last_name") @db.VarChar(100)
  profileImage String?    @map("profile_image") @db.VarChar(500)
  
  // Authentication
  password     String     @db.VarChar(255)
  role         AdminRole
  permissions  String[]   @db.VarChar(50) // granular permissions
  
  // Status
  status       ContentStatus @default(DRAFT)
  lastLoginAt  DateTime?  @map("last_login_at") @db.Timestamptz
  
  // Preferences
  preferences  Json?      @db.JsonB
  
  // Timestamps
  createdAt    DateTime   @default(now()) @map("created_at") @db.Timestamptz
  updatedAt    DateTime   @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  reports           Report[]
  aiGenerations     AIContentGeneration[]
  translationsCreated CategoryTranslation[] @relation("TranslatorCreated")
  translationsReviewed CategoryTranslation[] @relation("TranslatorReviewed")

  @@index([email, status])
  @@index([role])
  @@index([username])
  @@map("admins")
}

// ================================================================
// E-COMMERCE MODELS
// ================================================================

model Order {
  id          String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId      String?     @map("user_id") @db.Uuid
  orderNumber String      @unique @map("order_number") @db.VarChar(50)
  
  // Amounts
  subtotal    Decimal     @db.Decimal(12, 2)
  taxAmount   Decimal     @default(0) @map("tax_amount") @db.Decimal(12, 2)
  discount    Decimal     @default(0) @db.Decimal(12, 2)
  total       Decimal     @db.Decimal(12, 2)
  currency    String      @default("USD") @db.VarChar(3)
  
  // Payment
  paymentMethod String?   @map("payment_method") @db.VarChar(50)
  paymentStatus String?   @map("payment_status") @db.VarChar(50)
  transactionId String?   @map("transaction_id") @db.VarChar(100)
  paymentMetadata Json?   @map("payment_metadata") @db.JsonB
  
  // Customer info (for guest orders)
  customerEmail String?   @map("customer_email") @db.VarChar(255)
  customerName  String?   @map("customer_name") @db.VarChar(200)
  customerPhone String?   @map("customer_phone") @db.VarChar(20)
  
  // Billing address
  billingAddress Json?    @map("billing_address") @db.JsonB
  
  // Order status
  status      OrderStatus @default(PENDING)
  notes       String?     @db.Text
  
  // Fulfillment
  fulfillmentEmail String? @map("fulfillment_email") @db.VarChar(255)
  fulfilledAt      DateTime? @map("fulfilled_at") @db.Timestamptz
  
  // Timestamps
  createdAt   DateTime    @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime    @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  user       User?       @relation(fields: [userId], references: [id])
  items      OrderItem[]

  @@index([userId])
  @@index([status, createdAt])
  @@index([customerEmail])
  @@index([orderNumber])
  @@map("orders")
}

model OrderItem {
  id       String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  orderId  String      @map("order_id") @db.Uuid
  reportId String      @map("report_id") @db.Uuid
  
  // Item details
  license  LicenseType
  price    Decimal     @db.Decimal(10, 2)
  quantity Int         @default(1)
  
  // Snapshot of report info at time of purchase
  reportSnapshot Json  @map("report_snapshot") @db.JsonB

  // Relations
  order  Order  @relation(fields: [orderId], references: [id], onDelete: Cascade)
  report Report @relation(fields: [reportId], references: [id])

  @@index([orderId])
  @@index([reportId])
  @@map("order_items")
}

// ================================================================
// CUSTOMER ENGAGEMENT MODELS
// ================================================================

model Enquiry {
  id        String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId  String?       @map("report_id") @db.Uuid
  
  // Contact info
  firstName String        @map("first_name") @db.VarChar(100)
  lastName  String?       @map("last_name") @db.VarChar(100)
  email     String        @db.VarChar(255)
  phone     String?       @db.VarChar(20)
  company   String?       @db.VarChar(200)
  jobTitle  String?       @map("job_title") @db.VarChar(100)
  country   String?       @db.VarChar(100)
  
  // Enquiry details
  enquiryType String?     @map("enquiry_type") @db.VarChar(50) // sample, custom, pricing, etc.
  message     String?     @db.Text
  urgency     String?     @db.VarChar(20) // low, medium, high
  
  // Lead qualification
  status      EnquiryStatus @default(NEW)
  source      String?     @db.VarChar(50) // website, email, phone, etc.
  assignedTo  String?     @map("assigned_to") @db.Uuid
  
  // Follow-up
  followUpDate DateTime?  @map("follow_up_date") @db.Timestamptz
  notes        String?    @db.Text
  
  // Timestamps
  createdAt   DateTime    @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime    @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  report Report? @relation(fields: [reportId], references: [id])

  @@index([reportId, status])
  @@index([email])
  @@index([status, createdAt])
  @@index([assignedTo])
  @@map("enquiries")
}

model Request {
  id          String        @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId    String?       @map("report_id") @db.Uuid
  
  // Contact details
  fullName    String        @map("full_name") @db.VarChar(200)
  email       String        @db.VarChar(255)
  phone       String?       @db.VarChar(20)
  company     String?       @db.VarChar(200)
  designation String?       @db.VarChar(100)
  country     String?       @db.VarChar(100)
  
  // Request details
  requestType String?       @map("request_type") @db.VarChar(50)
  description String?       @db.Text
  customRequirements Json?  @map("custom_requirements") @db.JsonB
  
  // Processing
  status      EnquiryStatus @default(NEW)
  priority    Int           @default(0)
  assignedTo  String?       @map("assigned_to") @db.Uuid
  
  // Response
  response    String?       @db.Text
  estimatedCost Decimal?    @map("estimated_cost") @db.Decimal(10, 2)
  estimatedDays Int?        @map("estimated_days")
  
  // Timestamps
  createdAt   DateTime      @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime      @updatedAt @map("updated_at") @db.Timestamptz
  respondedAt DateTime?     @map("responded_at") @db.Timestamptz

  // Relations
  report Report? @relation(fields: [reportId], references: [id])

  @@index([reportId, status])
  @@index([email])
  @@index([status, priority])
  @@map("custom_requests")
}

// ================================================================
// CONTENT & SEO MODELS
// ================================================================

model FAQ {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId  String?  @map("report_id") @db.Uuid
  locale    String   @default("en") @db.VarChar(5)
  
  // Content
  question  String   @db.VarChar(500)
  answer    String   @db.Text
  
  // Organization
  category  String?  @db.VarChar(50)
  sortOrder Int      @default(0) @map("sort_order")
  
  // Status
  status    ContentStatus @default(PUBLISHED)
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  report Report? @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@index([reportId, locale, status])
  @@index([category, sortOrder])
  @@map("faqs")
}

model ReportReview {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  reportId  String   @map("report_id") @db.Uuid
  userId    String?  @map("user_id") @db.Uuid
  
  // Review content
  rating    Int      @db.SmallInt // 1-5
  title     String?  @db.VarChar(200)
  content   String?  @db.Text
  
  // Reviewer info (for anonymous reviews)
  reviewerName String? @map("reviewer_name") @db.VarChar(100)
  reviewerEmail String? @map("reviewer_email") @db.VarChar(255)
  reviewerCompany String? @map("reviewer_company") @db.VarChar(200)
  
  // Status
  status    ContentStatus @default(DRAFT)
  featured  Boolean  @default(false)
  verified  Boolean  @default(false)
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  report Report @relation(fields: [reportId], references: [id], onDelete: Cascade)
  user   User?  @relation(fields: [userId], references: [id])

  @@index([reportId, status])
  @@index([userId])
  @@index([rating, featured])
  @@map("report_reviews")
}

// ================================================================
// SUPPORTING MODELS
// ================================================================

model Blog {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId    String?   @map("category_id") @db.Uuid
  slug          String    @unique @db.VarChar(255)
  
  // Content
  title         String    @db.VarChar(300)
  excerpt       String?   @db.VarChar(500)
  content       String    @db.Text
  featuredImage String?   @map("featured_image") @db.VarChar(500)
  
  // SEO
  seoMetadata   Json?     @map("seo_metadata") @db.JsonB
  tags          String[]  @db.VarChar(50)
  
  // Status
  status        ContentStatus @default(DRAFT)
  featured      Boolean   @default(false)
  
  // Analytics
  viewCount     BigInt    @default(0) @map("view_count")
  
  // Timestamps
  publishedDate DateTime? @map("published_date") @db.Timestamptz
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  category     Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  translations BlogTranslation[]

  @@index([categoryId, status, featured])
  @@index([publishedDate])
  @@index([tags], type: Gin)
  @@map("blogs")
}

model BlogTranslation {
  id          String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  blogId      String @map("blog_id") @db.Uuid
  locale      String @db.VarChar(5)
  
  // Translated content
  title       String @db.VarChar(300)
  excerpt     String? @db.VarChar(500)
  content     String @db.Text
  slug        String @db.VarChar(255)
  
  // SEO for this locale
  seoMetadata Json?  @map("seo_metadata") @db.JsonB
  tags        String[] @db.VarChar(50)
  
  // Translation status
  status      TranslationStatus @default(PENDING)
  
  // Timestamps
  createdAt   DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt   DateTime @updatedAt @map("updated_at") @db.Timestamptz

  blog Blog @relation(fields: [blogId], references: [id], onDelete: Cascade)

  @@unique([blogId, locale])
  @@index([locale])
  @@index([slug])
  @@index([tags], type: Gin)
  @@map("blog_translations")
}

model Press {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId    String?   @map("category_id") @db.Uuid
  
  // Content
  title         String    @db.VarChar(300)
  content       String    @db.Text
  slug          String    @unique @db.VarChar(255)
  
  // SEO
  seoMetadata   Json?     @map("seo_metadata") @db.JsonB
  
  // Status
  status        ContentStatus @default(DRAFT)
  
  // Timestamps
  publishedDate DateTime? @map("published_date") @db.Timestamptz
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([categoryId, status])
  @@index([publishedDate])
  @@map("press_releases")
}

model Media {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  categoryId    String?   @map("category_id") @db.Uuid
  
  // Content
  title         String    @db.VarChar(300)
  description   String    @db.Text
  mediaType     String    @map("media_type") @db.VarChar(50) // video, podcast, infographic
  url           String    @db.VarChar(500)
  thumbnailUrl  String?   @map("thumbnail_url") @db.VarChar(500)
  
  // SEO
  seoMetadata   Json?     @map("seo_metadata") @db.JsonB
  
  // Status
  status        ContentStatus @default(DRAFT)
  
  // Timestamps
  publishedDate DateTime? @map("published_date") @db.Timestamptz
  createdAt     DateTime  @default(now()) @map("created_at") @db.Timestamptz
  updatedAt     DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  // Relations
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)

  @@index([categoryId, status])
  @@index([mediaType])
  @@map("media")
}

// ================================================================
// SYSTEM MODELS
// ================================================================

model Country {
  id        String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String @db.VarChar(100)
  code      String @unique @db.VarChar(2) // ISO 3166-1 alpha-2
  code3     String @unique @db.VarChar(3) // ISO 3166-1 alpha-3
  region    String @db.VarChar(50)
  subregion String @db.VarChar(50)
  phoneCode String @map("phone_code") @db.VarChar(10)
  currency  String @db.VarChar(3)
  languages String[] @db.VarChar(5)
  
  // Market data
  marketTier String? @map("market_tier") @db.VarChar(20) // developed, emerging, frontier
  gdp        Decimal? @db.Decimal(15, 2)
  population BigInt?
  
  @@index([region])
  @@index([marketTier])
  @@map("countries")
}

model UrlRedirect {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  sourceUrl String   @map("source_url") @db.VarChar(500)
  targetUrl String   @map("target_url") @db.VarChar(500)
  
  // Redirect type
  statusCode Int     @default(301) @map("status_code") // 301, 302, etc.
  
  // Status
  active    Boolean  @default(true)
  
  // Analytics
  hitCount  BigInt   @default(0) @map("hit_count")
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @updatedAt @map("updated_at") @db.Timestamptz

  @@index([sourceUrl])
  @@index([active])
  @@map("url_redirects")
}

// ================================================================
// ENUMS (defined in init script)
// ================================================================

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
  SCHEDULED
  
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
  ANALYST
  
  @@map("admin_role")
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
  REFUNDED
  
  @@map("order_status")
}

enum LicenseType {
  SINGLE
  MULTIPLE
  CORPORATE
  ENTERPRISE
  
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
  PENDING
  IN_PROGRESS
  REVIEW
  APPROVED
  PUBLISHED
  
  @@map("translation_status")
}

enum AIGenerationStatus {
  QUEUED
  PROCESSING
  COMPLETED
  FAILED
  CANCELLED
  
  @@map("ai_generation_status")
}
```


### **2.2 Advanced PostgreSQL Indexes and Functions**

**Create `docker/postgres/init/02-indexes-and-triggers.sql`:**

```sql
-- Create optimized indexes for TheBrainyInsights platform

-- Categories: Full-text search indexes
CREATE INDEX idx_categories_search_vector_gin 
ON categories USING gin(search_vector);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION update_category_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := create_search_vector(NEW.title, NEW.description);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_search_vector
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_category_search_vector();

-- Category translations search
CREATE INDEX idx_category_translations_search_gin 
ON category_translations USING gin(search_vector);

CREATE OR REPLACE FUNCTION update_category_translation_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := create_search_vector(NEW.title, NEW.description);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_category_translation_search_vector
    BEFORE INSERT OR UPDATE ON category_translations
    FOR EACH ROW EXECUTE FUNCTION update_category_translation_search_vector();

-- Reports: Advanced search indexes
CREATE INDEX idx_reports_search_vector_gin 
ON reports USING gin(search_vector);

CREATE INDEX idx_reports_market_data_gin 
ON reports USING gin(market_size, key_players, market_segments);

-- Complex search function for reports
CREATE OR REPLACE FUNCTION update_report_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.summary, '') || ' ' ||
        COALESCE(array_to_string(NEW.keywords, ' '), '') || ' ' ||
        COALESCE(array_to_string(NEW.industry_tags, ' '), '') || ' ' ||
        COALESCE(array_to_string(NEW.regions, ' '), '') || ' ' ||
        COALESCE(array_to_string(NEW.key_findings, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_report_search_vector
    BEFORE INSERT OR UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_report_search_vector();

-- Report translations search
CREATE INDEX idx_report_translations_search_gin 
ON report_translations USING gin(search_vector);

CREATE OR REPLACE FUNCTION update_report_translation_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector(
        CASE NEW.locale
            WHEN 'de' THEN 'german'
            WHEN 'es' THEN 'spanish'
            WHEN 'fr' THEN 'french'
            WHEN 'it' THEN 'italian'
            WHEN 'ja' THEN 'simple'  -- Japanese not fully supported
            WHEN 'ko' THEN 'simple'  -- Korean not fully supported
            ELSE 'english'
        END,
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.summary, '') || ' ' ||
        COALESCE(array_to_string(NEW.keywords, ' '), '') || ' ' ||
        COALESCE(array_to_string(NEW.key_findings, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_report_translation_search_vector
    BEFORE INSERT OR UPDATE ON report_translations
    FOR EACH ROW EXECUTE FUNCTION update_report_translation_search_vector();

-- Performance indexes for common queries
CREATE INDEX idx_reports_category_status_featured 
ON reports(category_id, status, featured) 
WHERE status = 'PUBLISHED';

CREATE INDEX idx_reports_published_date_desc 
ON reports(published_date DESC) 
WHERE status = 'PUBLISHED';

CREATE INDEX idx_reports_pricing 
ON reports(single_user_price, multi_user_price, corporate_price) 
WHERE status = 'PUBLISHED' AND single_user_price IS NOT NULL;

-- Analytics indexes
CREATE INDEX idx_reports_analytics 
ON reports(view_count, download_count, enquiry_count, avg_rating);

-- User behavior indexes
CREATE INDEX idx_enquiries_timeline 
ON enquiries(created_at DESC, status);

CREATE INDEX idx_orders_analytics 
ON orders(created_at, status, total);

-- Updated_at triggers for all tables
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER set_timestamp_categories
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_category_translations
    BEFORE UPDATE ON category_translations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_reports
    BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_report_translations
    BEFORE UPDATE ON report_translations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_admins
    BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_orders
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_enquiries
    BEFORE UPDATE ON enquiries
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- SEO and analytics functions
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
BEGIN
    SELECT 'TBI' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
           LPAD((EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::INTEGER % 100000)::TEXT, 5, '0')
    INTO new_number;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Advanced search function with ranking
CREATE OR REPLACE FUNCTION search_reports(
    search_query TEXT,
    locale_param VARCHAR(5) DEFAULT 'en',
    category_filter UUID DEFAULT NULL,
    limit_param INTEGER DEFAULT 20,
    offset_param INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title TEXT,
    description TEXT,
    slug TEXT,
    rank REAL,
    category_title TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        COALESCE(rt.title, r.title) as title,
        COALESCE(rt.description, r.description) as description,
        COALESCE(rt.slug, r.slug) as slug,
        ts_rank(
            COALESCE(rt.search_vector, r.search_vector),
            plainto_tsquery('english', search_query)
        ) as rank,
        COALESCE(ct.title, c.title) as category_title
    FROM reports r
    LEFT JOIN report_translations rt ON r.id = rt.report_id AND rt.locale = locale_param AND rt.status = 'PUBLISHED'
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = locale_param
    WHERE 
        r.status = 'PUBLISHED'
        AND (category_filter IS NULL OR r.category_id = category_filter)
        AND (
            r.search_vector @@ plainto_tsquery('english', search_query)
            OR (rt.search_vector IS NOT NULL AND rt.search_vector @@ plainto_tsquery('english', search_query))
        )
    ORDER BY rank DESC
    LIMIT limit_param OFFSET offset_param;
END;
$$ LANGUAGE plpgsql;
```


***

# 🎯 **TASK 3: LEGACY DATA MIGRATION SYSTEM**

## **Duration: 6 hours | Priority: High**

### **3.1 Selective Migration Strategy**

**Create `scripts/postgres-migration/migrate-selective-legacy.ts`:**

```typescript
import { Client } from 'pg'
import mysql from 'mysql2/promise'
import { v4 as uuidv4 } from 'uuid'

interface MigrationConfig {
  legacyMysql: {
    host: string
    user: string
    password: string
    database: string
  }
  postgres: {
    connectionString: string
  }
  limits: {
    categories: number
    reports: number
    users: number
    orders: number
  }
  verbose: boolean
}

interface MigrationStats {
  processed: number
  successful: number
  failed: number
  skipped: number
  errors: string[]
}

export class PostgresMigrator {
  private mysqlConn: mysql.Connection
  private pgClient: Client
  private config: MigrationConfig
  private stats: Record<string, MigrationStats> = {}

  constructor(config: MigrationConfig) {
    this.config = config
    this.pgClient = new Client({ 
      connectionString: config.postgres.connectionString 
    })
  }

  async connect(): Promise<void> {
    try {
      // Connect to legacy MySQL
      this.mysqlConn = await mysql.createConnection({
        host: this.config.legacyMysql.host,
        user: this.config.legacyMysql.user,
        password: this.config.legacyMysql.password,
        database: this.config.legacyMysql.database,
        charset: 'utf8mb4'
      })

      // Connect to PostgreSQL
      await this.pgClient.connect()

      console.log('✅ Connected to both databases')
    } catch (error) {
      console.error('❌ Connection failed:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    await this.mysqlConn?.end()
    await this.pgClient?.end()
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

  // PHASE 1: Migrate Categories (with translations)
  async migrateCategories(): Promise<void> {
    console.log('📂 Starting category migration...')
    this.initStats('categories')

    try {
      // Get top featured categories only
      const [englishCategories] = await this.mysqlConn.execute(`
        SELECT * FROM tbl_category 
        WHERE status = 'Active' AND featured = 'Yes'
        ORDER BY category_id ASC
        LIMIT ?
      `, [this.config.limits.categories]) as [any[], any]

      const [japaneseCategories] = await this.mysqlConn.execute(`
        SELECT * FROM tbl_category_jp 
        WHERE status = 'Active'
      `) as [any[], any]

      // Create mapping
      const japaneseMap = new Map()
      japaneseCategories.forEach((cat: any) => {
        japaneseMap.set(cat.shortcode, cat)
      })

      for (const engCat of englishCategories) {
        try {
          this.stats.categories.processed++

          const categoryId = uuidv4()
          const slug = this.generateSlug(engCat.title)

          // Insert main category
          await this.pgClient.query(`
            INSERT INTO categories (
              id, shortcode, slug, title, description, icon, featured, 
              status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (shortcode) DO NOTHING
          `, [
            categoryId,
            engCat.shortcode,
            slug,
            engCat.title,
            engCat.description,
            engCat.icon,
            true, // Only migrating featured
            'PUBLISHED',
            new Date(engCat.created_at),
            new Date(engCat.updated_at)
          ])

          // Add Japanese translation if available
          const jpCat = japaneseMap.get(engCat.shortcode)
          if (jpCat) {
            await this.pgClient.query(`
              INSERT INTO category_translations (
                id, category_id, locale, title, description, slug, 
                status, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              ON CONFLICT (category_id, locale) DO NOTHING
            `, [
              uuidv4(),
              categoryId,
              'ja',
              jpCat.title,
              jpCat.description,
              this.generateSlug(jpCat.title),
              'PUBLISHED',
              new Date(jpCat.created_at),
              new Date(jpCat.updated_at)
            ])
          }

          this.stats.categories.successful++
          this.logProgress('categories', `✅ Migrated: ${engCat.title}`)

        } catch (error) {
          this.stats.categories.failed++
          this.stats.categories.errors.push(`${engCat.shortcode}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ Category migration failed:', error)
      throw error
    }
  }

  // PHASE 2: Migrate Featured Reports (selective)
  async migrateReports(): Promise<void> {
    console.log('📊 Starting report migration...')
    this.initStats('reports')

    try {
      // Get category mapping first
      const categoryMap = new Map()
      const { rows: categories } = await this.pgClient.query(
        'SELECT id, shortcode FROM categories'
      )
      categories.forEach((cat: any) => {
        categoryMap.set(cat.shortcode, cat.id)
      })

      // Get top reports (featured, recent, high-value)
      const [englishReports] = await this.mysqlConn.execute(`
        SELECT r.*, c.shortcode as category_shortcode 
        FROM tbl_report r 
        LEFT JOIN tbl_category c ON r.category_id = c.category_id 
        WHERE r.status = 'Active' 
        AND (r.featured = 'Yes' OR r.price >= 3000)
        AND r.published_date >= '2023-01-01'
        ORDER BY r.featured DESC, r.published_date DESC
        LIMIT ?
      `, [this.config.limits.reports]) as [any[], any]

      const [japaneseReports] = await this.mysqlConn.execute(`
        SELECT * FROM tbl_report_jp WHERE status = 'Active'
      `) as [any[], any]

      // Create Japanese mapping by SKU
      const japaneseMap = new Map()
      japaneseReports.forEach((report: any) => {
        if (report.sku) {
          japaneseMap.set(report.sku, report)
        }
      })

      for (const engReport of englishReports) {
        try {
          this.stats.reports.processed++

          const reportId = uuidv4()
          const categoryId = categoryMap.get(engReport.category_shortcode)
          const slug = this.generateSlug(engReport.title)

          // Prepare market data
          const marketSize = engReport.segmentation ? {
            overview: engReport.segmentation.substring(0, 500)
          } : null

          const keyPlayers = engReport.companies ? {
            companies: engReport.companies.split(',').slice(0, 10)
          } : null

          // Insert main report
          await this.pgClient.query(`
            INSERT INTO reports (
              id, category_id, sku, slug, title, description, 
              summary, industry_tags, regions, published_date, pages,
              base_year, single_user_price, multi_user_price, corporate_price,
              market_size, key_players, keywords, featured, status,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            ON CONFLICT (sku) DO NOTHING
          `, [
            reportId,
            categoryId,
            engReport.sku || `legacy-${engReport.report_id}`,
            slug,
            engReport.title,
            engReport.description,
            engReport.description.substring(0, 500), // summary
            [engReport.types || 'Market Analysis'], // industry_tags
            ['Global'], // regions
            new Date(engReport.published_date),
            parseInt(engReport.pages) || 0,
            engReport.base_year,
            engReport.price,
            engReport.mprice,
            engReport.cprice,
            JSON.stringify(marketSize),
            JSON.stringify(keyPlayers),
            engReport.keywords ? engReport.keywords.split(',').slice(0, 10) : [],
            engReport.featured === 'Yes',
            'PUBLISHED',
            new Date(engReport.created_at),
            new Date(engReport.updated_at)
          ])

          // Add Japanese translation if available
          const jpReport = japaneseMap.get(engReport.sku)
          if (jpReport) {
            await this.pgClient.query(`
              INSERT INTO report_translations (
                id, report_id, locale, title, description, summary,
                slug, keywords, status, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
              ON CONFLICT (report_id, locale) DO NOTHING
            `, [
              uuidv4(),
              reportId,
              'ja',
              jpReport.title,
              jpReport.description,
              jpReport.description.substring(0, 500),
              this.generateSlug(jpReport.title),
              jpReport.keywords ? jpReport.keywords.split(',').slice(0, 10) : [],
              'PUBLISHED',
              new Date(jpReport.created_at),
              new Date(jpReport.updated_at)
            ])
          }

          this.stats.reports.successful++
          this.logProgress('reports', `✅ Migrated: ${engReport.title.substring(0, 50)}...`)

        } catch (error) {
          this.stats.reports.failed++
          this.stats.reports.errors.push(`${engReport.sku}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ Report migration failed:', error)
      throw error
    }
  }

  // PHASE 3: Migrate Recent Users & Orders
  async migrateUsersAndOrders(): Promise<void> {
    console.log('👥 Starting user and order migration...')
    
    // Users
    this.initStats('users')
    try {
      const [legacyUsers] = await this.mysqlConn.execute(`
        SELECT * FROM tbl_user 
        WHERE status = 'Active' 
        AND created_at >= '2024-01-01'
        ORDER BY created_at DESC
        LIMIT ?
      `, [this.config.limits.users]) as [any[], any]

      for (const user of legacyUsers) {
        try {
          this.stats.users.processed++

          await this.pgClient.query(`
            INSERT INTO users (
              id, email, first_name, last_name, phone, password,
              status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (email) DO NOTHING
          `, [
            uuidv4(),
            user.email,
            user.first_name,
            user.last_name,
            user.phone,
            user.password, // Already hashed
            user.status.toUpperCase(),
            new Date(user.created_at),
            new Date(user.updated_at)
          ])

          this.stats.users.successful++

        } catch (error) {
          this.stats.users.failed++
          this.stats.users.errors.push(`${user.email}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ User migration failed:', error)
    }

    // Recent Orders
    this.initStats('orders')
    try {
      const [legacyOrders] = await this.mysqlConn.execute(`
        SELECT * FROM tbl_order 
        WHERE status IN ('Completed', 'Processing')
        AND created_at >= '2024-01-01'
        ORDER BY created_at DESC
        LIMIT ?
      `, [this.config.limits.orders]) as [any[], any]

      for (const order of legacyOrders) {
        try {
          this.stats.orders.processed++

          const orderId = uuidv4()
          
          await this.pgClient.query(`
            INSERT INTO orders (
              id, order_number, subtotal, tax_amount, discount, total,
              customer_email, customer_name, customer_phone,
              status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `, [
            orderId,
            `LEGACY-${order.order_id}`,
            order.subtotal,
            0, // tax_amount
            order.discount,
            order.total,
            order.email,
            `${order.fname} ${order.lname}`.trim(),
            order.phone,
            order.status.toUpperCase(),
            new Date(order.created_at),
            new Date(order.updated_at)
          ])

          this.stats.orders.successful++

        } catch (error) {
          this.stats.orders.failed++
          this.stats.orders.errors.push(`${order.order_id}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ Order migration failed:', error)
    }
  }

  // PHASE 4: Create Sample Admin Users
  async createAdminUsers(): Promise<void> {
    console.log('👨‍💼 Creating admin users...')
    
    const adminUsers = [
      {
        email: 'admin@thebrainyinsights.com',
        username: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.' // password123
      },
      {
        email: 'manager@thebrainyinsights.com',
        username: 'manager',
        firstName: 'Content',
        lastName: 'Manager',
        role: 'MANAGER',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.'
      }
    ]

    for (const admin of adminUsers) {
      try {
        await this.pgClient.query(`
          INSERT INTO admins (
            id, email, username, first_name, last_name, password, role, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (email) DO NOTHING
        `, [
          uuidv4(),
          admin.email,
          admin.username,
          admin.firstName,
          admin.lastName,
          admin.password,
          admin.role,
          'PUBLISHED',
          new Date(),
          new Date()
        ])

        console.log(`✅ Created admin user: ${admin.email}`)
      } catch (error) {
        console.error(`❌ Failed to create admin ${admin.email}:`, error)
      }
    }
  }

  // Full migration process
  async runFullMigration(): Promise<void> {
    console.log('🚀 Starting PostgreSQL migration...')
    
    try {
      await this.connect()
      
      // Run migrations in order
      await this.migrateCategories()
      await this.migrateReports()
      await this.migrateUsersAndOrders()
      await this.createAdminUsers()
      
      // Print summary
      this.printSummary()
      
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    } finally {
      await this.disconnect()
    }
  }

  // Utility functions
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  }

  private printSummary(): void {
    console.log('\n📊 MIGRATION SUMMARY')
    console.log('='.repeat(50))
    
    Object.entries(this.stats).forEach(([table, stats]) => {
      console.log(`\n${table}:`)
      console.log(`  Processed: ${stats.processed}`)
      console.log(`  Successful: ${stats.successful}`)
      console.log(`  Failed: ${stats.failed}`)
      if (stats.errors.length > 0) {
        console.log(`  First 3 errors:`)
        stats.errors.slice(0, 3).forEach(error => {
          console.log(`    - ${error}`)
        })
      }
    })
    
    console.log('\n' + '='.repeat(50))
  }
}
```


### **3.2 Migration Configuration and Execution**

**Create `scripts/postgres-migration/run-migration.ts`:**

```typescript
import { PostgresMigrator } from './migrate-selective-legacy'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  legacyMysql: {
    host: process.env.LEGACY_DB_HOST || 'localhost',
    user: process.env.LEGACY_DB_USER || 'root',
    password: process.env.LEGACY_DB_PASSWORD || '',
    database: process.env.LEGACY_DB_NAME || 'tbi_db'
  },
  postgres: {
    connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:password@localhost:5432/tbi_db'
  },
  limits: {
    categories: 20,  // Only top categories
    reports: 100,    // Recent, featured reports
    users: 50,      // Recent active users
    orders: 50      // Recent orders
  },
  verbose: true
}

async function main() {
  const migrator = new PostgresMigrator(config)
  
  try {
    await migrator.runFullMigration()
    console.log('✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
```


***

# 🎯 **TASK 4: APPLICATION INTEGRATION**

## **Duration: 4 hours | Priority: High**

### **4.1 Enhanced Database Services**

**Create `src/lib/db/postgres-client.ts`:**

```typescript
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
      timestamp: result.rows[^0].current_time,
      version: result.rows.version,
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
```


### **4.2 Advanced Service Layer**

**Create `src/lib/db/services/enhanced-report-service.ts`:**

```typescript
import { prisma, pgPool } from '../postgres-client'
import type { Prisma } from '@prisma/client'

export interface SearchFilters {
  categoryId?: string
  priceMin?: number
  priceMax?: number
  regions?: string[]
  industryTags?: string[]
  publishedAfter?: Date
  featured?: boolean
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export interface ReportWithTranslation {
  id: string
  title: string
  description: string
  slug: string
  categoryId?: string
  featured: boolean
  avgRating?: number
  totalReviews: number
  singleUserPrice?: number
  publishedDate: Date
  isTranslated: boolean
  locale: string
  category?: {
    id: string
    title: string
    slug: string
  }
}

export class EnhancedReportService {
  
  // Advanced search with full-text and filters
  static async search(
    query: string,
    locale: string = 'en',
    filters: SearchFilters = {},
    pagination: { limit?: number; offset?: number } = {}
  ): Promise<{
    reports: ReportWithTranslation[]
    total: number
    aggregations: {
      categories: Array<{ id: string; title: string; count: number }>
      priceRanges: Array<{ range: string; count: number }>
      regions: Array<{ region: string; count: number }>
    }
  }> {
    const { limit = 24, offset = 0 } = pagination
    
    // Build dynamic where clause
    const whereConditions: string[] = ['r.status = $1']
    const params: any[] = ['PUBLISHED']
    let paramIndex = 2

    // Add filters
    if (filters.categoryId) {
      whereConditions.push(`r.category_id = $${paramIndex}`)
      params.push(filters.categoryId)
      paramIndex++
    }

    if (filters.priceMin !== undefined) {
      whereConditions.push(`r.single_user_price >= $${paramIndex}`)
      params.push(filters.priceMin)
      paramIndex++
    }

    if (filters.priceMax !== undefined) {
      whereConditions.push(`r.single_user_price <= $${paramIndex}`)
      params.push(filters.priceMax)
      paramIndex++
    }

    if (filters.regions?.length) {
      whereConditions.push(`r.regions && $${paramIndex}`)
      params.push(filters.regions)
      paramIndex++
    }

    if (filters.industryTags?.length) {
      whereConditions.push(`r.industry_tags && $${paramIndex}`)
      params.push(filters.industryTags)
      paramIndex++
    }

    if (filters.featured !== undefined) {
      whereConditions.push(`r.featured = $${paramIndex}`)
      params.push(filters.featured)
      paramIndex++
    }

    // Add search query
    if (query.trim()) {
      whereConditions.push(`(
        r.search_vector @@ plainto_tsquery('english', $${paramIndex})
        OR EXISTS (
          SELECT 1 FROM report_translations rt 
          WHERE rt.report_id = r.id 
          AND rt.locale = $${paramIndex + 1}
          AND rt.status = 'PUBLISHED'
          AND rt.search_vector @@ plainto_tsquery('english', $${paramIndex})
        )
      )`)
      params.push(query, locale)
      paramIndex += 2
    }

    const whereClause = whereConditions.join(' AND ')

    const client = await pgPool.connect()
    
    try {
      // Main search query
      const searchQuery = `
        SELECT 
          r.id,
          COALESCE(rt.title, r.title) as title,
          COALESCE(rt.description, r.description) as description,
          COALESCE(rt.slug, r.slug) as slug,
          r.category_id,
          r.featured,
          r.avg_rating,
          r.total_reviews,
          r.single_user_price,
          r.published_date,
          rt.id IS NOT NULL as is_translated,
          $${paramIndex} as locale,
          c.id as category_id,
          COALESCE(ct.title, c.title) as category_title,
          COALESCE(ct.slug, c.slug) as category_slug,
          ${query.trim() ? `ts_rank(COALESCE(rt.search_vector, r.search_vector), plainto_tsquery('english', $${paramIndex - 2})) as rank` : '0 as rank'}
        FROM reports r
        LEFT JOIN report_translations rt ON r.id = rt.report_id AND rt.locale = $${paramIndex} AND rt.status = 'PUBLISHED'
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $${paramIndex}
        WHERE ${whereClause}
        ORDER BY ${query.trim() ? 'rank DESC,' : ''} r.featured DESC, r.published_date DESC
        LIMIT ${paramIndex + 1} OFFSET ${paramIndex + 2}
      `

      params.push(locale, limit, offset)
      
      const result = await client.query(searchQuery, params)

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM reports r
        WHERE ${whereClause}
      `
      
      const countParams = params.slice(0, paramIndex - 3) // Remove locale, limit, offset
      const countResult = await client.query(countQuery, countParams)

      // Aggregations
      const aggregations = await this.getSearchAggregations(client, whereClause, countParams, locale)

      return {
        reports: result.rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          slug: row.slug,
          categoryId: row.category_id,
          featured: row.featured,
          avgRating: row.avg_rating,
          totalReviews: row.total_reviews,
          singleUserPrice: row.single_user_price,
          publishedDate: row.published_date,
          isTranslated: row.is_translated,
          locale: row.locale,
          category: row.category_id ? {
            id: row.category_id,
            title: row.category_title,
            slug: row.category_slug
          } : undefined
        })),
        total: parseInt(countResult.rows[^0].total),
        aggregations
      }

    } finally {
      client.release()
    }
  }

  // Get report by slug with translations
  static async getBySlug(
    slug: string,
    locale: string = 'en'
  ): Promise<ReportWithTranslation | null> {
    try {
      const report = await prisma.report.findFirst({
        where: {
          OR: [
            { slug: slug, status: 'PUBLISHED' },
            {
              translations: {
                some: {
                  slug: slug,
                  locale: locale,
                  status: 'PUBLISHED'
                }
              }
            }
          ]
        },
        include: {
          category: {
            include: {
              translations: {
                where: { locale }
              }
            }
          },
          translations: {
            where: { locale, status: 'PUBLISHED' }
          },
          faqs: {
            where: { locale, status: 'PUBLISHED' },
            orderBy: { sortOrder: 'asc' }
          },
          reviews: {
            where: { status: 'PUBLISHED' },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!report) return null

      const translation = report.translations[^0]
      const categoryTranslation = report.category?.translations

      return {
        id: report.id,
        title: translation?.title || report.title,
        description: translation?.description || report.description,
        slug: translation?.slug || report.slug,
        categoryId: report.categoryId,
        featured: report.featured,
        avgRating: report.avgRating ? parseFloat(report.avgRating.toString()) : undefined,
        totalReviews: report.totalReviews,
        singleUserPrice: report.singleUserPrice ? parseFloat(report.singleUserPrice.toString()) : undefined,
        publishedDate: report.publishedDate,
        isTranslated: !!translation,
        locale,
        category: report.category ? {
          id: report.category.id,
          title: categoryTranslation?.title || report.category.title,
          slug: categoryTranslation?.slug || report.category.slug
        } : undefined
      }

    } catch (error) {
      console.error('Error fetching report by slug:', error)
      return null
    }
  }

  // Get featured reports for homepage
  static async getFeatured(
    locale: string = 'en',
    limit: number = 8
  ): Promise<ReportWithTranslation[]> {
    try {
      const reports = await prisma.report.findMany({
        where: {
          status: 'PUBLISHED',
          featured: true
        },
        include: {
          category: {
            include: {
              translations: {
                where: { locale }
              }
            }
          },
          translations: {
            where: { locale, status: 'PUBLISHED' }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { publishedDate: 'desc' }
        ],
        take: limit
      })

      return reports.map(report => {
        const translation = report.translations[^0]
        const categoryTranslation = report.category?.translations

        return {
          id: report.id,
          title: translation?.title || report.title,
          description: translation?.description || report.description,
          slug: translation?.slug || report.slug,
          categoryId: report.categoryId,
          featured: report.featured,
          avgRating: report.avgRating ? parseFloat(report.avgRating.toString()) : undefined,
          totalReviews: report.totalReviews,
          singleUserPrice: report.singleUserPrice ? parseFloat(report.singleUserPrice.toString()) : undefined,
          publishedDate: report.publishedDate,
          isTranslated: !!translation,
          locale,
          category: report.category ? {
            id: report.category.id,
            title: categoryTranslation?.title || report.category.title,
            slug: categoryTranslation?.slug || report.category.slug
          } : undefined
        }
      })

    } catch (error) {
      console.error('Error fetching featured reports:', error)
      return []
    }
  }

  // Helper method for search aggregations
  private static async getSearchAggregations(
    client: any,
    whereClause: string,
    params: any[],
    locale: string
  ) {
    try {
      // Categories aggregation
      const categoriesQuery = `
        SELECT 
          c.id,
          COALESCE(ct.title, c.title) as title,
          COUNT(r.id) as count
        FROM reports r
        JOIN categories c ON r.category_id = c.id
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $${params.length + 1}
        WHERE ${whereClause}
        GROUP BY c.id, c.title, ct.title
        ORDER BY count DESC
        LIMIT 10
      `

      const categoriesResult = await client.query(categoriesQuery, [...params, locale])

      // Price ranges aggregation
      const priceRangesQuery = `
        SELECT 
          CASE 
            WHEN single_user_price < 1000 THEN 'Under $1K'
            WHEN single_user_price < 5000 THEN '$1K - $5K'
            WHEN single_user_price < 10000 THEN '$5K - $10K'
            ELSE '$10K+'
          END as range,
          COUNT(*) as count
        FROM reports r
        WHERE ${whereClause} AND single_user_price IS NOT NULL
        GROUP BY range
        ORDER BY count DESC
      `

      const priceRangesResult = await client.query(priceRangesQuery, params)

      // Regions aggregation
      const regionsQuery = `
        SELECT 
          unnest(regions) as region,
          COUNT(*) as count
        FROM reports r
        WHERE ${whereClause}
        GROUP BY region
        ORDER BY count DESC
        LIMIT 10
      `

      const regionsResult = await client.query(regionsQuery, params)

      return {
        categories: categoriesResult.rows,
        priceRanges: priceRangesResult.rows,
        regions: regionsResult.rows
      }

    } catch (error) {
      console.error('Error fetching aggregations:', error)
      return {
        categories: [],
        priceRanges: [],
        regions: []
      }
    }
  }
}
```


***

# 🎯 **TASK 5: TESTING \& VALIDATION**

## **Duration: 4 hours | Priority: High**

### **5.1 Comprehensive Test Suite**

**Create `scripts/test-postgres-setup.ts`:**

```typescript
import { checkDatabaseHealth, pgPool, prisma } from '../src/lib/db/postgres-client'
import { EnhancedReportService } from '../src/lib/db/services/enhanced-report-service'

interface TestResult {
  name: string
  status: 'pass' | 'fail'
  duration: number
  error?: string
  details?: any
}

export class PostgresTestSuite {
  private results: TestResult[] = []

  async runTest(
    name: string, 
    testFn: () => Promise<any>
  ): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const result = await testFn()
      const duration = Date.now() - startTime
      
      const testResult: TestResult = {
        name,
        status: 'pass',
        duration,
        details: result
      }
      
      this.results.push(testResult)
      console.log(`✅ ${name} (${duration}ms)`)
      
      return testResult
      
    } catch (error) {
      const duration = Date.now() - startTime
      
      const testResult: TestResult = {
        name,
        status: 'fail',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      this.results.push(testResult)
      console.log(`❌ ${name} (${duration}ms): ${testResult.error}`)
      
      return testResult
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting PostgreSQL Test Suite...\n')

    // Test 1: Database Connection & Health
    await this.runTest('Database Connection', async () => {
      const health = await checkDatabaseHealth()
      if (health.status !== 'healthy') {
        throw new Error(`Database unhealthy: ${health.error}`)
      }
      return health
    })

    // Test 2: Prisma Connection
    await this.runTest('Prisma Connection', async () => {
      await prisma.$connect()
      const result = await prisma.$queryRaw`SELECT 1 as test`
      return result
    })

    // Test 3: Extensions & Functions
    await this.runTest('Database Extensions', async () => {
      const client = await pgPool.connect()
      try {
        const extensions = await client.query(`
          SELECT extname FROM pg_extension 
          WHERE extname IN ('uuid-ossp', 'pg_trgm', 'unaccent', 'btree_gin')
        `)
        
        const functions = await client.query(`
          SELECT proname FROM pg_proc 
          WHERE proname IN ('create_search_vector', 'generate_slug', 'search_reports')
        `)
        
        return {
          extensions: extensions.rows,
          functions: functions.rows
        }
      } finally {
        client.release()
      }
    })

    // Test 4: Data Integrity
    await this.runTest('Data Integrity Check', async () => {
      const counts = await Promise.all([
        prisma.category.count(),
        prisma.report.count(),
        prisma.user.count(),
        prisma.admin.count(),
        prisma.categoryTranslation.count(),
        prisma.reportTranslation.count()
      ])

      const [categories, reports, users, admins, categoryTranslations, reportTranslations] = counts

      if (categories === 0) {
        throw new Error('No categories found')
      }

      if (reports === 0) {
        throw new Error('No reports found')
      }

      return {
        categories,
        reports,
        users,
        admins,
        categoryTranslations,
        reportTranslations
      }
    })

    // Test 5: Full-text Search
    await this.runTest('Full-text Search', async () => {
      const searchResults = await EnhancedReportService.search(
        'market analysis',
        'en',
        {},
        { limit: 5 }
      )

      if (searchResults.reports.length === 0) {
        throw new Error('Search returned no results')
      }

      return {
        resultsCount: searchResults.reports.length,
        totalMatches: searchResults.total,
        firstResult: searchResults.reports[^0]?.title
      }
    })

    // Test 6: Multilingual Content
    await this.runTest('Multilingual Content', async () => {
      const [englishReports, japaneseReports] = await Promise.all([
        EnhancedReportService.getFeatured('en', 3),
        EnhancedReportService.getFeatured('ja', 3)
      ])

      const translatedCount = japaneseReports.filter(r => r.isTranslated).length

      return {
        englishReports: englishReports.length,
        japaneseReports: japaneseReports.length,
        translatedCount,
        translationPercentage: translatedCount / japaneseReports.length * 100
      }
    })

    // Test 7: Performance Test
    await this.runTest('Performance Test', async () => {
      const startTime = Date.now()
      
      // Simulate concurrent requests
      const promises = Array.from({ length: 10 }, (_, i) => 
        EnhancedReportService.search(`test query ${i}`, 'en', {}, { limit: 10 })
      )
      
      await Promise.all(promises)
      
      const duration = Date.now() - startTime
      
      if (duration > 5000) {
        throw new Error(`Performance test too slow: ${duration}ms`)
      }
      
      return {
        duration,
        averagePerQuery: duration / 10
      }
    })

    // Test 8: Advanced Queries
    await this.runTest('Advanced Queries', async () => {
      const client = await pgPool.connect()
      
      try {
        // Test search function
        const searchResult = await client.query(`
          SELECT * FROM search_reports($1, $2, $3, $4, $5)
        `, ['technology', 'en', null, 5, 0])

        // Test aggregation
        const categoryStats = await client.query(`
          SELECT 
            c.title,
            COUNT(r.id) as report_count,
            AVG(r.single_user_price) as avg_price
          FROM categories c
          LEFT JOIN reports r ON c.id = r.category_id AND r.status = 'PUBLISHED'
          GROUP BY c.id, c.title
          ORDER BY report_count DESC
          LIMIT 5
        `)

        return {
          searchResults: searchResult.rows.length,
          categoryStats: categoryStats.rows
        }
        
      } finally {
        client.release()
      }
    })

    // Test 9: SEO and Slugs
    await this.runTest('SEO and Slug Generation', async () => {
      const client = await pgPool.connect()
      
      try {
        // Test slug generation function
        const slugResult = await client.query(`
          SELECT generate_slug($1) as slug
        `, ['This is a Test Title with Special Characters!@#$%'])

        const slug = slugResult.rows[^0].slug
        
        if (!slug || slug.includes(' ') || slug.includes('@')) {
          throw new Error(`Invalid slug generated: ${slug}`)
        }

        // Check for duplicate slugs
        const duplicateCheck = await client.query(`
          SELECT slug, COUNT(*) as count
          FROM (
            SELECT slug FROM reports
            UNION ALL
            SELECT slug FROM report_translations
          ) all_slugs
          GROUP BY slug
          HAVING COUNT(*) > 1
        `)

        return {
          generatedSlug: slug,
          duplicateCount: duplicateCheck.rows.length
        }
        
      } finally {
        client.release()
      }
    })

    // Test 10: AI Content Integration
    await this.runTest('AI Content System', async () => {
      // Test AI content generation table structure
      const aiGeneration = await prisma.aIContentGeneration.create({
        data: {
          contentType: 'report',
          locale: 'en',
          prompt: 'Test prompt for content generation',
          model: 'gpt-4',
          status: 'QUEUED',
          generatedBy: (await prisma.admin.findFirst())?.id || 'test-admin',
          metadata: {
            testRun: true,
            timestamp: new Date().toISOString()
          }
        }
      })

      // Clean up test data
      await prisma.aIContentGeneration.delete({
        where: { id: aiGeneration.id }
      })

      return {
        aiGenerationCreated: true,
        generationId: aiGeneration.id
      }
    })

    this.printSummary()
  }

  private printSummary(): void {
    console.log('\n📊 TEST SUMMARY')
    console.log('='.repeat(60))
    
    const passed = this.results.filter(r => r.status === 'pass').length
    const failed = this.results.filter(r => r.status === 'fail').length
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0)
    
    console.log(`Total Tests: ${this.results.length}`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)
    console.log(`Total Duration: ${totalDuration}ms`)
    console.log(`Average Duration: ${Math.round(totalDuration / this.results.length)}ms`)
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:')
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => {
          console.log(`  - ${r.name}: ${r.error}`)
        })
    }
    
    console.log('\n✅ DETAILED RESULTS:')
    this.results.forEach(r => {
      console.log(`  ${r.status === 'pass' ? '✅' : '❌'} ${r.name} (${r.duration}ms)`)
      if (r.details && Object.keys(r.details).length > 0) {
        console.log(`     Details:`, JSON.stringify(r.details, null, 6))
      }
    })
    
    console.log('='.repeat(60))
    console.log(failed === 0 ? '🎉 ALL TESTS PASSED!' : `⚠️  ${failed} TESTS FAILED`)
  }
}

// Run tests if called directly
if (require.main === module) {
  async function main() {
    const testSuite = new PostgresTestSuite()
    
    try {
      await testSuite.runAllTests()
      process.exit(0)
    } catch (error) {
      console.error('Test suite failed:', error)
      process.exit(1)
    }
  }
  
  main()
}
```


***

# 📋 **SPRINT 1 EXECUTION PLAN**

## **Week 1: Database Foundation (Days 1-5)**

### **Day 1: Docker \& PostgreSQL Setup (4 hours)**

- [ ] **Create Docker Environment** (2 hours)
    - [ ] Set up `docker-compose.yml` with PostgreSQL, Redis, Elasticsearch
    - [ ] Configure PostgreSQL with optimized settings
    - [ ] Create initialization scripts with extensions
    - [ ] Test database connectivity
- [ ] **Environment Configuration** (2 hours)
    - [ ] Configure environment variables
    - [ ] Set up development/production configurations
    - [ ] Test Docker services startup and health checks


### **Day 2: Prisma Schema \& Migration (4 hours)**

- [ ] **Create Enhanced Schema** (3 hours)
    - [ ] Implement complete Prisma schema with PostgreSQL features
    - [ ] Add advanced indexes, triggers, and functions
    - [ ] Configure full-text search capabilities
    - [ ] Set up multilingual translation tables
- [ ] **Database Generation** (1 hour)
    - [ ] Run `prisma generate`
    - [ ] Apply initial migration
    - [ ] Verify schema in database


### **Day 3: Legacy Migration System (4 hours)**

- [ ] **Build Migration Tools** (3 hours)
    - [ ] Create PostgreSQL migrator class
    - [ ] Implement selective data migration
    - [ ] Build category and report migration
    - [ ] Add user and order migration
- [ ] **Execute Migration** (1 hour)
    - [ ] Run migration scripts
    - [ ] Verify data integrity
    - [ ] Create sample admin users


### **Day 4: Service Layer Development (4 hours)**

- [ ] **Enhanced Database Services** (3 hours)
    - [ ] Create PostgreSQL client configuration
    - [ ] Build advanced report service
    - [ ] Implement search functionality
    - [ ] Add multilingual content handling
- [ ] **Integration Testing** (1 hour)
    - [ ] Test service layer functionality
    - [ ] Verify search performance
    - [ ] Check translation fallbacks


## **Week 2: Testing \& Optimization (Days 6-10)**

### **Day 5: Comprehensive Testing (4 hours)**

- [ ] **Test Suite Development** (2 hours)
    - [ ] Create comprehensive test suite
    - [ ] Add performance benchmarks
    - [ ] Implement health checks
- [ ] **Execute Tests** (2 hours)
    - [ ] Run full test suite
    - [ ] Fix any identified issues
    - [ ] Document test results


### **Final Deliverables**

- ✅ **PostgreSQL database** running in Docker
- ✅ **Complete schema** with multilingual support
- ✅ **Legacy data migrated** (selective, quality content)
- ✅ **Service layer** with advanced search
- ✅ **Full-text search** working across languages
- ✅ **Test suite** passing all checks
- ✅ **Documentation** for database architecture


## **Success Criteria**

- [ ] Database responds in <100ms for simple queries
- [ ] Search functionality works across all languages
- [ ] Translation system functional with fallbacks
- [ ] All test suite checks pass
- [ ] Ready for AI content generation integration
- [ ] SEO-optimized URLs and metadata working

**This PostgreSQL foundation will provide the perfect base for your multilingual, AI-powered market research platform! 🚀**

<div style="text-align: center">⁂</div>

[^1]: image.jpg

[^2]: tbi_db.sql

