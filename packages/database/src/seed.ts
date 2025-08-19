import { PrismaClient } from './generated'

const prisma = new PrismaClient()

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  // 1. Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        shortcode: 'tech',
        slug: 'technology',
        title: 'Technology',
        description: 'Technology and IT market research reports',
        icon: '💻',
        featured: true,
        sortOrder: 1,
        metaTitle: 'Technology Market Research Reports',
        metaDescription: 'Comprehensive technology market analysis and research reports'
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'health',
        slug: 'healthcare',
        title: 'Healthcare',
        description: 'Healthcare and pharmaceutical market research',
        icon: '🏥',
        featured: true,
        sortOrder: 2,
        metaTitle: 'Healthcare Market Research Reports',
        metaDescription: 'In-depth healthcare industry analysis and market reports'
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'auto',
        slug: 'automotive',
        title: 'Automotive',
        description: 'Automotive industry market research and analysis',
        icon: '🚗',
        featured: true,
        sortOrder: 3
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'energy',
        slug: 'energy',
        title: 'Energy',
        description: 'Energy sector market research and trends',
        icon: '⚡',
        featured: true,
        sortOrder: 4
      }
    }),
    prisma.category.create({
      data: {
        shortcode: 'food',
        slug: 'food-beverage',
        title: 'Food & Beverage',
        description: 'Food and beverage industry market analysis',
        icon: '🍕',
        featured: true,
        sortOrder: 5
      }
    })
  ])

  console.log(`✅ Created ${categories.length} categories`)

  // 2. Create Category Translations (Japanese)
  for (const category of categories) {
    await prisma.categoryTranslation.create({
      data: {
        categoryId: category.id,
        locale: 'ja',
        title: `${category.title} (JP)`, // In real scenario, use actual Japanese
        description: `${category.description} (Japanese version)`,
        slug: `${category.slug}-ja`,
        metaTitle: `${category.metaTitle} (JP)`,
        metaDescription: `${category.metaDescription} (JP)`,
        status: 'PUBLISHED'
      }
    })
  }

  console.log('✅ Created Japanese category translations')

  // 3. Create Sample Reports
  const sampleReports = [
    {
      categoryId: categories[0].id, // Technology
      title: 'Artificial Intelligence Market Analysis 2025',
      description: 'Comprehensive analysis of the global AI market including machine learning, deep learning, and neural networks. This report covers market size, growth trends, competitive landscape, and future projections for the AI industry.',
      summary: 'The AI market is expected to reach $1.8 trillion by 2030, driven by increased adoption across industries.',
      sku: 'AI-2025-001',
      slug: 'artificial-intelligence-market-analysis-2025',
      pages: 250,
      baseYear: 2024,
      forecastPeriod: '2025-2030',
      keyFindings: [
        'AI market growing at 35% CAGR',
        'Healthcare AI segment fastest growing',
        'North America leads adoption'
      ],
      keyPlayers: ['Google', 'Microsoft', 'IBM', 'Amazon', 'NVIDIA'],
      regions: ['North America', 'Europe', 'Asia Pacific'],
      industryTags: ['AI', 'Machine Learning', 'Deep Learning'],
      keywords: ['artificial intelligence', 'machine learning', 'AI market'],
      singlePrice: 4500,
      multiPrice: 6750,
      corporatePrice: 9000,
      featured: true,
      priority: 100
    },
    {
      categoryId: categories[1].id, // Healthcare
      title: 'Global Telemedicine Market Report 2025',
      description: 'In-depth analysis of the telemedicine market covering virtual consultations, remote monitoring, and digital health platforms. Market size, trends, and growth opportunities.',
      summary: 'Telemedicine market accelerated by COVID-19, expected to maintain strong growth through 2030.',
      sku: 'TELE-2025-001',
      slug: 'global-telemedicine-market-report-2025',
      pages: 180,
      baseYear: 2024,
      forecastPeriod: '2025-2030',
      keyFindings: [
        'Market size reached $83 billion in 2024',
        'Remote monitoring fastest growing segment',
        'Regulatory support driving adoption'
      ],
      keyPlayers: ['Teladoc', 'Amwell', 'MDLive', 'Doxy.me'],
      regions: ['Global'],
      industryTags: ['Telemedicine', 'Digital Health', 'Healthcare IT'],
      keywords: ['telemedicine', 'telehealth', 'digital health'],
      singlePrice: 3800,
      multiPrice: 5700,
      corporatePrice: 7600,
      featured: true,
      priority: 95
    },
    {
      categoryId: categories[2].id, // Automotive
      title: 'Electric Vehicle Battery Market Analysis',
      description: 'Comprehensive study of the EV battery market including lithium-ion, solid-state, and emerging battery technologies. Market dynamics, supply chain analysis, and future outlook.',
      summary: 'EV battery market driven by automotive electrification and energy storage demand.',
      sku: 'EV-BAT-2025',
      slug: 'electric-vehicle-battery-market-analysis',
      pages: 220,
      baseYear: 2024,
      keyFindings: [
        'Lithium-ion dominates current market',
        'Solid-state batteries emerging by 2028',
        'China leads production capacity'
      ],
      keyPlayers: ['CATL', 'LG Energy', 'BYD', 'Panasonic', 'Tesla'],
      regions: ['Global', 'Asia Pacific', 'Europe'],
      industryTags: ['EV Battery', 'Lithium-ion', 'Electric Vehicles'],
      keywords: ['EV battery', 'lithium-ion', 'electric vehicle'],
      singlePrice: 4200,
      multiPrice: 6300,
      corporatePrice: 8400,
      featured: true,
      priority: 90
    }
  ]

  const reports = []
  for (const reportData of sampleReports) {
    const report = await prisma.report.create({
      data: {
        ...reportData,
        publishedDate: new Date(),
        metaTitle: reportData.title,
        metaDescription: reportData.description.substring(0, 300),
        status: 'PUBLISHED',
        marketData: {
          marketSize: {
            2024: Math.floor(Math.random() * 50 + 10),
            2025: Math.floor(Math.random() * 60 + 20),
            2030: Math.floor(Math.random() * 100 + 50)
          },
          cagr: Math.floor(Math.random() * 20 + 10)
        }
      }
    })
    reports.push(report)
  }

  console.log(`✅ Created ${reports.length} sample reports`)

  // 4. Create Admin User
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@thebrainyinsights.com',
      username: 'superadmin',
      firstName: 'Super',
      lastName: 'Admin',
      password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.', // password123
      role: 'SUPERADMIN',
      status: 'ACTIVE'
    }
  })

  console.log(`✅ Created admin user: ${admin.email}`)

  // 5. Create Sample Reviews
  for (const report of reports) {
    await prisma.reportReview.create({
      data: {
        reportId: report.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        title: 'Excellent Market Analysis',
        content: 'Very comprehensive and well-researched report. Great insights into market trends.',
        reviewerName: 'John Smith',
        reviewerCompany: 'Tech Solutions Inc',
        status: 'PUBLISHED',
        verified: true
      }
    })
  }

  console.log('✅ Created sample reviews')

  // 6. Update report review counts
  for (const report of reports) {
    await prisma.report.update({
      where: { id: report.id },
      data: {
        reviewCount: 1,
        avgRating: 4.5
      }
    })
  }

  console.log('🎉 Database seeding completed successfully!')
}

seedDatabase()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
