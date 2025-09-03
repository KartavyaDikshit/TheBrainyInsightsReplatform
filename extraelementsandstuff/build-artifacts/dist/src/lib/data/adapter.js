import { ensurePrismaWithCache } from './db';
function parseKeywords(keywordsJson) {
    if (!keywordsJson)
        return '';
    try {
        const keywordsArray = JSON.parse(keywordsJson);
        if (Array.isArray(keywordsArray)) {
            return keywordsArray.join(', ');
        }
    }
    catch (e) {
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
export async function listCategories(locale) {
    const prisma = await ensurePrismaWithCache();
    const categories = await prisma.category.findMany({
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: locale },
                        { locale: 'en' } // Fallback to English if specific locale not found
                    ]
                }
            }
        }
    });
    return categories.map((c) => {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return ({
            id: c.id,
            slug: c.slug,
            title: ((_a = c.translations.find((t) => t.locale === (locale))) === null || _a === void 0 ? void 0 : _a.title) || ((_b = c.translations.find((t) => t.locale === 'en')) === null || _b === void 0 ? void 0 : _b.title) || '',
            description: ((_c = c.translations.find((t) => t.locale === (locale))) === null || _c === void 0 ? void 0 : _c.description) || ((_d = c.translations.find((t) => t.locale === 'en')) === null || _d === void 0 ? void 0 : _d.description) || '',
            metaTitle: ((_e = c.translations.find((t) => t.locale === (locale))) === null || _e === void 0 ? void 0 : _e.metaTitle) || ((_f = c.translations.find((t) => t.locale === 'en')) === null || _f === void 0 ? void 0 : _f.metaTitle) || '',
            metaDescription: ((_g = c.translations.find((t) => t.locale === (locale))) === null || _g === void 0 ? void 0 : _g.metaDescription) || ((_h = c.translations.find((t) => t.locale === 'en')) === null || _h === void 0 ? void 0 : _h.metaDescription) || '',
            translations: c.translations // Include translations
        });
    });
}
export async function getCategoryBySlug(slug, locale) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const prisma = await ensurePrismaWithCache();
    const category = await prisma.category.findUnique({
        where: { slug: slug },
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: locale },
                        { locale: 'en' }
                    ]
                }
            }
        }
    });
    if (!category)
        return undefined;
    return {
        id: category.id,
        slug: category.slug,
        title: ((_a = category.translations.find((t) => t.locale === (locale))) === null || _a === void 0 ? void 0 : _a.title) || ((_b = category.translations.find((t) => t.locale === 'en')) === null || _b === void 0 ? void 0 : _b.title) || '',
        description: ((_c = category.translations.find((t) => t.locale === (locale))) === null || _c === void 0 ? void 0 : _c.description) || ((_d = category.translations.find((t) => t.locale === 'en')) === null || _d === void 0 ? void 0 : _d.description) || '',
        metaTitle: ((_e = category.translations.find((t) => t.locale === (locale))) === null || _e === void 0 ? void 0 : _e.metaTitle) || ((_f = category.translations.find((t) => t.locale === 'en')) === null || _f === void 0 ? void 0 : _f.metaTitle) || '',
        metaDescription: ((_g = category.translations.find((t) => t.locale === (locale))) === null || _g === void 0 ? void 0 : _g.metaDescription) || ((_h = category.translations.find((t) => t.locale === 'en')) === null || _h === void 0 ? void 0 : _h.metaDescription) || '',
        translations: category.translations // Include translations
    };
}
export async function listReports({ locale, categorySlug, page = 1, size = 12, featured }) {
    const prisma = await ensurePrismaWithCache();
    const where = {};
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
                        { locale: locale },
                        { locale: 'en' }
                    ]
                }
            },
            category: true // Explicitly include the category
        }
    });
    return reports.map((r) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return ({
            id: r.id,
            slug: r.slug,
            categorySlug: ((_a = r.category) === null || _a === void 0 ? void 0 : _a.slug) || '', // Access from r.category.slug, added null check
            featured: r.featured,
            title: ((_b = r.translations.find((t) => t.locale === (locale))) === null || _b === void 0 ? void 0 : _b.title) || ((_c = r.translations.find((t) => t.locale === 'en')) === null || _c === void 0 ? void 0 : _c.title) || '',
            summary: ((_d = r.translations.find((t) => t.locale === (locale))) === null || _d === void 0 ? void 0 : _d.summary) || ((_e = r.translations.find((t) => t.locale === 'en')) === null || _e === void 0 ? void 0 : _e.summary) || '',
            description: ((_f = r.translations.find((t) => t.locale === (locale))) === null || _f === void 0 ? void 0 : _f.description) || ((_g = r.translations.find((t) => t.locale === 'en')) === null || _g === void 0 ? void 0 : _g.description) || '',
            metaTitle: ((_h = r.translations.find((t) => t.locale === (locale))) === null || _h === void 0 ? void 0 : _h.metaTitle) || ((_j = r.translations.find((t) => t.locale === 'en')) === null || _j === void 0 ? void 0 : _j.metaTitle) || '',
            metaDescription: ((_k = r.translations.find((t) => t.locale === (locale))) === null || _k === void 0 ? void 0 : _k.metaDescription) || ((_l = r.translations.find((t) => t.locale === 'en')) === null || _l === void 0 ? void 0 : _l.metaDescription) || '',
            keywords: ((_m = r.translations.find((t) => t.locale === (locale))) === null || _m === void 0 ? void 0 : _m.keywords) || ((_o = r.translations.find((t) => t.locale === 'en')) === null || _o === void 0 ? void 0 : _o.keywords) || [], // Changed to ensure string[]
            publishedDate: r.publishedDate, // Changed to publishedDate
            createdAt: r.createdAt,
            translations: r.translations // Include translations
        });
    });
}
export async function getReportBySlug(slug, locale) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const prisma = await ensurePrismaWithCache();
    const report = await prisma.report.findUnique({
        where: { slug: slug },
        include: {
            translations: {
                where: {
                    OR: [
                        { locale: locale },
                        { locale: 'en' }
                    ]
                }
            },
            category: true // Explicitly include the category
        }
    });
    if (!report)
        return undefined;
    return {
        id: report.id,
        slug: report.slug,
        categorySlug: ((_a = report.category) === null || _a === void 0 ? void 0 : _a.slug) || '', // Access from report.category.slug, added null check
        featured: report.featured,
        title: ((_b = report.translations.find((t) => t.locale === (locale))) === null || _b === void 0 ? void 0 : _b.title) || ((_c = report.translations.find((t) => t.locale === 'en')) === null || _c === void 0 ? void 0 : _c.title) || '',
        summary: ((_d = report.translations.find((t) => t.locale === (locale))) === null || _d === void 0 ? void 0 : _d.summary) || ((_e = report.translations.find((t) => t.locale === 'en')) === null || _e === void 0 ? void 0 : _e.summary) || '',
        description: ((_f = report.translations.find((t) => t.locale === (locale))) === null || _f === void 0 ? void 0 : _f.description) || ((_g = report.translations.find((t) => t.locale === 'en')) === null || _g === void 0 ? void 0 : _g.description) || '',
        metaTitle: ((_h = report.translations.find((t) => t.locale === (locale))) === null || _h === void 0 ? void 0 : _h.metaTitle) || ((_j = report.translations.find((t) => t.locale === 'en')) === null || _j === void 0 ? void 0 : _j.metaTitle) || '',
        metaDescription: ((_k = report.translations.find((t) => t.locale === (locale))) === null || _k === void 0 ? void 0 : _k.metaDescription) || ((_l = report.translations.find((t) => t.locale === 'en')) === null || _l === void 0 ? void 0 : _l.metaDescription) || '',
        keywords: ((_m = report.translations.find((t) => t.locale === (locale))) === null || _m === void 0 ? void 0 : _m.keywords) || ((_o = report.translations.find((t) => t.locale === 'en')) === null || _o === void 0 ? void 0 : _o.keywords) || [], // Changed to ensure string[]
        publishedDate: report.publishedDate, // Changed to publishedDate
        createdAt: report.createdAt,
        translations: report.translations // Include translations
    };
}
export async function search({ q, locale, page = 1, size = 10 }) {
    const prisma = await ensurePrismaWithCache();
    const reports = await prisma.report.findMany({
        where: {
            translations: {
                some: {
                    OR: [
                        { title: { contains: q }, locale: locale },
                        { title: { contains: q }, locale: 'en' }
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
                        { locale: locale },
                        { locale: 'en' }
                    ]
                }
            },
            category: true // Explicitly include the category
        }
    });
    return reports.map((r) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return ({
            id: r.id,
            slug: r.slug,
            categorySlug: ((_a = r.category) === null || _a === void 0 ? void 0 : _a.slug) || '', // Access from r.category.slug, added null check
            featured: r.featured,
            title: ((_b = r.translations.find((t) => t.locale === (locale))) === null || _b === void 0 ? void 0 : _b.title) || ((_c = r.translations.find((t) => t.locale === 'en')) === null || _c === void 0 ? void 0 : _c.title) || '',
            summary: ((_d = r.translations.find((t) => t.locale === (locale))) === null || _d === void 0 ? void 0 : _d.summary) || ((_e = r.translations.find((t) => t.locale === 'en')) === null || _e === void 0 ? void 0 : _e.summary) || '',
            description: ((_f = r.translations.find((t) => t.locale === (locale))) === null || _f === void 0 ? void 0 : _f.description) || ((_g = r.translations.find((t) => t.locale === 'en')) === null || _g === void 0 ? void 0 : _g.description) || '',
            metaTitle: ((_h = r.translations.find((t) => t.locale === (locale))) === null || _h === void 0 ? void 0 : _h.metaTitle) || ((_j = r.translations.find((t) => t.locale === 'en')) === null || _j === void 0 ? void 0 : _j.metaTitle) || '',
            metaDescription: ((_k = r.translations.find((t) => t.locale === (locale))) === null || _k === void 0 ? void 0 : _k.metaDescription) || ((_l = r.translations.find((t) => t.locale === 'en')) === null || _l === void 0 ? void 0 : _l.metaDescription) || '',
            keywords: ((_m = r.translations.find((t) => t.locale === (locale))) === null || _m === void 0 ? void 0 : _m.keywords) || ((_o = r.translations.find((t) => t.locale === 'en')) === null || _o === void 0 ? void 0 : _o.keywords) || [], // Changed to ensure string[]
            publishedDate: r.publishedDate, // Changed to publishedDate
            createdAt: r.createdAt,
        });
    });
}
export async function listSitemapEntries() {
    const prisma = await ensurePrismaWithCache();
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
    const entries = [];
    reports.forEach(report => {
        const alternates = {};
        locales.forEach(locale => {
            alternates[locale] = `${baseUrl}/${locale}/reports/${report.slug}`;
        });
        entries.push({
            url: `${baseUrl}/${getConfig().defaultLocale}/reports/${report.slug}`,
            lastModified: report.updatedAt ? new Date(report.updatedAt).toISOString() : new Date(report.createdAt).toISOString(),
            alternates,
        });
    });
    categories.forEach(category => {
        const alternates = {};
        locales.forEach(locale => {
            alternates[locale] = `${baseUrl}/${locale}/categories/${category.slug}`;
        });
        entries.push({
            url: `${baseUrl}/${getConfig().defaultLocale}/categories/${category.slug}`,
            lastModified: category.updatedAt ? new Date(category.updatedAt).toISOString() : new Date(category.createdAt).toISOString(),
            alternates,
        });
    });
    return entries;
}
