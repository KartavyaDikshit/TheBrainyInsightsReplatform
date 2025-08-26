import { PrismaClient } from './generated';
const prisma = new PrismaClient();
async function seed() {
    console.log('🌱 Starting database seeding...');
    try {
        // Create sample categories
        const techCategory = await prisma.category.create({
            data: {
                shortcode: 'tech',
                slug: 'technology',
                title: 'Technology',
                description: 'Technology and IT market research reports',
                icon: '💻',
                featured: true,
                sortOrder: 1,
                metaTitle: 'Technology Market Research Reports',
                metaDescription: 'Comprehensive technology market analysis and research reports',
                status: 'PUBLISHED'
            }
        });
        const healthCategory = await prisma.category.create({
            data: {
                shortcode: 'health',
                slug: 'healthcare',
                title: 'Healthcare',
                description: 'Healthcare and pharmaceutical market research',
                icon: '🏥',
                featured: true,
                sortOrder: 2,
                metaTitle: 'Healthcare Market Research Reports',
                metaDescription: 'In-depth healthcare industry analysis and market reports',
                status: 'PUBLISHED'
            }
        });
        // Create sample reports
        await prisma.report.create({
            data: {
                categoryId: techCategory.id,
                sku: 'AI-2025-001',
                slug: 'artificial-intelligence-market-analysis-2025',
                title: 'Artificial Intelligence Market Analysis 2025',
                description: 'Comprehensive analysis of the global AI market including machine learning, deep learning, and neural networks.',
                summary: 'The AI market is expected to reach $1.8 trillion by 2030, driven by increased adoption across industries.',
                pages: 250,
                publishedDate: new Date(),
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
                metaTitle: 'Artificial Intelligence Market Analysis 2025',
                metaDescription: 'Comprehensive AI market research report with detailed analysis of trends, growth, and opportunities.',
                singlePrice: 4500,
                multiPrice: 6750,
                corporatePrice: 9000,
                featured: true,
                priority: 100,
                status: 'PUBLISHED'
            }
        });
        await prisma.report.create({
            data: {
                categoryId: healthCategory.id,
                sku: 'TELE-2025-001',
                slug: 'global-telemedicine-market-report-2025',
                title: 'Global Telemedicine Market Report 2025',
                description: 'In-depth analysis of the telemedicine market covering virtual consultations, remote monitoring, and digital health platforms.',
                summary: 'Telemedicine market accelerated by COVID-19, expected to maintain strong growth through 2030.',
                pages: 180,
                publishedDate: new Date(),
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
                metaTitle: 'Global Telemedicine Market Report 2025',
                metaDescription: 'Comprehensive telemedicine market analysis with growth projections and competitive landscape.',
                singlePrice: 3800,
                multiPrice: 5700,
                corporatePrice: 7600,
                featured: true,
                priority: 95,
                status: 'PUBLISHED'
            }
        });
        // Create admin user
        await prisma.admin.create({
            data: {
                email: 'admin@thebrainyinsights.com',
                username: 'superadmin',
                firstName: 'Super',
                lastName: 'Admin',
                password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.',
                role: 'SUPERADMIN',
                status: 'PUBLISHED'
            }
        });
        console.log('✅ Database seeded successfully');
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
    finally {
        await prisma.$disconnect();
    }
}
seed();
