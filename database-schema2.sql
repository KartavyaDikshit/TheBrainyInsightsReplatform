-- Connect as tbi_user
-- psql -U tbi_user -d tbi_db -f final-database-schema.sql

-- Drop existing tables and types for clean setup
DROP TABLE IF EXISTS enquiries CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS translation_jobs CASCADE;
DROP TABLE IF EXISTS report_translations CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS category_translations CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- Drop additional tables that might exist
DROP TABLE IF EXISTS content_generation_jobs CASCADE;
DROP TABLE IF EXISTS content_generation_workflows CASCADE;
DROP TABLE IF EXISTS ai_prompt_templates CASCADE;
DROP TABLE IF EXISTS api_usage_logs CASCADE;
DROP TABLE IF EXISTS api_quotas CASCADE;
DROP TABLE IF EXISTS report_reviews CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;
DROP TABLE IF EXISTS blog_translations CASCADE;
DROP TABLE IF EXISTS seo_analytics CASCADE;

-- Drop types
DROP TYPE IF EXISTS enquiry_status;
DROP TYPE IF EXISTS license_type;
DROP TYPE IF EXISTS payment_status;
DROP TYPE IF EXISTS order_status;
DROP TYPE IF EXISTS admin_role;
DROP TYPE IF EXISTS user_status;
DROP TYPE IF EXISTS translation_job_status;
DROP TYPE IF EXISTS translation_status;
DROP TYPE IF EXISTS content_status;
DROP TYPE IF EXISTS content_workflow_status;
DROP TYPE IF EXISTS content_job_status;

-- Create enums
CREATE TYPE content_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'ACTIVE');
CREATE TYPE translation_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');
CREATE TYPE translation_job_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRY');
CREATE TYPE content_workflow_status AS ENUM ('GENERATING', 'PENDING_REVIEW', 'IN_REVIEW', 'REVISION_REQUIRED', 'APPROVED', 'PUBLISHED', 'REJECTED');
CREATE TYPE content_job_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE admin_role AS ENUM ('SUPERADMIN', 'MANAGER', 'EDITOR', 'TRANSLATOR', 'MODERATOR');
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
CREATE TYPE license_type AS ENUM ('SINGLE', 'MULTIPLE', 'CORPORATE', 'ENTERPRISE');
CREATE TYPE enquiry_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONVERTED', 'CLOSED_LOST', 'CLOSED_WON');

-- ============================================================================
-- CORE CONTENT MODELS
-- ============================================================================

-- Categories table (Enhanced)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shortcode VARCHAR(20) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    
    -- Advanced SEO for Regional Keywords
    seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    regional_keywords JSONB,
    search_volume JSONB,
    ranking_factors JSONB,
    
    -- SEO Metadata
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    canonical_url VARCHAR(500),
    og_title VARCHAR(300),
    og_description VARCHAR(500),
    og_image VARCHAR(500),
    
    -- Regional SEO
    hreflang_alts JSONB,
    
    -- Analytics
    status content_status DEFAULT 'PUBLISHED',
    view_count BIGINT DEFAULT 0,
    click_count BIGINT DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Category translations table (Enhanced)
CREATE TABLE category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL,
    locale VARCHAR(5) NOT NULL,
    
    title VARCHAR(300) NOT NULL,
    description TEXT,
    slug VARCHAR(150) NOT NULL,
    
    -- Advanced SEO per locale
    seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    localized_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    cultural_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    long_tail_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    og_title VARCHAR(300),
    og_description VARCHAR(500),
    
    -- AI Translation Metadata
    translation_job_id UUID,
    ai_generated BOOLEAN DEFAULT FALSE,
    human_reviewed BOOLEAN DEFAULT FALSE,
    translation_quality DECIMAL(3,2),
    cultural_adaptation TEXT,
    
    -- SEO Performance per locale
    search_performance JSONB,
    local_rankings JSONB,
    
    status translation_status DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, locale)
);

