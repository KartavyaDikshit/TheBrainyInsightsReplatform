import http from 'http';
import { logStep, logError } from './runlog.cjs';

const urls = [
  '/en',
  '/en/reports',
  '/en/categories/technology',
  '/en/reports/global-ai-chipset-market-2025-2030',
  '/en/search?q=ai',
  '/sitemap.xml',
  '/robots.txt',
  '/admin/staging',
  '/api/sitemap-data',
];

let passed = 0;
let failed = 0;

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${url}`, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        logStep(`SMOKE TEST PASS (${res.statusCode})`, url);
        passed++;
      } else {
        logError(`SMOKE TEST FAIL (${res.statusCode})`, new Error(`Status code was ${res.statusCode}`), url);
        failed++;
      }
      resolve();
    }).on('error', (err) => {
      logError('SMOKE TEST ERROR', err, url);
      failed++;
      resolve();
    });
  });
}

async function runSmokeTests() {
  logStep('SMOKE TEST START');
  await Promise.all(urls.map(checkUrl));
  logStep('SMOKE TEST COMPLETE', `Passed: ${passed}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
}

// Wait for the server to be ready
setTimeout(runSmokeTests, 5000);