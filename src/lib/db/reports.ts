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
  ): Promise<{ reports: ReportWithTranslations[]; total: number }> {
    try {
      // Base SELECT
      let query = `
        SELECT
          r.id, r.slug, r.title, r.description, r.summary, r.pages, r.published_date,
          r.single_price, r.multi_price, r.corporate_price, r.featured, r.status,
          r.view_count, r.avg_rating, r.review_count, r.created_at, r.keywords, NULL AS semantic_keywords,
          NULL AS regional_keywords, NULL AS click_through_rate, NULL AS average_position, NULL AS impressions, NULL AS clicks,

          c.id AS category_id, c.slug AS category_slug, c.title AS category_title,

          rt.id AS translation_id, rt.locale AS translation_locale, rt.title AS translated_title,
          rt.description AS translated_description, rt.summary AS translated_summary, rt.slug AS translated_slug,
          rt.table_of_contents AS translated_table_of_contents, rt.methodology AS translated_methodology,
          rt.key_findings AS translated_key_findings, NULL AS translated_executive_summary,
          rt.keywords AS translated_keywords, NULL AS translated_semantic_keywords,
          NULL AS translated_localized_keywords, NULL AS translated_cultural_keywords,
          NULL AS translated_meta_title, NULL AS translated_meta_description,
          NULL AS translated_og_title, NULL AS translated_og_description,
          NULL AS translated_schema_markup, NULL AS translated_breadcrumb_data,
          NULL AS translated_faq_data, rt.ai_generated AS translation_ai_generated,
          rt.ai_generated AS translation_human_reviewed, NULL AS translation_quality,
          NULL AS translated_cultural_adaptation_score, NULL AS translation_job_id,
          NULL AS translated_search_performance, rt.status AS translation_status,

          r.review_count AS reviews_count,
          (SELECT COUNT(*) FROM enquiries     WHERE report_id = r.id) AS enquiries_count
        FROM reports r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_translations rt
          ON r.id = rt.report_id
         AND rt.locale = $1
         AND rt.status::text = 'PUBLISHED'
      `;

      // Filters (use enums via ::text and booleans as booleans)
      const filters: string[] = [`r.status::text = 'PUBLISHED'`];

      const params: (string | number | boolean)[] = [locale];
      let i = 2; // next $ index for main query

      if (options.categoryId) {
        filters.push(`r.category_id = $${i}`);
        params.push(options.categoryId);
        i++;
      }
      if (options.featured === true) {
        filters.push(`r.featured IS TRUE`);
      } else if (options.featured === false) {
        filters.push(`r.featured IS FALSE`);
      }

      if (filters.length) {
        query += ` WHERE ` + filters.join(' AND ');
      }

      // Sorting
      let orderByColumn = 'r.published_date';
      if (options.sortBy === 'createdAt') orderByColumn = 'r.created_at';
      if (options.sortBy === 'publishedDate') orderByColumn = 'r.published_date';
      if (options.sortBy === 'title') orderByColumn = 'r.title';
      const sortOrder = options.sortOrder === 'asc' ? 'ASC' : 'DESC';
      query += ` ORDER BY ${orderByColumn} ${sortOrder}`;

      // Pagination
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

      // Count query (separate params index)
      const countFilters: string[] = [`r.status::text = 'PUBLISHED'`];
      const countParams: (string | number | boolean)[] = [];
      let j = 1;

      if (options.categoryId) {
        countFilters.push(`r.category_id = $${j}`);
        countParams.push(options.categoryId);
        j++;
      }
      if (options.featured === true) {
        countFilters.push(`r.featured IS TRUE`);
      } else if (options.featured === false) {
        countFilters.push(`r.featured IS FALSE`);
      }

      let countQuery = `SELECT COUNT(*) FROM reports r`;
      if (countFilters.length) {
        countQuery += ` WHERE ` + countFilters.join(' AND ');
      }

      const [reportsResult, totalResult] = await Promise.all([
        db.query(query, params),
        db.query(countQuery, countParams),
      ]);

      const reports = reportsResult.rows.map((row: any) => {
        const report: ReportWithTranslations = {
          id: row.id,
          slug: row.translated_slug || row.slug,
          title: row.translated_title || row.title,
          description: row.translated_description || row.description,
          summary: row.translated_summary || row.summary,
          pages: row.pages,
          published_date: row.published_date,
          single_user_price: row.single_price,
          multi_user_price: row.multi_price,
          corporate_price: row.corporate_price,
          featured: row.featured,
          status: row.status,
          view_count: row.view_count,
          avg_rating: row.avg_rating,
          total_reviews: row.review_count,
          created_at: row.created_at,
          keywords: row.translated_keywords || row.keywords,
          semantic_keywords: row.semantic_keywords,
          regional_keywords: row.regional_keywords,
          click_through_rate: row.click_through_rate,
          average_position: row.average_position,
          impressions: row.impressions,
          clicks: row.clicks,
          // category display
          category_title: row.category_title,
          category_slug: row.category_slug,
          _count: {
            reviews: parseInt(String(row.reviews_count ?? 0), 10),
            enquiries: parseInt(String(row.enquiries_count ?? 0), 10),
          },
        };

        if (row.translation_id) {
          report.translations = [
            {
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
              localized_keywords: row.translated_localized_keywords,
              cultural_keywords: row.translated_cultural_keywords,
              meta_title: row.translated_meta_title,
              meta_description: row.translated_meta_description,
              og_title: row.translated_og_title,
              og_description: row.translated_og_description,
              schema_markup: row.translated_schema_markup,
              breadcrumb_data: row.translated_breadcrumb_data,
              faq_data: row.translated_faq_data,
              ai_generated: row.translation_ai_generated,
              human_reviewed: row.translation_human_reviewed,
              translation_quality: row.translation_quality,
              cultural_adaptation_score: row.translated_cultural_adaptation_score,
              translation_job_id: row.translation_job_id,
              search_performance: row.translated_search_performance,
              status: row.translation_status,
              // if you want translation timestamps, select/alias them explicitly
              created_at: row.created_at,
              updated_at: row.updated_at,
            },
          ];
        }
        return report;
      });

      return {
        reports,
        total: parseInt(String(totalResult.rows[0]?.count ?? 0), 10),
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
      // 1) Try finding by the main report slug (with overlay translation for locale)
      const query = `
        SELECT
          r.id, r.slug, r.title, r.description, r.summary, r.pages, r.published_date,
          r.single_price, r.multi_price, r.corporate_price, r.featured, r.status,
          r.view_count, r.avg_rating, r.review_count, r.created_at, r.keywords, NULL AS semantic_keywords,
          NULL AS regional_keywords, NULL AS click_through_rate, NULL AS average_position, NULL AS impressions, NULL AS clicks,

          c.id AS category_id, c.slug AS category_slug, c.title AS category_title,

          rt.id AS translation_id, rt.locale AS translation_locale, rt.title AS translated_title,
          rt.description AS translated_description, rt.summary AS translated_summary, rt.slug AS translated_slug,
          rt.table_of_contents AS translated_table_of_contents, rt.methodology AS translated_methodology,
          rt.key_findings AS translated_key_findings, NULL AS translated_executive_summary,
          rt.keywords AS translated_keywords, NULL AS translated_semantic_keywords,
          NULL AS translated_localized_keywords, NULL AS translated_cultural_keywords,
          NULL AS translated_meta_title, NULL AS translated_meta_description,
          NULL AS translated_og_title, NULL AS translated_og_description,
          NULL AS translated_schema_markup, NULL AS translated_breadcrumb_data,
          NULL AS translated_faq_data, rt.ai_generated AS translation_ai_generated,
          rt.ai_generated AS translation_human_reviewed, NULL AS translation_quality,
          NULL AS translated_cultural_adaptation_score, NULL AS translation_job_id,
          NULL AS translated_search_performance, rt.status AS translation_status,

          r.review_count AS reviews_count,
          (SELECT COUNT(*) FROM enquiries     WHERE report_id = r.id) AS enquiries_count
        FROM reports r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_translations rt
          ON r.id = rt.report_id
         AND rt.locale = $2
         AND rt.status::text = 'PUBLISHED'
        WHERE r.slug = $1
          AND r.status::text = 'PUBLISHED'
        LIMIT 1
      `;
      const params: (string | number | boolean)[] = [slug, locale];

      let result = await db.query(query, params);
      let row = result.rows[0];

      // 2) Fallback: find by translated slug for the locale
      if (!row) {
        const translatedQuery = `
          SELECT
            r.id, r.slug, r.title, r.description, r.summary, r.pages, r.published_date,
            r.single_price, r.multi_price, r.corporate_price, r.featured, r.status,
            r.view_count, r.avg_rating, r.review_count, r.created_at, r.keywords, NULL AS semantic_keywords,
            NULL AS regional_keywords, NULL AS click_through_rate, NULL AS average_position, NULL AS impressions, NULL AS clicks,

            c.id AS category_id, c.slug AS category_slug, c.title AS category_title,

            rt.id AS translation_id, rt.locale AS translation_locale, rt.title AS translated_title,
            rt.description AS translated_description, rt.summary AS translated_summary, rt.slug AS translated_slug,
            rt.table_of_contents AS translated_table_of_contents, rt.methodology AS translated_methodology,
            rt.key_findings AS translated_key_findings, NULL AS translated_executive_summary,
            rt.keywords AS translated_keywords, NULL AS translated_semantic_keywords,
            NULL AS translated_localized_keywords, NULL AS translated_cultural_keywords,
            NULL AS translated_meta_title, NULL AS translated_meta_description,
            NULL AS translated_og_title, NULL AS translated_og_description,
            NULL AS translated_schema_markup, NULL AS translated_breadcrumb_data,
            NULL AS translated_faq_data, rt.ai_generated AS translation_ai_generated,
            rt.ai_generated AS translation_human_reviewed, NULL AS translation_quality,
            NULL AS translated_cultural_adaptation_score, NULL AS translation_job_id,
            NULL AS translated_search_performance, rt.status AS translation_status,

            r.review_count AS reviews_count,
            (SELECT COUNT(*) FROM enquiries     WHERE report_id = r.id) AS enquiries_count
          FROM reports r
          JOIN report_translations rt
            ON r.id = rt.report_id
          LEFT JOIN categories c ON r.category_id = c.id
          WHERE rt.slug = $1
            AND rt.locale = $2
            AND rt.status::text = 'PUBLISHED'
            AND r.status::text = 'PUBLISHED'
          LIMIT 1
        `;
        result = await db.query(translatedQuery, [slug, locale]);
        row = result.rows[0];
        if (!row) return null;
      }

      const report: ReportWithTranslations = {
        id: row.id,
        slug: row.translated_slug || row.slug,
        title: row.translated_title || row.title,
        description: row.translated_description || row.description,
        summary: row.translated_summary || row.summary,
        pages: row.pages,
        published_date: row.published_date,
        single_user_price: row.single_user_price,
        multi_user_price: row.multi_user_price,
        corporate_price: row.corporate_price,
        featured: row.featured,
        status: row.status,
        view_count: row.view_count,
        avg_rating: row.avg_rating,
        total_reviews: row.total_reviews,
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
          reviews: parseInt(String(row.reviews_count ?? 0), 10),
          enquiries: parseInt(String(row.enquiries_count ?? 0), 10),
        },
      };

      if (row.translation_id) {
        report.translations = [
          {
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
            localized_keywords: row.translated_localized_keywords,
            cultural_keywords: row.translated_cultural_keywords,
            meta_title: row.translated_meta_title,
            meta_description: row.translated_meta_description,
            og_title: row.translated_og_title,
            og_description: row.translated_og_description,
            schema_markup: row.translated_schema_markup,
            breadcrumb_data: row.translated_breadcrumb_data,
            faq_data: row.translated_faq_data,
            ai_generated: row.translation_ai_generated,
            human_reviewed: row.translation_human_reviewed,
            translation_quality: row.translation_quality,
            cultural_adaptation_score: row.translated_cultural_adaptation_score,
            translation_job_id: row.translation_job_id,
            search_performance: row.translated_search_performance,
            status: row.translation_status,
            created_at: row.created_at,
            updated_at: row.updated_at,
          },
        ];
      }

      return report;
    } catch (error) {
      console.error('Error fetching report by slug:', error);
      return null;
    }
  }
}
