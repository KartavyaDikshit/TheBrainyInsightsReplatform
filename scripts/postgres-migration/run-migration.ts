import { PostgresMigrator } from './migrate-selective-legacy.js'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  legacyMysql: {
    host: process.env.LEGACY_DB_HOST || 'localhost',
    user: process.env.LEGACY_DB_USER || 'root',
    password: process.env.LEGACY_DB_PASSWORD || '',
    database: process.env.LEGACY_DB_NAME || 'tbi_db'
  },
  postgres: {
    connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:password@localhost:5432/tbi_db'
  },
  limits: {
    categories: 20,  // Only top categories
    reports: 100,    // Recent, featured reports
    users: 50,      // Recent active users
    orders: 50      // Recent orders
  },
  verbose: true
}

async function main() {
  const migrator = new PostgresMigrator(config)
  
  try {
    await migrator.runFullMigration()
    console.log('✅ Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()