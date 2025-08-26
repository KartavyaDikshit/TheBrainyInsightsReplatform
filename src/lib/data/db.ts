// import { PrismaClient } from '@tbi/database';
// import { redisManager } from '../../../packages/lib/src/redis-client';
// import crypto from 'crypto';
// import fs from 'fs';
// import path from 'path';

// interface CacheConfig {
//   defaultTTL: number;
//   keyPrefix: string;
//   enableLogging: boolean;
// }

// const defaultConfig: CacheConfig = {
//   defaultTTL: 300, // 5 minutes
//   keyPrefix: 'prisma:',
//   enableLogging: process.env.DEBUG_CACHE_HANDLER === 'true'
// };

// function generateCacheKey(model: string, operation: string, args: any): string {
//   const argsHash = crypto
//     .createHash('md5')
//     .update(JSON.stringify(args))
//     .digest('hex');
  
//   return `${defaultConfig.keyPrefix}${model}:${operation}:${argsHash}`;
// }

// function logPrismaCache(operation: string, model: string, key: string, hit: boolean) {
//   if (defaultConfig.enableLogging) {
//     const logEntry = `
// [${new Date().toISOString()}] PRISMA_CACHE_${hit ? 'HIT' : 'MISS'}: ${model}.${operation} - ${key}`;
//     fs.appendFileSync(path.join(process.cwd(), 'REDISLOG.md'), logEntry);
//   }
// }

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// let prisma: PrismaClient;

// export async function ensurePrismaWithCache(): Promise<PrismaClient> {
//   if (!global.prisma) {
//     global.prisma = new PrismaClient({
//       log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
//     });

//     if (process.env.ENABLE_PRISMA_CACHE === 'true' && process.env.NEXT_RUNTIME === 'nodejs') {
//       const redisConnected = await redisManager.connect();
//       if (redisConnected) {
//         global.prisma = global.prisma.$extends({
//           query: {
//             $allModels: {
//               async $allOperations({ model, operation, args, query }) {
//                 const cacheableOperations = ['findUnique', 'findFirst', 'findMany', 'count', 'aggregate'];

//                 if (!model || !cacheableOperations.includes(operation)) {
//                   return query(args);
//                 }

//                 const cacheKey = generateCacheKey(model, operation, args);

//                 try {
//                   const client = redisManager.getClient();
//                   if (!client) { // Added null check
//                     return query(args);
//                   }

//                   // Try to get from cache
//                   const cached = await client.get(cacheKey);
//                   if (cached) {
//                     logPrismaCache(operation, model, cacheKey, true);
//                     return JSON.parse(cached);
//                   }

//                   // Execute query
//                   const result = await query(args);

//                   // Cache the result
//                   if (result !== null && result !== undefined) {
//                     const ttl = defaultConfig.defaultTTL;
//                     await client.setEx(cacheKey, ttl, JSON.parse(result));

//                     // Tag for invalidation
//                     await client.sAdd(`tag:model:${model.toLowerCase()}`, cacheKey);

//                     logPrismaCache(operation, model, cacheKey, false);
//                   }

//                   return result;

//                 } catch (error) {
//                   console.error('[Prisma Cache Error]', error);
//                   // Fall back to direct query on error
//                   return query(args);
//                 }
//               },
//             },
//           },
//         }).$extends({
//           query: {
//             $allModels: {
//               async $allOperations({ model, operation, args, query }) {
//                 const writeOperations = ['create', 'update', 'upsert', 'delete', 'createMany', 'updateMany', 'deleteMany'];

//                 if (model && writeOperations.includes(operation)) {
//                   try {
//                     const client = redisManager.getClient();
//                     if (!client) { // Added null check
//                       return query(args);
//                     }

//                     // Get all cached keys for this model
//                     const tagKey = `tag:model:${model.toLowerCase()}`;
//                     const keys = await client.sMembers(tagKey);

//                     if (keys.length > 0) {
//                       await client.del(keys);
//                       await client.del(tagKey);

//                       if (defaultConfig.enableLogging) {
//                         const logEntry = `
// [${new Date().toISOString()}] PRISMA_INVALIDATE: ${model} - ${keys.length} keys removed`;
//                         fs.appendFileSync(path.join(process.cwd(), 'REDISLOG.md'), logEntry);
//                       }
//                     }
//                   } catch (error) {
//                     console.error('[Prisma Invalidation Error]', error);
//                   }
//                 }

//                 return query(args);
//               },
//             },
//           },
//         }) as PrismaClient;
//       }
//     }
//   }
//   prisma = global.prisma;
//   return prisma;
// }

// export function getPrisma(): PrismaClient {
//   if (!global.prisma) {
//     throw new Error("Prisma client not initialized. Call ensurePrismaWithCache() first.");
//   }
//   return global.prisma;
// }

// // Placeholder for JSON stub data (e.g., from /seed/demo/*.json)
// // In a real scenario, you would load these from files or a mock service.
// export const getStubData = (entity: string) => {
//   switch (entity) {
//     case 'categories':
//       return [
//         { id: 'cat1', slug: 'technology', translations: [{ locale: 'EN', name: 'Technology' }] },
//         { id: 'cat2', slug: 'healthcare', translations: [{ locale: 'EN', name: 'Healthcare' }] },
//       ];
//     case 'reports':
//       return [
//         { id: 'rep1', slug: 'ai-chipset', categoryId: 'cat1', translations: [{ locale: 'EN', title: 'Global AI Chipset Market' }] },
//         { id: 'rep2', slug: 'ev-battery', categoryId: 'cat1', translations: [{ locale: 'EN', title: 'EV Battery Market Trends' }] },
//       ];
//     default:
//       return [];
//   }
// };