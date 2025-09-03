# KARTAWORK: TheBrainyInsights Replatform — Codebase & Operations Documentation

## 1. Executive Summary

This document provides a comprehensive overview of the TheBrainyInsights Replatform project.

*   **Project Purpose:** To build a modern, scalable, and SEO-optimized web application for TheBrainyInsights, a market research and consulting company.
*   **Client Goals:**
    *   **Multilingual:** Support for multiple languages (`en`, `de`, `fr`, `es`, `it`, `ja`, `ko`).
    *   **SEO Excellence:** Best-in-class SEO features including clean URLs, metadata, structured data, and sitemaps.
    *   **AI-Powered Content:** An internal staging area for AI-generated content that requires manual approval before publishing.
    *   **Database Agnostic:** The architecture is designed to be pluggable, supporting a DB-less demo mode and a production mode with a relational database (MariaDB via Prisma).
*   **Current Status:** The application is in a feature-complete state for a DB-less demonstration. It runs entirely on stubbed JSON data, bypassing the need for a database connection. A persistent environmental issue on the development machine is currently blocking the switch to the Prisma/MariaDB setup.

## 2. Tech Stack

| Category      | Technology                                       | Version/Target | Notes                                                                |
|---------------|--------------------------------------------------|----------------|----------------------------------------------------------------------|
| **Framework** | Next.js (React)                                  | 14.x           | App Router, SSR/ISR                                                  |
| **Language**  | TypeScript                                       | 5.x            | Full-stack type safety                                               |
| **Styling**   | Tailwind CSS                                     | 3.x            | Utility-first CSS framework (Assumed from common Next.js setups)     |
| **i18n**      | `next-intl`                                      | 3.x            | Internationalization library for Next.js                             |
| **Database**  | **MariaDB (Production)** / **SQLite (Dev/Demo)** | -              | Managed via Prisma ORM                                               |
| **ORM**       | Prisma                                           | 5.x            | Next-generation ORM for Node.js and TypeScript                       |
| **Build**     | `pnpm`                                           | 8.x            | Fast, disk space-efficient package manager                           |
| **Runtime**   | Node.js                                          | 20.x LTS       | JavaScript runtime environment                                       |
| **Deployment**| PM2, Nginx                                       | -              | Process manager and reverse proxy for VPS deployment                 |
| **Linting**   | ESLint, Prettier                                 | -              | Code quality and formatting                                          |

### DEMO_NO_DB vs. Prisma/MariaDB

The application can run in two modes, controlled by the `DEMO_NO_DB` environment variable:
*   `DEMO_NO_DB=true`: ( **Current Default** ) The application uses a data adapter that fetches data from API routes, which in turn read from JSON files in the `seed/demo` directory. This mode is for demonstration purposes and avoids any database dependency.
*   `DEMO_NO_DB=false`: The data adapter is intended to switch to using the Prisma client to interact directly with a MariaDB database. This is the intended production path, currently blocked by a schema validation issue.

## 3. Monorepo Structure

The project uses a pnpm workspace to manage a monorepo structure.

```
C:\Users\User\TheBrainyInsightsReplatform\
├───.env.local.example      # Example environment variables
├───auth.ts                 # (Placeholder) Authentication logic
├───i18n.ts                 # `next-intl` configuration
├───KARTALOG.md             # Manual log of key decisions and blockers
├───middleware.ts           # Next.js middleware for routing/auth
├───next.config.mjs         # Next.js configuration
├───nginx.conf              # Nginx configuration template for deployment
├───package.json            # Root project dependencies and scripts
├───pm2.config.js           # PM2 configuration for deployment
├───tsconfig.json           # Root TypeScript configuration
├───apps/                   # Contains the individual applications
│   ├───admin/              # (Future) Admin dashboard application
│   └───web/                # The main public-facing Next.js website
├───docs/                   # Project documentation
├───infra/                  # (Future) Infrastructure-as-Code (e.g., Terraform)
├───messages/               # i18n translation files (JSON)
├───packages/               # Shared code, components, and configurations
│   ├───database/           # Prisma schema and database-related code
│   ├───lib/                # Shared library code (DTOs, helpers)
│   └───ui/                 # Shared React component library
├───scripts/                # Standalone scripts for various tasks (ETL, DB ops)
└───seed/                   # Data for seeding the database or for demo mode
    └───demo/               # JSON files for `DEMO_NO_DB` mode
```

