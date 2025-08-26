import { prisma } from '@tbi/database';
async function main() {
    console.log('Prisma client imported successfully');
    await prisma.$connect();
    console.log('Prisma client connected successfully');
    await prisma.$disconnect();
    console.log('Prisma client disconnected successfully');
}
main();
