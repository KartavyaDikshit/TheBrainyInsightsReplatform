import { db, Report, Category, ReportTranslation } from '@tbi/database';

export type ReportWithTranslations = Report & {
  translations?: ReportTranslation[];
  category?: Category;
  _count?: { reviews: number; enquiries: number };
  regional_keywords?: any;
};

export class ReportService {
  static async getAll(
    locale = 'en',
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
      let query = `
        SELECT
          r.id, r.slug, r.title, r.description, r.summary, r.pages, r.published_date,
          r.single_price, r.multi_price, r.corporate_price, r.featured, r.status,
          r.view_count, r.avg_rating, r.review_count, r.created_at, r.keywords, r.semantic_keywords,
          r.regional_keywords, r.click_through_rate, r.average_position, r.impressions, r.clicks,
          c.id as category_id, c.slug as category_slug, c.title as category_title,
          rt.id as translation_id, rt.locale as translation_locale, rt.title as translated_title,
          rt.description as translated_description, rt.summary as translated_summary, rt.slug as translated_slug,
          rt.table_of_contents as translated_table_of_contents, rt.methodology as translated_methodology,
          rt.key_findings as translated_key_findings, rt.executive_summary as translated_executive_summary,
          rt.keywords as translated_keywords, rt.semantic_keywords as translated_semantic_keywords,
          rt.localized_keywords as translated_localized_keywords, rt.cultural_keywords as translated_cultural_keywords,
          rt.meta_title as translated_meta_title, rt.meta_description as translated_meta_description,
          rt.og_title as translated_og_title, rt.og_description as translated_og_description,
          rt.schema_markup as translated_schema_markup, rt.breadcrumb_data as translated_breadcrumb_data,
          rt.faq_data as translated_faq_data, rt.ai_generated as translation_ai_generated,
          rt.human_reviewed as translation_human_reviewed, rt.translation_quality as translation_quality,
          rt.cultural_adaptation_score as translated_cultural_adaptation_score, rt.translation_job_id as translation_job_id,
          rt.search_performance as translated_search_performance, rt.status as translation_status,
          (SELECT COUNT(*) FROM report_reviews WHERE report_id = r.id) as reviews_count,
          (SELECT COUNT(*) FROM enquiries WHERE report_id = r.id) as enquiries_count
        FROM reports r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_translations rt ON r.id = rt.report_id AND rt.locale = $1 AND rt.status = 'PUBLISHED'
        WHERE r.status = 'PUBLISHED'
      `;
      let countQuery = `SELECT COUNT(*) FROM reports r WHERE r.status = 'PUBLISHED'`;
      const params: (string | boolean | number)[] = [locale];
      const countParams: (string | boolean | number)[] = [];
      let paramIndex = 2;

      if (options.categoryId) {
        query += ` AND r.category_id = ${paramIndex}`;
        countQuery += ` AND r.category_id = ${paramIndex}`;
        params.push(options.categoryId);
        countParams.push(options.categoryId);
        paramIndex++;
      }
      if (options.featured !== undefined) {
        query += ` AND r.featured = ${paramIndex}`;
        countQuery += ` AND r.featured = ${paramIndex}`;
        params.push(options.featured);
        countParams.push(options.featured);
        paramIndex++;
      }

      let orderByColumn = 'r.published_date';
      if (options.sortBy === 'createdAt') orderByColumn = 'r.created_at';
      if (options.sortBy === 'publishedDate') orderByColumn = 'r.published_date';
      if (options.sortBy === 'title') orderByColumn = 'r.title';

      const sortOrder = options.sortOrder === 'asc' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${orderByColumn} ${sortOrder}`;

      if (options.limit) {
        query += ` LIMIT ${paramIndex}`;
        params.push(options.limit);
        paramIndex++;
      }
      if (options.offset) {
        query += ` OFFSET ${paramIndex}`;
        params.push(options.offset);
        paramIndex++;
      }

      const [reportsResult, totalResult] = await Promise.all([
        db.query(query, params),
        db.query(countQuery, countParams)
      ]);

      const reports = reportsResult.rows.map((row: any) => {
        const report: ReportWithTranslations = {
          id: row.id,
          slug: row.slug,
          title: row.translated_title || row.title,
          description: row.translated_description || row.description,
          summary: row.translated_summary || row.summary,
          pages: row.pages,
          published_date: row.published_date,
          single_price: row.single_price,
          multi_price: row.multi_price,
          corporate_price: row.corporate_price,
          featured: row.featured,
          status: row.status,
          view_count: row.view_count,
          avg_rating: row.avg_rating,
          review_count: row.review_count,
          created_at: row.created_at,
          keywords: row.translated_keywords || row.keywords,
          semantic_keywords: row.semantic_keywords,
          regional_keywords: row.regional_keywords,
          click_through_rate: row.click_through_rate,
          average_position: row.average_position,
          impressions: row.impressions,
          clicks: row.clicks,
          category_title: row.category_title,
          category_slug: row.category_slug,
          _count: {
            reviews: parseInt(row.reviews_count),
            enquiries: parseInt(row.enquiries_count)
          }
        };

        if (row.translation_id) {
          report.translations = [{
            id: row.translation_id,
            report_id: row.id,
            locale: row.translation_locale,
            title: row.translated_title,
            description: row.translated_description,
            summary: row.translated_summary,
            slug: row.translated_slug,
            table_of_contents: row.translated_table_of_contents,
            methodology: row.translated_methodology,
            key_findings: row.translated_key_findings,
            executive_summary: row.translated_executive_summary,
            keywords: row.translated_keywords,
            semantic_keywords: row.translated_semantic_keywords,
            localized_keywords: row.localized_keywords,
            cultural_keywords: row.cultural_keywords,
            meta_title: row.translated_meta_title,
            meta_description: row.translated_meta_description,
            og_title: row.translated_og_title,
            og_description: row.translated_og_description,
            schema_markup: row.translated_schema_markup,
            breadcrumb_data: row.translated_breadcrumb_data,
            faq_data: row.translated_faq_data,
            ai_generated: row.translation_ai_generated,
            human_reviewed: row.human_reviewed,
            translation_quality: row.translation_quality,
            cultural_adaptation_score: row.translated_cultural_adaptation_score,
            translation_job_id: row.translation_job_id,
            search_performance: row.translated_search_performance,
            status: row.translation_status,
            created_at: row.created_at,
            updated_at: row.updated_at,
          }];
        }
        return report;
      });

      return {
        reports,
        total: parseInt(totalResult.rows[0].count)
      };
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }
  }

  static async getBySlug(
    slug: string, 
    locale = 'en'
  ): Promise<ReportWithTranslations | null> {
    try {
      let query = ``;
      let params: (string | boolean)[] = [];

      if (locale === 'en') {
        query = `
          SELECT
            r.id, r.slug, r.title, r.description, r.summary, r.pages, r.published_date,
            r.single_price, r.multi_price, r.corporate_price, r.featured, r.status,
            r.view_count, r.avg_rating, r.review_count, r.created_at, r.keywords, r.semantic_keywords,
            r.regional_keywords, r.click_through_rate, r.average_position, r.impressions, r.clicks,
            c.id as category_id, c.slug as category_slug, c.title as category_title,
            rt.id as translation_id, rt.locale as translation_locale, rt.title as translated_title,
            rt.description as translated_description, rt.summary as translated_summary, rt.slug as translated_slug,
            rt.table_of_contents as translated_table_of_contents, rt.methodology as translated_methodology,
            rt.key_findings as translated_key_findings, rt.executive_summary as translated_executive_summary,
            rt.keywords as translated_keywords,
            rt.semantic_keywords as translated_semantic_keywords,
            rt.localized_keywords as translated_localized_keywords,
            rt.cultural_keywords as translated_cultural_keywords,
            rt.meta_title as translated_meta_title,
            rt.meta_description as translated_meta_description,
            rt.og_title as translated_og_title,
            rt.og_description as translated_og_description,
            rt.schema_markup as translated_schema_markup,
            rt.breadcrumb_data as translated_breadcrumb_data,
            rt.faq_data as translated_faq_data,
            rt.ai_generated as translation_ai_generated,
            rt.human_reviewed as translation_human_reviewed,
            rt.translation_quality as translation_quality,
            rt.cultural_adaptation_score as translated_cultural_adaptation_score,
            rt.translation_job_id as translation_job_id,
            rt.search_performance as translated_search_performance,
            rt.status as translation_status,
            (SELECT COUNT(*) FROM report_reviews WHERE report_id = r.id) as reviews_count,
            (SELECT COUNT(*) FROM enquiries WHERE report_id = r.id) as enquiries_count
          FROM reports r
          LEFT JOIN categories c ON r.category_id = c.id
          JOIN report_translations rt ON r.id = rt.report_id
          WHERE rt.slug = $1 AND rt.locale = $2 AND rt.status = 'PUBLISHED'
        `;
        params = [slug, locale];
      }

      const result = await db.query(query, params);
      const row = result.rows[0];

      if (!row) {
        return null;
      }

      const report: ReportWithTranslations = {
        id: row.id,
        slug: row.translated_slug || row.slug,
        title: row.translated_title || row.title,
        description: row.translated_description || row.description,
        summary: row.translated_summary || row.summary,
        pages: row.pages,
        published_date: row.published_date,
        single_price: row.single_price,
        multi_price: row.multi_price,
        corporate_price: row.corporate_price,
        featured: row.featured,
        status: row.status,
        view_count: row.view_count,
        avg_rating: row.avg_rating,
        review_count: row.review_count,
        created_at: row.created_at,
        keywords: row.translated_keywords || row.keywords,
        semantic_keywords: row.semantic_keywords,
        regional_keywords: row.regional_keywords,
        click_through_rate: row.click_through_rate,
        average_position: row.average_position,
        impressions: row.impressions,
        clicks: row.clicks,
        category_title: row.category_title,
        category_slug: row.category_slug,
        _count: {
          reviews: parseInt(row.reviews_count),
          enquiries: parseInt(row.enquiries_count)
        }
      };

      if (row.translation_id) {
        report.translations = [{
          id: row.translation_id,
          report_id: row.id,
          locale: row.translation_locale,
          title: row.translated_title,
          description: row.translated_description,
          summary: row.translated_summary,
          slug: row.translated_slug,
          table_of_contents: row.translated_table_of_contents,
          methodology: row.translated_methodology,
          key_findings: row.translated_key_findings,
          executive_summary: row.translated_executive_summary,
          keywords: row.translated_keywords,
          semantic_keywords: row.translated_semantic_keywords,
          localized_keywords: row.localized_keywords,
          cultural_keywords: row.cultural_keywords,
          meta_title: row.translated_meta_title,
          meta_description: row.translated_meta_description,
          og_title: row.translated_og_title,
          og_description: row.translated_og_description,
          schema_markup: row.translated_schema_markup,
          breadcrumb_data: row.translated_breadcrumb_data,
          faq_data: row.translated_faq_data,
          ai_generated: row.translation_ai_generated,
          human_reviewed: row.human_reviewed,
          translation_quality: row.translation_quality,
          cultural_adaptation_score: row.translated_cultural_adaptation_score,
          translation_job_id: row.translation_job_id,
          search_performance: row.translated_search_performance,
          status: row.translation_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }];
      }
      return report;
    } catch (error) {
      console.error('Error fetching report by slug:', error);
      return null;
    }
  }
}