-- Reports table (Complete with AI integration)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID,
    
    -- Core Identifiers
    sku VARCHAR(50) UNIQUE,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    summary TEXT,
    
    -- Report Specifications
    pages INTEGER DEFAULT 0,
    published_date DATE NOT NULL,
    base_year INTEGER,
    forecast_period VARCHAR(50),
    
    -- Content Structure
    table_of_contents TEXT,
    list_of_figures TEXT,
    methodology TEXT,
    key_findings TEXT[] DEFAULT ARRAY[]::TEXT[],
    executive_summary TEXT,
    
    -- Market Intelligence Data (JSON for flexibility)
    market_data JSONB,
    competitive_landscape JSONB,
    market_segmentation JSONB,
    regional_analysis JSONB,
    swot_analysis JSONB,
    
    -- Classification & Tagging
    key_players TEXT[] DEFAULT ARRAY[]::TEXT[],
    regions TEXT[] DEFAULT ARRAY[]::TEXT[],
    industry_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    report_type VARCHAR(50),
    research_method VARCHAR(100),
    
    -- Advanced SEO & Keywords (CRITICAL)
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    semantic_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    regional_keywords JSONB,
    competitor_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    trending_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    long_tail_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Complete SEO Metadata
    meta_title VARCHAR(500) NOT NULL,
    meta_description VARCHAR(500) NOT NULL,
    canonical_url VARCHAR(500),
    og_title VARCHAR(500),
    og_description VARCHAR(500),
    og_image VARCHAR(500),
    twitter_title VARCHAR(500),
    twitter_description VARCHAR(500),
    
    -- Structured Data for Rich Snippets
    schema_markup JSONB,
    breadcrumb_data JSONB,
    faq_data JSONB,
    
    -- Pricing Structure
    single_price DECIMAL(10,2),
    multi_price DECIMAL(10,2),
    corporate_price DECIMAL(10,2),
    enterprise_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- AI Content Generation Tracking
    ai_generated BOOLEAN DEFAULT FALSE,
    content_generation_workflow_id UUID,
    human_approved BOOLEAN DEFAULT FALSE,
    content_quality_score DECIMAL(3,2),
    ai_confidence_score DECIMAL(3,2),
    
    -- Status & Features
    status content_status DEFAULT 'DRAFT',
    featured BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    
    -- Advanced Analytics
    view_count BIGINT DEFAULT 0,
    download_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    enquiry_count BIGINT DEFAULT 0,
    
    -- SEO Performance Tracking (CRITICAL)
    search_rankings JSONB,
    click_through_rate DECIMAL(5,4),
    average_position DECIMAL(5,2),
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    bounce_rate DECIMAL(5,4),
    time_on_page INTEGER, -- seconds
    
    -- Review System
    avg_rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    total_rating_points INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Report translations table (Complete multilingual SEO)
CREATE TABLE report_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL,
    locale VARCHAR(5) NOT NULL,
    
    -- Core Content
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    summary TEXT,
    slug VARCHAR(200) NOT NULL,
    
    -- Extended Content
    table_of_contents TEXT,
    list_of_figures TEXT,
    methodology TEXT,
    key_findings TEXT[] DEFAULT ARRAY[]::TEXT[],
    executive_summary TEXT,
    
    -- Localized SEO (CRITICAL FOR MULTILINGUAL SEO)
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    semantic_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    localized_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    cultural_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    long_tail_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    local_competitor_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Complete Localized Meta
    meta_title VARCHAR(500) NOT NULL,
    meta_description VARCHAR(500) NOT NULL,
    canonical_url VARCHAR(500),
    og_title VARCHAR(500),
    og_description VARCHAR(500),
    og_image VARCHAR(500),
    twitter_title VARCHAR(500),
    twitter_description VARCHAR(500),
    
    -- Localized Schema & Rich Snippets
    schema_markup JSONB,
    breadcrumb_data JSONB,
    faq_data JSONB,
    local_business_schema JSONB,
    
    -- AI Translation Metadata
    translation_job_id UUID,
    ai_generated BOOLEAN DEFAULT FALSE,
    human_reviewed BOOLEAN DEFAULT FALSE,
    translation_quality DECIMAL(3,2),
    cultural_adaptation_score DECIMAL(3,2),
    cultural_adaptation_notes TEXT,
    localization_notes TEXT,
    
    -- SEO Performance per locale (CRITICAL)
    search_performance JSONB,
    local_rankings JSONB,
    regional_ctr DECIMAL(5,4),
    regional_impressions BIGINT DEFAULT 0,
    regional_clicks BIGINT DEFAULT 0,
    
    status translation_status DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    UNIQUE(report_id, locale)
);

-- ============================================================================
-- AI CONTENT GENERATION SYSTEM (CORE REQUIREMENT)
-- ============================================================================

