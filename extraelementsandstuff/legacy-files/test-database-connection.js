import { Pool } from 'pg';

// Test database connection and check data
async function testDatabaseConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:password@localhost:5432/alttbidb'
  });

  try {
    console.log('🔍 Testing Database Connection...\n');

    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connection successful!\n');

    // Check tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Available Tables:');
    tablesResult.rows.forEach(row => console.log(`  - ${row.table_name}`));
    console.log('');

    // Check categories data
    const categoriesResult = await client.query(`
      SELECT id, title, slug, description, icon, featured, status, view_count
      FROM categories 
      WHERE status = 'PUBLISHED'
      ORDER BY sort_order ASC, title ASC
      LIMIT 10;
    `);
    
    console.log('📊 Categories Data:');
    console.log(`  Total categories: ${categoriesResult.rows.length}`);
    categoriesResult.rows.forEach(cat => {
      console.log(`  - ${cat.title} (${cat.slug}) - Featured: ${cat.featured} - Views: ${cat.view_count}`);
    });
    console.log('');

    // Check reports data
    const reportsResult = await client.query(`
      SELECT r.id, r.title, r.slug, r.pages, r.single_price, r.featured, r.status,
             c.title as category_title
      FROM reports r
      LEFT JOIN categories c ON r.category_id = c.id
      WHERE r.status = 'PUBLISHED'
      ORDER BY r.featured DESC, r.published_date DESC
      LIMIT 10;
    `);
    
    console.log('📑 Reports Data:');
    console.log(`  Total reports: ${reportsResult.rows.length}`);
    reportsResult.rows.forEach(report => {
      console.log(`  - ${report.title} (${report.category_title}) - Pages: ${report.pages} - Price: $${report.single_price || 'N/A'}`);
    });
    console.log('');

    // Check featured data specifically
    const featuredCategoriesResult = await client.query(`
      SELECT COUNT(*) as count FROM categories WHERE featured = true AND status = 'PUBLISHED';
    `);
    
    const featuredReportsResult = await client.query(`
      SELECT COUNT(*) as count FROM reports WHERE featured = true AND status = 'PUBLISHED';
    `);

    console.log('⭐ Featured Content:');
    console.log(`  Featured Categories: ${featuredCategoriesResult.rows[0].count}`);
    console.log(`  Featured Reports: ${featuredReportsResult.rows[0].count}`);
    console.log('');

    // Test your services
    console.log('🧪 Testing CategoryService and ReportService...');
    
    client.release();
    await pool.end();
    
    console.log('✅ Database verification complete!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check DATABASE_URL in .env.local');
    console.log('3. Verify database and tables exist');
    console.log('4. Check user permissions');
  }
}

testDatabaseConnection();
