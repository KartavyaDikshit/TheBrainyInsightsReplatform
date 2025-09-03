# TheBrainyInsights - Market Research Platform

A comprehensive market research and business intelligence platform built with Next.js 15, featuring multi-language support, dynamic content management, and a modern UI.

## 🏗️ Project Structure

### Core Application Files
```
├── src/                          # Main application source code
│   ├── app/                      # Next.js 15 App Router pages
│   │   ├── [locale]/            # Internationalized routes
│   │   ├── api/                 # API endpoints
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── ui/                  # UI component library
│   │   └── *.tsx                # Feature components
│   ├── lib/                     # Utility libraries
│   │   ├── db/                  # Database services
│   │   └── auth.ts              # Authentication
│   └── types/                   # TypeScript type definitions
├── packages/                    # Monorepo packages
│   ├── database/               # Database package (Prisma)
│   ├── lib/                    # Shared utilities
│   └── ui/                     # Shared UI components
├── public/                     # Static assets
├── messages/                   # i18n message files
└── scripts/                    # Build and deployment scripts
```

### Configuration Files
```
├── package.json                # Main package configuration
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── pnpm-workspace.yaml        # PNPM workspace configuration
├── docker-compose.yml         # Docker services
└── pm2.config.js              # PM2 process manager
```

### Organization Folder
All non-essential files have been moved to `extraelementsandstuff/` for better organization:

```
extraelementsandstuff/
├── documentation/             # All .md files and database schemas
│   ├── *.md                  # Project documentation
│   └── database-schema*.sql  # Database schemas
├── logs-and-errors/          # Log files and error reports
│   ├── *.txt                 # Error logs and output files
│   └── *.log                 # Sprint logs
├── screenshots/              # Project screenshots
│   └── Screenshot*.png       # UI screenshots
├── legacy-files/             # Legacy configuration files
│   ├── *.cjs                 # Legacy scripts
│   ├── *.conf                # Configuration files
│   └── test-*.js            # Legacy test files
└── build-artifacts/          # Build outputs
    └── dist/                 # Compiled build files
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start database:**
   ```bash
   docker-compose up -d postgres
   ```

4. **Run database migrations:**
   ```bash
   cd packages/database
   pnpm prisma migrate deploy
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

## 🌐 Features

- **Multi-language Support:** 7 languages (EN, DE, FR, ES, IT, JA, KO)
- **Dynamic Content:** Database-driven categories and reports
- **Modern UI:** Beautiful, responsive design with Tailwind CSS
- **Category Detail Pages:** Comprehensive category browsing with search/filter
- **Client Testimonials:** Rotating testimonial carousel
- **Admin Dashboard:** Content management interface
- **API Endpoints:** RESTful API for data access
- **SEO Optimized:** Meta tags, sitemaps, and structured data

## 🔧 Development

- **Framework:** Next.js 15 with App Router
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS + Radix UI components  
- **Package Manager:** PNPM with workspace support
- **Deployment:** Docker + PM2 for production

## 📁 Key Directories

- `/src/app/[locale]/` - Internationalized pages
- `/src/components/` - Reusable React components
- `/packages/database/` - Database schema and migrations
- `/scripts/` - Build, migration, and utility scripts
- `/seed/` - Database seed data
- `/extraelementsandstuff/` - Non-essential files (organized)

## 🗃️ Database

The application uses PostgreSQL with Prisma ORM. Key entities:
- **Categories:** Market research categories
- **Reports:** Research reports with pricing tiers
- **Translations:** Multi-language content support
- **Users:** Authentication and user management

---

For detailed documentation, see the files in `extraelementsandstuff/documentation/`.
