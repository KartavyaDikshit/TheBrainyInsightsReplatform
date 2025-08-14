import { getPrisma } from './db';
import { toLocaleEnum } from '../../../packages/lib/src/utils';
import { Lead } from '@prisma/client'; // Import Locale enum

const prisma = getPrisma();

// Define the transformed types
export interface TransformedCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  seoTitle: string; // Added
  seoDesc: string;  // Added
}

export interface TransformedReport {
  id: string;
  slug: string;
  categorySlug: string;
  featured: boolean | null; // Changed from featured?: boolean;
  title: string;
  summary: string;
  bodyHtml: string;
  seoTitle: string;
  seoDesc: string;
  keywords: string;
  publishedAt: Date | null;
  createdAt: Date;
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
    const categories = await prisma.category.findMany({
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: toLocaleEnum(locale) },
                        { locale: toLocaleEnum('en') } // Fallback to English if specific locale not found
                    ]
                }
            }
        }
    });
    return categories.map(c => ({
        id: c.id,
        slug: c.slug,
        name: c.translations.find(t => t.locale === (toLocaleEnum(locale)))?.name || c.translations.find(t => t.locale === toLocaleEnum('en'))?.name || '',
        description: c.translations.find(t => t.locale === (toLocaleEnum(locale)))?.description || c.translations.find(t => t.locale === toLocaleEnum('en'))?.description || '',
        seoTitle: c.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoTitle || c.translations.find(t => t.locale === toLocaleEnum('en'))?.seoTitle || '',
        seoDesc: c.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoDesc || c.translations.find(t => t.locale === toLocaleEnum('en'))?.seoDesc || '',
    }));
}

export async function getCategoryBySlug(slug: string, locale: string): Promise<TransformedCategory | undefined> {
    const category = await prisma.category.findUnique({
        where: { slug: slug },
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: toLocaleEnum(locale) },
                        { locale: toLocaleEnum('en') }
                    ]
                }
            }
        }
    });
    if (!category) return undefined;
    return {
        id: category.id,
        slug: category.slug,
        name: category.translations.find(t => t.locale === (toLocaleEnum(locale)))?.name || category.translations.find(t => t.locale === toLocaleEnum('en'))?.name || '',
        description: category.translations.find(t => t.locale === (toLocaleEnum(locale)))?.description || category.translations.find(t => t.locale === toLocaleEnum('en'))?.description || '',
        seoTitle: category.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoTitle || category.translations.find(t => t.locale === toLocaleEnum('en'))?.seoTitle || '',
        seoDesc: category.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoDesc || category.translations.find(t => t.locale === toLocaleEnum('en'))?.seoDesc || '',
    };
}

export async function listReports({ locale, categorySlug, page = 1, size = 12, featured }: { locale: string; categorySlug?: string; page?: number; size?: number; featured?: boolean }): Promise<TransformedReport[]> {
    const where: any = {};
    if (categorySlug) {
        where.categorySlug = categorySlug;
    }
    if (featured !== undefined) {
        where.featured = featured;
    }

    const reports = await prisma.report.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: toLocaleEnum(locale) },
                        { locale: toLocaleEnum('en') }
                    ]
                }
            },
            category: true // Explicitly include the category
        }
    });

    return reports.map(r => ({
        id: r.id,
        slug: r.slug,
        categorySlug: r.category.slug, // Access from r.category.slug
        featured: r.featured,
        title: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.title || r.translations.find(t => t.locale === toLocaleEnum('en'))?.title || '',
        summary: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.summary || r.translations.find(t => t.locale === toLocaleEnum('en'))?.summary || '',
        bodyHtml: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.bodyHtml || r.translations.find(t => t.locale === toLocaleEnum('en'))?.bodyHtml || '',
        seoTitle: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoTitle || r.translations.find(t => t.locale === toLocaleEnum('en'))?.seoTitle || '',
        seoDesc: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoDesc || r.translations.find(t => t.locale === toLocaleEnum('en'))?.seoDesc || '',
        keywords: parseKeywords(r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.keywordsJson ?? null) || parseKeywords(r.translations.find(t => t.locale === toLocaleEnum('en'))?.keywordsJson ?? null) || '',
        publishedAt: r.publishedAt,
        createdAt: r.createdAt,
    }));
}

