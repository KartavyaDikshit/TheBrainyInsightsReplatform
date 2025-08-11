const { logStep } = require('./runlog.cjs');

if (process.env.DEMO_NO_DB !== 'true') {
  logStep(
    'PREBUILD WARNING',
    'DEMO_NO_DB is not "true". This build might fail if Prisma dependencies are not met. Continuing anyway.'
  );
} else {
    logStep('PREBUILD CHECK', 'DEMO_NO_DB is "true". Prisma will be bypassed.');
}