-- Content Generation Workflows (4-Phase System)
CREATE TABLE content_generation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Input Parameters
    industry VARCHAR(255) NOT NULL,
    market_size VARCHAR(255),
    geographic_scope VARCHAR(255) NOT NULL,
    timeframe VARCHAR(50) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    custom_requirements TEXT,
    
    -- 4-Phase Job Tracking
    phase1_job_id UUID, -- Market Analysis
    phase2_job_id UUID, -- Competitive Analysis  
    phase3_job_id UUID, -- Trends Analysis
    phase4_job_id UUID, -- Final Synthesis
    
    -- Generated Content Storage
    market_analysis TEXT,
    competitive_analysis TEXT,
    trends_analysis TEXT,
    final_synthesis TEXT,
    
    -- Quality Metrics
    overall_quality_score DECIMAL(3,2),
    content_coherence DECIMAL(3,2),
    factual_accuracy DECIMAL(3,2),
    market_insight_depth DECIMAL(3,2),
    innovation_score DECIMAL(3,2),
    
    -- Workflow Status
    workflow_status content_workflow_status DEFAULT 'GENERATING',
    current_phase INTEGER DEFAULT 1,
    
    -- Review Process
    assigned_reviewer_id UUID,
    review_notes TEXT,
    revision_requests TEXT[],
    approved_by UUID,
    approved_at TIMESTAMP,
    
    -- Cost & Performance Tracking
    total_tokens_used INTEGER DEFAULT 0,
    total_cost DECIMAL(8,4) DEFAULT 0,
    processing_time INTEGER, -- total seconds
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- Content Generation Jobs (Individual Phase Jobs)
CREATE TABLE content_generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    workflow_id UUID,
    phase INTEGER NOT NULL, -- 1-4 for the 4-phase generation
    
    -- AI Configuration
    prompt_template TEXT NOT NULL,
    context_data JSONB,
    ai_model VARCHAR(50) DEFAULT 'gpt-4-turbo-preview',
    temperature DECIMAL(3,2) DEFAULT 0.4,
    max_tokens INTEGER DEFAULT 4000,
    
    -- Input & Output
    input_prompt TEXT NOT NULL,
    output_text TEXT,
    
    -- Quality Assessment
    quality_score DECIMAL(3,2),
    relevance_score DECIMAL(3,2),
    innovation_score DECIMAL(3,2),
    completeness_score DECIMAL(3,2),
    
    -- Processing Details
    status content_job_status DEFAULT 'PENDING',
    processing_time INTEGER, -- milliseconds
    retry_count INTEGER DEFAULT 0,
    
    -- Token Usage
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    cost DECIMAL(8,4),
    
    -- Error Handling
    error_message TEXT,
    error_code VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- AI TRANSLATION SYSTEM (ENHANCED)
-- ============================================================================

-- Translation jobs table (Enhanced)
CREATE TABLE translation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) NOT NULL,
    content_id UUID NOT NULL,
    
    source_locale VARCHAR(5) NOT NULL,
    target_locale VARCHAR(5) NOT NULL,
    
    -- Translation Details
    field_name VARCHAR(50) NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT,
    
    -- AI Configuration
    ai_model VARCHAR(50) DEFAULT 'gpt-4',
    prompt_template TEXT,
    temperature DECIMAL(3,2) DEFAULT 0.3,
    max_tokens INTEGER DEFAULT 2000,
    
    -- Advanced Quality Metrics
    quality_score DECIMAL(3,2),
    fluency_score DECIMAL(3,2),
    accuracy_score DECIMAL(3,2),
    cultural_score DECIMAL(3,2),
    seo_relevance_score DECIMAL(3,2),
    
    -- Processing Status
    status translation_job_status DEFAULT 'PENDING',
    priority INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    
    -- Token Usage & Cost Tracking
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    estimated_cost DECIMAL(8,4),
    actual_cost DECIMAL(8,4),
    
    -- Error Handling
    error_message TEXT,
    error_code VARCHAR(50),
    
    -- Timing
    processing_started TIMESTAMP,
    processing_ended TIMESTAMP,
    processing_time INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID
);

-- ============================================================================
-- AI MANAGEMENT SYSTEM
-- ============================================================================

-- AI Prompt Templates (Updateable for future)
CREATE TABLE ai_prompt_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    
    prompt_type VARCHAR(50) NOT NULL, -- 'translation', 'content_generation', etc.
    phase INTEGER, -- For content generation (1-4)
    
    template_text TEXT NOT NULL,
    variables JSONB, -- Template variables like {industry}, {locale}
    
    -- Versioning
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Performance Tracking
    usage_count INTEGER DEFAULT 0,
    avg_quality_score DECIMAL(3,2),
    avg_cost DECIMAL(8,4),
    success_rate DECIMAL(5,4),
    
    -- Configuration
    default_model VARCHAR(50) DEFAULT 'gpt-4',
    default_temperature DECIMAL(3,2) DEFAULT 0.3,
    default_max_tokens INTEGER DEFAULT 2000,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID NOT NULL
);

-- API Usage Logs (Token tracking and cost management)
CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    service_type VARCHAR(50) NOT NULL, -- 'translation', 'content_generation'
    model VARCHAR(50) NOT NULL,
    
    -- Request Details
    request_id VARCHAR(100),
    job_id UUID,
    user_id UUID,
    
    -- Token Usage
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    
    -- Cost Tracking
    cost_per_token DECIMAL(10,8) NOT NULL,
    total_cost DECIMAL(8,4) NOT NULL,
    
    -- Performance Metrics
    response_time INTEGER NOT NULL, -- milliseconds
    success BOOLEAN NOT NULL,
    error_message TEXT,
    
    -- Metadata
    request_data JSONB,
    response_data JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- API Quotas (Rate limiting and budget control)
