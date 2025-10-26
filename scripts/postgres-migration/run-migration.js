var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PostgresMigrator } from './migrate-selective-legacy.js';
import dotenv from 'dotenv';
dotenv.config();
const config = {
    legacyMysql: {
        host: process.env.LEGACY_DB_HOST || 'localhost',
        user: process.env.LEGACY_DB_USER || 'root',
        password: process.env.LEGACY_DB_PASSWORD || '',
        database: process.env.LEGACY_DB_NAME || 'alttbidb'
    },
    postgres: {
        connectionString: process.env.DATABASE_URL || 'postgresql://tbi_user:password@localhost:5432/alttbidb'
    },
    limits: {
        categories: 20, // Only top categories
        reports: 100, // Recent, featured reports
        users: 50, // Recent active users
        orders: 50 // Recent orders
    },
    verbose: true
};
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const migrator = new PostgresMigrator(config);
        try {
            yield migrator.runFullMigration();
            console.log('✅ Migration completed successfully!');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Migration failed:', error);
            process.exit(1);
        }
    });
}
main();
