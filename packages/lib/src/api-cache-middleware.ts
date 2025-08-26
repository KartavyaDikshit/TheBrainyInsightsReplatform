import { NextRequest, NextResponse } from 'next/server';
import { redisManager } from './redis-client';

interface CacheOptions {
  ttl?: number;
  tags?: string[];
  revalidateOnStale?: boolean;
  keyGenerator?: (req: NextRequest) => string;
}

export function withCache(options: CacheOptions = {}) {
  return function <T extends any[], R>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: T) => Promise<NextResponse<R>>>
  ) {
    const method = descriptor.value!;

    descriptor.value = async function (...args: T) {
      const request = args[0] as NextRequest;
      const ttl = options.ttl || 300; // 5 minutes default
      
      // Generate cache key
      const cacheKey = options.keyGenerator 
        ? options.keyGenerator(request)
        : `api:${request.nextUrl.pathname}:${request.nextUrl.searchParams.toString()}`;

      try {
        // Try to get from Redis
        const client = redisManager.getClient();
        if (!client) {
          // If Redis client is not available, bypass cache and execute original method
          return await method.apply(this, args);
        }
        const cached = await client.get(cacheKey);
        
        if (cached) {
          const data = JSON.parse(cached);
          
          // Log cache hit
          const logEntry = `
[${new Date().toISOString()}] API_CACHE_HIT: ${cacheKey}`;
          require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
          
          return new NextResponse(JSON.stringify(data.body), {
            status: data.status,
            headers: {
              ...data.headers,
              'X-Cache': 'HIT',
              'X-Cache-Key': cacheKey
            }
          });
        }

        // Cache miss - execute original method
        const response = await method.apply(this, args);
        
        // Cache successful responses
        if (response.status >= 200 && response.status < 300) {
          const responseBody = await response.text();
          
          const cacheData = {
            body: responseBody,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          };

          // Store in Redis
          await client.setEx(cacheKey, ttl, JSON.stringify(cacheData));
          
          // Handle tags
          if (options.tags) {
            for (const tag of options.tags) {
              await client.sAdd(`tag:${tag}`, cacheKey);
            }
          }

          // Log cache set
          const logEntry = `
[${new Date().toISOString()}] API_CACHE_SET: ${cacheKey} (TTL: ${ttl})`;
          require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);

          // Return response with cache headers
          return new NextResponse(responseBody, {
            status: response.status,
            headers: {
              ...Object.fromEntries(response.headers.entries()),
              'X-Cache': 'MISS',
              'X-Cache-Key': cacheKey
            }
          });
        }

        return response;

      } catch (error) {
        console.error('[API Cache Error]', error);
        // Fall back to original method on error
        return method.apply(this, args);
      }
    };
  };
}

// Cache invalidation utility
export async function invalidateCache(pattern: string) {
  try {
    const client = redisManager.getClient();
    if (!client) { // Added null check
      console.warn('Redis client not available for cache invalidation.');
      return 0;
    }
    const keys = await client.keys(pattern);
    
    if (keys.length > 0) {
      await client.del(keys);
      const logEntry = `
[${new Date().toISOString()}] CACHE_INVALIDATED: ${pattern} (${keys.length} keys)`;
      require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
    }
    
    return keys.length;
  } catch (error) {
    console.error('[Cache Invalidation Error]', error);
    return 0;
  }
}