CREATE TABLE api_quotas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    quota_type VARCHAR(20) NOT NULL, -- 'daily', 'monthly'
    service_type VARCHAR(50) NOT NULL,
    quota_date VARCHAR(10) NOT NULL, -- YYYY-MM-DD or YYYY-MM
    
    -- Limits
    tokens_limit INTEGER NOT NULL,
    requests_limit INTEGER NOT NULL,
    cost_limit DECIMAL(10,2) NOT NULL,
    
    -- Current Usage
    tokens_used INTEGER DEFAULT 0,
    requests_made INTEGER DEFAULT 0,
    cost_spent DECIMAL(10,2) DEFAULT 0,
    
    -- Status
    is_exceeded BOOLEAN DEFAULT FALSE,
    
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(quota_type, service_type, quota_date)
);

-- ============================================================================
-- USER MANAGEMENT & E-COMMERCE
-- ============================================================================

-- Users table (Enhanced)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(200),
    country VARCHAR(100),
    
    -- Preferences & Localization
    preferred_language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50),
    newsletter BOOLEAN DEFAULT TRUE,
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    
    -- User Behavior & Analytics
    registration_source VARCHAR(100),
    utm_data JSONB,
    behavior_data JSONB,
    
    status user_status DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Admins table (Enhanced)
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    
    password VARCHAR(255) NOT NULL,
    role admin_role NOT NULL,
    
    -- Permissions
    permissions JSONB,
    
    -- Activity Tracking
    status content_status DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Customer Information
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20),
    company VARCHAR(200),
    country VARCHAR(100),
    
    -- Amounts
    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Payment
    payment_method VARCHAR(50),
    payment_status payment_status DEFAULT 'PENDING',
    payment_provider VARCHAR(50),
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP,
    
    -- Analytics
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(500),
    utm_data JSONB,
    
    status order_status DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    report_id UUID NOT NULL,
    
    license_type license_type NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    
    -- Access Control
    access_granted BOOLEAN DEFAULT FALSE,
    access_expiry TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    download_limit INTEGER,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES reports(id)
);

-- ============================================================================
-- CUSTOMER ENGAGEMENT & REVIEWS
-- ============================================================================

-- Enquiries table (Enhanced)
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID,
    user_id UUID,
    
    -- Contact Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    job_title VARCHAR(100),
    country VARCHAR(100),
    
    -- Enquiry Details
    subject VARCHAR(300),
    message TEXT,
    enquiry_type VARCHAR(50),
    urgency VARCHAR(20),
    
    -- Lead Qualification
    budget_range VARCHAR(50),
    decision_maker BOOLEAN DEFAULT FALSE,
    timeline VARCHAR(100),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    
    -- Processing & Response
    status enquiry_status DEFAULT 'NEW',
    assigned_to UUID,
    response_text TEXT,
    response_date TIMESTAMP,
    follow_up_date TIMESTAMP,
    
    -- Analytics
    source VARCHAR(100),
    utm_data JSONB,
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (report_id) REFERENCES reports(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Report Reviews table (New - for customer feedback)
CREATE TABLE report_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL,
    user_id UUID,
    
    -- Review Content
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    
    -- Detailed Ratings
    accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
    usefulness_rating INTEGER CHECK (usefulness_rating >= 1 AND usefulness_rating <= 5),
    presentation_rating INTEGER CHECK (presentation_rating >= 1 AND presentation_rating <= 5),
    
    -- Anonymous Reviewer Information
    reviewer_name VARCHAR(100),
    reviewer_company VARCHAR(200),
    reviewer_job_title VARCHAR(100),
    
    -- Review Management
    status content_status DEFAULT 'PUBLISHED',
    verified BOOLEAN DEFAULT FALSE,
    helpful INTEGER DEFAULT 0, -- Helpful votes
    reported INTEGER DEFAULT 0, -- Report count
    moderator_note TEXT,
    
    -- Purchase Verification
    is_purchased BOOLEAN DEFAULT FALSE,
    purchase_order_id UUID,
    verified_purchase BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================================
-- CONTENT MANAGEMENT (BLOGS)
-- ============================================================================

-- Blogs table
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID,
    
    -- Content
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    
    -- Categorization
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    industries TEXT[] DEFAULT ARRAY[]::TEXT[],
    regions TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- SEO
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    semantic_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    
    -- Publishing
    status content_status DEFAULT 'DRAFT',
    featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    
    -- Analytics
    view_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    read_time INTEGER, -- estimated reading time in minutes
    
    -- AI Generation
    ai_generated BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Blog translations table
CREATE TABLE blog_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_id UUID NOT NULL,
    locale VARCHAR(5) NOT NULL,
    
    -- Content
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    
    -- Localized Categorization
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    localized_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- SEO
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    
    -- AI Translation
    translation_job_id UUID,
    ai_generated BOOLEAN DEFAULT FALSE,
    human_reviewed BOOLEAN DEFAULT FALSE,
    translation_quality DECIMAL(3,2),
    
    status translation_status DEFAULT 'DRAFT',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE,
    UNIQUE(blog_id, locale)
);

-- ============================================================================
-- SEO ANALYTICS & PERFORMANCE TRACKING
-- ============================================================================

