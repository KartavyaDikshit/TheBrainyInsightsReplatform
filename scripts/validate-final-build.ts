import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface BuildStep {
  command: string;
  description: string;
  critical: boolean;
}

async function runCommand(step: BuildStep): Promise<boolean> {
  console.log(`\n🔧 ${step.description}...`);
  try {
    const { stdout, stderr } = await execAsync(step.command, {
      cwd: process.cwd(),
      timeout: 300000, // 5 minutes
      env: { ...process.env, NODE_ENV: 'development' }
    });

    if (stderr && !stderr.includes('warning')) {
      console.log(`⚠️  ${stderr}`);
    }
    
    console.log(`✅ ${step.description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${step.description} failed:`);
    console.error(error instanceof Error ? error.message : String(error));
    return false;
  }
}

async function validateBuild(): Promise<void> {
  console.log('🚀 FINAL BUILD VALIDATION');
  console.log('=' .repeat(50));

  const buildSteps: BuildStep[] = [
    {
      command: 'pnpm typecheck',
      description: 'TypeScript Type Checking',
      critical: true
    },
    {
      command: 'pnpm lint --fix',
      description: 'ESLint Validation & Auto-fix',
      critical: true
    },
    {
      command: 'pnpm build',
      description: 'Production Build',
      critical: true
    }
  ];

  let allPassed = true;
  const results: { step: string; passed: boolean }[] = [];

  for (const step of buildSteps) {
    const success = await runCommand(step);
    results.push({ step: step.description, passed: success });

    if (!success && step.critical) {
      allPassed = false;
      console.log(`\n💥 Critical step failed: ${step.description}`);
      break;
    }
  }

  console.log('\n' + '='.repeat(50));

  if (allPassed) {
    console.log('🎉 ALL VALIDATIONS PASSED!');
    console.log('✅ Build process is stable and ready for production');
  } else {
    console.log('❌ VALIDATION FAILED');
    console.log('Please resolve the errors above before proceeding.');
    process.exit(1);
  }
}

validateBuild().catch((error) => {
  console.error('Validation script failed:', error);
  process.exit(1);
});