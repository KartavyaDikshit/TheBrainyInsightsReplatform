import { prisma } from '@tbi/database';
export class ReportService {
    static async getAll(locale = 'en', options = {}) {
        try {
            const whereClause = Object.assign(Object.assign({ status: 'PUBLISHED' }, (options.categoryId && { categoryId: options.categoryId })), (options.featured !== undefined && { featured: options.featured }));
            const [reports, total] = await Promise.all([
                prisma.report.findMany(Object.assign(Object.assign({ where: whereClause, include: {
                        category: true,
                        translations: locale !== 'en' ? {
                            where: { locale, status: 'PUBLISHED' }
                        } : false,
                        _count: {
                            select: {
                                reviews: true,
                                enquiries: true
                            }
                        }
                    }, orderBy: [
                        { [options.sortBy || 'publishedDate']: options.sortOrder || 'desc' }
                    ] }, (options.limit && { take: options.limit })), (options.offset && { skip: options.offset }))),
                prisma.report.count({ where: whereClause })
            ]);
            const processedReports = reports.map(report => {
                if (locale !== 'en' && report.translations && report.translations.length > 0) {
                    const translation = report.translations[0];
                    return Object.assign(Object.assign({}, report), { title: translation.title, description: translation.description, summary: translation.summary, slug: translation.slug, metaTitle: translation.metaTitle, metaDescription: translation.metaDescription, keywords: translation.keywords });
                }
                return report;
            });
            return {
                reports: processedReports,
                total
            };
        }
        catch (error) {
            console.error('Error fetching reports:', error);
            throw new Error('Failed to fetch reports');
        }
    }
    static async getBySlug(slug, locale = 'en') {
        try {
            let report;
            if (locale === 'en') {
                report = await prisma.report.findUnique({
                    where: { slug },
                    include: {
                        category: true,
                        _count: {
                            select: {
                                reviews: true,
                                enquiries: true
                            }
                        }
                    }
                });
            }
            else {
                // First try to find by translation slug
                const translation = await prisma.reportTranslation.findFirst({
                    where: { slug, locale, status: 'PUBLISHED' },
                    include: {
                        report: {
                            include: {
                                category: true,
                                _count: {
                                    select: {
                                        reviews: true,
                                        enquiries: true
                                    }
                                }
                            }
                        }
                    }
                });
                if (translation) {
                    report = Object.assign(Object.assign({}, translation.report), { title: translation.title, description: translation.description, summary: translation.summary, slug: translation.slug, metaTitle: translation.metaTitle, metaDescription: translation.metaDescription, keywords: translation.keywords });
                }
            }
            return report;
        }
        catch (error) {
            console.error('Error fetching report by slug:', error);
            return undefined; // Changed to undefined
        }
    }
}
