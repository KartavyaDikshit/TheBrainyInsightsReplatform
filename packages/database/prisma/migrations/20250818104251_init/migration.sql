-- CreateEnum
CREATE TYPE "public"."content_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "public"."user_status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."admin_role" AS ENUM ('SUPERADMIN', 'MANAGER', 'EDITOR', 'ANALYST');

-- CreateEnum
CREATE TYPE "public"."order_status" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."license_type" AS ENUM ('SINGLE', 'MULTIPLE', 'CORPORATE', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."enquiry_status" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."translation_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'REVIEW', 'APPROVED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."ai_generation_status" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "shortcode" VARCHAR(16) NOT NULL,
    "slug" VARCHAR(128) NOT NULL,
    "icon" VARCHAR(64),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."content_status" NOT NULL DEFAULT 'PUBLISHED',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "seo_metadata" JSONB,
    "view_count" BIGINT NOT NULL DEFAULT 0,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "search_vector" tsvector,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "published_at" TIMESTAMPTZ,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "slug" VARCHAR(128) NOT NULL,
    "seo_metadata" JSONB,
    "status" "public"."translation_status" NOT NULL DEFAULT 'PENDING',
    "translated_by" UUID,
    "reviewed_by" UUID,
    "search_vector" tsvector,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "admin_id" UUID,
    "sku" VARCHAR(32),
    "slug" VARCHAR(255) NOT NULL,
    "report_type" VARCHAR(50),
    "industry_tags" VARCHAR(50)[],
    "regions" VARCHAR(50)[],
    "published_date" DATE NOT NULL,
    "pages" INTEGER NOT NULL DEFAULT 0,
    "base_year" INTEGER,
    "forecast_period" VARCHAR(50),
    "report_link" VARCHAR(500),
    "sample_link" VARCHAR(500),
    "thumbnail" VARCHAR(500),
    "avg_rating" DECIMAL(3,2),
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "public"."content_status" NOT NULL DEFAULT 'DRAFT',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "view_count" BIGINT NOT NULL DEFAULT 0,
    "download_count" BIGINT NOT NULL DEFAULT 0,
    "enquiry_count" BIGINT NOT NULL DEFAULT 0,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT,
    "table_of_contents" TEXT,
    "methodology" TEXT,
    "key_findings" TEXT[],
    "market_size" JSONB,
    "key_players" JSONB,
    "market_segments" JSONB,
    "keywords" VARCHAR(100)[],
    "seo_metadata" JSONB,
    "search_vector" tsvector,
    "single_user_price" DECIMAL(10,2),
    "multi_user_price" DECIMAL(10,2),
    "corporate_price" DECIMAL(10,2),
    "enterprise_price" DECIMAL(10,2),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "published_at" TIMESTAMPTZ,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "report_id" UUID NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT,
    "table_of_contents" TEXT,
    "methodology" TEXT,
    "key_findings" TEXT[],
    "slug" VARCHAR(255) NOT NULL,
    "market_size" JSONB,
    "key_players" JSONB,
    "market_segments" JSONB,
    "keywords" VARCHAR(100)[],
    "seo_metadata" JSONB,
    "status" "public"."translation_status" NOT NULL DEFAULT 'PENDING',
    "translated_by" UUID,
    "reviewed_by" UUID,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "ai_prompt" TEXT,
    "search_vector" tsvector,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "published_at" TIMESTAMPTZ,

    CONSTRAINT "report_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_content_generations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_type" VARCHAR(50) NOT NULL,
    "content_id" UUID,
    "locale" VARCHAR(5) NOT NULL,
    "prompt" TEXT NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "temperature" DECIMAL(3,2),
    "max_tokens" INTEGER,
    "status" "public"."ai_generation_status" NOT NULL DEFAULT 'QUEUED',
    "generated_by" UUID NOT NULL,
    "reviewed_by" UUID,
    "generated_content" JSONB,
    "token_usage" JSONB,
    "error" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ai_content_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "phone" VARCHAR(20),
    "password" VARCHAR(255),
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "company" VARCHAR(200),
    "job_title" VARCHAR(100),
    "industry" VARCHAR(100),
    "country" VARCHAR(100),
    "timezone" VARCHAR(50),
    "preferred_language" VARCHAR(5),
    "newsletter" BOOLEAN NOT NULL DEFAULT true,
    "marketing_emails" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB,
    "status" "public"."user_status" NOT NULL DEFAULT 'PENDING',
    "last_login_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "profile_image" VARCHAR(500),
    "password" VARCHAR(255) NOT NULL,
    "role" "public"."admin_role" NOT NULL,
    "permissions" VARCHAR(50)[],
    "status" "public"."content_status" NOT NULL DEFAULT 'DRAFT',
    "last_login_at" TIMESTAMPTZ,
    "preferences" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "order_number" VARCHAR(50) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "payment_method" VARCHAR(50),
    "payment_status" VARCHAR(50),
    "transaction_id" VARCHAR(100),
    "payment_metadata" JSONB,
    "customer_email" VARCHAR(255),
    "customer_name" VARCHAR(200),
    "customer_phone" VARCHAR(20),
    "billing_address" JSONB,
    "status" "public"."order_status" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "fulfillment_email" VARCHAR(255),
    "fulfilled_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "license" "public"."license_type" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "report_snapshot" JSONB NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enquiries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "report_id" UUID,
    "user_id" UUID,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "company" VARCHAR(200),
    "job_title" VARCHAR(100),
    "country" VARCHAR(100),
    "enquiry_type" VARCHAR(50),
    "message" TEXT,
    "urgency" VARCHAR(20),
    "status" "public"."enquiry_status" NOT NULL DEFAULT 'NEW',
    "source" VARCHAR(50),
    "assigned_to" UUID,
    "follow_up_date" TIMESTAMPTZ,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."custom_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "report_id" UUID,
    "user_id" UUID,
    "full_name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "company" VARCHAR(200),
    "designation" VARCHAR(100),
    "country" VARCHAR(100),
    "request_type" VARCHAR(50),
    "description" TEXT,
    "custom_requirements" JSONB,
    "status" "public"."enquiry_status" NOT NULL DEFAULT 'NEW',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "assigned_to" UUID,
    "response" TEXT,
    "estimated_cost" DECIMAL(10,2),
    "estimated_days" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "responded_at" TIMESTAMPTZ,

    CONSTRAINT "custom_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faqs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "report_id" UUID,
    "locale" VARCHAR(5) NOT NULL DEFAULT 'en',
    "question" VARCHAR(500) NOT NULL,
    "answer" TEXT NOT NULL,
    "category" VARCHAR(50),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."content_status" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "report_id" UUID NOT NULL,
    "user_id" UUID,
    "rating" SMALLINT NOT NULL,
    "title" VARCHAR(200),
    "content" TEXT,
    "reviewer_name" VARCHAR(100),
    "reviewer_email" VARCHAR(255),
    "reviewer_company" VARCHAR(200),
    "status" "public"."content_status" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "report_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blogs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "slug" VARCHAR(255) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "excerpt" VARCHAR(500),
    "content" TEXT NOT NULL,
    "featured_image" VARCHAR(500),
    "seo_metadata" JSONB,
    "tags" VARCHAR(50)[],
    "status" "public"."content_status" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "view_count" BIGINT NOT NULL DEFAULT 0,
    "published_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_translations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "blog_id" UUID NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(300) NOT NULL,
    "excerpt" VARCHAR(500),
    "content" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "seo_metadata" JSONB,
    "tags" VARCHAR(50)[],
    "status" "public"."translation_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "blog_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."press_releases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "title" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "seo_metadata" JSONB,
    "status" "public"."content_status" NOT NULL DEFAULT 'DRAFT',
    "published_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "press_releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID,
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,
    "media_type" VARCHAR(50) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "seo_metadata" JSONB,
    "status" "public"."content_status" NOT NULL DEFAULT 'DRAFT',
    "published_date" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."countries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "code3" VARCHAR(3) NOT NULL,
    "region" VARCHAR(50) NOT NULL,
    "subregion" VARCHAR(50) NOT NULL,
    "phone_code" VARCHAR(10) NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "languages" VARCHAR(5)[],
    "market_tier" VARCHAR(20),
    "gdp" DECIMAL(15,2),
    "population" BIGINT,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."url_redirects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "source_url" VARCHAR(500) NOT NULL,
    "target_url" VARCHAR(500) NOT NULL,
    "status_code" INTEGER NOT NULL DEFAULT 301,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "hit_count" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "url_redirects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_shortcode_key" ON "public"."categories"("shortcode");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_status_featured_sort_order_idx" ON "public"."categories"("status", "featured", "sort_order");

-- CreateIndex
CREATE INDEX "categories_shortcode_idx" ON "public"."categories"("shortcode");

-- CreateIndex
CREATE INDEX "categories_search_vector_idx" ON "public"."categories" USING GIN ("search_vector");

-- CreateIndex
CREATE INDEX "category_translations_locale_idx" ON "public"."category_translations"("locale");

-- CreateIndex
CREATE INDEX "category_translations_slug_idx" ON "public"."category_translations"("slug");

-- CreateIndex
CREATE INDEX "category_translations_status_idx" ON "public"."category_translations"("status");

-- CreateIndex
CREATE INDEX "category_translations_search_vector_idx" ON "public"."category_translations" USING GIN ("search_vector");

-- CreateIndex
CREATE UNIQUE INDEX "category_translations_category_id_locale_key" ON "public"."category_translations"("category_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "reports_sku_key" ON "public"."reports"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "reports_slug_key" ON "public"."reports"("slug");

-- CreateIndex
CREATE INDEX "reports_category_id_status_featured_idx" ON "public"."reports"("category_id", "status", "featured");

-- CreateIndex
CREATE INDEX "reports_published_date_idx" ON "public"."reports"("published_date");

-- CreateIndex
CREATE INDEX "reports_sku_idx" ON "public"."reports"("sku");

-- CreateIndex
CREATE INDEX "reports_slug_idx" ON "public"."reports"("slug");

-- CreateIndex
CREATE INDEX "reports_status_priority_idx" ON "public"."reports"("status", "priority");

-- CreateIndex
CREATE INDEX "reports_industry_tags_idx" ON "public"."reports" USING GIN ("industry_tags");

-- CreateIndex
CREATE INDEX "reports_regions_idx" ON "public"."reports" USING GIN ("regions");

-- CreateIndex
CREATE INDEX "reports_keywords_idx" ON "public"."reports" USING GIN ("keywords");

-- CreateIndex
CREATE INDEX "reports_search_vector_idx" ON "public"."reports" USING GIN ("search_vector");

-- CreateIndex
CREATE INDEX "reports_avg_rating_total_reviews_idx" ON "public"."reports"("avg_rating", "total_reviews");

-- CreateIndex
CREATE INDEX "report_translations_locale_idx" ON "public"."report_translations"("locale");

-- CreateIndex
CREATE INDEX "report_translations_slug_idx" ON "public"."report_translations"("slug");

-- CreateIndex
CREATE INDEX "report_translations_status_idx" ON "public"."report_translations"("status");

-- CreateIndex
CREATE INDEX "report_translations_search_vector_idx" ON "public"."report_translations" USING GIN ("search_vector");

-- CreateIndex
CREATE INDEX "report_translations_keywords_idx" ON "public"."report_translations" USING GIN ("keywords");

-- CreateIndex
CREATE UNIQUE INDEX "report_translations_report_id_locale_key" ON "public"."report_translations"("report_id", "locale");

-- CreateIndex
CREATE INDEX "ai_content_generations_content_type_status_idx" ON "public"."ai_content_generations"("content_type", "status");

-- CreateIndex
CREATE INDEX "ai_content_generations_generated_by_idx" ON "public"."ai_content_generations"("generated_by");

-- CreateIndex
CREATE INDEX "ai_content_generations_created_at_idx" ON "public"."ai_content_generations"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "public"."users"("status");

-- CreateIndex
CREATE INDEX "users_country_idx" ON "public"."users"("country");

-- CreateIndex
CREATE INDEX "users_industry_idx" ON "public"."users"("industry");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "public"."admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "public"."admins"("username");

-- CreateIndex
CREATE INDEX "admins_email_status_idx" ON "public"."admins"("email", "status");

-- CreateIndex
CREATE INDEX "admins_role_idx" ON "public"."admins"("role");

-- CreateIndex
CREATE INDEX "admins_username_idx" ON "public"."admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "public"."orders"("order_number");

-- CreateIndex
CREATE INDEX "orders_user_id_idx" ON "public"."orders"("user_id");

-- CreateIndex
CREATE INDEX "orders_status_created_at_idx" ON "public"."orders"("status", "created_at");

-- CreateIndex
CREATE INDEX "orders_customer_email_idx" ON "public"."orders"("customer_email");

-- CreateIndex
CREATE INDEX "orders_order_number_idx" ON "public"."orders"("order_number");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "public"."order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_report_id_idx" ON "public"."order_items"("report_id");

-- CreateIndex
CREATE INDEX "enquiries_report_id_status_idx" ON "public"."enquiries"("report_id", "status");

-- CreateIndex
CREATE INDEX "enquiries_email_idx" ON "public"."enquiries"("email");

-- CreateIndex
CREATE INDEX "enquiries_status_created_at_idx" ON "public"."enquiries"("status", "created_at");

-- CreateIndex
CREATE INDEX "enquiries_assigned_to_idx" ON "public"."enquiries"("assigned_to");

-- CreateIndex
CREATE INDEX "enquiries_user_id_idx" ON "public"."enquiries"("user_id");

-- CreateIndex
CREATE INDEX "custom_requests_report_id_status_idx" ON "public"."custom_requests"("report_id", "status");

-- CreateIndex
CREATE INDEX "custom_requests_email_idx" ON "public"."custom_requests"("email");

-- CreateIndex
CREATE INDEX "custom_requests_status_priority_idx" ON "public"."custom_requests"("status", "priority");

-- CreateIndex
CREATE INDEX "custom_requests_user_id_idx" ON "public"."custom_requests"("user_id");

-- CreateIndex
CREATE INDEX "faqs_report_id_locale_status_idx" ON "public"."faqs"("report_id", "locale", "status");

-- CreateIndex
CREATE INDEX "faqs_category_sort_order_idx" ON "public"."faqs"("category", "sort_order");

-- CreateIndex
CREATE INDEX "report_reviews_report_id_status_idx" ON "public"."report_reviews"("report_id", "status");

-- CreateIndex
CREATE INDEX "report_reviews_user_id_idx" ON "public"."report_reviews"("user_id");

-- CreateIndex
CREATE INDEX "report_reviews_rating_featured_idx" ON "public"."report_reviews"("rating", "featured");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "public"."blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_category_id_status_featured_idx" ON "public"."blogs"("category_id", "status", "featured");

-- CreateIndex
CREATE INDEX "blogs_published_date_idx" ON "public"."blogs"("published_date");

-- CreateIndex
CREATE INDEX "blogs_tags_idx" ON "public"."blogs" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "blog_translations_locale_idx" ON "public"."blog_translations"("locale");

-- CreateIndex
CREATE INDEX "blog_translations_slug_idx" ON "public"."blog_translations"("slug");

-- CreateIndex
CREATE INDEX "blog_translations_tags_idx" ON "public"."blog_translations" USING GIN ("tags");

-- CreateIndex
CREATE UNIQUE INDEX "blog_translations_blog_id_locale_key" ON "public"."blog_translations"("blog_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "press_releases_slug_key" ON "public"."press_releases"("slug");

-- CreateIndex
CREATE INDEX "press_releases_category_id_status_idx" ON "public"."press_releases"("category_id", "status");

-- CreateIndex
CREATE INDEX "press_releases_published_date_idx" ON "public"."press_releases"("published_date");

-- CreateIndex
CREATE INDEX "media_category_id_status_idx" ON "public"."media"("category_id", "status");

-- CreateIndex
CREATE INDEX "media_media_type_idx" ON "public"."media"("media_type");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "public"."countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code3_key" ON "public"."countries"("code3");

-- CreateIndex
CREATE INDEX "countries_region_idx" ON "public"."countries"("region");

-- CreateIndex
CREATE INDEX "countries_market_tier_idx" ON "public"."countries"("market_tier");

-- CreateIndex
CREATE INDEX "url_redirects_source_url_idx" ON "public"."url_redirects"("source_url");

-- CreateIndex
CREATE INDEX "url_redirects_active_idx" ON "public"."url_redirects"("active");

-- AddForeignKey
ALTER TABLE "public"."category_translations" ADD CONSTRAINT "category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category_translations" ADD CONSTRAINT "category_translations_translated_by_fkey" FOREIGN KEY ("translated_by") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category_translations" ADD CONSTRAINT "category_translations_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_translations" ADD CONSTRAINT "report_translations_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_content_generations" ADD CONSTRAINT "ai_content_generations_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "public"."admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_content_generations" ADD CONSTRAINT "ai_content_generations_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "public"."reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enquiries" ADD CONSTRAINT "enquiries_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enquiries" ADD CONSTRAINT "enquiries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."custom_requests" ADD CONSTRAINT "custom_requests_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."custom_requests" ADD CONSTRAINT "custom_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."faqs" ADD CONSTRAINT "faqs_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_reviews" ADD CONSTRAINT "report_reviews_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_reviews" ADD CONSTRAINT "report_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blogs" ADD CONSTRAINT "blogs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_translations" ADD CONSTRAINT "blog_translations_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."press_releases" ADD CONSTRAINT "press_releases_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
