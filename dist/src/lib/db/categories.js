import { prisma } from '@tbi/database';
export class CategoryService {
    static async getAll(locale = 'en', options = {}) {
        try {
            const categories = await prisma.category.findMany(Object.assign(Object.assign({ where: Object.assign({ status: 'PUBLISHED' }, (options.featured !== undefined && { featured: options.featured })), include: {
                    translations: locale !== 'en' ? {
                        where: { locale, status: 'PUBLISHED' }
                    } : false,
                    _count: {
                        select: { reports: true }
                    }
                }, orderBy: [
                    { sortOrder: 'asc' },
                    { createdAt: 'desc' }
                ] }, (options.limit && { take: options.limit })), (options.offset && { skip: options.offset })));
            return categories.map(category => {
                if (locale !== 'en' && category.translations && category.translations.length > 0) {
                    const translation = category.translations[0];
                    return Object.assign(Object.assign({}, category), { title: translation.title, description: translation.description, slug: translation.slug, metaTitle: translation.metaTitle, metaDescription: translation.metaDescription });
                }
                return category;
            });
        }
        catch (error) {
            console.error('Error fetching categories:', error);
            throw new Error('Failed to fetch categories');
        }
    }
    static async getBySlug(slug, locale = 'en') {
        try {
            let category;
            if (locale === 'en') {
                category = await prisma.category.findUnique({
                    where: { slug },
                    include: {
                        _count: { select: { reports: true } }
                    }
                });
            }
            else {
                // First try to find by translation slug
                const translation = await prisma.categoryTranslation.findFirst({
                    where: { slug, locale, status: 'PUBLISHED' },
                    include: {
                        category: {
                            include: {
                                _count: { select: { reports: true } }
                            }
                        }
                    }
                });
                if (translation) {
                    category = Object.assign(Object.assign({}, translation.category), { title: translation.title, description: translation.description, slug: translation.slug, metaTitle: translation.metaTitle, metaDescription: translation.metaDescription });
                }
                else {
                    // Fallback to English slug
                    category = await prisma.category.findUnique({
                        where: { slug },
                        include: {
                            translations: { where: { locale, status: 'PUBLISHED' } },
                            _count: { select: { reports: true } }
                        }
                    });
                    if (category && category.translations && category.translations.length > 0) {
                        const trans = category.translations[0];
                        category = Object.assign(Object.assign({}, category), { title: trans.title, description: trans.description, slug: trans.slug, metaTitle: trans.metaTitle, metaDescription: trans.metaDescription });
                    }
                }
            }
            return category;
        }
        catch (error) {
            console.error('Error fetching category by slug:', error);
            return null;
        }
    }
}
