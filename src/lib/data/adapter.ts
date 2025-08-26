import { db } from '@tbi/database';

// Define the transformed types
export interface TransformedCategory {
  id: string;
  slug: string;
  title: string; // Changed from name
  description: string | null; // Changed to string | null
  metaTitle: string | null; // Changed to string | null
  metaDescription: string | null;  // Changed to string | null
  translations?: { // Added translations
    title: string;
    description: string | null; // Changed to string | null
    metaTitle: string | null; // Changed to string | null
    metaDescription: string | null; // Changed to string | null
    locale: string;
  }[];
  locale?: string;
  translated_slug?: string;
  updated_at: Date;
  created_at: Date;
}

export interface TransformedReport {
  id: string;
  slug: string;
  categorySlug: string;
  featured: boolean | null; // Changed from featured?: boolean;
  title: string;
  summary: string | null; // Changed to string | null
  description: string | null; // Changed from bodyHtml to description
  metaTitle: string | null; // Changed to string | null
  metaDescription: string | null;  // Changed to string | null
  keywords: string[]; // This is already string[], but the source might be string[] | null
  publishedDate: Date | null;
  translations?: { // Added translations
    title: string;
    description: string | null;
    summary: string | null;
    slug: string;
    tableOfContents: string | null;
    methodology: string | null;
    keyFindings: string[];
    metaTitle: string | null;
    metaDescription: string | null;
    keywords: string[];
    locale: string;
  }[];
  locale?: string;
  translated_slug?: string;
  updated_at: Date;
  created_at: Date;
}

function parseKeywords(keywordsJson: string | null): string {
  if (!keywordsJson) return '';
  try {
    const keywordsArray = JSON.parse(keywordsJson);
    if (Array.isArray(keywordsArray)) {
      return keywordsArray.join(', ');
    }
  } catch (e) {
    console.error('Error parsing keywordsJson:', e);
  }
  return '';
}



export function getConfig() {
    return {
        locales: (process.env.LOCALES || 'en').split(','),
        defaultLocale: process.env.DEFAULT_LOCALE || 'en',
    };
}

export async function listCategories(locale: string): Promise<TransformedCategory[]> {
    const result = await db.query(
        `SELECT
            c.id, c.slug, c.title, c.description, c.meta_title, c.meta_description, c.updated_at, c.created_at,
            ct.title as translated_title, ct.description as translated_description,
            ct.meta_title as translated_meta_title, ct.meta_description as translated_meta_description
        FROM categories c
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $1`,
        [locale]
    );

    return result.rows.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        title: c.translated_title || c.title,
        description: c.translated_description || c.description,
        metaTitle: c.translated_meta_title || c.meta_title,
        metaDescription: c.translated_meta_description || c.meta_description,
        updated_at: c.updated_at,
        created_at: c.created_at,
        translations: c.translated_title ? [{
            title: c.translated_title,
            description: c.translated_description,
            metaTitle: c.translated_meta_title,
            metaDescription: c.translated_meta_description,
            locale: locale
        }] : []
    }));
}

export async function getCategoryBySlug(slug: string, locale: string): Promise<TransformedCategory | undefined> {
    const result = await db.query(
        `SELECT
            c.id, c.slug, c.title, c.description, c.meta_title, c.meta_description, c.updated_at, c.created_at,
            ct.title as translated_title, ct.description as translated_description,
            ct.meta_title as translated_meta_title, ct.meta_description as translated_meta_description
        FROM categories c
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $2
        WHERE c.slug = $1
        LIMIT 1`,
        [slug, locale]
    );

    const category = result.rows[0];

    if (!category) return undefined;

    return {
        id: category.id,
        slug: category.slug,
        title: category.translated_title || category.title,
        description: category.translated_description || category.description,
        metaTitle: category.translated_meta_title || category.meta_title,
        metaDescription: category.translated_meta_description || category.meta_description,
        updated_at: category.updated_at,
        created_at: category.created_at,
        translations: category.translated_title ? [{
            title: category.translated_title,
            description: category.translated_description,
            metaTitle: category.translated_meta_title,
            metaDescription: category.translated_meta_description,
            locale: locale
        }] : []
    };
}