export async function getReportBySlug(slug: string, locale: string): Promise<TransformedReport | undefined> {
    const report = await prisma.report.findUnique({
        where: { slug: slug },
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: toLocaleEnum(locale) },
                        { locale: toLocaleEnum('en') }
                    ]
                }
            },
            category: true // Explicitly include the category
        }
    });
    if (!report) return undefined;
    return {
        id: report.id,
        slug: report.slug,
        categorySlug: report.category.slug, // Access from report.category.slug
        featured: report.featured,
        title: report.translations.find(t => t.locale === (toLocaleEnum(locale)))?.title || report.translations.find(t => t.locale === toLocaleEnum('en'))?.title || '',
        summary: report.translations.find(t => t.locale === (toLocaleEnum(locale)))?.summary || report.translations.find(t => t.locale === toLocaleEnum('en'))?.summary || '',
        bodyHtml: report.translations.find(t => t.locale === (toLocaleEnum(locale)))?.bodyHtml || report.translations.find(t => t.locale === toLocaleEnum('en'))?.bodyHtml || '',
        seoTitle: report.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoTitle || report.translations.find(t => t.locale === toLocaleEnum('en'))?.seoTitle || '',
        seoDesc: report.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoDesc || report.translations.find(t => t.locale === toLocaleEnum('en'))?.seoDesc || '',
        keywords: parseKeywords(report.translations.find(t => t.locale === (toLocaleEnum(locale)))?.keywordsJson ?? null) || parseKeywords(report.translations.find(t => t.locale === toLocaleEnum('en'))?.keywordsJson ?? null) || '',
        publishedAt: report.publishedAt,
        createdAt: report.createdAt,
    };
}

export async function search({ q, locale, page = 1, size = 10 }: { q: string; locale: string; page?: number; size?: number }): Promise<TransformedReport[]> {
    const reports = await prisma.report.findMany({
        where: {
            translations: {
                some: {
                    OR: [
                        { title: { contains: q }, locale: toLocaleEnum(locale) },
                        { title: { contains: q }, locale: toLocaleEnum('en') }
                    ]
                }
            }
        },
        skip: (page - 1) * size,
        take: size,
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: toLocaleEnum(locale) },
                        { locale: toLocaleEnum('en') }
                    ]
                }
            },
            category: true // Explicitly include the category
        }
    });

    return reports.map(r => ({
        id: r.id,
        slug: r.slug,
        categorySlug: r.category.slug, // Access from r.category.slug
        featured: r.featured,
        title: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.title || r.translations.find(t => t.locale === toLocaleEnum('en'))?.title || '',
                summary: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.summary || r.translations.find(t => t.locale === toLocaleEnum('en'))?.summary || '',
        bodyHtml: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.bodyHtml || r.translations.find(t => t.locale === toLocaleEnum('en'))?.bodyHtml || '',
        seoTitle: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoTitle || r.translations.find(t => t.locale === toLocaleEnum('en'))?.seoTitle || '',
        seoDesc: r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.seoDesc || r.translations.find(t => t.locale === toLocaleEnum('en'))?.seoDesc || '',
        keywords: parseKeywords(r.translations.find(t => t.locale === (toLocaleEnum(locale)))?.keywordsJson ?? null) || parseKeywords(r.translations.find(t => t.locale === toLocaleEnum('en'))?.keywordsJson ?? null) || '',
        publishedAt: r.publishedAt,
        createdAt: r.createdAt,
    }));
}

export async function listRedirects() {
    return prisma.redirectMap.findMany();
}

export async function listSitemapEntries() {
    const reports = await prisma.report.findMany({
        include: {
            translations: true, // Include translations for sitemap generation
            category: true // Include category for sitemap generation
        }
    });
    const categories = await prisma.category.findMany({
        include: {
            translations: true // Include translations for sitemap generation
        }
    });
    const locales = getConfig().locales;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    const entries: { url: string; lastModified: string; alternates: { [key: string]: string } }[] = [];

    reports.forEach(report => {
        const alternates: { [key: string]: string } = {};
        locales.forEach(locale => {
            alternates[toLocaleEnum(locale)] = `${baseUrl}/${locale}/reports/${report.slug}`;
        });
        entries.push({
            url: `${baseUrl}/${getConfig().defaultLocale}/reports/${report.slug}`,
            lastModified: report.updatedAt ? new Date(report.updatedAt).toISOString() : new Date(report.createdAt).toISOString(),
            alternates,
        });
    });

    categories.forEach(category => {
        const alternates: { [key: string]: string } = {};
        locales.forEach(locale => {
            alternates[toLocaleEnum(locale)] = `${baseUrl}/${locale}/categories/${category.slug}`;
        });
        entries.push({
            url: `${baseUrl}/${getConfig().defaultLocale}/categories/${category.slug}`,
            lastModified: category.updatedAt ? new Date(category.updatedAt).toISOString() : new Date(category.createdAt).toISOString(),
            alternates,
        });
    });

    return entries;
}

export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.lead.create({ data: leadData });
}

export async function listLeads() {
    return prisma.lead.findMany();
}

export async function listAIQueue() {
    return prisma.aIGenerationQueue.findMany();
}

export async function approveAIItem(id: string) {
    return prisma.aIGenerationQueue.update({
        where: { id: id },
        data: { status: 'APPROVED' }
    });
}

export async function rejectAIItem(id: string) {
    return prisma.aIGenerationQueue.update({
        where: { id: id },
        data: { status: 'REJECTED' }
    });
}