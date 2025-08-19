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
