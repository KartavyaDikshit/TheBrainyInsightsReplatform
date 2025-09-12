import { Pool } from 'pg';

// Database client (same as your app)
const db = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:tbipassword@localhost:5432/tbi_db'
});

const dbQuery = async (text, params) => {
  const client = await db.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Test configurations
const TEST_LOCALES = ['en', 'de', 'fr', 'es', 'it', 'ja', 'ko'];
const COMPONENT_TESTS = {
  hero: true,
  categoryGrid: true,
  reportGrid: true,
  categoryDetail: true,
  reportDetail: true,
  translations: true
};

class DatabaseIntegrationTester {
  constructor() {
    this.results = {
      connection: false,
      basicQueries: false,
      categoryService: false,
      reportService: false,
      translations: false,
      dynamicComponents: {},
      errors: []
    };
  }

  async testBasicConnection() {
    console.log('\n🔌 Testing Basic Database Connection...');
    
    try {
      const result = await dbQuery('SELECT NOW() as current_time, current_user as user_name, version() as postgres_version');
      console.log('✅ Database connected successfully!');
      console.log('📅 Current time:', result.rows[0].current_time);
      console.log('👤 Connected as:', result.rows[0].user_name);
      console.log('🐘 PostgreSQL version:', result.rows[0].postgres_version.split(' ')[0]);
      
      // Test authentication method
      const authResult = await dbQuery(`
        SELECT name, setting 
        FROM pg_settings 
        WHERE name = 'password_encryption'
      `);
      console.log('🔐 Authentication method:', authResult.rows[0]?.setting || 'Unknown');
      
      this.results.connection = true;
      return true;
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      this.results.errors.push(`Connection: ${error.message}`);
      return false;
    }
  }

  async testBasicQueries() {
    console.log('\n📊 Testing Basic Database Queries...');
    
    try {
      // Test all main tables exist and are accessible
      const tables = [
        'categories', 'category_translations',
        'reports', 'report_translations', 
        'users', 'admins',
        'orders', 'order_items', 'enquiries',
        'translation_jobs', 'content_generation_workflows',
        'blogs', 'blog_translations',
        'seo_analytics'
      ];
      
      console.log('🔍 Checking table accessibility...');
      for (const table of tables) {
        const result = await dbQuery(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        console.log(`   ${table}: ${count} records`);
      }
      
      // Test basic data integrity
      const categoryCount = await dbQuery(`SELECT COUNT(*) as count FROM categories WHERE status = 'PUBLISHED'`);
      const reportCount = await dbQuery(`SELECT COUNT(*) as count FROM reports WHERE status = 'PUBLISHED'`);
      
      console.log('📈 Published content:');
      console.log(`   Categories: ${categoryCount.rows[0].count}`);
      console.log(`   Reports: ${reportCount.rows[0].count}`);
      
      this.results.basicQueries = true;
      return true;
    } catch (error) {
      console.error('❌ Basic queries failed:', error.message);
      this.results.errors.push(`Basic queries: ${error.message}`);
      return false;
    }
  }

  async testCategoryService() {
    console.log('\n📂 Testing Category Service (CategoryGrid Component)...');
    
    try {
      // Test the exact queries used by CategoryService
      const categoryQuery = `
        SELECT
          c.id,
          c.shortcode,
          c.slug,
          c.title,
          c.description,
          c.icon,
          c.featured,
          c.sort_order,
          c.status,
          c.view_count,
          c.created_at,
          ct.title AS translated_title,
          ct.description AS translated_description,
          ct.slug AS translated_slug,
          (
            SELECT COUNT(*)
            FROM reports r
            WHERE r.category_id = c.id
              AND r.status::text = 'PUBLISHED'
          ) AS reports_count
        FROM categories c
        LEFT JOIN category_translations ct
          ON ct.category_id = c.id
         AND ct.locale = $1
         AND ct.status::text = 'PUBLISHED'
        WHERE c.status::text = 'PUBLISHED'
        ORDER BY c.sort_order ASC NULLS LAST, c.created_at DESC
        LIMIT 6
      `;
      
      const result = await dbQuery(categoryQuery, ['en']);
      console.log(`✅ Found ${result.rows.length} categories for CategoryGrid`);
      
      if (result.rows.length > 0) {
        const sample = result.rows[0];
        console.log('📋 Sample category data:');
        console.log(`   ID: ${sample.id}`);
        console.log(`   Title: ${sample.translated_title || sample.title}`);
        console.log(`   Slug: ${sample.translated_slug || sample.slug}`);
        console.log(`   Featured: ${sample.featured}`);
        console.log(`   Reports: ${sample.reports_count}`);
        console.log(`   Icon: ${sample.icon || '📊'}`);
      }
      
      // Test featured categories specifically
      const featuredQuery = categoryQuery.replace('WHERE c.status::text = \'PUBLISHED\'', 'WHERE c.status::text = \'PUBLISHED\' AND c.featured = $2');
      const featuredResult = await dbQuery(featuredQuery, ['en', true]);
      console.log(`🌟 Featured categories: ${featuredResult.rows.length}`);
      
      this.results.categoryService = true;
      this.results.dynamicComponents.CategoryGrid = {
        status: 'success',
        records: result.rows.length,
        featured: featuredResult.rows.length
      };
      
      return true;
    } catch (error) {
      console.error('❌ Category service failed:', error.message);
      this.results.errors.push(`Category service: ${error.message}`);
      this.results.dynamicComponents.CategoryGrid = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async testReportService() {
    console.log('\n📄 Testing Report Service (ReportGrid Component)...');
    
    try {
      // Test the exact queries used by ReportService
      const reportQuery = `
        SELECT
          r.id,
          r.slug,
          r.title,
          r.description,
          r.summary,
          r.pages,
          r.published_date,
          r.single_price,
          r.multi_price,
          r.corporate_price,
          r.featured,
          r.status,
          r.view_count,
          r.avg_rating,
          r.review_count,
          r.created_at,
          c.title as category_title,
          c.slug as category_slug,
          rt.title as translated_title,
          rt.description as translated_description,
          rt.summary as translated_summary,
          rt.slug as translated_slug
        FROM reports r
        LEFT JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_translations rt
          ON r.id = rt.report_id
         AND rt.locale = $1
         AND rt.status::text = 'PUBLISHED'
        WHERE r.status::text = 'PUBLISHED'
        ORDER BY r.featured DESC, r.published_date DESC
        LIMIT 8
      `;
      
      const result = await dbQuery(reportQuery, ['en']);
      console.log(`✅ Found ${result.rows.length} reports for ReportGrid`);
      
      if (result.rows.length > 0) {
        const sample = result.rows[0];
        console.log('📋 Sample report data:');
        console.log(`   ID: ${sample.id}`);
        console.log(`   Title: ${sample.translated_title || sample.title}`);
        console.log(`   Category: ${sample.category_title || 'Uncategorized'}`);
        console.log(`   Pages: ${sample.pages || 'N/A'}`);
        console.log(`   Price: $${sample.single_price || 'N/A'}`);
        console.log(`   Featured: ${sample.featured}`);
        console.log(`   Rating: ${sample.avg_rating || 'N/A'}`);
      }
      
      // Test featured reports
      const featuredReportQuery = reportQuery.replace('WHERE r.status::text = \'PUBLISHED\'', 'WHERE r.status::text = \'PUBLISHED\' AND r.featured = $2');
      const featuredResult = await dbQuery(featuredReportQuery, ['en', true]);
      console.log(`🌟 Featured reports: ${featuredResult.rows.length}`);
      
      this.results.reportService = true;
      this.results.dynamicComponents.ReportGrid = {
        status: 'success',
        records: result.rows.length,
        featured: featuredResult.rows.length
      };
      
      return true;
    } catch (error) {
      console.error('❌ Report service failed:', error.message);
      this.results.errors.push(`Report service: ${error.message}`);
      this.results.dynamicComponents.ReportGrid = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async testHeroComponent() {
    console.log('\n🦸 Testing Hero Component Data...');
    
    try {
      // Test the counts used by Hero component
      const [categoryCount, reportCount] = await Promise.all([
        dbQuery(`SELECT COUNT(*) as count FROM categories WHERE status = 'PUBLISHED'`),
        dbQuery(`SELECT COUNT(*) as count FROM reports WHERE status = 'PUBLISHED'`)
      ]);
      
      const categoryTotal = parseInt(categoryCount.rows[0].count);
      const reportTotal = parseInt(reportCount.rows[0].count);
      
      console.log('📊 Hero component stats:');
      console.log(`   Total categories: ${categoryTotal}`);
      console.log(`   Total reports: ${reportTotal}`);
      console.log(`   Languages supported: ${TEST_LOCALES.length}`);
      
      this.results.dynamicComponents.Hero = {
        status: 'success',
        categoryCount: categoryTotal,
        reportCount: reportTotal,
        languages: TEST_LOCALES.length
      };
      
      return true;
    } catch (error) {
      console.error('❌ Hero component data failed:', error.message);
      this.results.dynamicComponents.Hero = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async testTranslationSupport() {
    console.log('\n🌍 Testing Translation Support...');
    
    try {
      const translationResults = {};
      
      for (const locale of TEST_LOCALES.slice(0, 3)) { // Test first 3 locales
        console.log(`   Testing locale: ${locale}`);
        
        // Test category translations
        const categoryTranslations = await dbQuery(`
          SELECT COUNT(*) as count 
          FROM category_translations 
          WHERE locale = $1 AND status = 'PUBLISHED'
        `, [locale]);
        
        // Test report translations  
        const reportTranslations = await dbQuery(`
          SELECT COUNT(*) as count 
          FROM report_translations 
          WHERE locale = $1 AND status = 'PUBLISHED'
        `, [locale]);
        
        translationResults[locale] = {
          categories: parseInt(categoryTranslations.rows[0].count),
          reports: parseInt(reportTranslations.rows[0].count)
        };
        
        console.log(`     Categories: ${translationResults[locale].categories}`);
        console.log(`     Reports: ${translationResults[locale].reports}`);
      }
      
      this.results.translations = true;
      this.results.dynamicComponents.Translations = {
        status: 'success',
        locales: translationResults
      };
      
      return true;
    } catch (error) {
      console.error('❌ Translation support failed:', error.message);
      this.results.errors.push(`Translations: ${error.message}`);
      this.results.dynamicComponents.Translations = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async testCategoryDetailComponent() {
    console.log('\n📂 Testing Category Detail Component...');
    
    try {
      // Test category by slug lookup (used in [slug] pages)
      const categoryDetailQuery = `
        SELECT
          c.id, c.shortcode, c.slug, c.title, c.description, c.icon,
          c.featured, c.sort_order, c.meta_title, c.meta_description,
          c.status, c.view_count, c.created_at,
          ct.title AS translated_title,
          ct.description AS translated_description,
          ct.slug AS translated_slug,
          ct.meta_title AS translated_meta_title,
          ct.meta_description AS translated_meta_description,
          (
            SELECT COUNT(*) FROM reports r 
            WHERE r.category_id = c.id AND r.status::text = 'PUBLISHED'
          ) AS reports_count
        FROM categories c
        LEFT JOIN category_translations ct
          ON ct.category_id = c.id AND ct.locale = $2 AND ct.status::text = 'PUBLISHED'
        WHERE c.slug = $1 AND c.status::text = 'PUBLISHED'
        LIMIT 1
      `;
      
      // Get a sample category slug
      const sampleCategory = await dbQuery(`
        SELECT slug FROM categories 
        WHERE status = 'PUBLISHED' 
        ORDER BY created_at DESC 
        LIMIT 1
      `);
      
      if (sampleCategory.rows.length > 0) {
        const testSlug = sampleCategory.rows[0].slug;
        const result = await dbQuery(categoryDetailQuery, [testSlug, 'en']);
        
        if (result.rows.length > 0) {
          const category = result.rows[0];
          console.log('✅ Category detail lookup successful');
          console.log(`   Slug: ${testSlug}`);
          console.log(`   Title: ${category.translated_title || category.title}`);
          console.log(`   Reports in category: ${category.reports_count}`);
          
          this.results.dynamicComponents.CategoryDetail = {
            status: 'success',
            testSlug: testSlug,
            reportsCount: parseInt(category.reports_count)
          };
        } else {
          throw new Error('Category detail lookup returned no results');
        }
      } else {
        console.log('⚠️  No categories found for testing detail component');
        this.results.dynamicComponents.CategoryDetail = {
          status: 'warning',
          message: 'No categories available for testing'
        };
      }
      
      return true;
    } catch (error) {
      console.error('❌ Category detail component failed:', error.message);
      this.results.dynamicComponents.CategoryDetail = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async testPagePerformance() {
    console.log('\n⚡ Testing Page Performance Queries...');
    
    try {
      const startTime = Date.now();
      
      // Simulate homepage data loading (concurrent queries)
      const [featuredCategories, featuredReports, allCategories, allReports] = await Promise.all([
        dbQuery(`
          SELECT COUNT(*) as count FROM categories 
          WHERE status = 'PUBLISHED' AND featured = true
        `),
        dbQuery(`
          SELECT COUNT(*) as count FROM reports 
          WHERE status = 'PUBLISHED' AND featured = true
        `),
        dbQuery(`
          SELECT COUNT(*) as count FROM categories 
          WHERE status = 'PUBLISHED'
        `),
        dbQuery(`
          SELECT COUNT(*) as count FROM reports 
          WHERE status = 'PUBLISHED'
        `)
      ]);
      
      const endTime = Date.now();
      const queryTime = endTime - startTime;
      
      console.log('📊 Performance results:');
      console.log(`   Homepage queries executed in: ${queryTime}ms`);
      console.log(`   Featured categories: ${featuredCategories.rows[0].count}`);
      console.log(`   Featured reports: ${featuredReports.rows[0].count}`);
      console.log(`   Total categories: ${allCategories.rows[0].count}`);
      console.log(`   Total reports: ${allReports.rows[0].count}`);
      
      if (queryTime > 5000) {
        console.log('⚠️  Queries are slow (>5s). Consider optimizing.');
      } else if (queryTime > 1000) {
        console.log('⚠️  Queries are moderately slow (>1s).');
      } else {
        console.log('✅ Query performance is good (<1s).');
      }
      
      this.results.dynamicComponents.Performance = {
        status: 'success',
        queryTime: queryTime,
        featuredCategories: parseInt(featuredCategories.rows[0].count),
        featuredReports: parseInt(featuredReports.rows[0].count)
      };
      
      return true;
    } catch (error) {
      console.error('❌ Performance test failed:', error.message);
      this.results.dynamicComponents.Performance = {
        status: 'failed',
        error: error.message
      };
      return false;
    }
  }

  async runAllTests() {
    console.log('🚀 Database Integration Test Suite');
    console.log('=====================================');
    console.log('Testing all database connections and dynamic components...\n');
    
    const tests = [
      { name: 'Basic Connection', method: this.testBasicConnection },
      { name: 'Basic Queries', method: this.testBasicQueries },
      { name: 'Category Service', method: this.testCategoryService },
      { name: 'Report Service', method: this.testReportService },
      { name: 'Hero Component', method: this.testHeroComponent },
      { name: 'Translation Support', method: this.testTranslationSupport },
      { name: 'Category Detail', method: this.testCategoryDetailComponent },
      { name: 'Performance', method: this.testPagePerformance }
    ];
    
    let passedTests = 0;
    
    for (const test of tests) {
      try {
        const success = await test.method.call(this);
        if (success) passedTests++;
      } catch (error) {
        console.error(`❌ ${test.name} test failed:`, error.message);
        this.results.errors.push(`${test.name}: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📋 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    
    console.log(`\n✅ Tests passed: ${passedTests}/${tests.length}`);
    
    console.log('\n🧩 Dynamic Component Status:');
    Object.entries(this.results.dynamicComponents).forEach(([component, result]) => {
      const status = result.status === 'success' ? '✅' : 
                    result.status === 'warning' ? '⚠️' : '❌';
      console.log(`   ${status} ${component}: ${result.status}`);
      
      if (result.records !== undefined) {
        console.log(`      Records: ${result.records}`);
      }
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });
    
    if (this.results.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.results.errors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }
    
    console.log('\n🎯 NEXT.JS APPLICATION STATUS:');
    if (passedTests === tests.length) {
      console.log('🎉 ALL TESTS PASSED! Your application should work perfectly.');
      console.log('   • Database connections: ✅');
      console.log('   • Dynamic components: ✅');
      console.log('   • Translations: ✅');
      console.log('   • Performance: ✅');
    } else {
      console.log('⚠️  Some tests failed. Check the errors above.');
      console.log('💡 Common fixes:');
      console.log('   • Ensure DATABASE_URL environment variable is set');
      console.log('   • Check PostgreSQL service is running');
      console.log('   • Verify tbi_user password is correct');
    }
    
    await db.end();
    return passedTests === tests.length;
  }
}

// Run the comprehensive test
const tester = new DatabaseIntegrationTester();
tester.runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  });
