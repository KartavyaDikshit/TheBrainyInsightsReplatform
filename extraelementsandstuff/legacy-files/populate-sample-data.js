import { Pool } from 'pg';
import { randomUUID } from 'crypto';

async function populateSampleData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:password@localhost:5432/alttbidb'
  });

  try {
    const client = await pool.connect();
    console.log('🚀 Populating sample data...\n');

    // Generate UUIDs for categories
    const catIds = {
      tech: randomUUID(),
      health: randomUUID(),
      finance: randomUUID(),
      retail: randomUUID(),
      energy: randomUUID(),
      manufacturing: randomUUID()
    };

    // Insert sample categories
    const categories = [
      {
        id: catIds.tech,
        shortcode: 'TECH',
        slug: 'technology',
        title: 'Technology & Software',
        description: 'Comprehensive analysis of technology trends, software markets, and digital transformation.',
        icon: '💻',
        featured: true,
        sort_order: 1,
        status: 'PUBLISHED',
        view_count: 1250
      },
      {
        id: catIds.health, 
        shortcode: 'HLTH',
        slug: 'healthcare',
        title: 'Healthcare & Life Sciences',
        description: 'Medical devices, pharmaceuticals, biotechnology, and healthcare industry insights.',
        icon: '🏥',
        featured: true,
        sort_order: 2,
        status: 'PUBLISHED',
        view_count: 980
      },
      {
        id: catIds.finance,
        shortcode: 'FIN',
        slug: 'financial-services',
        title: 'Financial Services',
        description: 'Banking, fintech, insurance, and investment market analysis.',
        icon: '💰',
        featured: true,
        sort_order: 3,
        status: 'PUBLISHED',
        view_count: 745
      },
      {
        id: catIds.retail,
        shortcode: 'RET',
        slug: 'retail-consumer',
        title: 'Retail & Consumer Goods',
        description: 'Consumer behavior, e-commerce trends, and retail market data.',
        icon: '🛒',
        featured: true,
        sort_order: 4,
        status: 'PUBLISHED',
        view_count: 632
      },
      {
        id: catIds.energy,
        shortcode: 'ENR',
        slug: 'energy-sustainability',
        title: 'Energy & Sustainability',
        description: 'Renewable energy, oil & gas, and environmental solutions.',
        icon: '⚡',
        featured: true,
        sort_order: 5,
        status: 'PUBLISHED',
        view_count: 521
      },
      {
        id: catIds.manufacturing,
        shortcode: 'MFG',
        slug: 'manufacturing',
        title: 'Manufacturing & Industrial',
        description: 'Industrial equipment, automation, and supply chain analysis.',
        icon: '🏭',
        featured: true,
        sort_order: 6,
        status: 'PUBLISHED',
        view_count: 418
      }
    ];

    // Insert categories
    for (const cat of categories) {
      await client.query(`
        INSERT INTO categories (id, shortcode, slug, title, description, icon, featured, sort_order, status, view_count, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          view_count = EXCLUDED.view_count,
          updated_at = NOW()
      `, [cat.id, cat.shortcode, cat.slug, cat.title, cat.description, cat.icon, cat.featured, cat.sort_order, cat.status, cat.view_count]);
    }

    console.log('✅ Categories inserted successfully!');

    // Insert sample reports
    const reports = [
      {
        id: randomUUID(),
        slug: 'global-ai-market-2024',
        title: 'Global Artificial Intelligence Market Report 2024',
        description: 'Comprehensive analysis of the AI market including machine learning, deep learning, and neural networks.',
        summary: 'The global AI market is expected to reach $1.8 trillion by 2030.',
        pages: 245,
        published_date: '2024-01-15',
        single_price: 2499,
        multi_price: 4999,
        corporate_price: 9999,
        featured: true,
        status: 'PUBLISHED',
        view_count: 3420,
        avg_rating: 4.8,
        review_count: 27,
        category_id: catIds.tech
      },
      {
        id: randomUUID(),
        slug: 'healthcare-digital-transformation',
        title: 'Healthcare Digital Transformation Market Analysis',
        description: 'Digital health technologies, telemedicine, and electronic health records market research.',
        summary: 'Digital healthcare solutions are revolutionizing patient care delivery.',
        pages: 189,
        published_date: '2024-01-10',
        single_price: 1899,
        multi_price: 3799,
        corporate_price: 7599,
        featured: true,
        status: 'PUBLISHED',
        view_count: 2156,
        avg_rating: 4.6,
        review_count: 19,
        category_id: catIds.health
      },
      {
        id: randomUUID(),
        slug: 'fintech-market-trends-2024',
        title: 'Fintech Market Trends and Opportunities 2024',
        description: 'Analysis of digital banking, payment systems, and blockchain technologies.',
        summary: 'Fintech innovations are reshaping traditional financial services.',
        pages: 167,
        published_date: '2024-01-08',
        single_price: 1699,
        multi_price: 3399,
        corporate_price: 6799,
        featured: true,
        status: 'PUBLISHED',
        view_count: 1876,
        avg_rating: 4.7,
        review_count: 22,
        category_id: catIds.finance
      },
      {
        id: randomUUID(),
        slug: 'e-commerce-consumer-behavior',
        title: 'E-commerce Consumer Behavior Study 2024',
        description: 'Online shopping patterns, mobile commerce trends, and post-pandemic consumer preferences.',
        summary: 'Consumer behavior has permanently shifted towards digital channels.',
        pages: 134,
        published_date: '2024-01-05',
        single_price: 1299,
        multi_price: 2599,
        corporate_price: 5199,
        featured: true,
        status: 'PUBLISHED',
        view_count: 1543,
        avg_rating: 4.5,
        review_count: 15,
        category_id: catIds.retail
      },
      {
        id: randomUUID(),
        slug: 'renewable-energy-market-2024',
        title: 'Renewable Energy Market Outlook 2024',
        description: 'Solar, wind, and other renewable energy technologies market analysis.',
        summary: 'Renewable energy adoption is accelerating globally.',
        pages: 198,
        published_date: '2024-01-03',
        single_price: 1799,
        multi_price: 3599,
        corporate_price: 7199,
        featured: true,
        status: 'PUBLISHED',
        view_count: 1287,
        avg_rating: 4.9,
        review_count: 31,
        category_id: catIds.energy
      },
      {
        id: randomUUID(),
        slug: 'smart-manufacturing-industry-4',
        title: 'Smart Manufacturing and Industry 4.0 Report',
        description: 'IoT, automation, and smart factory technologies in manufacturing.',
        summary: 'Industry 4.0 is transforming manufacturing operations worldwide.',
        pages: 156,
        published_date: '2024-01-01',
        single_price: 1599,
        multi_price: 3199,
        corporate_price: 6399,
        featured: true,
        status: 'PUBLISHED',
        view_count: 1098,
        avg_rating: 4.4,
        review_count: 18,
        category_id: catIds.manufacturing
      }
    ];

    // Insert reports
    for (const report of reports) {
      await client.query(`
        INSERT INTO reports (id, slug, title, description, summary, pages, published_date, single_price, multi_price, corporate_price, featured, status, view_count, avg_rating, review_count, category_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          view_count = EXCLUDED.view_count,
          updated_at = NOW()
      `, [report.id, report.slug, report.title, report.description, report.summary, report.pages, report.published_date, report.single_price, report.multi_price, report.corporate_price, report.featured, report.status, report.view_count, report.avg_rating, report.review_count, report.category_id]);
    }

    console.log('✅ Reports inserted successfully!');

    // Verify data
    const categoryCount = await client.query('SELECT COUNT(*) as count FROM categories WHERE status = $1', ['PUBLISHED']);
    const reportCount = await client.query('SELECT COUNT(*) as count FROM reports WHERE status = $1', ['PUBLISHED']);
    const featuredCategories = await client.query('SELECT COUNT(*) as count FROM categories WHERE featured = true AND status = $1', ['PUBLISHED']);
    const featuredReports = await client.query('SELECT COUNT(*) as count FROM reports WHERE featured = true AND status = $1', ['PUBLISHED']);

    console.log('\n📊 Data Summary:');
    console.log(`  Total Categories: ${categoryCount.rows[0].count}`);
    console.log(`  Total Reports: ${reportCount.rows[0].count}`);
    console.log(`  Featured Categories: ${featuredCategories.rows[0].count}`);
    console.log(`  Featured Reports: ${featuredReports.rows[0].count}`);

    client.release();
    await pool.end();
    
    console.log('\n🎉 Sample data population complete!');
    console.log('Your homepage should now display dynamic content from the database.');
    
  } catch (error) {
    console.error('❌ Error populating data:', error.message);
  }
}

populateSampleData();