-- SEO Analytics table (New - for tracking performance)
CREATE TABLE seo_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    content_type VARCHAR(50) NOT NULL, -- 'report', 'category', 'blog'
    content_id UUID NOT NULL,
    locale VARCHAR(5) NOT NULL,
    
    -- SEO Metrics
    search_engine VARCHAR(20) NOT NULL, -- 'google', 'bing', etc.
    keyword VARCHAR(255) NOT NULL,
    position INTEGER,
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    
    -- Performance Data
    date DATE NOT NULL,
    country VARCHAR(3), -- ISO country code
    device VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(content_type, content_id, locale, search_engine, keyword, date, country, device)
);

-- ============================================================================
-- COMPREHENSIVE INDEXING FOR PERFORMANCE
-- ============================================================================

-- Categories indexes
CREATE INDEX idx_categories_status_featured ON categories(status, featured, sort_order);
CREATE INDEX idx_categories_shortcode ON categories(shortcode);
CREATE INDEX idx_categories_seo_keywords ON categories USING GIN(seo_keywords);
CREATE INDEX idx_categories_regional_keywords ON categories USING GIN(regional_keywords);

-- Category translations indexes
CREATE INDEX idx_category_translations_locale_status ON category_translations(locale, status);
CREATE INDEX idx_category_translations_ai_human ON category_translations(ai_generated, human_reviewed);
CREATE INDEX idx_category_translations_localized_keywords ON category_translations USING GIN(localized_keywords);

-- Reports indexes (Critical for performance)
CREATE INDEX idx_reports_category_status_featured ON reports(category_id, status, featured);
CREATE INDEX idx_reports_published_status ON reports(published_date, status);
CREATE INDEX idx_reports_rating ON reports(avg_rating, review_count);
CREATE INDEX idx_reports_industry_tags ON reports USING GIN(industry_tags);
CREATE INDEX idx_reports_keywords ON reports USING GIN(keywords);
CREATE INDEX idx_reports_semantic_keywords ON reports USING GIN(semantic_keywords);
CREATE INDEX idx_reports_ai_human ON reports(ai_generated, human_approved);
CREATE INDEX idx_reports_slug ON reports(slug);
CREATE INDEX idx_reports_sku ON reports(sku);

-- Report translations indexes
CREATE INDEX idx_report_translations_locale_status ON report_translations(locale, status);
CREATE INDEX idx_report_translations_ai_human ON report_translations(ai_generated, human_reviewed);
CREATE INDEX idx_report_translations_slug ON report_translations(slug);
CREATE INDEX idx_report_translations_keywords ON report_translations USING GIN(keywords);

-- AI system indexes
CREATE INDEX idx_content_generation_workflows_status ON content_generation_workflows(workflow_status, current_phase);
CREATE INDEX idx_content_generation_workflows_created ON content_generation_workflows(created_by, created_at);

CREATE INDEX idx_content_generation_jobs_workflow ON content_generation_jobs(workflow_id, phase);
CREATE INDEX idx_content_generation_jobs_status ON content_generation_jobs(status, phase);

CREATE INDEX idx_translation_jobs_status_priority ON translation_jobs(status, priority, created_at);
CREATE INDEX idx_translation_jobs_content ON translation_jobs(content_type, content_id);
CREATE INDEX idx_translation_jobs_locales ON translation_jobs(source_locale, target_locale);

CREATE INDEX idx_ai_prompt_templates_type ON ai_prompt_templates(prompt_type, is_active);
CREATE INDEX idx_ai_prompt_templates_version ON ai_prompt_templates(version, is_active);

CREATE INDEX idx_api_usage_logs_service ON api_usage_logs(service_type, created_at);
CREATE INDEX idx_api_usage_logs_model ON api_usage_logs(model, created_at);
CREATE INDEX idx_api_usage_logs_user ON api_usage_logs(user_id, created_at);

CREATE INDEX idx_api_quotas_date ON api_quotas(quota_date, is_exceeded);

-- User & commerce indexes
CREATE INDEX idx_users_email_status ON users(email, status);
CREATE INDEX idx_users_language_status ON users(preferred_language, status);

CREATE INDEX idx_admins_email_status ON admins(email, status);
CREATE INDEX idx_admins_role_status ON admins(role, status);

CREATE INDEX idx_orders_customer_status ON orders(customer_email, status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status, status);
CREATE INDEX idx_orders_created ON orders(created_at);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_report ON order_items(report_id);
CREATE INDEX idx_order_items_access ON order_items(access_granted, access_expiry);

-- Engagement indexes
CREATE INDEX idx_enquiries_report_status ON enquiries(report_id, status);
CREATE INDEX idx_enquiries_email_status ON enquiries(email, status);
CREATE INDEX idx_enquiries_assigned ON enquiries(assigned_to, status);
CREATE INDEX idx_enquiries_created ON enquiries(created_at);

