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
          c.id, c.shortcode, c.slug, c.title, c.description, c.icon, c.featured, c.sort_order,
          c.seo_keywords, c.regional_keywords, c.search_volume, c.meta_title, c.meta_description,
          c.canonical_url, c.status, c.view_count, c.click_count, c.created_at, c.updated_at,
          ct.id as translation_id, ct.locale as translation_locale, ct.title as translated_title,
          ct.description as translated_description, ct.slug as translated_slug,
          ct.seo_keywords as translated_seo_keywords, ct.localized_keywords as translated_localized_keywords,
          ct.cultural_keywords as translated_cultural_keywords, ct.meta_title as translated_meta_title,
          ct.meta_description as translated_meta_description, ct.ai_generated as translation_ai_generated,
          ct.human_reviewed as translation_human_reviewed, ct.translation_quality as translation_quality,
          ct.translation_job_id as translation_job_id, ct.status as translation_status,
          (SELECT COUNT(*) FROM reports WHERE category_id = c.id) as reports_count
        FROM categories c
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $1 AND ct.status = 'PUBLISHED'
        WHERE c.status = 'PUBLISHED'
      `;
      const params: (string | boolean | number)[] = [locale];
      let paramIndex = 2;

      if (options.featured !== undefined) {
        query += ` AND c.featured = ${paramIndex}`;
        params.push(options.featured);
        paramIndex++;
      }

      query += ` ORDER BY c.sort_order ASC, c.created_at DESC`;

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

      const result = await db.query(query, params);

      return result.rows.map((row: any) => {
        const category: CategoryWithTranslations = {
          id: row.id,
          shortcode: row.shortcode,
          slug: row.slug,
          title: row.translated_title || row.title,
          description: row.translated_description || row.description,
          icon: row.icon,
          featured: row.featured,
          sort_order: row.sort_order,
          seo_keywords: row.seo_keywords,
          regional_keywords: row.regional_keywords,
          search_volume: row.search_volume,
          meta_title: row.translated_meta_title || row.meta_title,
          meta_description: row.translated_meta_description || row.meta_description,
          canonical_url: row.canonical_url,
          status: row.status,
          view_count: row.view_count,
          click_count: row.click_count,
          created_at: row.created_at,
          updated_at: row.updated_at,
          _count: { reports: parseInt(row.reports_count) },
        };

        if (row.translation_id) {
          category.translations = [{
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
            created_at: row.created_at, // Assuming translation created_at is same as category for simplicity
            updated_at: row.updated_at, // Assuming translation updated_at is same as category for simplicity
          }];
        }
        return category;
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  static async getBySlug(
    slug: string, 
    locale = 'en'
  ): Promise<CategoryWithTranslations | null> {
    try {
      const query = `
        SELECT
          c.id, c.shortcode, c.slug, c.title, c.description, c.icon, c.featured, c.sort_order,
          c.seo_keywords, c.regional_keywords, c.search_volume, c.meta_title, c.meta_description,
          c.canonical_url, c.status, c.view_count, c.click_count, c.created_at, c.updated_at,
          ct.id as translation_id, ct.locale as translation_locale, ct.title as translated_title,
          ct.description as translated_description, ct.slug as translated_slug,
          ct.seo_keywords as translated_seo_keywords, ct.localized_keywords as translated_localized_keywords,
          ct.cultural_keywords as translated_cultural_keywords, ct.meta_title as translated_meta_title,
          ct.meta_description as translated_meta_description, ct.ai_generated as translation_ai_generated,
          ct.human_reviewed as translation_human_reviewed, ct.translation_quality as translation_quality,
          ct.translation_job_id as translation_job_id, ct.status as translation_status,
          (SELECT COUNT(*) FROM reports WHERE category_id = c.id) as reports_count
        FROM categories c
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $2 AND ct.status = 'PUBLISHED'
        WHERE c.slug = $1
        LIMIT 1
      `;
      const params: (string | boolean | number)[] = [slug, locale];

      const result = await db.query(query, params);
      const row = result.rows[0];

      if (!row) {
        // If not found by main slug, try finding by translated slug
        const translatedQuery = `
          SELECT
            c.id, c.shortcode, c.slug, c.title, c.description, c.icon, c.featured, c.sort_order,
            c.seo_keywords, c.regional_keywords, c.search_volume, c.meta_title, c.meta_description,
            c.canonical_url, c.status, c.view_count, c.click_count, c.created_at, c.updated_at,
            ct.id as translation_id, ct.locale as translation_locale, ct.title as translated_title,
            ct.description as translated_description, ct.slug as translated_slug,
            ct.seo_keywords as translated_seo_keywords, ct.localized_keywords as translated_localized_keywords,
            ct.cultural_keywords as translated_cultural_keywords, ct.meta_title as translated_meta_title,
            ct.meta_description as translated_meta_description, ct.ai_generated as translation_ai_generated,
            ct.human_reviewed as translation_human_reviewed, ct.translation_quality as translation_quality,
            ct.translation_job_id as translation_job_id, ct.status as translation_status,
            (SELECT COUNT(*) FROM reports WHERE category_id = c.id) as reports_count
          FROM categories c
          JOIN category_translations ct ON c.id = ct.category_id
          WHERE ct.slug = $1 AND ct.locale = $2 AND ct.status = 'PUBLISHED'
          LIMIT 1
        `;
        const translatedResult = await db.query(translatedQuery, [slug, locale]);
        const translatedRow = translatedResult.rows[0];

        if (!translatedRow) {
          return null; // Not found by main slug or translated slug
        }
        return {
          id: translatedRow.id,
          shortcode: translatedRow.shortcode,
          slug: translatedRow.slug,
          title: translatedRow.translated_title || translatedRow.title,
          description: translatedRow.translated_description || translatedRow.description,
          icon: translatedRow.icon,
          featured: translatedRow.featured,
          sort_order: translatedRow.sort_order,
          seo_keywords: translatedRow.seo_keywords,
          regional_keywords: translatedRow.regional_keywords,
          search_volume: translatedRow.search_volume,
          meta_title: translatedRow.translated_meta_title || translatedRow.meta_title,
          meta_description: translatedRow.translated_meta_description || translatedRow.meta_description,
          canonical_url: translatedRow.canonical_url,
          status: translatedRow.status,
          view_count: translatedRow.view_count,
          click_count: translatedRow.click_count,
          created_at: translatedRow.created_at,
          updated_at: translatedRow.updated_at,
          _count: { reports: parseInt(translatedRow.reports_count) },
          translations: translatedRow.translation_id ? [{
            id: translatedRow.translation_id,
            category_id: translatedRow.id,
            locale: translatedRow.translation_locale,
            title: translatedRow.translated_title,
            description: translatedRow.translated_description,
            slug: translatedRow.translated_slug,
            seo_keywords: translatedRow.translated_seo_keywords,
            localized_keywords: translatedRow.translated_localized_keywords,
            cultural_keywords: translatedRow.cultural_keywords,
            meta_title: translatedRow.translated_meta_title,
            meta_description: translatedRow.translated_meta_description,
            ai_generated: translatedRow.translation_ai_generated,
            human_reviewed: translatedRow.translation_human_reviewed,
            translation_quality: translatedRow.translation_quality,
            translation_job_id: translatedRow.translation_job_id,
            status: translatedRow.translation_status,
            created_at: translatedRow.created_at,
            updated_at: translatedRow.updated_at,
          }] : [],
        };
      }

      return {
        id: row.id,
        shortcode: row.shortcode,
        slug: row.slug,
        title: row.translated_title || row.title,
        description: row.translated_description || row.description,
        icon: row.icon,
        featured: row.featured,
        sort_order: row.sort_order,
        seo_keywords: row.seo_keywords,
        regional_keywords: row.regional_keywords,
        search_volume: row.search_volume,
        meta_title: row.translated_meta_title || row.meta_title,
        meta_description: row.translated_meta_description || row.meta_description,
        canonical_url: row.canonical_url,
        status: row.status,
        view_count: row.view_count,
        click_count: row.click_count,
        created_at: row.created_at,
        updated_at: row.updated_at,
        _count: { reports: parseInt(row.reports_count) },
        translations: row.translation_id ? [{
          id: row.translation_id,
          category_id: row.id,
          locale: row.translation_locale,
          title: row.translated_title,
          description: row.translated_description,
          slug: row.translated_slug,
          seo_keywords: row.translated_seo_keywords,
          localized_keywords: row.translated_localized_keywords,
          cultural_keywords: row.cultural_keywords,
          meta_title: row.translated_meta_title,
          meta_description: row.translated_meta_description,
          ai_generated: row.translation_ai_generated,
          human_reviewed: row.translation_human_reviewed,
          translation_quality: row.translation_quality,
          translation_job_id: row.translation_job_id,
          status: row.translation_status,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }] : [],
      };
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  }
}