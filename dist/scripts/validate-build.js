import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
async function validateBuild() {
    console.log('🔍 Starting build validation...\n');
    try {
        // 1. Type checking
        console.log('1️⃣ Running TypeScript type check...');
        await execAsync('pnpm typecheck');
        console.log('✅ TypeScript validation passed\n');
        // 2. Linting
        console.log('2️⃣ Running ESLint...');
        await execAsync('pnpm lint');
        console.log('✅ Linting passed\n');
        // 3. Database generation
        console.log('3️⃣ Generating Prisma client...');
        await execAsync('pnpm db:generate');
        console.log('✅ Prisma client generated\n');
        // 4. Build
        console.log('4️⃣ Building application...');
        await execAsync('pnpm build');
        console.log('✅ Build completed successfully\n');
        console.log('🎉 All validations passed! Sprint 1.4 is complete.');
    }
    catch (error) {
        console.error('❌ Validation failed:');
        console.error(error);
        process.exit(1);
    }
}
validateBuild();
