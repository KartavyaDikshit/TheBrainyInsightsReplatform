# TheBrainyInsightsReplatform

> Modern AI-powered market research platform with advanced multilingual SEO capabilities

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

## 🚀 Project Overview

TheBrainyInsightsReplatform is a comprehensive modernization of The Brainy Insights website - a leading market research and consulting platform. This project replaces the legacy PHP-based system with a modern, scalable, AI-powered Next.js application.

### Key Features

- **🤖 AI-Powered Content Generation**: 4-phase sequential content generation with OpenAI integration
- **🌍 Advanced Multilingual Support**: 7 languages (EN, DE, ES, FR, IT, JA, KO) with AI-powered translations
- **🔍 SEO-First Architecture**: Advanced structured data, regional keyword optimization, and schema markup
- **⚡ High Performance**: Redis caching, optimized database queries, and CDN integration
- **📊 Comprehensive Analytics**: Real-time performance tracking and business intelligence
- **🛡️ Enterprise Security**: Role-based access control, audit trails, and data encryption

## 📋 Table of Contents

- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚦 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔧 Development](#-development)
- [🌐 API Documentation](#-api-documentation)
- [🤖 AI Integration](#-ai-integration)
- [🌍 Internationalization](#-internationalization)
- [🚀 Deployment](#-deployment)
- [📊 Database Schema](#-database-schema)
- [🧪 Testing](#-testing)
- [📈 Performance](#-performance)
- [🤝 Contributing](#-contributing)

## 🏗️ Architecture

### Monorepo Structure
```
TheBrainyInsightsReplatform/
├── apps/
│   └── admin/                    # Admin dashboard application
├── packages/
│   ├── database/                 # Prisma schema and database utilities
│   │   ├── prisma/schema.prisma  # Database schema definition
│   │   └── src/                  # Database client and utilities
│   ├── lib/                      # Shared utilities and services
│   │   ├── cache.ts             # Redis caching utilities
│   │   ├── redis-client.ts      # Redis connection management
│   │   └── seo/                 # SEO utilities
│   └── ui/                       # Reusable UI component library
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/            # Internationalized routes
│   │   └── api/                 # API endpoints
│   ├── components/              # Application-specific components
│   ├── lib/                     # Application utilities
│   └── types/                   # TypeScript definitions
├── messages/                    # i18n message files
└── scripts/                     # Utility scripts
```

### System Architecture Diagram
```mermaid
graph TB
    A[Next.js Frontend] --> B[API Routes]
    B --> C[Prisma ORM]
    C --> D[PostgreSQL Database]
    B --> E[Redis Cache]
    B --> F[OpenAI API]
    A --> G[i18n System]
    G --> H[Message Files]
    B --> I[Search Engine]
    J[Admin Dashboard] --> B
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.0.3 with App Router
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.0
- **UI Components**: Custom component library
- **State Management**: React Server Components + Client Components
- **Internationalization**: next-intl

### Backend
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.x
- **Caching**: Redis 7
- **API**: Next.js API Routes (REST)
- **Authentication**: NextAuth.js v4
- **AI Integration**: OpenAI API 4.20.0

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier (implicit)
- **Type Checking**: TypeScript strict mode
- **Database Migrations**: Prisma Migrate

## 🚦 Getting Started

### Prerequisites
- Node.js 18.x or higher
- pnpm 8.x or higher
- PostgreSQL 14+
- Redis 6+ (optional for development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform.git
cd TheBrainyInsightsReplatform
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://tbi_user:password@localhost:5432/tbi_db"

# Redis (optional)
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=""

# OpenAI (required for AI features)
OPENAI_API_KEY="your-openai-api-key"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Setup PostgreSQL database**
```sql
-- Connect to PostgreSQL and create database
CREATE DATABASE tbi_db;
CREATE USER tbi_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE tbi_db TO tbi_user;
```

5. **Run database migrations**
```bash
cd packages/database
pnpm db:push
```

6. **Seed the database (optional)**
```bash
# Load sample data from database-schema2.sql
psql -U tbi_user -d tbi_db -f database-schema2.sql
```

7. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Quick Setup with Docker (Alternative)

```bash
# Start PostgreSQL and Redis
docker-compose up postgres redis -d

# Run migrations and start app
pnpm db:push
pnpm dev
```

## 📁 Project Structure

### Core Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/[locale]/` | Internationalized pages and layouts |
| `src/app/api/` | API route handlers |
| `packages/database/` | Database schema and utilities |
| `packages/lib/` | Shared business logic and utilities |
| `packages/ui/` | Reusable UI components |
| `messages/` | Translation files for i18n |
| `scripts/` | Build and utility scripts |

### Key Files

| File | Purpose |
|------|---------|
| `packages/database/prisma/schema.prisma` | Database schema definition |
| `src/i18n.ts` | Internationalization configuration |
| `src/middleware.ts` | Next.js middleware for routing |
| `next.config.js` | Next.js configuration |
| `tailwind.config.js` | Tailwind CSS configuration |

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server
pnpm typecheck          # Run TypeScript checks
pnpm lint               # Run ESLint

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:push           # Push schema changes to database
pnpm db:migrate        # Run database migrations

# Utilities
pnpm clean:all         # Clean all node_modules and build artifacts
pnpm fresh-install     # Clean installation from scratch
```

### Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature-name
   
   # Make changes and test
   pnpm dev
   pnpm typecheck
   pnpm lint
   
   # Build to ensure no errors
   pnpm build
   ```

2. **Database Changes**
   ```bash
   # Edit packages/database/prisma/schema.prisma
   # Push changes to development database
   pnpm db:push
   
   # Generate new Prisma client
   pnpm db:generate
   ```

3. **Adding UI Components**
   ```bash
   # Add to packages/ui/src/
   # Export from packages/ui/src/index.ts
   # Use in app with import from '@tbi/ui'
   ```

## 🌐 API Documentation

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/categories` | GET | List all categories with i18n |
| `/api/categories/[slug]` | GET | Get category by slug |
| `/api/reports/[slug]` | GET | Get report by slug |
| `/api/contact` | POST | Submit contact inquiry |
| `/api/health` | GET | System health check |
| `/api/search` | GET | Search reports and categories |

### API Response Format

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

### Example API Usage

```typescript
// Get categories
const response = await fetch('/api/categories?locale=en&featured=true');
const { data: categories } = await response.json();

// Get single report
const report = await fetch('/api/reports/ai-market-2025?lang=en');
const reportData = await report.json();
```

## 🤖 AI Integration

### OpenAI Configuration

The platform integrates OpenAI for two primary functions:

1. **Content Generation**: 4-phase sequential AI content creation
2. **Translation Services**: Automated multilingual content translation

### AI Content Generation Workflow

```typescript
// Phase 1: Market Analysis
// Phase 2: Competitive Analysis  
// Phase 3: Trends Analysis
// Phase 4: Final Synthesis

// Each phase uses context from previous phases
// Human review and approval required before publishing
```

### Translation Pipeline

```typescript
// Automatic translation job creation
// Quality scoring and human review
// Cultural adaptation and localization
// SEO optimization for target markets
```

### AI Database Schema

Key tables for AI functionality:
- `translation_jobs` - AI translation tracking
- `content_generation_workflows` - 4-phase content pipeline
- `ai_prompt_templates` - Reusable prompts
- `api_usage_logs` - Cost tracking and monitoring

## 🌍 Internationalization

### Supported Languages

- 🇺🇸 English (en) - Default
- 🇩🇪 German (de)
- 🇪🇸 Spanish (es)  
- 🇫🇷 French (fr)
- 🇮🇹 Italian (it)
- 🇯🇵 Japanese (ja)
- 🇰🇷 Korean (ko)

### Adding New Language

1. **Add locale to configuration**
```typescript
// src/config/i18n.ts
export const locales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt'];
```

2. **Create message file**
```bash
# Create messages/pt.json
cp messages/en.json messages/pt.json
# Translate content
```

3. **Update database translations**
```sql
-- Add translations for categories and reports
INSERT INTO category_translations (category_id, locale, title, description, ...)
VALUES (...);
```

### Regional SEO

Each locale supports:
- Regional keywords mapping
- Cultural keyword adaptation  
- Local search optimization
- Geographic targeting
- Currency and pricing localization

## 🚀 Deployment

### Production Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/tbi_db"

# Redis
REDIS_URL="redis://redis-host:6379"

# OpenAI
OPENAI_API_KEY="your-production-api-key"

# Security
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"

# Performance
NODE_ENV="production"
```

### Build and Deploy

```bash
# Build the application
pnpm build

# Start production server
pnpm start

# Or deploy to cloud platform
# (Vercel, AWS, Google Cloud, etc.)
```

### Performance Optimization

- **Redis Caching**: API responses cached for 5 minutes
- **Static Generation**: Categories and popular reports pre-generated
- **Image Optimization**: Next.js Image component with CDN
- **Database Optimization**: Indexed queries and connection pooling

## 📊 Database Schema

### Core Content Models

```sql
-- Categories with multilingual support
categories (id, shortcode, slug, title, description, ...)
category_translations (id, category_id, locale, title, ...)

-- Reports with comprehensive metadata
reports (id, sku, slug, title, description, pricing, seo_data, ...)
report_translations (id, report_id, locale, title, ...)

-- AI Translation System
translation_jobs (id, content_type, original_text, translated_text, ...)

-- User Management
users (id, email, preferred_language, ...)
admins (id, email, role, permissions, ...)

-- E-commerce
orders (id, user_id, total, status, ...)
order_items (id, order_id, report_id, license_type, ...)
```

### Database Indexes

Critical indexes for performance:
```sql
-- SEO and content queries
CREATE INDEX idx_reports_category_status_featured ON reports(category_id, status, featured);
CREATE INDEX idx_reports_keywords ON reports USING GIN(keywords);

-- Multilingual content
CREATE INDEX idx_report_translations_locale_status ON report_translations(locale, status);

-- Analytics
CREATE INDEX idx_reports_published_status ON reports(published_date, status);
```

## 🧪 Testing

### Test Structure
```bash
# Unit tests
pnpm test

# Integration tests  
pnpm test:integration

# E2E tests
pnpm test:e2e

# Type checking
pnpm typecheck
```

### Testing Strategy
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load testing and optimization

## 📈 Performance

### Key Metrics
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Database Query Time**: < 100ms
- **Cache Hit Ratio**: > 80%

### Optimization Features
- Redis caching with TTL management
- Database connection pooling
- Image optimization and lazy loading
- Static generation for public pages
- CDN integration for assets

### Monitoring
- Real-time performance dashboards
- Error tracking and alerting
- Database performance monitoring  
- API usage analytics

## 🚨 Known Issues

### Development Environment
- ❌ `pnpm dev` throws errors (under investigation)
- ⚠️ Redis connection intermittent in development
- ⚠️ Some environment variables not properly resolved

### Missing Features
- ❌ OpenAI API integration not implemented
- ❌ 4-phase AI content generation pipeline missing
- ❌ Advanced SEO automation incomplete
- ❌ Production deployment configuration needed

## 🗺️ Roadmap

### Phase 1: Core AI Integration (4-6 weeks)
- [ ] Implement OpenAI API client
- [ ] Build translation pipeline  
- [ ] Create content generation workflow
- [ ] Add human review system

### Phase 2: Advanced Features (4-6 weeks)
- [ ] Complete SEO automation
- [ ] Implement advanced caching
- [ ] Add monitoring and observability
- [ ] Build admin dashboard

### Phase 3: Production Launch (2-3 weeks)
- [ ] Production deployment setup
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Load testing and scaling

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and test thoroughly
4. Ensure all checks pass (`pnpm build`, `pnpm typecheck`, `pnpm lint`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled, no `any` types
- **Components**: Functional components with proper props typing
- **API**: RESTful design with consistent error handling
- **Database**: Proper indexing and query optimization
- **Internationalization**: All user-facing text must be translatable

### Pull Request Guidelines
- Include comprehensive description
- Add tests for new functionality
- Update documentation as needed
- Ensure no breaking changes
- Follow semantic versioning

## 📄 License

This project is proprietary to The Brainy Insights. All rights reserved.

---

## 🔗 Links

- [Legacy Website](https://thebrainyinsights.com/)
- [Legacy Admin](https://thebrainyinsights.com/officearea-user/)
- [Project Documentation](./TBI-Complete-Analysis.md)

---

**Built with ❤️ by The Brainy Insights Development Team**

*For technical support or questions, please contact the development team or create an issue in this repository.*
