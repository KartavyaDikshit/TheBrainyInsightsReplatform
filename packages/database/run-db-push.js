require('dotenv').config({ path: '../../.env.local' });
const { exec } = require('child_process');

exec('pnpm db:push', { stdio: 'inherit' }, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