export async function listReports({ locale, categorySlug, page = 1, size = 12, featured }: { locale: string; categorySlug?: string; page?: number; size?: number; featured?: boolean }): Promise<TransformedReport[]> {
    let query = `
        SELECT
            r.id, r.slug, r.featured, r.title, r.summary, r.description, r.meta_title, r.meta_description, r.keywords, r.published_date, r.created_at,
            c.slug as category_slug,
            rt.title as translated_title, rt.summary as translated_summary, rt.description as translated_description,
            rt.meta_title as translated_meta_title, rt.meta_description as translated_meta_description, rt.keywords as translated_keywords
        FROM reports r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_translations rt ON r.id = rt.report_id AND rt.locale = $1
        WHERE 1=1
    `;
    const params: (string | number | boolean)[] = [locale];
    let paramIndex = 2;

    if (categorySlug) {
        query += ` AND c.slug = ${paramIndex}`;
        params.push(categorySlug);
        paramIndex++;
    }
    if (featured !== undefined) {
        query += ` AND r.featured = ${paramIndex}`;
        params.push(featured);
        paramIndex++;
    }

    query += ` ORDER BY r.published_date DESC`;

    query += ` LIMIT ${paramIndex}`;
    params.push(size);
    paramIndex++;

    query += ` OFFSET ${paramIndex}`;
    params.push((page - 1) * size);
    paramIndex++;

    const result = await db.query(query, params);

    return result.rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        categorySlug: r.category_slug || '',
        featured: r.featured,
        title: r.translated_title || r.title,
        summary: r.translated_summary || r.summary,
        description: r.translated_description || r.description,
        metaTitle: r.translated_meta_title || r.meta_title,
        metaDescription: r.translated_meta_description || r.meta_description,
        keywords: r.translated_keywords || r.keywords || [],
        publishedDate: r.published_date,
        updated_at: r.updated_at,
        created_at: r.created_at,
        translations: r.translated_title ? [{
            title: r.translated_title,
            description: r.translated_description,
            summary: r.translated_summary,
            slug: r.slug,
            tableOfContents: null, // Not selected in query
            methodology: null, // Not selected in query
            keyFindings: [], // Not selected in query
            metaTitle: r.translated_meta_title,
            metaDescription: r.translated_meta_description,
            keywords: r.translated_keywords || [],
            locale: locale
        }] : []
    }));
}

export async function getReportBySlug(slug: string, locale: string): Promise<TransformedReport | undefined> {
    const result = await db.query(
        `SELECT
            r.id, r.slug, r.featured, r.title, r.summary, r.description, r.meta_title, r.meta_description, r.keywords, r.published_date, r.created_at,
            c.slug as category_slug,
            rt.title as translated_title, rt.summary as translated_summary, rt.description as translated_description,
            rt.meta_title as translated_meta_title, rt.meta_description as translated_meta_description, rt.keywords as translated_keywords
        FROM reports r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_translations rt ON r.id = rt.report_id AND rt.locale = $2
        WHERE r.slug = $1
        LIMIT 1`,
        [slug, locale]
    );

    const report = result.rows[0];

    if (!report) return undefined;

    return {
        id: report.id,
        slug: report.slug,
        categorySlug: report.category_slug || '',
        featured: report.featured,
        title: report.translated_title || report.title,
        summary: report.translated_summary || report.summary,
        description: report.translated_description || report.description,
        metaTitle: report.translated_meta_title || report.meta_title,
        metaDescription: report.translated_meta_description || report.meta_description,
        keywords: report.translated_keywords || report.keywords || [],
        publishedDate: report.published_date,
        updated_at: report.updated_at,
        created_at: report.created_at,
        translations: report.translated_title ? [{
            title: report.translated_title,
            description: report.translated_description,
            summary: report.translated_summary,
            slug: report.slug,
            tableOfContents: null, // Not selected in query
            methodology: null, // Not selected in query
            keyFindings: [], // Not selected in query
            metaTitle: report.translated_meta_title,
            metaDescription: report.translated_meta_description,
            keywords: report.translated_keywords || [],
            locale: locale
        }] : []
    };
}

