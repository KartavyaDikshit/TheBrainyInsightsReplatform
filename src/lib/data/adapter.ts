import * as memory from './memory';
export type { Category, Report } from './memory';

// Define the transformed types
export interface TransformedCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface TransformedReport {
  id: string;
  slug: string;
  categorySlug: string;
  featured?: boolean;
  title: string;
  summary: string;
  bodyHtml: string;
  seoTitle: string;
  seoDesc: string;
  keywords: string;
}

const DEMO_NO_DB = process.env.DEMO_NO_DB === 'true';

async function ensureDemoMode() {
    if (!DEMO_NO_DB) {
        throw new Error('Database not enabled. Set DEMO_NO_DB=true in your environment.');
    }
    await memory.loadStubsOnce();
}

export function getConfig() {
    return {
        demo: DEMO_NO_DB,
        locales: (process.env.LOCALES || 'en').split(','),
        defaultLocale: process.env.DEFAULT_LOCALE || 'en',
    };
}

export async function listCategories(locale: string): Promise<TransformedCategory[]> {
    await ensureDemoMode();
    const categories = memory.getCategories();
    return categories.map(c => ({
        id: c.id,
        slug: c.slug,
        name: c.translations[locale]?.name || c.translations.en.name,
        description: c.translations[locale]?.description || c.translations.en.description,
    }));
}

export async function getCategoryBySlug(slug: string, locale: string): Promise<TransformedCategory | undefined> {
    await ensureDemoMode();
    const category = memory.getCategories().find(c => c.slug === slug);
    if (!category) return undefined;
    return {
        id: category.id,
        slug: category.slug,
        name: category.translations[locale]?.name || category.translations.en.name,
        description: category.translations[locale]?.description || category.translations.en.description,
    };
}

export async function listReports({ locale, categorySlug, page = 1, size = 12, featured }: { locale: string; categorySlug?: string; page?: number; size?: number; featured?: boolean }): Promise<TransformedReport[]> {
    await ensureDemoMode();
    let reports = memory.getReports();
    if (categorySlug) {
        reports = reports.filter(r => r.categorySlug === categorySlug);
    }
    if (featured !== undefined) {
        reports = reports.filter(r => r.featured === featured);
    }
    const start = (page - 1) * size;
    const end = start + size;
    return reports.slice(start, end).map(r => ({
        id: r.id,
        slug: r.slug,
        categorySlug: r.categorySlug,
        featured: r.featured,
        title: r.translations[locale]?.title || r.translations.en.title,
        summary: r.translations[locale]?.summary || r.translations.en.summary,
        bodyHtml: r.translations[locale]?.bodyHtml || r.translations.en.bodyHtml,
        seoTitle: r.translations[locale]?.seoTitle || r.translations.en.seoTitle,
        seoDesc: r.translations[locale]?.seoDesc || r.translations.en.seoDesc,
        keywords: r.translations[locale]?.keywords || r.translations.en.keywords,
    }));
}

export async function getReportBySlug(slug: string, locale: string): Promise<TransformedReport | undefined> {
    await ensureDemoMode();
    const report = memory.getReports().find(r => r.slug === slug);
    if (!report) return undefined;
    return {
        id: report.id,
        slug: report.slug,
        categorySlug: report.categorySlug,
        featured: report.featured,
        title: report.translations[locale]?.title || report.translations.en.title,
        summary: report.translations[locale]?.summary || report.translations.en.summary,
        bodyHtml: report.translations[locale]?.bodyHtml || report.translations.en.bodyHtml,
        seoTitle: report.translations[locale]?.seoTitle || report.translations.en.seoTitle,
        seoDesc: report.translations[locale]?.seoDesc || report.translations.en.seoDesc,
        keywords: report.translations[locale]?.keywords || report.translations.en.keywords,
    };
}

export async function search({ q, locale, page = 1, size = 10 }: { q: string; locale: string; page?: number; size?: number }): Promise<TransformedReport[]> {
    await ensureDemoMode();
    const reports = memory.getReports().filter(r => 
        (r.translations[locale]?.title || r.translations.en.title).toLowerCase().includes(q.toLowerCase())
    );
    const start = (page - 1) * size;
    const end = start + size;
    return reports.slice(start, end).map(r => ({
        id: r.id,
        slug: r.slug,
        categorySlug: r.categorySlug,
        featured: r.featured,
        title: r.translations[locale]?.title || r.translations.en.title,
        summary: r.translations[locale]?.summary || r.translations.en.summary,
        bodyHtml: r.translations[locale]?.bodyHtml || r.translations.en.bodyHtml,
        seoTitle: r.translations[locale]?.seoTitle || r.translations.en.seoTitle,
        seoDesc: r.translations[locale]?.seoDesc || r.translations.en.seoDesc,
        keywords: r.translations[locale]?.keywords || r.translations.en.keywords,
    }));
}

export async function listRedirects() {
    await ensureDemoMode();
    return memory.getRedirects();
}

export async function listSitemapEntries() {
    await ensureDemoMode();
    const reports = memory.getReports();
    const categories = memory.getCategories();
    const locales = getConfig().locales;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const entries: { url: string; lastModified: string; alternates: { [key: string]: string } }[] = [];

    reports.forEach(report => {
        const alternates: { [key: string]: string } = {};
        locales.forEach(locale => {
            alternates[locale] = `${baseUrl}/${locale}/reports/${report.slug}`;
        });
        entries.push({
            url: `${baseUrl}/en/reports/${report.slug}`,
            lastModified: new Date().toISOString(),
            alternates,
        });
    });

    categories.forEach(category => {
        const alternates: { [key: string]: string } = {};
        locales.forEach(locale => {
            alternates[locale] = `${baseUrl}/${locale}/categories/${category.slug}`;
        });
        entries.push({
            url: `${baseUrl}/en/categories/${category.slug}`,
            lastModified: new Date().toISOString(),
            alternates,
        });
    });

    return entries;
}

export async function createLead(leadData: Omit<memory.Lead, 'id'>) {
    await ensureDemoMode();
    return memory.addLead(leadData);
}

export async function listLeads() {
    await ensureDemoMode();
    return memory.getLeads();
}

export async function listAIQueue() {
    await ensureDemoMode();
    return memory.getAIQueue();
}

export async function approveAIItem(id: string) {
    await ensureDemoMode();
    return memory.updateAIQueueItem(id, 'APPROVED');
}

export async function rejectAIItem(id: string) {
    await ensureDemoMode();
    return memory.updateAIQueueItem(id, 'REJECTED');
}
