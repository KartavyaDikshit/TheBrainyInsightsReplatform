"use strict";
// import { Client } from 'pg' // Commented out
// import mysql from 'mysql2/promise' // Commented out
// import { v4 as uuidv4 } from 'uuid' // Commented out
/* Commented out the entire class
interface MigrationConfig {
  legacyMysql: {
    host: string
    user: string
    password: string
    database: string
  }
  postgres: {
    connectionString: string
  }
  limits: {
    categories: number
    reports: number
    users: number
    orders: number
  }
  verbose: boolean
}

interface MigrationStats {
  processed: number
  successful: number
  failed: number
  skipped: number
  errors: string[]
}

export class PostgresMigrator {
  private mysqlConn: mysql.Connection | undefined
  private pgClient: Client
  private config: MigrationConfig
  private stats: Record<string, MigrationStats> = {}

  constructor(config: MigrationConfig) {
    this.config = config
    this.pgClient = new Client({
      connectionString: config.postgres.connectionString
    })
  }

  async connect(): Promise<void> {
    try {
      // Connect to legacy MySQL
      this.mysqlConn = await mysql.createConnection({
        host: this.config.legacyMysql.host,
        user: this.config.legacyMysql.user,
        password: this.config.legacyMysql.password,
        database: this.config.legacyMysql.database,
        charset: 'utf8mb4'
      })

      // Connect to PostgreSQL
      await this.pgClient.connect()

      console.log('✅ Connected to both databases')
    } catch (error) {
      console.error('❌ Connection failed:', error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    await this.mysqlConn?.end()
    await this.pgClient?.end()
  }

  private initStats(tableName: string): void {
    this.stats[tableName] = {
      processed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: []
    }
  }

  private logProgress(tableName: string, message: string): void {
    if (this.config.verbose) {
      console.log(`[${tableName}] ${message}`)
    }
  }

  // PHASE 1: Migrate Categories (with translations)
  async migrateCategories(): Promise<void> {
    console.log('📂 Starting category migration...')
    this.initStats('categories')

    try {
      // Get top featured categories only
      const [englishCategories] = await this.mysqlConn!.execute(`
        SELECT * FROM tbl_category
        WHERE status = 'Active' AND featured = 'Yes'
        ORDER BY category_id ASC
        LIMIT ?
      `, [this.config.limits.categories]) as [any[], any]

      const [japaneseCategories] = await this.mysqlConn!.execute(`
        SELECT * FROM tbl_category_jp
        WHERE status = 'Active'
      `) as [any[], any]

      // Create mapping
      const japaneseMap = new Map()
      japaneseCategories.forEach((cat: any) => {
        japaneseMap.set(cat.shortcode, cat)
      })

      for (const engCat of englishCategories) {
        try {
          this.stats.categories.processed++

          const categoryId = uuidv4()
          const slug = this.generateSlug(engCat.title)

          // Insert main category
          await this.pgClient.query(`
            INSERT INTO categories (
              id, shortcode, slug, title, description, icon, featured,
              status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (shortcode) DO NOTHING
          `,
          [
            categoryId,
            engCat.shortcode,
            slug,
            engCat.title,
            engCat.description,
            engCat.icon,
            true, // Only migrating featured
            'PUBLISHED',
            new Date(engCat.created_at),
            new Date(engCat.updated_at)
          ])

          // Add Japanese translation if available
          const jpCat = japaneseMap.get(engCat.shortcode)
          if (jpCat) {
            await this.pgClient.query(`
              INSERT INTO category_translations (
                id, category_id, locale, title, description, slug,
                status, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              ON CONFLICT (category_id, locale) DO NOTHING
            `,
            [
              uuidv4(),
              categoryId,
              'ja',
              jpCat.title,
              jpCat.description,
              this.generateSlug(jpCat.title),
              'PUBLISHED',
              new Date(jpCat.created_at),
              new Date(jpCat.updated_at)
            ])
          }

          this.stats.categories.successful++
          this.logProgress('categories', `✅ Migrated: ${engCat.title}`)

        } catch (error) {
          this.stats.categories.failed++
          this.stats.categories.errors.push(`${engCat.shortcode}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ Category migration failed:', error)
      throw error
    }
  }

  // PHASE 2: Migrate Featured Reports (selective)
  async migrateReports(): Promise<void> {
    console.log('📊 Starting report migration...')
    this.initStats('reports')

    try {
      // Get category mapping first
      const categoryMap = new Map()
      const { rows: categories } = await this.pgClient.query(
        'SELECT id, shortcode FROM categories'
      )
      categories.forEach((cat: any) => {
        categoryMap.set(cat.shortcode, cat.id)
      })

      // Get top reports (featured, recent, high-value)
      const [englishReports] = await this.mysqlConn!.execute(`
        SELECT r.*, c.shortcode as category_shortcode
        FROM tbl_report r
        LEFT JOIN tbl_category c ON r.category_id = c.category_id
        WHERE r.status = 'Active'
        AND (r.featured = 'Yes' OR r.price >= 3000)
        AND r.published_date >= '2023-01-01'
        ORDER BY r.featured DESC, r.published_date DESC
        LIMIT ?
      `, [this.config.limits.reports]) as [any[], any]

      const [japaneseReports] = await this.mysqlConn!.execute(`
        SELECT * FROM tbl_report_jp WHERE status = 'Active'
      `) as [any[], any]

      // Create Japanese mapping by SKU
      const japaneseMap = new Map()
      japaneseReports.forEach((report: any) => {
        if (report.sku) {
          japaneseMap.set(report.sku, report)
        }
      })

      for (const engReport of englishReports) {
        try {
          this.stats.reports.processed++

          const reportId = uuidv4()
          const categoryId = categoryMap.get(engReport.category_shortcode)
          const slug = this.generateSlug(engReport.title)

          // Prepare market data
          const marketSize = engReport.segmentation ? {
            overview: engReport.segmentation.substring(0, 500)
          } : null

          const keyPlayers = engReport.companies ? {
            companies: engReport.companies.split(',').slice(0, 10)
          } : null

          // Insert main report
          await this.pgClient.query(`
            INSERT INTO reports (
              id, category_id, sku, slug, title, description,
              summary, industry_tags, regions, published_date, pages,
              base_year, single_user_price, multi_user_price, corporate_price,
              market_size, key_players, keywords, featured, status,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
            ON CONFLICT (sku) DO NOTHING
          `,
          [
            reportId,
            categoryId,
            engReport.sku || `legacy-${engReport.report_id}`,
            slug,
            engReport.title,
            engReport.description,
            engReport.description.substring(0, 500), // summary
            [engReport.types || 'Market Analysis'], // industry_tags
            ['Global'], // regions
            new Date(engReport.published_date),
            parseInt(engReport.pages) || 0,
            engReport.base_year,
            engReport.price,
            engReport.mprice,
            engReport.cprice,
            JSON.stringify(marketSize),
            JSON.stringify(keyPlayers),
            engReport.keywords ? engReport.keywords.split(',').slice(0, 10) : [],
            engReport.featured === 'Yes',
            'PUBLISHED',
            new Date(engReport.created_at),
            new Date(engReport.updated_at)
          ])

          // Add Japanese translation if available
          const jpReport = japaneseMap.get(engReport.sku)
          if (jpReport) {
            await this.pgClient.query(`
              INSERT INTO report_translations (
                id, report_id, locale, title, description, summary,
                slug, keywords, status, created_at, updated_at
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
              ON CONFLICT (report_id, locale) DO NOTHING
            `,
            [
              uuidv4(),
              reportId,
              'ja',
              jpReport.title,
              jpReport.description,
              jpReport.description.substring(0, 500),
              this.generateSlug(jpReport.title),
              jpReport.keywords ? jpReport.keywords.split(',').slice(0, 10) : [],
              'PUBLISHED',
              new Date(jpReport.created_at),
              new Date(jpReport.updated_at)
            ])
          }

          this.stats.reports.successful++
          this.logProgress('reports', `✅ Migrated: ${engReport.title.substring(0, 50)}...`)

        } catch (error) {
          this.stats.reports.failed++
          this.stats.reports.errors.push(`${engReport.sku}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ Report migration failed:', error)
      throw error
    }
  }

  // PHASE 3: Migrate Recent Users & Orders
  async migrateUsersAndOrders(): Promise<void> {
    console.log('👥 Starting user and order migration...')
    
    // Users
    this.initStats('users')
    try {
      const [legacyUsers] = await this.mysqlConn!.execute(`
        SELECT * FROM tbl_user
        WHERE status = 'Active'
        AND created_at >= '2024-01-01'
        ORDER BY created_at DESC
        LIMIT ?
      `, [this.config.limits.users]) as [any[], any]

      for (const user of legacyUsers) {
        try {
          this.stats.users.processed++

          await this.pgClient.query(`
            INSERT INTO users (
              id, email, first_name, last_name, phone, password,
              status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (email) DO NOTHING
          `,
          [
            uuidv4(),
            user.email,
            user.first_name,
            user.last_name,
            user.phone,
            user.password, // Already hashed
            user.status.toUpperCase(),
            new Date(user.created_at),
            new Date(user.updated_at)
          ])

          this.stats.users.successful++

        } catch (error) {
          this.stats.users.failed++
          this.stats.users.errors.push(`${user.email}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ User migration failed:', error)
    }

    // Recent Orders
    this.initStats('orders')
    try {
      const [legacyOrders] = await this.mysqlConn!.execute(`
        SELECT * FROM tbl_order
        WHERE status IN ('Completed', 'Processing')
        AND created_at >= '2024-01-01'
        ORDER BY created_at DESC
        LIMIT ?
      `, [this.config.limits.orders]) as [any[], any]

      for (const order of legacyOrders) {
        try {
          this.stats.orders.processed++

          const orderId = uuidv4()
          
          await this.pgClient.query(`
            INSERT INTO orders (
              id, order_number, subtotal, tax_amount, discount, total,
              customer_email, customer_name, customer_phone,
              status, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `,
          [
            orderId,
            `LEGACY-${order.order_id}`,
            order.subtotal,
            0, // tax_amount
            order.discount,
            order.total,
            order.email,
            `${order.fname} ${order.lname}`.trim(),
            order.phone,
            order.status.toUpperCase(),
            new Date(order.created_at),
            new Date(order.updated_at)
          ])

          this.stats.orders.successful++

        } catch (error) {
          this.stats.orders.failed++
          this.stats.orders.errors.push(`${order.order_id}: ${error}`)
        }
      }

    } catch (error) {
      console.error('❌ Order migration failed:', error)
    }
  }

  // PHASE 4: Create Sample Admin Users
  async createAdminUsers(): Promise<void> {
    console.log('👨‍💼 Creating admin users...')
    
    const adminUsers = [
      {
        email: 'admin@thebrainyinsights.com',
        username: 'superadmin',
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPERADMIN',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.' // password123
      },
      {
        email: 'manager@thebrainyinsights.com',
        username: 'manager',
        firstName: 'Content',
        lastName: 'Manager',
        role: 'MANAGER',
        password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj0v7S.I2D5.'
      }
    ]

    for (const admin of adminUsers) {
      try {
        await this.pgClient.query(`
          INSERT INTO admins (
            id, email, username, first_name, last_name, password, role, status, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (email) DO NOTHING
        `,
        [
          uuidv4(),
          admin.email,
          admin.username,
          admin.firstName,
          admin.lastName,
          admin.password,
          admin.role,
          'PUBLISHED',
          new Date(),
          new Date()
        ])

        console.log(`✅ Created admin user: ${admin.email}`)
      } catch (error) {
        console.error(`❌ Failed to create admin ${admin.email}:`, error)
      }
    }
  }

  // Full migration process
  async runFullMigration(): Promise<void> {
    console.log('🚀 Starting PostgreSQL migration...')
    
    try {
      await this.connect()
      
      // Run migrations in order
      await this.migrateCategories()
      await this.migrateReports()
      await this.migrateUsersAndOrders()
      await this.createAdminUsers()
      
      // Print summary
      this.printSummary()
      
    } catch (error) {
      console.error('❌ Migration failed:', error)
      throw error
    } finally {
      await this.disconnect()
    }
  }

  // Utility functions
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s\-_]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 100)
  }

  private printSummary(): void {
    console.log('\n📊 MIGRATION SUMMARY')
    console.log('='.repeat(50))
    
    Object.entries(this.stats).forEach(([table, stats]) => {
      console.log(`\n${table}:`)
      console.log(`  Processed: ${stats.processed}`)
      console.log(`  Successful: ${stats.successful}`)
      console.log(`  Failed: ${stats.failed}`)
      if (stats.errors.length > 0) {
        console.log(`  First 3 errors:`)
        stats.errors.slice(0, 3).forEach(error => {
          console.log(`    - ${error}`)
        })
      }
    })
    
    console.log('\n' + '='.repeat(50))
  }
}
*/ 