CREATE INDEX idx_report_reviews_report ON report_reviews(report_id, status);
CREATE INDEX idx_report_reviews_rating ON report_reviews(rating, verified);
CREATE INDEX idx_report_reviews_verified ON report_reviews(verified, is_purchased);

-- Content indexes
CREATE INDEX idx_blogs_category_status ON blogs(category_id, status);
CREATE INDEX idx_blogs_published ON blogs(published_at, status);
CREATE INDEX idx_blogs_tags ON blogs USING GIN(tags);
CREATE INDEX idx_blogs_featured ON blogs(featured, status);

CREATE INDEX idx_blog_translations_locale_status ON blog_translations(locale, status);
CREATE INDEX idx_blog_translations_ai_human ON blog_translations(ai_generated, human_reviewed);

-- SEO analytics indexes
CREATE INDEX idx_seo_analytics_content ON seo_analytics(content_type, content_id, locale);
CREATE INDEX idx_seo_analytics_keyword ON seo_analytics(keyword, date);
CREATE INDEX idx_seo_analytics_performance ON seo_analytics(date, country, device);

-- ============================================================================
-- INSERT COMPREHENSIVE SAMPLE DATA
-- ============================================================================

-- Insert categories with enhanced SEO data
INSERT INTO categories (shortcode, slug, title, description, icon, featured, sort_order, seo_keywords, regional_keywords, meta_title, meta_description, status) VALUES
('tech', 'technology', 'Technology Market Research', 'Comprehensive technology and IT market research reports covering AI, software, hardware, and digital transformation trends across global markets.', '💻', TRUE, 1,
 ARRAY['technology market research', 'IT industry analysis', 'digital transformation', 'software market', 'artificial intelligence', 'tech trends', 'innovation reports'],
 '{"en": ["technology", "IT", "software"], "de": ["technologie", "IT", "software"], "fr": ["technologie", "informatique", "logiciel"], "es": ["tecnología", "TI", "software"], "it": ["tecnologia", "IT", "software"], "ja": ["テクノロジー", "IT", "ソフトウェア"], "ko": ["기술", "IT", "소프트웨어"]}'::jsonb,
 'Technology Market Research Reports | Global IT Industry Analysis | TheBrainyInsights',
 'Leading technology market research reports covering AI, software, hardware, and digital transformation trends with comprehensive global market analysis and forecasts.',
 'PUBLISHED'),

('health', 'healthcare', 'Healthcare Market Research', 'In-depth healthcare and pharmaceutical market research covering medical devices, digital health, biotechnology, and healthcare services worldwide.', '🏥', TRUE, 2,
 ARRAY['healthcare market research', 'pharmaceutical industry', 'medical devices', 'digital health', 'biotechnology', 'healthcare services', 'medical technology'],
 '{"en": ["healthcare", "pharmaceutical", "medical"], "de": ["gesundheitswesen", "pharmazeutisch", "medizinisch"], "fr": ["soins de santé", "pharmaceutique", "médical"], "es": ["salud", "farmacéutico", "médico"], "it": ["sanità", "farmaceutico", "medico"], "ja": ["ヘルスケア", "製薬", "医療"], "ko": ["헬스케어", "제약", "의료"]}'::jsonb,
 'Healthcare Market Research Reports | Pharmaceutical Industry Analysis | TheBrainyInsights',
 'Comprehensive healthcare market research covering pharmaceuticals, medical devices, digital health, and biotechnology with detailed market forecasts and competitive analysis.',
 'PUBLISHED'),

('auto', 'automotive', 'Automotive Market Research', 'Complete automotive industry research covering electric vehicles, autonomous driving, mobility services, and automotive technology innovations.', '🚗', TRUE, 3,
 ARRAY['automotive market research', 'electric vehicles', 'autonomous driving', 'mobility services', 'automotive technology', 'EV market', 'car industry'],
 '{"en": ["automotive", "electric vehicles", "mobility"], "de": ["automobil", "elektrofahrzeuge", "mobilität"], "fr": ["automobile", "véhicules électriques", "mobilité"], "es": ["automotriz", "vehículos eléctricos", "movilidad"], "it": ["automobilistico", "veicoli elettrici", "mobilità"], "ja": ["自動車", "電気自動車", "モビリティ"], "ko": ["자동차", "전기차", "모빌리티"]}'::jsonb,
 'Automotive Market Research | Electric Vehicles & Autonomous Driving Analysis | TheBrainyInsights',
 'Leading automotive market research covering electric vehicles, autonomous driving, mobility services, and automotive technology with comprehensive industry analysis.',
 'PUBLISHED');

