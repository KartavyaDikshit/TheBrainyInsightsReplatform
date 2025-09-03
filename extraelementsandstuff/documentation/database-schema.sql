-- Connect as tbi_user
-- psql -U tbi_user -d tbi_db -f database-schema.sql

-- Create enums first
CREATE TYPE content_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'ACTIVE');
CREATE TYPE translation_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED');
CREATE TYPE translation_job_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRY');
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE admin_role AS ENUM ('SUPERADMIN', 'MANAGER', 'EDITOR', 'TRANSLATOR', 'MODERATOR');
CREATE TYPE order_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');
CREATE TYPE license_type AS ENUM ('SINGLE', 'MULTIPLE', 'CORPORATE', 'ENTERPRISE');
CREATE TYPE enquiry_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'CONVERTED', 'CLOSED');

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shortcode VARCHAR(20) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    regional_keywords JSONB,
    search_volume JSONB,
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    canonical_url VARCHAR(500),
    status content_status DEFAULT 'PUBLISHED',
    view_count BIGINT DEFAULT 0,
    click_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Category translations table
CREATE TABLE category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL,
    locale VARCHAR(5) NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT,
    slug VARCHAR(150) NOT NULL,
    seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    localized_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    cultural_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    ai_generated BOOLEAN DEFAULT FALSE,
    human_reviewed BOOLEAN DEFAULT FALSE,
    translation_quality DECIMAL(3,2),
    translation_job_id UUID,
    status translation_status DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, locale)
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID,
    sku VARCHAR(50) UNIQUE,
    slug VARCHAR(200) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    summary TEXT,
    pages INTEGER DEFAULT 0,
    published_date DATE NOT NULL,
    base_year INTEGER,
    forecast_period VARCHAR(50),
    table_of_contents TEXT,
    methodology TEXT,
    key_findings TEXT[] DEFAULT ARRAY[]::TEXT[],
    executive_summary TEXT,
    market_data JSONB,
    competitive_landscape JSONB,
    market_segmentation JSONB,
    regional_analysis JSONB,
    key_players TEXT[] DEFAULT ARRAY[]::TEXT[],
    regions TEXT[] DEFAULT ARRAY[]::TEXT[],
    industry_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    report_type VARCHAR(50),
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    semantic_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    regional_keywords JSONB,
    competitor_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    trending_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    meta_title VARCHAR(500) NOT NULL,
    meta_description VARCHAR(500) NOT NULL,
    canonical_url VARCHAR(500),
    og_title VARCHAR(500),
    og_description VARCHAR(500),
    og_image VARCHAR(500),
    schema_markup JSONB,
    breadcrumb_data JSONB,
    faq_data JSONB,
    single_price DECIMAL(10,2),
    multi_price DECIMAL(10,2),
    corporate_price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    ai_generated BOOLEAN DEFAULT FALSE,
    human_approved BOOLEAN DEFAULT FALSE,
    content_quality_score DECIMAL(3,2),
    status content_status DEFAULT 'DRAFT',
    featured BOOLEAN DEFAULT FALSE,
    priority INTEGER DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    download_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    enquiry_count BIGINT DEFAULT 0,
    search_rankings JSONB,
    click_through_rate DECIMAL(5,4),
    average_position DECIMAL(5,2),
    impressions BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    avg_rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Report translations table
CREATE TABLE report_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL,
    locale VARCHAR(5) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    summary TEXT,
    slug VARCHAR(200) NOT NULL,
    table_of_contents TEXT,
    methodology TEXT,
    key_findings TEXT[] DEFAULT ARRAY[]::TEXT[],
    executive_summary TEXT,
    keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    semantic_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    localized_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    cultural_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
    meta_title VARCHAR(500) NOT NULL,
    meta_description VARCHAR(500) NOT NULL,
    og_title VARCHAR(500),
    og_description VARCHAR(500),
    schema_markup JSONB,
    breadcrumb_data JSONB,
    faq_data JSONB,
    ai_generated BOOLEAN DEFAULT FALSE,
    human_reviewed BOOLEAN DEFAULT FALSE,
    translation_quality DECIMAL(3,2),
    cultural_adaptation TEXT,
    translation_job_id UUID,
    search_performance JSONB,
    status translation_status DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
    UNIQUE(report_id, locale)
);

-- Translation jobs table
CREATE TABLE translation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_type VARCHAR(50) NOT NULL,
    content_id UUID NOT NULL,
    source_locale VARCHAR(5) NOT NULL,
    target_locale VARCHAR(5) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    original_text TEXT NOT NULL,
    translated_text TEXT,
    ai_model VARCHAR(50) DEFAULT 'gpt-4',
    temperature DECIMAL(3,2) DEFAULT 0.3,
    max_tokens INTEGER DEFAULT 2000,
    quality_score DECIMAL(3,2),
    fluency_score DECIMAL(3,2),
    accuracy_score DECIMAL(3,2),
    cultural_score DECIMAL(3,2),
    status translation_job_status DEFAULT 'PENDING',
    priority INTEGER DEFAULT 0,
    retry_count INTEGER DEFAULT 0,
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    estimated_cost DECIMAL(8,4),
    actual_cost DECIMAL(8,4),
    error_message TEXT,
    error_code VARCHAR(50),
    processing_started TIMESTAMP,
    processing_ended TIMESTAMP,
    processing_time INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_by UUID
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(200),
    country VARCHAR(100),
    preferred_language VARCHAR(5),
    timezone VARCHAR(50),
    newsletter BOOLEAN DEFAULT TRUE,
    status user_status DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role admin_role NOT NULL,
    status content_status DEFAULT 'ACTIVE',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20),
    company VARCHAR(200),
    country VARCHAR(100),
    subtotal DECIMAL(12,2) NOT NULL,
    discount DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_status payment_status DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP,
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
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES reports(id)
);

