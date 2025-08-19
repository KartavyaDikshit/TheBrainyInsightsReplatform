-- Enable required extensions for TheBrainyInsights
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

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