## 4. Application Architecture

### Frontend
The frontend is a Next.js 14 application using the **App Router**.

*   **Rendering Strategy:** The application primarily uses Server-Side Rendering (SSR) with plans for Incremental Static Regeneration (ISR) for heavily-trafficked, semi-static pages like report details.
*   **i18n Routing:** Internationalization is handled by `next-intl`. The URL structure includes a locale prefix (e.g., `/en/reports`, `/de/reports`). The `i18n.ts` file configures the message loading, and `middleware.ts` is intended to handle locale detection and redirection.
    *   **File:** `i18n.ts`
    *   **File:** `middleware.ts`
    *   **Layout:** `apps/web/src/app/[locale]/layout.tsx`

### Data Layer Abstraction
A data adapter pattern is used to decouple the application logic from the data source. This allows the application to seamlessly switch between the JSON stub API (demo mode) and a direct Prisma database connection (production mode).

*   **File:** `apps/web/src/lib/data/adapter.ts`
*   **Logic:** The `DEMO_NO_DB` environment variable controls which data fetching strategy is used.
    *   If `true`, the adapter functions make `fetch` calls to internal API routes that serve static JSON.
    *   If `false`, the functions are intended to use the Prisma client to query the database directly.

### Caching
An in-memory LRU (Least Recently Used) cache is implemented to reduce redundant data fetching for common API requests.

*   **File:** `packages/lib/src/cache.ts` (Assumed location, based on `KARTALOG.md`)

### Logging and Error Handling
*   **Logging:** A simple logging script exists for development purposes.
    *   **File:** `scripts/log.js`
*   **Error Handling:** Standard Next.js error handling is used (`not-found.tsx`, `error.tsx`). The data adapter and API routes include basic error handling.
    *   **File:** `apps/web/src/app/[locale]/not-found.tsx`

## 5. SEO System

The application has a comprehensive SEO implementation.

*   **Canonical & Hreflang:** The main layout (`[locale]/layout.tsx`) is responsible for generating `canonical` and `hreflang` tags for multilingual content discovery. The `SeoHelmet` component likely encapsulates this logic.
    *   **File:** `apps/web/src/app/[locale]/layout.tsx`
    *   **Component:** `packages/ui/src/SeoHelmet.tsx`
*   **Structured Data (JSON-LD):** A dedicated component generates JSON-LD structured data for various page types (reports, categories) to enhance search engine understanding.
    *   **Component:** `packages/ui/src/JsonLd.tsx`
*   **Sitemaps:** A dynamic sitemap is generated by `sitemap.ts`, which fetches all public URLs from an internal API endpoint.
    *   **File:** `apps/web/src/app/sitemap.ts`
    *   **API Route:** `pages/api/sitemap-data.ts`
*   **robots.txt:** A `robots.ts` file generates the `robots.txt` to control web crawler access.
    *   **File:** `apps/web/src/app/robots.ts`
*   **Breadcrumbs:** A `Breadcrumbs` component provides navigational context for users and search engines.
    *   **Component:** `packages/ui/src/Breadcrumbs.tsx`

## 6. Routing Map

### User-Facing Routes
All user-facing routes are prefixed with a locale (e.g., `/en`).

*   `/`: Home page.
*   `/about`: Static "About Us" page.
*   `/contact`: Static "Contact Us" page with a lead capture form.
*   `/services`: Static "Services" page.
*   `/reports`: Index page listing all reports, with pagination.
*   `/reports/[slug]`: Detail page for a single report.
*   `/categories`: Index page listing all categories.
*   `/categories/[slug]`: Detail page for a single category, listing its reports.
*   `/search`: Search results page.

### API Routes