-- Insert AI prompt templates
INSERT INTO ai_prompt_templates (name, prompt_type, phase, template_text, variables, version, is_active, default_model, default_temperature, default_max_tokens, created_by) VALUES
('Market Analysis Template v1', 'content_generation', 1, 
'You are a senior market research analyst specializing in {industry} industry analysis. Generate a comprehensive market analysis for the {industry} market covering {geographic_scope} with a focus on {timeframe}.

REQUIREMENTS:
1. Market size and valuation (current and projected)
2. Key market drivers and restraints  
3. Market segmentation breakdown
4. Regional analysis and opportunities
5. Regulatory landscape impact

Provide specific data points, percentages, and market values. Generate insights that will inform competitive analysis, trend forecasting, and final synthesis.',
'{"industry": "Industry name", "geographic_scope": "Geographic coverage", "timeframe": "Analysis timeframe"}'::jsonb,
1, TRUE, 'gpt-4-turbo-preview', 0.4, 4000, uuid_generate_v4()),

('Competitive Analysis Template v1', 'content_generation', 2,
'Building upon the market analysis, conduct comprehensive competitive landscape analysis for the {industry} market.

REQUIREMENTS:
1. Market leader identification and market share analysis
2. Competitive positioning and strategies
3. SWOT analysis of top 5-7 players
4. Emerging competitors and disruptors
5. Competitive advantages and differentiation factors

Provide detailed competitive matrix with market share data and strategic positioning analysis.',
'{"industry": "Industry name"}'::jsonb,
1, TRUE, 'gpt-4-turbo-preview', 0.4, 4000, uuid_generate_v4()),

('Translation Template v1', 'translation', NULL,
'You are a professional translator specializing in market research content. Translate from {source_language} to {target_language}.

REQUIREMENTS:
1. Maintain technical accuracy of market terms and company names
2. Preserve SEO keywords while making them culturally appropriate  
3. Adapt content for local market context
4. Keep professional, authoritative tone
5. Ensure translations are optimized for local search engines

Provide only the translated text.',
'{"source_language": "Source language", "target_language": "Target language"}'::jsonb,
1, TRUE, 'gpt-4', 0.3, 2000, uuid_generate_v4());

-- Insert comprehensive sample reports
INSERT INTO reports (category_id, sku, slug, title, description, summary, pages, published_date, base_year, forecast_period, 
                    table_of_contents, methodology, key_findings, executive_summary, market_data, competitive_landscape,
                    key_players, regions, industry_tags, keywords, semantic_keywords, regional_keywords,
                    meta_title, meta_description, single_price, multi_price, corporate_price, featured, priority, status)
