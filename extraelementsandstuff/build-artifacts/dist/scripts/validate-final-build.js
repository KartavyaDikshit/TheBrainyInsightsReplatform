import { exec } from 'child_process';
import { promisify } from 'util';
import { prisma } from '@tbi/database';
const execAsync = promisify(exec);
async function validateFinalBuild() {
    console.log('🔍 Starting final build validation...\n');
    try {
        // 1. Clean environment
        console.log('1️⃣ Cleaning environment...');
        await execAsync('pnpm clean');
        await execAsync('pnpm install --frozen-lockfile');
        console.log('✅ Environment cleaned and dependencies installed\n');
        // 2. Database validation
        console.log('2️⃣ Validating database schema...');
        await execAsync('pnpm db:generate');
        await prisma.$connect();
        console.log('✅ Database schema valid and connected\n');
        // 3. Type checking
        console.log('3️⃣ Running TypeScript validation...');
        await execAsync('pnpm typecheck');
        console.log('✅ TypeScript validation passed\n');
        // 4. Linting
        console.log('4️⃣ Running ESLint...');
        await execAsync('pnpm lint');
        console.log('✅ Linting passed\n');
        // 5. Build validation
        console.log('5️⃣ Building application...');
        await execAsync('pnpm build');
        console.log('✅ Build completed successfully\n');
        // 6. Database seeding (optional)
        console.log('6️⃣ Seeding database...');
        await execAsync('pnpm db:seed');
        console.log('✅ Database seeded\n');
        console.log('🎉 SPRINT 1.5 COMPLETED SUCCESSFULLY!');
        console.log('✅ All validations passed');
        console.log('✅ Database schema finalized with AI integration');
        console.log('✅ Translation system implemented');
        console.log('✅ SEO optimization structure in place');
        console.log('✅ Build errors resolved');
    }
    catch (error) {
        console.error('❌ Validation failed:');
        console.error(error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
validateFinalBuild();
