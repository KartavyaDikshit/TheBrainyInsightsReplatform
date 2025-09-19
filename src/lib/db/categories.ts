import { db, Category } from '@tbi/database';

interface CategoryTranslation {
  id: string;
  category_id: string;
  locale: string;
  title: string;
  description?: string;
  slug: string;
  seo_keywords?: string[];
  localized_keywords?: string[];
  cultural_keywords?: string[];
  meta_title?: string;
  meta_description?: string;
  ai_generated?: boolean;
  human_reviewed?: boolean;
  translation_quality?: number;
  translation_job_id?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export type CategoryWithTranslations = Category & {
  translations?: CategoryTranslation[];
  _count?: { reports: number };
};

export class CategoryService {
  /**
   * List categories with optional locale overlay.
   * - Uses translation SEO/meta when available.
   * - Compares enums via ::text for safety.
   * - Compares booleans as booleans.
   */
  static async getAll(
    locale = 'en',
    options: {
      featured?: boolean;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<CategoryWithTranslations[]> {
    try {
      let query = `
        SELECT
          c.id,
          c.shortcode,
          c.slug,
          c.title,
          c.description,
          c.icon,
          c.featured,
          c.sort_order,
          c.seo_metadata,
          NULL AS search_volume,
          NULL AS meta_title,
          NULL AS meta_description,
          NULL AS canonical_url,
          c.status,
          c.view_count,
          0 AS click_count,
          c.created_at,
          c.updated_at,

          ct.id                  AS translation_id,
          ct.locale              AS translation_locale,
          ct.title               AS translated_title,
          ct.description         AS translated_description,
          ct.slug                AS translated_slug,
          NULL AS translated_seo_keywords,
          NULL AS translated_localized_keywords,
          NULL AS translated_cultural_keywords,
          NULL AS translated_meta_title,
          NULL AS translated_meta_description,
          NULL AS translation_ai_generated,
          NULL AS translation_human_reviewed,
          NULL AS translation_quality,
          NULL AS translation_job_id,
          ct.status              AS translation_status,

          (
            SELECT COUNT(*)
            FROM reports r
            WHERE r.category_id = c.id
              AND r.status::text = 'PUBLISHED'
          ) AS reports_count
        FROM categories c
        LEFT JOIN category_translations ct
          ON ct.category_id = c.id
         AND ct.locale = $1
         AND ct.status::text = 'PUBLISHED'
        WHERE c.status::text = 'PUBLISHED'
      `;

      const params: (string | boolean | number)[] = [locale];
      let i = 2;

      if (options.featured !== undefined) {
        // bind strictly as boolean
        query += ` AND c.featured = $${i}::boolean`;
        params.push(Boolean(options.featured));
        i++;
      }

      query += ` ORDER BY c.sort_order ASC NULLS LAST, c.created_at DESC`;

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

      const result = await db.query(query, params);

      return result.rows.map((row: any) => {
        const category: CategoryWithTranslations = {
          id: row.id,
          shortcode: row.shortcode,
          slug: row.slug,
          title: row.translated_title ?? row.title,
          description: row.translated_description ?? row.description,
          icon: row.icon,
          featured: row.featured,
          sort_order: row.sort_order,
          // Prefer translated SEO/meta if present
          seo_keywords: row.translated_seo_keywords ?? null,
          regional_keywords: row.regional_keywords ?? row.translated_localized_keywords ?? null,
          search_volume: row.search_volume ?? null,
          meta_title: row.translated_meta_title ?? row.meta_title ?? null,
          meta_description: row.translated_meta_description ?? row.meta_description ?? null,
          canonical_url: row.canonical_url ?? null,
          status: row.status,
          view_count: row.view_count,
          click_count: row.click_count,
          created_at: row.created_at,
          updated_at: row.updated_at,
          _count: { reports: parseInt(String(row.reports_count ?? 0), 10) },
        };

        if (row.translation_id) {
          category.translations = [
            {
              id: row.translation_id,
              category_id: row.id,
              locale: row.translation_locale,
              title: row.translated_title,
              description: row.translated_description,
              slug: row.translated_slug,
              seo_keywords: row.translated_seo_keywords,
              localized_keywords: row.translated_localized_keywords,
              cultural_keywords: row.translated_cultural_keywords,
              meta_title: row.translated_meta_title,
              meta_description: row.translated_meta_description,
              ai_generated: row.translation_ai_generated,
              human_reviewed: row.translation_human_reviewed,
              translation_quality: row.translation_quality,
              translation_job_id: row.translation_job_id,
              status: row.translation_status,
              // If translations table has its own timestamps, select/alias them explicitly.
              created_at: row.created_at,
              updated_at: row.updated_at,
            },
          ];
        }

        return category;
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * Fetch a single category by slug, with locale overlay and fallback by translated slug.
   */
  static async getBySlug(
    slug: string,
    locale = 'en'
  ): Promise<CategoryWithTranslations | null> {
    try {
      const query = `
        SELECT
          c.id,
          c.shortcode,
          c.slug,
          c.title,
          c.description,
          c.icon,
          c.featured,
          c.sort_order,
          c.seo_metadata,
          NULL AS search_volume,
          NULL AS meta_title,
          NULL AS meta_description,
          NULL AS canonical_url,
          c.status,
          c.view_count,
          0 AS click_count,
          c.created_at,
          c.updated_at,

          ct.id                  AS translation_id,
          ct.locale              AS translation_locale,
          ct.title               AS translated_title,
          ct.description         AS translated_description,
          ct.slug                AS translated_slug,
          NULL AS translated_seo_keywords,
          NULL AS translated_localized_keywords,
          NULL AS translated_cultural_keywords,
          NULL AS translated_meta_title,
          NULL AS translated_meta_description,
          NULL AS translation_ai_generated,
          NULL AS translation_human_reviewed,
          NULL AS translation_quality,
          NULL AS translation_job_id,
          ct.status              AS translation_status,

          (
            SELECT COUNT(*)
            FROM reports r
            WHERE r.category_id = c.id
              AND r.status::text = 'PUBLISHED'
          ) AS reports_count
        FROM categories c
        LEFT JOIN category_translations ct
          ON ct.category_id = c.id
         AND ct.locale = $2
         AND ct.status::text = 'PUBLISHED'
        WHERE c.slug = $1
        LIMIT 1
      `;
      const params: (string | boolean | number)[] = [slug, locale];

      const result = await db.query(query, params);
      let row = result.rows[0];

      if (!row) {
        // Fallback: find by translated slug
        const translatedQuery = `
          SELECT
            c.id,
            c.shortcode,
            c.slug,
            c.title,
            c.description,
            c.icon,
            c.featured,
            c.sort_order,
            c.seo_metadata,
            NULL AS search_volume,
            NULL AS meta_title,
            NULL AS meta_description,
            NULL AS canonical_url,
            c.status,
            c.view_count,
            0 AS click_count,
            c.created_at,
            c.updated_at,

            ct.id                  AS translation_id,
            ct.locale              AS translation_locale,
            ct.title               AS translated_title,
            ct.description         AS translated_description,
            ct.slug                AS translated_slug,
            NULL AS translated_seo_keywords,
            NULL AS translated_localized_keywords,
            NULL AS translated_cultural_keywords,
            NULL AS translated_meta_title,
            NULL AS translated_meta_description,
            NULL AS translation_ai_generated,
            NULL AS translation_human_reviewed,
            NULL AS translation_quality,
            NULL AS translation_job_id,
            ct.status              AS translation_status,

            (
              SELECT COUNT(*)
              FROM reports r
              WHERE r.category_id = c.id
                AND r.status::text = 'PUBLISHED'
            ) AS reports_count
          FROM categories c
          JOIN category_translations ct
            ON ct.category_id = c.id
          WHERE ct.slug = $1
            AND ct.locale = $2
            AND ct.status::text = 'PUBLISHED'
          LIMIT 1
        `;
        const translatedResult = await db.query(translatedQuery, [slug, locale]);
        row = translatedResult.rows[0];
        if (!row) return null;
      }

      const category: CategoryWithTranslations = {
        id: row.id,
        shortcode: row.shortcode,
        slug: row.slug,
        title: row.translated_title ?? row.title,
        description: row.translated_description ?? row.description,
        icon: row.icon,
        featured: row.featured,
        sort_order: row.sort_order,
        seo_keywords: row.translated_seo_keywords ?? null,
        regional_keywords: row.regional_keywords ?? row.translated_localized_keywords ?? null,
        search_volume: row.search_volume ?? null,
        meta_title: row.translated_meta_title ?? row.meta_title ?? null,
        meta_description: row.translated_meta_description ?? row.meta_description ?? null,
        canonical_url: row.canonical_url ?? null,
        status: row.status,
        view_count: row.view_count,
        click_count: row.click_count,
        created_at: row.created_at,
        updated_at: row.updated_at,
        _count: { reports: parseInt(String(row.reports_count ?? 0), 10) },
        translations: row.translation_id
          ? [
              {
                id: row.translation_id,
                category_id: row.id,
                locale: row.translation_locale,
                title: row.translated_title,
                description: row.translated_description,
                slug: row.translated_slug,
                seo_keywords: row.translated_seo_keywords,
                localized_keywords: row.translated_localized_keywords,
                cultural_keywords: row.translated_cultural_keywords,
                meta_title: row.translated_meta_title,
                meta_description: row.translated_meta_description,
                ai_generated: row.translation_ai_generated,
                human_reviewed: row.translation_human_reviewed,
                translation_quality: row.translation_quality,
                translation_job_id: row.translation_job_id,
                status: row.translation_status,
                created_at: row.created_at,
                updated_at: row.updated_at,
              },
            ]
          : [],
      };

      return category;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }
}