SELECT 
    c.id,
    'TBI-AI-2025-001',
    'artificial-intelligence-market-2025',
    'Global Artificial Intelligence Market Analysis 2025: Comprehensive Industry Forecast and Competitive Landscape',
    'This comprehensive 285-page report provides an in-depth analysis of the global artificial intelligence market, covering machine learning, deep learning, natural language processing, computer vision, and robotics segments. The report includes detailed competitive landscape analysis, market segmentation by technology and application, regional market dynamics, and strategic recommendations for stakeholders across the AI value chain.',
    'The global artificial intelligence market is projected to reach $1.81 trillion by 2030, growing at a remarkable CAGR of 36.8% from 2025 to 2030. Machine learning dominates the market with 65% share, while healthcare and automotive emerge as the fastest-growing application areas with growth rates exceeding 40% annually.',
    285,
    CURRENT_DATE,
    2024,
    '2025-2030',
    '1. Executive Summary\n2. Research Methodology\n3. Market Overview\n4. Technology Segmentation\n5. Application Analysis\n6. Regional Market Dynamics\n7. Competitive Landscape\n8. Strategic Recommendations\n9. Market Forecasts\n10. Appendices',
    'This report employs a mixed-method research approach combining primary research (expert interviews, industry surveys) with secondary research (company reports, government publications, industry databases). Market sizing utilizes bottom-up and top-down methodologies with cross-validation through multiple data sources.',
    ARRAY[
        'Global AI market expected to grow at 36.8% CAGR through 2030, reaching $1.81 trillion',
        'Machine learning segment dominates with 65% market share, driven by enterprise adoption',
        'Healthcare AI applications show highest growth potential at 42% CAGR',
        'Automotive sector emerges as second-fastest growing application area',
        'North America leads in market value while Asia-Pacific shows highest growth rate',
        'Investment in AI startups reached record $75 billion in 2024',
        'Cloud-based AI services account for 68% of deployment models'
    ],
    'The artificial intelligence market has reached an inflection point, transitioning from experimental technology to mainstream business adoption. This transformation is driven by unprecedented advances in computing power, data availability, and algorithmic sophistication. Our analysis reveals that AI is no longer confined to technology companies but has become integral to operations across virtually every industry sector.',
    '{"market_size_2024": 458.5, "market_size_2030": 1811.2, "cagr": 36.8, "segments": {"machine_learning": 65, "natural_language_processing": 18, "computer_vision": 12, "robotics": 5}, "currency": "USD_billions"}'::jsonb,
    '{"market_leaders": [{"company": "Google", "market_share": 23.5}, {"company": "Microsoft", "market_share": 19.2}, {"company": "IBM", "market_share": 12.8}, {"company": "Amazon", "market_share": 11.4}], "competitive_intensity": "high", "market_concentration": "moderate"}'::jsonb,
    ARRAY['Google', 'Microsoft', 'IBM', 'Amazon Web Services', 'NVIDIA', 'Intel', 'Salesforce', 'SAP', 'Oracle', 'Facebook (Meta)'],
    ARRAY['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
    ARRAY['artificial-intelligence', 'machine-learning', 'deep-learning', 'computer-vision', 'natural-language-processing', 'robotics', 'enterprise-ai'],
    ARRAY['artificial intelligence market', 'AI market size', 'machine learning growth', 'AI trends 2025', 'enterprise AI adoption', 'AI market forecast', 'global AI industry'],
    ARRAY['AI adoption', 'intelligent systems', 'automated processes', 'cognitive computing', 'predictive analytics', 'AI transformation', 'digital intelligence'],
    '{"en": ["artificial intelligence market", "AI industry analysis", "machine learning trends"], "de": ["künstliche intelligenz markt", "ki industrie analyse", "maschinelles lernen trends"], "fr": ["marché intelligence artificielle", "analyse industrie ia", "tendances apprentissage automatique"], "es": ["mercado inteligencia artificial", "análisis industria ia", "tendencias aprendizaje automático"], "it": ["mercato intelligenza artificiale", "analisi industria ia", "tendenze apprendimento automatico"], "ja": ["人工知能市場", "ai産業分析", "機械学習トレンド"], "ko": ["인공지능 시장", "ai 산업 분석", "머신러닝 트렌드"]}'::jsonb,
    'Global AI Market Analysis 2025 | $1.8T by 2030 | Machine Learning & Deep Learning Trends | TheBrainyInsights',
    'Comprehensive 285-page AI market research report covering machine learning, deep learning, NLP, computer vision. Detailed competitive analysis, regional forecasts, and strategic insights for 2025-2030.',
    4500.00,
    6750.00,
    9000.00,
    TRUE,
    100,
    'PUBLISHED'
FROM categories c WHERE c.shortcode = 'tech';

-- Insert report translation for German
INSERT INTO report_translations (report_id, locale, title, description, summary, slug, keywords, semantic_keywords, 
                               localized_keywords, cultural_keywords, meta_title, meta_description, ai_generated, status)
SELECT 
    r.id,
    'de',
    'Globale Künstliche Intelligenz Marktanalyse 2025: Umfassende Branchenprognose und Wettbewerbslandschaft',
    'Dieser umfassende 285-seitige Bericht bietet eine tiefgreifende Analyse des globalen Marktes für künstliche Intelligenz und deckt maschinelles Lernen, Deep Learning, natürliche Sprachverarbeitung, Computer Vision und Robotik-Segmente ab.',
    'Der globale Markt für künstliche Intelligenz wird voraussichtlich bis 2030 1,81 Billionen US-Dollar erreichen und von 2025 bis 2030 mit einer bemerkenswerten CAGR von 36,8% wachsen.',
    'kuenstliche-intelligenz-markt-2025',
    ARRAY['künstliche intelligenz markt', 'ki marktgröße', 'maschinelles lernen wachstum', 'ki trends 2025'],
    ARRAY['ki adoption', 'intelligente systeme', 'automatisierte prozesse', 'kognitives computing'],
    ARRAY['künstliche intelligenz', 'maschinelles lernen', 'deep learning', 'ki technologie'],
    ARRAY['industrie 4.0', 'digitalisierung', 'automatisierung', 'deutsche ki initiative'],
    'Globale KI Marktanalyse 2025 | 1,8B$ bis 2030 | Maschinelles Lernen Trends | TheBrainyInsights',
    'Umfassender 285-seitiger KI-Marktforschungsbericht über maschinelles Lernen, Deep Learning, NLP. Detaillierte Wettbewerbsanalyse und strategische Einblicke für 2025-2030.',
    TRUE,
    'PUBLISHED'
FROM reports r WHERE r.sku = 'TBI-AI-2025-001';

-- Insert admin user with enhanced permissions
INSERT INTO admins (email, username, first_name, last_name, password, role, permissions, status) VALUES
('admin@thebrainyinsights.com', 'superadmin', 'Super', 'Admin', 
 '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.', 
 'SUPERADMIN',
 '{"content_management": true, "ai_management": true, "user_management": true, "analytics": true, "system_settings": true}'::jsonb,
 'ACTIVE');

-- Insert sample API quotas
INSERT INTO api_quotas (quota_type, service_type, quota_date, tokens_limit, requests_limit, cost_limit) VALUES
('daily', 'translation', '2025-08-24', 100000, 1000, 150.00),
('daily', 'content_generation', '2025-08-24', 500000, 100, 750.00),
('monthly', 'translation', '2025-08', 3000000, 30000, 4500.00),
('monthly', 'content_generation', '2025-08', 15000000, 3000, 22500.00);

COMMIT;
