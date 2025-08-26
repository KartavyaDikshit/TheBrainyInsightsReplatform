// import { PostgresMigrator } from './migrate-selective-legacy.js' // Commented out
// import dotenv from 'dotenv' // Commented out

// dotenv.config() // Commented out

// const config = { // Commented out
//   legacyMysql: { // Commented out
//     host: process.env.LEGACY_DB_HOST || 'localhost', // Commented out
//     user: process.env.LEGACY_DB_USER || 'root', // Commented out
//     password: process.env.LEGACY_DB_PASSWORD || '', // Commented out
//     database: process.env.LEGACY_DB_NAME || 'tbi_db' // Commented out
//   }, // Commented out
//   postgres: { // Commented out
//     connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:password@localhost:5432/tbi_db' // Commented out
//   }, // Commented out
//   limits: { // Commented out
//     categories: 20,  // Only top categories // Commented out
//     reports: 100,    // Recent, featured reports // Commented out
//     users: 50,      // Recent active users // Commented out
//     orders: 50      // Recent orders // Commented out
//   }, // Commented out
//   verbose: true // Commented out
// } // Commented out

// async function main() { // Commented out
//   const migrator = new PostgresMigrator(config) // Commented out

//   try { // Commented out
//     await migrator.runFullMigration() // Commented out
//     console.log('✅ Migration completed successfully!') // Commented out
//     process.exit(0) // Commented out
//   } catch (error) { // Commented out
//     console.error('❌ Migration failed:', error) // Commented out
//     process.exit(1) // Commented out
//   } // Commented out
// } // Commented out

// main() // Commented out