import { Prisma } from '@prisma/client';
import { redisManager } from '../../packages/lib/src/redis-client';

interface CacheConfig {
  defaultTTL: number;
  keyPrefix: string;
  enableLogging: boolean;
}

const defaultConfig: CacheConfig = {
  defaultTTL: 300, // 5 minutes
  keyPrefix: 'prisma:',
  enableLogging: process.env.DEBUG_CACHE_HANDLER === 'true'
};

function generateCacheKey(model: string, operation: string, args: any): string {
  const argsHash = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(args))
    .digest('hex');
  
  return `${defaultConfig.keyPrefix}${model}:${operation}:${argsHash}`;
}

function logPrismaCache(operation: string, model: string, key: string, hit: boolean) {
  if (defaultConfig.enableLogging) {
    const logEntry = `
[${new Date().toISOString()}] PRISMA_CACHE_${hit ? 'HIT' : 'MISS'}: ${model}.${operation} - ${key}`;
    require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
  }
}

export const prismaRedisMiddleware: Prisma.Middleware = async (params, next) => {
  const { model, action, args } = params;
  
  // Only cache read operations
  const cacheableOperations = ['findUnique', 'findFirst', 'findMany', 'count', 'aggregate'];
  
  if (!model || !cacheableOperations.includes(action)) {
    return next(params);
  }

  const cacheKey = generateCacheKey(model, action, args);

  try {
    const client = redisManager.getClient();
    
    // Try to get from cache
    const cached = await client.get(cacheKey);
    if (cached) {
      logPrismaCache(action, model, cacheKey, true);
      return JSON.parse(cached);
    }

    // Execute query
    const result = await next(params);

    // Cache the result
    if (result !== null && result !== undefined) {
      const ttl = defaultConfig.defaultTTL;
      await client.setEx(cacheKey, ttl, JSON.stringify(result));
      
      // Tag for invalidation
      await client.sAdd(`tag:model:${model.toLowerCase()}`, cacheKey);
      
      logPrismaCache(action, model, cacheKey, false);
    }

    return result;

  } catch (error) {
    console.error('[Prisma Cache Error]', error);
    // Fall back to direct query on error
    return next(params);
  }
};

// Cache invalidation for write operations
export const prismaInvalidationMiddleware: Prisma.Middleware = async (params, next) => {
  const { model, action } = params;
  
  const writeOperations = ['create', 'update', 'upsert', 'delete', 'createMany', 'updateMany', 'deleteMany'];
  
  if (model && writeOperations.includes(action)) {
    try {
      const client = redisManager.getClient();
      
      // Get all cached keys for this model
      const tagKey = `tag:model:${model.toLowerCase()}`;
      const keys = await client.sMembers(tagKey);
      
      if (keys.length > 0) {
        await client.del(keys);
        await client.del(tagKey);
        
        if (defaultConfig.enableLogging) {
          const logEntry = `
[${new Date().toISOString()}] PRISMA_INVALIDATE: ${model} - ${keys.length} keys removed`;
          require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
        }
      }
    } catch (error) {
      console.error('[Prisma Invalidation Error]', error);
    }
  }

  return next(params);
};
