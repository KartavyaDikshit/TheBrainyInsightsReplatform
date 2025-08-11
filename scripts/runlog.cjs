
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '..', 'LOGS', 'KARTALOG_RUN.md');

function log(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`);
}

function logStep(title, details = '') {
  log(`STEP: ${title} - ${details}`);
}

function logError(title, err, context = '') {
  log(`ERROR: ${title} - ${err.message}\n${err.stack}\nContext: ${context}`);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    logStep(args[0], args.slice(1).join(' '));
  }
}

module.exports = { logStep, logError };
