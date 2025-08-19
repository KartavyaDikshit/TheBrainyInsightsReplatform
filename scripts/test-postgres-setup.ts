import { checkDatabaseHealth, pgPool, prisma } from '../src/lib/db/postgres-client'
import { EnhancedReportService } from '../src/lib/db/services/enhanced-report-service'
import { PrismaClient } from '../../packages/database/src/generated/client';

interface TestResult {
  name: string
  status: 'pass' | 'fail'
  duration: number
  error?: string
  details?: any
}

export class PostgresTestSuite {
  private results: TestResult[] = []

  async runTest(
    name: string, 
    testFn: () => Promise<any>
  ): Promise<TestResult> {
    const startTime = Date.now()
    
    try {
      const result = await testFn()
      const duration = Date.now() - startTime
      
      const testResult: TestResult = {
        name,
        status: 'pass',
        duration,
        details: result
      }
      
      this.results.push(testResult)
      console.log(`✅ ${name} (${duration}ms)`)
      
      return testResult
      
    } catch (error) {
      const duration = Date.now() - startTime
      
      const testResult: TestResult = {
        name,
        status: 'fail',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      
      this.results.push(testResult)
      console.log(`❌ ${name} (${duration}ms): ${testResult.error}`)
      
      return testResult
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting PostgreSQL Test Suite...\n')

    // Test 1: Database Connection & Health
    await this.runTest('Database Connection', async () => {
      const health = await checkDatabaseHealth()
      if (health.status !== 'healthy') {
        throw new Error(`Database unhealthy: ${health.error}`)
      }
      return health
    })

    // Test 2: Prisma Connection
    await this.runTest('Prisma Connection', async () => {
      await prisma.$connect()
      const result = await prisma.$queryRaw`SELECT 1 as test`
      return result
    })

    // Test 3: Extensions & Functions
    await this.runTest('Database Extensions', async () => {
      const client = await pgPool.connect()
      try {
        const extensions = await client.query(`
          SELECT extname FROM pg_extension 
          WHERE extname IN ('uuid-ossp', 'pg_trgm', 'unaccent', 'btree_gin')
        `)
        
        const functions = await client.query(`
          SELECT proname FROM pg_proc 
          WHERE proname IN ('create_search_vector', 'generate_slug', 'search_reports')
        `)
        
        return {
          extensions: extensions.rows,
          functions: functions.rows
        }
      } finally {
        client.release()
      }
    })

    // Test 4: Data Integrity
    await this.runTest('Data Integrity Check', async () => {
      const counts = await Promise.all([
        prisma.category.count(),
        prisma.report.count(),
        prisma.user.count(),
        prisma.admin.count(),
        prisma.categoryTranslation.count(),
        prisma.reportTranslation.count()
      ])

      const [categories, reports, users, admins, categoryTranslations, reportTranslations] = counts

      if (categories === 0) {
        throw new Error('No categories found')
      }

      if (reports === 0) {
        throw new Error('No reports found')
      }

      return {
        categories,
        reports,
        users,
        admins,
        categoryTranslations,
        reportTranslations
      }
    })

    // Test 5: Full-text Search
    await this.runTest('Full-text Search', async () => {
      const searchResults = await EnhancedReportService.search(
        'market analysis',
        'en',
        {},
        { limit: 5 }
      )

      if (searchResults.reports.length === 0) {
        throw new Error('Search returned no results')
      }

      return {
        resultsCount: searchResults.reports.length,
        totalMatches: searchResults.total,
        firstResult: searchResults.reports[0]?.title
      }
    })

    // Test 6: Multilingual Content
    await this.runTest('Multilingual Content', async () => {
      const [englishReports, japaneseReports] = await Promise.all([
        EnhancedReportService.getFeatured('en', 3),
        EnhancedReportService.getFeatured('ja', 3)
      ])

      const translatedCount = japaneseReports.filter(r => r.isTranslated).length

      return {
        englishReports: englishReports.length,
        japaneseReports: japaneseReports.length,
        translatedCount,
        translationPercentage: translatedCount / japaneseReports.length * 100
      }
    })

    // Test 7: Performance Test
    await this.runTest('Performance Test', async () => {
      const startTime = Date.now()
      
      // Simulate concurrent requests
      const promises = Array.from({ length: 10 }, (_, i) => 
        EnhancedReportService.search(`test query ${i}`, 'en', {}, { limit: 10 })
      )
      
      await Promise.all(promises)
      
      const duration = Date.now() - startTime
      
      if (duration > 5000) {
        throw new Error(`Performance test too slow: ${duration}ms`)
      }
      
      return {
        duration,
        averagePerQuery: duration / 10
      }
    })

    // Test 8: Advanced Queries
    await this.runTest('Advanced Queries', async () => {
      const client = await pgPool.connect()
      
      try {
        // Test search function
        const searchResult = await client.query(`
          SELECT * FROM search_reports($1, $2, $3, $4, $5)
        `, ['technology', 'en', null, 5, 0])

        // Test aggregation
        const categoryStats = await client.query(`
          SELECT 
            c.title,
            COUNT(r.id) as report_count,
            AVG(r.single_user_price) as avg_price
          FROM categories c
          LEFT JOIN reports r ON c.id = r.category_id AND r.status = 'PUBLISHED'
          GROUP BY c.id, c.title
          ORDER BY report_count DESC
          LIMIT 5
        `)

        return {
          searchResults: searchResult.rows.length,
          categoryStats: categoryStats.rows
        }
        
      } finally {
        client.release()
      }
    })

    // Test 9: SEO and Slugs
    await this.runTest('SEO and Slug Generation', async () => {
      const client = await pgPool.connect()
      
      try {
        // Test slug generation function
        const slugResult = await client.query(`
          SELECT generate_slug($1) as slug
        `, ['This is a Test Title with Special Characters!@#$%'])

        const slug = slugResult.rows[0].slug
        
        if (!slug || slug.includes(' ') || slug.includes('@')) {
          throw new Error(`Invalid slug generated: ${slug}`)
        }

        // Check for duplicate slugs
        const duplicateCheck = await client.query(`
          SELECT slug, COUNT(*) as count
          FROM (
            SELECT slug FROM reports
            UNION ALL
            SELECT slug FROM report_translations
          ) all_slugs
          GROUP BY slug
          HAVING COUNT(*) > 1
        `)

        return {
          generatedSlug: slug,
          duplicateCount: duplicateCheck.rows.length
        }
        
      } finally {
        client.release()
      }
    })

    // Test 10: AI Content Integration
    await this.runTest('AI Content System', async () => {
      // Test AI content generation table structure
      const aiGeneration = await prisma.aIContentGeneration.create({
        data: {
          contentType: 'report',
          locale: 'en',
          prompt: 'Test prompt for content generation',
          model: 'gpt-4',
          status: 'QUEUED',
          generatedBy: (await prisma.admin.findFirst())?.id || 'test-admin',
          metadata: {
            testRun: true,
            timestamp: new Date().toISOString()
          }
        }
      })

      // Clean up test data
      await prisma.aIContentGeneration.delete({
        where: { id: aiGeneration.id }
      })

      return {
        aiGenerationCreated: true,
        generationId: aiGeneration.id
      }
    })

    this.printSummary()
  }

  private printSummary(): void {
    console.log('\n📊 TEST SUMMARY')
    console.log('='.repeat(60))
    
    const passed = this.results.filter((r: TestResult) => r.status === 'pass').length
    const failed = this.results.filter((r: TestResult) => r.status === 'fail').length
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0)
    
    console.log(`Total Tests: ${this.results.length}`)
    console.log(`Passed: ${passed}`)
    console.log(`Failed: ${failed}`)
    console.log(`Total Duration: ${totalDuration}ms`)
    console.log(`Average Duration: ${Math.round(totalDuration / this.results.length)}ms`)
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:')
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => {
          console.log(`  - ${r.name}: ${r.error}`)
        })
    }
    
    console.log('\n✅ DETAILED RESULTS:')
    this.results.forEach(r => {
      console.log(`  ${r.status === 'pass' ? '✅' : '❌'} ${r.name} (${r.duration}ms)`)
      if (r.details && Object.keys(r.details).length > 0) {
        console.log(`     Details:`, JSON.stringify(r.details, null, 6))
      }
    })
    
    console.log('='.repeat(60))
    console.log(failed === 0 ? '🎉 ALL TESTS PASSED!' : `⚠️  ${failed} TESTS FAILED`)
  }
}

// Run tests if called directly
if (require.main === module) {
  async function main() {
    const testSuite = new PostgresTestSuite()
    
    try {
      await testSuite.runAllTests()
      process.exit(0)
    } catch (error) {
      console.error('Test suite failed:', error)
      process.exit(1)
    }
  }
  
  main()
}