export async function search({ q, locale, page = 1, size = 10 }: { q: string; locale: string; page?: number; size?: number }): Promise<TransformedReport[]> {
    let query = `
        SELECT
            r.id, r.slug, r.featured, r.title, r.summary, r.description, r.meta_title, r.meta_description, r.keywords, r.published_date, r.created_at,
            c.slug as category_slug,
            rt.title as translated_title, rt.summary as translated_summary, rt.description as translated_description,
            rt.meta_title as translated_meta_title, rt.meta_description as translated_meta_description, rt.keywords as translated_keywords
        FROM reports r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_translations rt ON r.id = rt.report_id AND rt.locale = $1
        WHERE (r.title ILIKE $2 OR rt.title ILIKE $2)
    `;
    const params: (string | number | boolean)[] = [locale, `%${q}%`];
    let paramIndex = 3;

    query += ` ORDER BY r.published_date DESC`;

    query += ` LIMIT ${paramIndex}`;
    params.push(size);
    paramIndex++;

    query += ` OFFSET ${paramIndex}`;
    params.push((page - 1) * size);
    paramIndex++;

    const result = await db.query(query, params);

    return result.rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        categorySlug: r.category_slug || '',
        featured: r.featured,
        title: r.translated_title || r.title,
        summary: r.translated_summary || r.summary,
        description: r.translated_description || r.description,
        metaTitle: r.translated_meta_title || r.meta_title,
        metaDescription: r.translated_meta_description || r.meta_description,
        keywords: r.translated_keywords || r.keywords || [],
        publishedDate: r.published_date,
        updated_at: r.updated_at,
        createdAt: r.created_at,
        translations: r.translated_title ? [{
            title: r.translated_title,
            description: r.translated_description,
            summary: r.translated_summary,
            slug: r.slug,
            tableOfContents: null, // Not selected in query
            methodology: null, // Not selected in query
            keyFindings: [], // Not selected in query
            metaTitle: r.translated_meta_title,
            metaDescription: r.translated_meta_description,
            keywords: r.translated_keywords || [],
            locale: locale
        }] : []
    }));
}


export async function listSitemapEntries() {
    const reportsResult = await db.query(
        `SELECT
            r.slug, r.updated_at, r.created_at,
            rt.locale, rt.slug as translated_slug
        FROM reports r
        LEFT JOIN report_translations rt ON r.id = rt.report_id`
    );
    const reports = reportsResult.rows;

    const categoriesResult = await db.query(
        `SELECT
            c.slug, c.updated_at, c.created_at,
            ct.locale, ct.slug as translated_slug
        FROM categories c
        LEFT JOIN category_translations ct ON c.id = ct.category_id`
    );
    const categories = categoriesResult.rows;

    const locales = getConfig().locales;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const entries: { url: string; lastModified: string; alternates: { [key: string]: string } }[] = [];

    reports.forEach((report: TransformedReport) => {
        const alternates: { [key: string]: string } = {};
        locales.forEach(locale => {
            const translatedSlug = report.locale === locale ? report.translated_slug : report.slug; // Use translated slug if available for locale
            alternates[locale] = `${baseUrl}/${locale}/reports/${translatedSlug}`;
        });
        entries.push({
            url: `${baseUrl}/${getConfig().defaultLocale}/reports/${report.slug}`,
            lastModified: report.updated_at ? new Date(report.updated_at).toISOString() : new Date(report.created_at).toISOString(),
            alternates,
        });
    });

    categories.forEach((category: TransformedCategory) => {
        const alternates: { [key: string]: string } = {};
        locales.forEach(locale => {
            const translatedSlug = category.locale === locale ? category.translated_slug : category.slug; // Use translated slug if available for locale
            alternates[locale] = `${baseUrl}/${locale}/categories/${translatedSlug}`;
        });
        entries.push({
            url: `${baseUrl}/${getConfig().defaultLocale}/categories/${category.slug}`,
            lastModified: category.updated_at ? new Date(category.updated_at).toISOString() : new Date(category.created_at).toISOString(),
            alternates,
        });
    });

    return entries;
}