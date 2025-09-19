import { Pool } from 'pg';

// Enhanced PostgreSQL client wrapper with full schema support
export class DatabaseClient {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:tbipassword@localhost:5432/tbi_db'
    });
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release(); // Release client back to the pool
    }
  }

// --- FIXED getCategories ---
async getCategories(locale: string = 'en', featured?: boolean): Promise<any[]> {
  let query = `
    SELECT
      c.id, c.shortcode, c.slug, c.title, c.description, c.icon,
      c.featured, c.status, c.view_count, c.created_at,
      ct.title AS localized_title, ct.description AS localized_description,
      ct.slug  AS localized_slug, ct.meta_title, ct.meta_description
    FROM categories c
    LEFT JOIN category_translations ct
      ON c.id = ct.category_id
     AND ct.locale = $1
     AND ct.status = 'PUBLISHED'
    WHERE c.status = 'PUBLISHED'
  `;

  const params: any[] = [locale];
  let i = 2;

  if (featured !== undefined) {
    query += ` AND c.featured = $${i}::boolean`;
    params.push(Boolean(featured));
    i++;
  }

  query += ` ORDER BY c.sort_order ASC, c.title ASC`;

  const result = await this.query(query, params);

  return result.rows.map((row: Category) => ({
    ...row,
    title: row.localized_title || row.title,
    description: row.localized_description || row.description,
    slug: row.localized_slug || row.slug,
  }));
}