-- Enquiries table
CREATE TABLE enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID,
    user_id UUID,
    first_name VARCHAR(100) NOT NULL,
    lastName VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(200),
    jobTitle VARCHAR(100),
    country VARCHAR(100),
    subject VARCHAR(300),
    message TEXT,
    enquiryType VARCHAR(50),
    status enquiry_status DEFAULT 'NEW',
    assignedTo UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (report_id) REFERENCES reports(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX idx_categories_status_featured ON categories(status, featured, sort_order);
CREATE INDEX idx_categories_shortcode ON categories(shortcode);
CREATE INDEX idx_categories_seo_keywords ON categories USING GIN(seo_keywords);

CREATE INDEX idx_category_translations_locale_status ON category_translations(locale, status);
CREATE INDEX idx_category_translations_ai_human ON category_translations(ai_generated, human_reviewed);

CREATE INDEX idx_reports_category_status_featured ON reports(category_id, status, featured);
CREATE INDEX idx_reports_published_status ON reports(published_date, status);
CREATE INDEX idx_reports_rating ON reports(avg_rating, review_count);
CREATE INDEX idx_reports_industry_tags ON reports USING GIN(industry_tags);
CREATE INDEX idx_reports_keywords ON reports USING GIN(keywords);
CREATE INDEX idx_reports_semantic_keywords ON reports USING GIN(semantic_keywords);
CREATE INDEX idx_reports_ai_human ON reports(ai_generated, human_approved);

CREATE INDEX idx_report_translations_locale_status ON report_translations(locale, status);
CREATE INDEX idx_report_translations_ai_human ON report_translations(ai_generated, human_reviewed);

CREATE INDEX idx_translation_jobs_status_priority ON translation_jobs(status, priority, created_at);
CREATE INDEX idx_translation_jobs_content ON translation_jobs(content_type, content_id);
CREATE INDEX idx_translation_jobs_locales ON translation_jobs(source_locale, target_locale);

CREATE INDEX idx_users_email_status ON users(email, status);
CREATE INDEX idx_users_language_status ON users(preferred_language, status);

CREATE INDEX idx_admins_email_status ON admins(email, status);
CREATE INDEX idx_admins_role_status ON admins(role, status);

CREATE INDEX idx_orders_customer_status ON orders(customer_email, status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status, status);
CREATE INDEX idx_orders_created ON orders(created_at);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_report ON order_items(report_id);

CREATE INDEX idx_enquiries_report_status ON enquiries(report_id, status);
CREATE INDEX idx_enquiries_email_status ON enquiries(email, status);
CREATE INDEX idx_enquiries_created ON enquiries(created_at);

-- Insert sample data
INSERT INTO categories (shortcode, slug, title, description, icon, featured, sort_order, seo_keywords, meta_title, meta_description, status) VALUES
('tech', 'technology', 'Technology Market Research', 'Comprehensive technology and IT market research reports covering AI, software, hardware, and digital transformation trends.', '💻', TRUE, 1, 
 ARRAY['technology', 'IT', 'digital transformation', 'software', 'artificial intelligence'], 
 'Technology Market Research Reports | TheBrainyInsights', 
 'Leading technology market research reports covering AI, software, hardware, and digital transformation trends with comprehensive market analysis.', 
 'PUBLISHED');

INSERT INTO reports (category_id, sku, slug, title, description, pages, published_date, base_year, forecast_period, key_findings, key_players, regions, industry_tags, keywords, semantic_keywords, meta_title, meta_description, single_price, multi_price, corporate_price, featured, priority, status)
SELECT 
    c.id,
    'TBI-AI-2025-001',
    'artificial-intelligence-market-2025',
    'Global Artificial Intelligence Market Analysis 2025',
    'Comprehensive analysis of the global AI market including machine learning, deep learning, natural language processing, and computer vision segments with detailed competitive landscape and growth forecasts.',
    285,
    CURRENT_DATE,
    2024,
    '2025-2030',
    ARRAY['AI market expected to grow at 36.8% CAGR through 2030', 'Machine learning segment dominates with 65% market share', 'Healthcare and automotive are fastest-growing application areas'],
    ARRAY['Google', 'Microsoft', 'IBM', 'Amazon', 'NVIDIA', 'Intel'],
    ARRAY['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'],
    ARRAY['artificial-intelligence', 'machine-learning', 'deep-learning', 'computer-vision'],
    ARRAY['artificial intelligence market', 'AI market size', 'machine learning growth', 'AI trends 2025'],
    ARRAY['AI adoption', 'intelligent systems', 'automated processes', 'cognitive computing'],
    'Global AI Market Analysis 2025 | $1.8T by 2030 | TheBrainyInsights',
    'Comprehensive AI market research covering machine learning, deep learning, NLP. 285-page report with 2025-2030 forecasts and competitive analysis.',
    4500.00,
    6750.00,
    9000.00,
    TRUE,
    100,
    'PUBLISHED'
FROM categories c WHERE c.shortcode = 'tech';

-- Create admin user (password is hashed version of "admin123")
INSERT INTO admins (email, username, first_name, last_name, password, role, status) VALUES
('admin@thebrainyinsights.com', 'superadmin', 'Super', 'Admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.', 'SUPERADMIN', 'ACTIVE');

COMMIT;