*   **Public:**
    *   `GET /api/reports`: Lists reports.
        *   **Query Params:** `lang`, `category`, `page`, `size`, `featured`
        *   **Returns:** `Report[]`
        *   **Source:** `seed/demo/reports.json`
    *   `GET /api/reports/[slug]`: Gets a single report.
        *   **Query Params:** `lang`
        *   **Returns:** `Report`
        *   **Source:** `seed/demo/reports.json`
    *   `GET /api/categories`: Lists categories.
        *   **Query Params:** `lang`
        *   **Returns:** `Category[]`
        *   **Source:** `seed/demo/categories.json`
    *   `GET /api/categories/[slug]`: Gets a single category.
        *   **Query Params:** `lang`
        *   **Returns:** `Category`
        *   **Source:** `seed/demo/categories.json`
    *   `GET /api/search`: Searches reports.
        *   **Query Params:** `q`, `lang`, `page`, `size`
        *   **Returns:** `Report[]`
        *   **Source:** `seed/demo/reports.json`
    *   `POST /api/contact`: Submits the contact form.
        *   **Body:** `CreateLeadPayload`
        *   **Returns:** `{ id: string }`
        *   **Source:** In-memory (demo), `Lead` table (DB)
    *   `GET /api/sitemap-data`: Provides data for `sitemap.xml`.
        *   **Returns:** `SitemapEntry[]`
        *   **Source:** `seed/demo/reports.json`, `seed/demo/categories.json`
*   **Admin/AI:**
    *   `GET /api/ai/staging`: Lists items in the AI content queue.
        *   **Returns:** `AIQueueItem[]`
        *   **Source:** `seed/demo/ai_queue.json`
    *   `POST /api/ai/approve`: Approves an AI-generated item.
        *   **Body:** `{ id: string }`
        *   **Returns:** `AIQueueItem`
        *   **Source:** In-memory (demo)
    *   `POST /api/ai/reject`: Rejects an AI-generated item.
        *   **Body:** `{ id: string }`
        *   **Returns:** `AIQueueItem`
        *   **Source:** In-memory (demo)

## 7. UI/UX Library

The reusable React components are located in `packages/ui/src`.

*   **File:** `packages/ui/src/index.ts` (barrel file exporting all components)

| Component             | Purpose                                                 |
|-----------------------|---------------------------------------------------------|
| `SiteHeader`          | Main site navigation header.                            |
| `SiteFooter`          | Main site footer.                                       |
| `Container`, `Section`| Layout and structural components.                       |
| `LanguageSwitcher`    | Dropdown for changing the locale.                       |
| `ReportCard`          | Displays a summary of a single report.                  |
| `CategoryCard`        | Displays a summary of a single category.                |
| `Pagination`          | Navigation for paginated lists.                         |
| `SearchBar`           | The main search input component.                        |
| `Button`, `TextInput`, etc. | Standard form elements.                          |
| `Table`               | Renders data in a tabular format for admin pages.       |
| `Modal`, `DiffViewer` | UI components for admin interactions.                   |
| `JsonLd`, `SeoHelmet` | SEO-specific components.                                |

## 8. Data Models

### Demo Mode (JSON)

*   **`seed/demo/categories.json`**
    ```json
    [
      {
        "id": "cat-1",
        "slug": "technology",
        "translations": {
          "en": { "name": "Technology" },
          "de": { "name": "Technologie" }
        }
      }
    ]
    ```
*   **`seed/demo/reports.json`**
    ```json
    [
      {
        "id": "rep-1",
        "slug": "global-ai-market",
        "categoryId": "cat-1",
        "translations": {
          "en": { "title": "Global AI Market" },
          "de": { "title": "Globaler KI-Markt" }
        }
      }
    ]
    ```
*   Other files: `translations.json`, `redirects.json`, `leads.json`, `ai_queue.json`.

### Production Mode (Prisma)

The intended database schema is defined in `packages/database/prisma/schema.prisma`.

*   **File:** `packages/database/prisma/schema.prisma`

```prisma
datasource db {
  provider = "sqlite" // Should be "mysql" for production
  url      = "file:./dev.db" // Should be env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Locale {
  EN
  DE
  FR
  ES
  IT
  JA
  KO
}

enum Status {
  DRAFT
  STAGED
  PUBLISHED
}

model Category {
  id        String   @id @default(cuid())
  slug      String   @unique
  // ... fields
}

model Report {
  id        String   @id @default(cuid())
  slug      String   @unique
  // ... fields
}

// ... other models: ReportTranslation, RedirectMap, User, Lead, etc.
```

**Note:** The `provider` is currently set to `sqlite` for the demo workaround. For production, it should be `mysql` and the `url` should be loaded from an environment variable.