// --- FIXED getReports ---
async getReports(
  locale: string = 'en',
  options: {
    categoryId?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<any[]> {
  let query = `
    SELECT
      r.id, r.slug, r.title, r.description, r.summary, r.pages,
      r.published_date, r.single_user_price, r.multi_user_price, r.corporate_price,
      r.featured, r.status, r.view_count, r.avg_rating, r.total_reviews,
      r.created_at, r.keywords, r.semantic_keywords,
      c.title AS category_title, c.slug AS category_slug,
      rt.title AS localized_title, rt.description AS localized_description,
      rt.summary AS localized_summary, rt.slug AS localized_slug,
      rt.meta_title, rt.meta_description
    FROM reports r
    LEFT JOIN categories c ON r.category_id = c.id
    LEFT JOIN report_translations rt
      ON r.id = rt.report_id
     AND rt.locale = $1
     AND rt.status = 'PUBLISHED'
    WHERE r.status = 'PUBLISHED'
  `;

  const params: any[] = [locale];
  let i = 2;

  if (options.categoryId) {
    query += ` AND r.category_id = $${i}`;
    params.push(options.categoryId);
    i++;
  }

  if (options.featured !== undefined) {
    query += ` AND r.featured = $${i}::boolean`;
    params.push(Boolean(options.featured));
    i++;
  }

  query += ` ORDER BY r.featured DESC, r.published_date DESC`;

  if (typeof options.limit === 'number') {
    query += ` LIMIT $${i}`;
    params.push(options.limit);
    i++;
  }

  if (typeof options.offset === 'number') {
    query += ` OFFSET $${i}`;
    params.push(options.offset);
    i++;
  }

  const result = await this.query(query, params);

  return result.rows.map((row: Report) => ({
    ...row,
    title: row.localized_title || row.title,
    description: row.localized_description || row.description,
    summary: row.localized_summary || row.summary,
    slug: row.localized_slug || row.slug,
  }));
}


  // AI workflow methods
  async createContentGenerationWorkflow(data: any): Promise<string> {
    const result = await this.query(`
      INSERT INTO ai_content_generations 
      (content_type, content_id, locale, prompt, model, generated_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `, [data.contentType, data.contentId, data.locale, data.prompt, data.model, data.generatedBy]);
    
    return result.rows[0].id;
  }

  // Translation methods
  async createTranslationJob(data: any): Promise<string> {
    const result = await this.query(`
      INSERT INTO translation_jobs 
      (content_type, content_id, source_locale, target_locale, field_name, original_text, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [data.contentType, data.contentId, data.sourceLocale, data.targetLocale, data.fieldName, data.originalText, data.createdBy]);
    
    return result.rows[0].id;
  }

  // Analytics methods
  async getCategoryCount(): Promise<number> {
    const result = await this.query(`SELECT COUNT(*) as count FROM categories WHERE status = 'PUBLISHED'`);
    return parseInt(result.rows[0].count);
  }

  async getReportCount(): Promise<number> {
    const result = await this.query(`SELECT COUNT(*) as count FROM reports WHERE status = 'PUBLISHED'`);
    return parseInt(result.rows[0].count);
  }

  async getWorkflowCount(): Promise<number> {
    const result = await this.query(`SELECT COUNT(*) as count FROM ai_content_generations`);
    return parseInt(result.rows[0].count);
  }

  async getTranslationJobCount(): Promise<number> {
    const result = await this.query(`SELECT COUNT(*) as count FROM translation_jobs`);
    return parseInt(result.rows[0].count);
  }

  // SEO analytics - Note: table doesn't exist in migration, commenting out for now
  async getTopKeywords(limit: number = 10): Promise<any[]> {
    // Table seo_analytics doesn't exist in migration, return empty array
    return [];
    /*
    const result = await this.query(`
      SELECT keyword, SUM(impressions) as total_impressions, 
             SUM(clicks) as total_clicks, AVG(ctr) as avg_ctr
      FROM seo_analytics 
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY keyword
      ORDER BY total_impressions DESC
      LIMIT $1
    `, [limit]);
    
    return result.rows;
    */
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// Export singleton instance
export const db = new DatabaseClient();

// Enhanced TypeScript interfaces
export interface Category {
  id: string;
  shortcode: string;
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  featured: boolean;
  sort_order: number;
  seo_keywords?: string[];
  regional_keywords?: any;
  search_volume?: any;
  canonical_url?: string;
  status: string;
  view_count: number;
  click_count?: number;
  created_at: Date;
  updated_at: Date; // Add this line
  meta_title?: string;
  meta_description?: string;
  localized_title?: string;
  localized_description?: string;
  localized_slug?: string;
}

export interface Report {
  id: string;
  slug: string;
  title: string;
  description: string;
  summary?: string;
  pages: number;
  published_date: Date;
  single_user_price?: number;
  multi_user_price?: number;
  corporate_price?: number;
  featured: boolean;
  status: string;
  view_count: number;
  avg_rating?: number;
  total_reviews: number;
  created_at: Date;
  category_title?: string;
  category_slug?: string;
  keywords?: string[];
  semantic_keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  localized_title?: string;
  localized_description?: string;
  localized_summary?: string;
  localized_slug?: string;
  click_through_rate?: number;
  average_position?: number;
  impressions?: number;
  clicks?: number;
}

export interface ReportTranslation {
  id: string;
  report_id: string;
  locale: string;
  title: string;
  description: string;
  summary?: string;
  slug: string;
  table_of_contents?: string;
  list_of_figures?: string;
  methodology?: string;
  key_findings?: string[];
  executive_summary?: string;
  keywords?: string[];
  semantic_keywords?: string[];
  localized_keywords?: string[];
  cultural_keywords?: string[];
  long_tail_keywords?: string[];
  local_competitor_keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  schema_markup?: any;
  breadcrumb_data?: any;
  faq_data?: any;
  local_business_schema?: any;
  translation_job_id?: string;
  ai_generated?: boolean;
  human_reviewed?: boolean;
  translation_quality?: number;
  cultural_adaptation_score?: number;
  cultural_adaptation_notes?: string;
  localization_notes?: string;
  search_performance?: any;
  local_rankings?: any;
  regional_ctr?: number;
  regional_impressions?: number;
  regional_clicks?: number;
  status?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContentGenerationWorkflow {
  id: string;
  industry: string;
  geographic_scope: string;
  timeframe: string;
  workflow_status: string;
  created_at: Date;
}

export interface TranslationJob {
  id: string;
  content_type: string;
  source_locale: string;
  target_locale: string;
  field_name: string;
  status: string;
  created_at: Date;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.close();
});

process.on('SIGINT', async () => {
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await db.close();
  process.exit(0);
});