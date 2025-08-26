"use strict";
/*
import { prisma, pgPool } from '../postgres-client'
import type { Prisma } from '@tbi/database'

export interface SearchFilters {
  categoryId?: string
  priceMin?: number
  priceMax?: number
  regions?: string[]
  industryTags?: string[]
  publishedAfter?: Date
  featured?: boolean
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

export interface ReportWithTranslation {
  id: string
  title: string
  description: string
  slug: string
  categoryId?: string
  featured: boolean
  avgRating?: number
  totalReviews: number
  singleUserPrice?: number
  publishedDate: Date
  isTranslated: boolean
  locale: string
  category?: {
    id: string
    title: string
    slug: string
  }
}

export class EnhancedReportService {
  
  // Advanced search with full-text and filters
  static async search(
    query: string,
    locale: string = 'en',
    filters: SearchFilters = {},
    pagination: { limit?: number; offset?: number } = {}
  ): Promise<{
    reports: ReportWithTranslation[]
    total: number
    aggregations: {
      categories: Array<{ id: string; title: string; count: number }>
      priceRanges: Array<{ range: string; count: number }>
      regions: Array<{ region: string; count: number }>
    }
  }> {
    const { limit = 24, offset = 0 } = pagination
    
    // Build dynamic where clause
    const whereConditions: string[] = ['r.status = $1']
    const params: any[] = ['PUBLISHED']
    let paramIndex = 2

    // Add filters
    if (filters.categoryId) {
      whereConditions.push(`r.category_id = $${paramIndex}`)
      params.push(filters.categoryId)
      paramIndex++
    }

    if (filters.priceMin !== undefined) {
      whereConditions.push(`r.single_user_price >= $${paramIndex}`)
      params.push(filters.priceMin)
      paramIndex++
    }

    if (filters.priceMax !== undefined) {
      whereConditions.push(`r.single_user_price <= $${paramIndex}`)
      params.push(filters.priceMax)
      paramIndex++
    }

    if (filters.regions?.length) {
      whereConditions.push(`r.regions && $${paramIndex}`)
      params.push(filters.regions)
      paramIndex++
    }

    if (filters.industryTags?.length) {
      whereConditions.push(`r.industry_tags && $${paramIndex}`)
      params.push(filters.industryTags)
      paramIndex++
    }

    if (filters.featured !== undefined) {
      whereConditions.push(`r.featured = $${paramIndex}`)
      params.push(filters.featured)
      paramIndex++
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
      )`)
      params.push(query, locale)
      paramIndex += 2
    }

    const whereClause = whereConditions.join(' AND ')

    const client = await pgPool.connect()
    
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
      `

      params.push(locale, limit, offset)
      
      const result = await client.query(searchQuery, params)

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total
        FROM reports r
        WHERE ${whereClause}
      `
      
      const countParams = params.slice(0, paramIndex - 3) // Remove locale, limit, offset
      const countResult = await client.query(countQuery, countParams)

      // Aggregations
      const aggregations = await this.getSearchAggregations(client, whereClause, countParams, locale)

      return {
        reports: result.rows.map((row: any) => ({
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
      }

    } finally {
      client.release()
    }
  }

  // Get report by slug with translations
  static async getBySlug(
    slug: string,
    locale: string = 'en'
  ): Promise<ReportWithTranslation | null> {
    try {
      const report: Prisma.ReportGetPayload<{
        include: {
          category: { include: { translations: true } };
          translations: true;
          faqs: true;
          reviews: { include: { user: true } };
        };
      }> | null = await prisma.report.findFirst({
        where: {
          OR: [
            { slug: slug, status: 'PUBLISHED' },
            {
              translations: {
                some: {
                  slug: slug,
                  locale: locale as any,
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
            where: { locale: locale as any, status: 'PUBLISHED' }
          },
          faqs: {
            where: { locale: locale as any, status: 'PUBLISHED' } as any,
            orderBy: { sortOrder: 'asc' } as any
          },
          reviews: {
            where: { status: 'PUBLISHED' },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })

      if (!report) return null

      const translation = report.translations[0]
      const categoryTranslation = report.category?.translations

      return {
        id: report.id,
        title: translation?.title || report.title,
        description: translation?.description || report.description,
        slug: translation?.slug || report.slug,
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
          title: categoryTranslation?.title || report.category.title,
          slug: categoryTranslation?.slug || report.category.slug
        } : undefined
      }

    } catch (error) {
      console.error('Error fetching report by slug:', error)
      return null
    }
  }

  // Get featured reports for homepage
  static async getFeatured(
    locale: string = 'en',
    limit: number = 8
  ): Promise<ReportWithTranslation[]> {
    try {
      const reports: Prisma.ReportGetPayload<{
        include: {
          category: { include: { translations: true } };
          translations: true;
        };
      }>[] = await prisma.report.findMany({
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
            where: { locale: locale as any, status: 'PUBLISHED' }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { publishedAt: 'desc' }
        ],
        take: limit
      })

      return reports.map((report: any) => {
        const translation = report.translations[0]
        const categoryTranslation = report.category?.translations

        return {
          id: report.id,
          title: translation?.title || report.title,
          description: translation?.description || report.description,
          slug: translation?.slug || report.slug,
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
            title: categoryTranslation?.title || report.category.title,
            slug: categoryTranslation?.slug || report.category.slug
          } : undefined
        }
      })

    } catch (error) {
      console.error('Error fetching featured reports:', error)
      return []
    }
  }

  // Helper method for search aggregations
  private static async getSearchAggregations(
    client: any,
    whereClause: string,
    params: any[],
    locale: string
  ) {
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
      `

      const categoriesResult = await client.query(categoriesQuery, [...params, locale])

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
      `

      const priceRangesResult = await client.query(priceRangesQuery, params)

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
      `

      const regionsResult = await client.query(regionsQuery, params)

      return {
        categories: categoriesResult.rows,
        priceRanges: priceRangesResult.rows,
        regions: regionsResult.rows
      }

    } catch (error) {
      console.error('Error fetching aggregations:', error)
      return {
        categories: [],
        priceRanges: [],
        regions: []
      }
    }
  }
}
*/ 
