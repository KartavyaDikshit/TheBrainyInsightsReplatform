const fs = require('fs');
const path = require('path');

const kartalogPath = path.join(__dirname, '..', 'KARTALOG.md');

const message = process.argv[2];

if (message) {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const logEntry = `## [${timestamp}] - ${message}\n`;
  fs.appendFileSync(kartalogPath, logEntry);
  console.log(`Logged: ${message}`);
} else {
  console.error('Usage: node scripts/log.js "Your log message"');
}
