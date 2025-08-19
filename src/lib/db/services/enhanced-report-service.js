var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma, pgPool } from '../postgres-client';
export class EnhancedReportService {
    // Advanced search with full-text and filters
    static search(query_1) {
        return __awaiter(this, arguments, void 0, function* (query, locale = 'en', filters = {}, pagination = {}) {
            var _a, _b;
            const { limit = 24, offset = 0 } = pagination;
            // Build dynamic where clause
            const whereConditions = ['r.status = $1'];
            const params = ['PUBLISHED'];
            let paramIndex = 2;
            // Add filters
            if (filters.categoryId) {
                whereConditions.push(`r.category_id = $${paramIndex}`);
                params.push(filters.categoryId);
                paramIndex++;
            }
            if (filters.priceMin !== undefined) {
                whereConditions.push(`r.single_user_price >= $${paramIndex}`);
                params.push(filters.priceMin);
                paramIndex++;
            }
            if (filters.priceMax !== undefined) {
                whereConditions.push(`r.single_user_price <= $${paramIndex}`);
                params.push(filters.priceMax);
                paramIndex++;
            }
            if ((_a = filters.regions) === null || _a === void 0 ? void 0 : _a.length) {
                whereConditions.push(`r.regions && $${paramIndex}`);
                params.push(filters.regions);
                paramIndex++;
            }
            if ((_b = filters.industryTags) === null || _b === void 0 ? void 0 : _b.length) {
                whereConditions.push(`r.industry_tags && $${paramIndex}`);
                params.push(filters.industryTags);
                paramIndex++;
            }
            if (filters.featured !== undefined) {
                whereConditions.push(`r.featured = $${paramIndex}`);
                params.push(filters.featured);
                paramIndex++;
            }
            // Add search query
            if (query.trim()) {
                whereConditions.push(`(
        r.search_vector @@ plainto_tsquery('english', $${paramIndex})
        OR EXISTS (
          SELECT 1 FROM report_translations rt 
          WHERE rt.report_id = r.id 
          AND rt.locale = $${paramIndex + 1}
          AND rt.status = 'PUBLISHED'
          AND rt.search_vector @@ plainto_tsquery('english', $${paramIndex})
        )
      )`);
                params.push(query, locale);
                paramIndex += 2;
            }
            const whereClause = whereConditions.join(' AND ');
            const client = yield pgPool.connect();
            try {
                // Main search query
                const searchQuery = `
        SELECT 
          r.id,
          COALESCE(rt.title, r.title) as title,
          COALESCE(rt.description, r.description) as description,
          COALESCE(rt.slug, r.slug) as slug,
          r.category_id,
          r.featured,
          r.avg_rating,
          r.total_reviews,
          r.single_user_price,
          r.published_date,
          rt.id IS NOT NULL as is_translated,
          $${paramIndex} as locale,
          c.id as category_id,
          COALESCE(ct.title, c.title) as category_title,
          COALESCE(ct.slug, c.slug) as category_slug,
          ${query.trim() ? `ts_rank(COALESCE(rt.search_vector, r.search_vector), plainto_tsquery('english', $${paramIndex - 2})) as rank` : '0 as rank'}
        FROM reports r
        LEFT JOIN report_translations rt ON r.id = rt.report_id AND rt.locale = $${paramIndex} AND rt.status = 'PUBLISHED'
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $${paramIndex}
        WHERE ${whereClause}
        ORDER BY ${query.trim() ? 'rank DESC,' : ''} r.featured DESC, r.published_date DESC
        LIMIT ${paramIndex + 1} OFFSET ${paramIndex + 2}
      `;
                params.push(locale, limit, offset);
                const result = yield client.query(searchQuery, params);
                // Count query
                const countQuery = `
        SELECT COUNT(*) as total
        FROM reports r
        WHERE ${whereClause}
      `;
                const countParams = params.slice(0, paramIndex - 3); // Remove locale, limit, offset
                const countResult = yield client.query(countQuery, countParams);
                // Aggregations
                const aggregations = yield this.getSearchAggregations(client, whereClause, countParams, locale);
                return {
                    reports: result.rows.map((row) => ({
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        slug: row.slug,
                        categoryId: row.category_id,
                        featured: row.featured,
                        avgRating: row.avg_rating,
                        totalReviews: row.total_reviews,
                        singleUserPrice: row.single_user_price,
                        publishedDate: row.published_date,
                        isTranslated: row.is_translated,
                        locale: row.locale,
                        category: row.category_id ? {
                            id: row.category_id,
                            title: row.category_title,
                            slug: row.category_slug
                        } : undefined
                    })),
                    total: parseInt(countResult.rows[0].total),
                    aggregations
                };
            }
            finally {
                client.release();
            }
        });
    }
    // Get report by slug with translations
    static getBySlug(slug_1) {
        return __awaiter(this, arguments, void 0, function* (slug, locale = 'en') {
            var _a;
            try {
                const report = yield prisma.report.findFirst({
                    where: {
                        OR: [
                            { slug: slug, status: 'PUBLISHED' },
                            {
                                translations: {
                                    some: {
                                        slug: slug,
                                        locale: locale,
                                        status: 'PUBLISHED'
                                    }
                                }
                            }
                        ]
                    },
                    include: {
                        category: {
                            include: {
                                translations: {
                                    where: { locale }
                                }
                            }
                        },
                        translations: {
                            where: { locale: locale, status: 'PUBLISHED' }
                        },
                        faqs: {
                            where: { locale: locale, status: 'PUBLISHED' },
                            orderBy: { sortOrder: 'asc' }
                        },
                        reviews: {
                            where: { status: 'PUBLISHED' },
                            include: { user: true },
                            orderBy: { createdAt: 'desc' },
                            take: 10
                        }
                    }
                });
                if (!report)
                    return null;
                const translation = report.translations[0];
                const categoryTranslation = (_a = report.category) === null || _a === void 0 ? void 0 : _a.translations;
                return {
                    id: report.id,
                    title: (translation === null || translation === void 0 ? void 0 : translation.title) || report.title,
                    description: (translation === null || translation === void 0 ? void 0 : translation.description) || report.description,
                    slug: (translation === null || translation === void 0 ? void 0 : translation.slug) || report.slug,
                    categoryId: report.categoryId,
                    featured: report.featured,
                    avgRating: report.avgRating ? parseFloat(report.avgRating.toString()) : undefined,
                    totalReviews: report.totalReviews,
                    singleUserPrice: report.singleUserPrice ? parseFloat(report.singleUserPrice.toString()) : undefined,
                    publishedDate: report.publishedDate,
                    isTranslated: !!translation,
                    locale,
                    category: report.category ? {
                        id: report.category.id,
                        title: (categoryTranslation === null || categoryTranslation === void 0 ? void 0 : categoryTranslation.title) || report.category.title,
                        slug: (categoryTranslation === null || categoryTranslation === void 0 ? void 0 : categoryTranslation.slug) || report.category.slug
                    } : undefined
                };
            }
            catch (error) {
                console.error('Error fetching report by slug:', error);
                return null;
            }
        });
    }
    // Get featured reports for homepage
    static getFeatured() {
        return __awaiter(this, arguments, void 0, function* (locale = 'en', limit = 8) {
            try {
                const reports = yield prisma.report.findMany({
                    where: {
                        status: 'PUBLISHED',
                        featured: true
                    },
                    include: {
                        category: {
                            include: {
                                translations: {
                                    where: { locale }
                                }
                            }
                        },
                        translations: {
                            where: { locale: locale, status: 'PUBLISHED' }
                        }
                    },
                    orderBy: [
                        { priority: 'desc' },
                        { publishedAt: 'desc' }
                    ],
                    take: limit
                });
                return reports.map((report) => {
                    var _a;
                    const translation = report.translations[0];
                    const categoryTranslation = (_a = report.category) === null || _a === void 0 ? void 0 : _a.translations;
                    return {
                        id: report.id,
                        title: (translation === null || translation === void 0 ? void 0 : translation.title) || report.title,
                        description: (translation === null || translation === void 0 ? void 0 : translation.description) || report.description,
                        slug: (translation === null || translation === void 0 ? void 0 : translation.slug) || report.slug,
                        categoryId: report.categoryId,
                        featured: report.featured,
                        avgRating: report.avgRating ? parseFloat(report.avgRating.toString()) : undefined,
                        totalReviews: report.totalReviews,
                        singleUserPrice: report.singleUserPrice ? parseFloat(report.singleUserPrice.toString()) : undefined,
                        publishedDate: report.publishedDate,
                        isTranslated: !!translation,
                        locale,
                        category: report.category ? {
                            id: report.category.id,
                            title: (categoryTranslation === null || categoryTranslation === void 0 ? void 0 : categoryTranslation.title) || report.category.title,
                            slug: (categoryTranslation === null || categoryTranslation === void 0 ? void 0 : categoryTranslation.slug) || report.category.slug
                        } : undefined
                    };
                });
            }
            catch (error) {
                console.error('Error fetching featured reports:', error);
                return [];
            }
        });
    }
    // Helper method for search aggregations
    static getSearchAggregations(client, whereClause, params, locale) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Categories aggregation
                const categoriesQuery = `
        SELECT 
          c.id,
          COALESCE(ct.title, c.title) as title,
          COUNT(r.id) as count
        FROM reports r
        JOIN categories c ON r.category_id = c.id
        LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.locale = $${params.length + 1}
        WHERE ${whereClause}
        GROUP BY c.id, c.title, ct.title
        ORDER BY count DESC
        LIMIT 10
      `;
                const categoriesResult = yield client.query(categoriesQuery, [...params, locale]);
                // Price ranges aggregation
                const priceRangesQuery = `
        SELECT 
          CASE 
            WHEN single_user_price < 1000 THEN 'Under $1K'
            WHEN single_user_price < 5000 THEN '$1K - $5K'
            WHEN single_user_price < 10000 THEN '$5K - $10K'
            ELSE '$10K+'
          END as range,
          COUNT(*) as count
        FROM reports r
        WHERE ${whereClause} AND single_user_price IS NOT NULL
        GROUP BY range
        ORDER BY count DESC
      `;
                const priceRangesResult = yield client.query(priceRangesQuery, params);
                // Regions aggregation
                const regionsQuery = `
        SELECT 
          unnest(regions) as region,
          COUNT(*) as count
        FROM reports r
        WHERE ${whereClause}
        GROUP BY region
        ORDER BY count DESC
        LIMIT 10
      `;
                const regionsResult = yield client.query(regionsQuery, params);
                return {
                    categories: categoriesResult.rows,
                    priceRanges: priceRangesResult.rows,
                    regions: regionsResult.rows
                };
            }
            catch (error) {
                console.error('Error fetching aggregations:', error);
                return {
                    categories: [],
                    priceRanges: [],
                    regions: []
                };
            }
        });
    }
}
