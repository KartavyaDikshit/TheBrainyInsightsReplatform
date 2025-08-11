const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');

if (!fs.existsSync(prismaClientPath)) {
  console.error('Error: Prisma client not generated. Run `npm run prep:db`.');
  process.exit(1);
}