## 9. Dev and Build Workflows

### Environment Variables
Configure the application by creating a `.env.local` file from the example.

*   **File:** `.env.local.example`
    *   `DEMO_NO_DB`: `true` or `false`. Controls the data source.
    *   `DEFAULT_LOCALE`: The default language (e.g., `en`).
    *   `LOCALES`: Comma-separated list of supported locales.
    *   `BASE_URL`: The public URL of the application.
    *   `DATABASE_URL`: (For DB mode) The connection string for the MariaDB database.

### PNPM Scripts
The following scripts are available in the root `package.json`:

*   `pnpm dev`: Starts the Next.js development server.
*   `pnpm build`: Builds the application for production.
*   `pnpm start`: Starts the production server.
*   `pnpm lint`: Lints the codebase.
*   `pnpm typecheck`: Runs the TypeScript compiler to check for type errors.

## 10. Deployment Notes

*   **PM2:** The `pm2.config.js` file is configured to run the Next.js application as a persistent background service.
    *   **File:** `pm2.config.js`
    *   **Commands:** `pm2 start pm2.config.js`, `pm2 stop thebrainyinsights`, `pm2 restart thebrainyinsights`
*   **Nginx:** The `nginx.conf` file provides a template for setting up Nginx as a reverse proxy. This is used for SSL termination, caching, and serving the application.
    *   **File:** `nginx.conf`
*   **Redirects:** For performance, the redirects from `seed/demo/redirects.json` should be converted into server-level rules in Nginx.

## 11. Known Issues and Blockers

*   **Prisma Schema Validation Error:** There is a persistent, critical blocker on the primary development machine. The `prisma generate` command fails with the error: `This line is not an enum value definition.`. This is likely an environmental issue with the Node.js/pnpm setup.
*   **Workaround:** The `DEMO_NO_DB=true` flag was implemented to allow development and demonstration to proceed without a database connection. The entire data layer currently runs on JSON files.

## 12. Roadmap Next Steps

1.  **Resolve Environment Blocker:** The top priority is to fix the Prisma validation issue on the development machine.
2.  **Finalize DB-less Demo:** Ensure all user and admin flows are fully functional in the `DEMO_NO_DB` mode.
3.  **Stabilize SEO:** Perform a full audit of all SEO features using third-party tools.
4.  **Implement Minimal Tests:** Add basic unit and integration tests for critical components and API routes.
5.  **Switch to MariaDB/Prisma:** Once the environment is stable, execute the plan to switch the application to use the MariaDB database.
6.  **Future Features:**
    *   Harden the AI pipeline.
    *   Implement full CRUD operations for the admin dashboard.
    *   Integrate a full-text search engine (e.g., MeiliSearch, Algolia).
    *   Add analytics and monitoring.

---

## Run This Now (DB-less Demo Mode)

These commands will run the application locally using the JSON stub data.

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```
2.  **Set Up Environment:**
    Create a file named `.env.local` at the root of the project and add the following content:
    ```
    DEMO_NO_DB=true
    DEFAULT_LOCALE=en
    LOCALES=en,de,fr,es,it,ja,ko
    BASE_URL=http://localhost:3000
    ```
3.  **Run the Development Server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:3000`.

## Switch to MariaDB Later

These are the steps to switch the application to use a MariaDB database. **Do not attempt this until the Prisma environment issue is resolved.**

1.  **Install a MariaDB Server:**
    Ensure you have a running MariaDB instance.
2.  **Update Environment Variables:**
    Modify your `.env.local` file:
    ```
    DEMO_NO_DB=false
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```
    Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your MariaDB connection details.
3.  **Update Prisma Schema:**
    In `packages/database/prisma/schema.prisma`, change the provider:
    ```prisma
datasource db {
  provider = "mysql" // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
    ```
4.  **Generate Prisma Client:**
    ```bash
    pnpm exec prisma generate
    ```
5.  **Run Database Migrations:**
    ```bash
    pnpm exec prisma migrate deploy
    ```
6.  **Seed the Database:**
    (A seed script `prisma/seed.ts` will need to be created or adapted)
    ```bash
    pnpm exec prisma db seed
    ```
7.  **Start the Application:**
    ```bash
    pnpm dev
    ```
