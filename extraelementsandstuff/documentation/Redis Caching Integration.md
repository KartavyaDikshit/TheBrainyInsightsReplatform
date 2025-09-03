<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Redis Caching Integration for TheBrainyInsightsReplatform

After thoroughly analyzing your repository, I've created a comprehensive Redis integration plan with extreme detail, debugging protocols, and continuous monitoring. Here's everything you need to transform your Next.js 15 application with Redis caching.

## Repository Analysis \& Architecture Understanding

Your **TheBrainyInsightsReplatform** is a sophisticated monorepo built with:

- **Tech Stack**: Next.js 15.4.6, TypeScript 76.9%, React 18.3.1, Prisma ORM, MySQL
- **Architecture**: Monorepo with modular design (packages: database, lib, ui)
- **Authentication**: NextAuth 4.24.11 with `auth.ts`
- **Current Caching**: Basic LRU cache (10.0.2)
- **Deployment**: PM2 + Nginx configuration
- **Package Manager**: pnpm

Key integration points identified:

- `packages/database/prisma/` for query caching
- `src/app/api/` for API response caching
- `packages/lib/cache.ts` for existing cache utilities
- `auth.ts` for session management integration

![Redis Integration Implementation Timeline - TheBrainyInsightsReplatform](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/49bc1fe3dd70f36c8904bf45d0e2b942/e40c3bf7-a2fe-4421-9be3-5dd52ac2bf3d/ae41e5d2.png)

Redis Integration Implementation Timeline - TheBrainyInsightsReplatform

## Gemini CLI Command for Redis Integration

Here's the complete Gemini CLI command sequence to implement Redis caching with comprehensive monitoring:

```bash
# Install Gemini CLI globally
npm install -g @google/gemini-cli

# Initialize project analysis and Redis integration
gemini "I need to integrate Redis caching into this Next.js 15 monorepo application. The tech stack includes TypeScript, Prisma, MySQL, NextAuth, and uses pnpm. I want to implement: 1) Next.js 15 cache handler with Redis, 2) Session management with Redis adapter, 3) Prisma query caching, 4) API response caching with tag-based invalidation, 5) Real-time monitoring and health checks, 6) Production-ready configuration with security. Please provide step-by-step implementation with file contents, configurations, debugging commands, and monitoring setup. Include error handling, fallback mechanisms, and performance optimization. Generate all necessary code files with TypeScript types." --files="package.json,next.config.js,auth.ts,packages/database/prisma/schema.prisma,src/app/api/**/*.ts,packages/lib/cache.ts" --output-format="detailed" --include-tests
```


## Phase-by-Phase Implementation Roadmap

### Phase 1: Redis Environment Setup (Days 1-2)

**1.1 Production Redis Installation**

```bash
# Ubuntu/Debian Production Installation
sudo apt-get update
sudo apt-get install lsb-release curl gpg

# Add Redis official repository
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
sudo chmod 644 /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

# Install Redis
sudo apt-get update  
sudo apt-get install redis-stack-server

# Production Configuration
sudo systemctl enable redis-stack-server
sudo systemctl start redis-stack-server

# Security hardening
sudo ufw allow from 127.0.0.1 to any port 6379
sudo nano /etc/redis-stack.conf
# Add: requirepass YOUR_STRONG_PASSWORD_HERE
# Add: bind 127.0.0.1 ::1
sudo systemctl restart redis-stack-server
```

**1.2 Development Environment Setup**

```bash
# Docker alternative for development
docker run -d --name redis-dev \
  -p 6379:6379 \
  -e REDIS_PASSWORD=dev_password_123 \
  redis:7.2-alpine redis-server --requirepass dev_password_123

# Health check
docker exec redis-dev redis-cli -a dev_password_123 ping
# Expected: PONG
```

**Debugging Commands:**

```bash
# Check Redis status
redis-cli -a YOUR_PASSWORD info server
redis-cli -a YOUR_PASSWORD config get "*memory*"
redis-cli -a YOUR_PASSWORD monitor

# Performance monitoring  
redis-cli -a YOUR_PASSWORD --latency-history
redis-cli -a YOUR_PASSWORD info stats
```


### Phase 2: Next.js 15 Cache Handler Integration (Days 3-5)

**2.1 Install Dependencies**

```bash
# Navigate to repository root
cd TheBrainyInsightsReplatform

# Install Redis packages with pnpm
pnpm add redis @redis/client ioredis
pnpm add @fortedigital/nextjs-cache-handler
pnpm add -D @types/redis
```

**2.2 Create Redis Client Configuration**

Create `lib/redis-client.ts`:

```typescript
import { createClient, RedisClientType } from 'redis';
import { Redis } from 'ioredis';

interface RedisConfig {
  url: string;
  password?: string;
  maxRetries: number;
  retryDelayOnFailover: number;
  maxRetriesPerRequest: number;
}

class RedisManager {
  private static instance: RedisManager;
  private client: RedisClientType | null = null;
  private ioredisClient: Redis | null = null;
  private isConnected = false;

  private constructor() {}

  static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  async connect(): Promise<void> {
    try {
      const config: RedisConfig = {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD,
        maxRetries: 3,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3
      };

      // Primary client for cache operations
      this.client = createClient({
        url: config.url,
        password: config.password,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500)
        }
      });

      // IORedis client for advanced operations
      this.ioredisClient = new Redis(config.url, {
        password: config.password,
        maxRetriesPerRequest: config.maxRetriesPerRequest,
        retryDelayOnFailover: config.retryDelayOnFailover,
        lazyConnect: true
      });

      this.client.on('error', (error) => {
        console.error('[Redis Client Error]', {
          error: error.message,
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
      });

      this.client.on('connect', () => {
        console.log('[Redis] Client connected successfully');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.warn('[Redis] Client disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      await this.ioredisClient.connect();

      // Health check
      const pong = await this.client.ping();
      if (pong !== 'PONG') {
        throw new Error('Redis health check failed');
      }

      console.log('[Redis] Successfully connected and validated');

    } catch (error) {
      console.error('[Redis] Connection failed:', error);
      throw error;
    }
  }

  getClient(): RedisClientType {
    if (!this.client || !this.isConnected) {
      throw new Error('Redis client not connected');
    }
    return this.client;
  }

  getIORedisClient(): Redis {
    if (!this.ioredisClient) {
      throw new Error('IORedis client not available');
    }
    return this.ioredisClient;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
    }
    if (this.ioredisClient) {
      await this.ioredisClient.disconnect();
    }
    this.isConnected = false;
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

export const redisManager = RedisManager.getInstance();
export default redisManager;
```

**2.3 Create Next.js 15 Compatible Cache Handler**

Create `cache-handler.js` in project root:

```javascript
const { createClient } = require('redis');
const fs = require('fs');
const path = require('path');

// Comprehensive logging function
function logCacheOperation(operation, key, details = {}) {
  if (process.env.DEBUG_CACHE_HANDLER === 'true') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      operation,
      key,
      ...details
    };
    
    // Write to REDISLOG.md
    const logLine = `\n[${logEntry.timestamp}] ${operation}: ${key} ${JSON.stringify(details)}`;
    try {
      fs.appendFileSync(path.join(process.cwd(), 'REDISLOG.md'), logLine);
    } catch (error) {
      console.error('Failed to write to REDISLOG.md:', error);
    }
  }
  console.log(`[Cache ${operation}]`, { key, ...details });
}

class RedisCacheHandler {
  constructor(options) {
    this.options = options;
    this.client = null;
    this.isConnected = false;
    this.memoryFallback = new Map();
    this.maxMemorySize = 100; // Fallback memory cache size
  }

  async #connect() {
    if (this.client && this.isConnected) return;

    try {
      this.client = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        password: process.env.REDIS_PASSWORD,
        socket: {
          reconnectStrategy: (retries) => {
            logCacheOperation('RECONNECT_ATTEMPT', 'redis', { retries });
            return retries < 3 ? Math.min(retries * 50, 500) : false;
          }
        }
      });

      this.client.on('error', (error) => {
        logCacheOperation('ERROR', 'redis_client', { error: error.message });
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logCacheOperation('CONNECTED', 'redis_client');
        this.isConnected = true;
      });

      await this.client.connect();
      await this.client.ping();
      
      logCacheOperation('INITIALIZED', 'cache_handler', { 
        redis_connected: true,
        pid: process.pid
      });

    } catch (error) {
      logCacheOperation('CONNECTION_FAILED', 'redis', { error: error.message });
      this.isConnected = false;
    }
  }

  async get(key) {
    await this.#connect();
    
    try {
      if (this.isConnected && this.client) {
        const data = await this.client.get(key);
        if (data) {
          const parsed = JSON.parse(data);
          logCacheOperation('HIT', key, { source: 'redis' });
          return parsed;
        }
      }
      
      // Fallback to memory cache
      const memoryData = this.memoryFallback.get(key);
      if (memoryData) {
        logCacheOperation('HIT', key, { source: 'memory_fallback' });
        return memoryData;
      }
      
      logCacheOperation('MISS', key);
      return null;

    } catch (error) {
      logCacheOperation('GET_ERROR', key, { error: error.message });
      return this.memoryFallback.get(key) || null;
    }
  }

  async set(key, data, ctx) {
    await this.#connect();
    
    const serialized = JSON.stringify(data);
    const ttl = ctx?.revalidate || 3600; // Default 1 hour TTL

    try {
      if (this.isConnected && this.client) {
        await this.client.setEx(key, ttl, serialized);
        
        // Handle tags for invalidation
        if (ctx?.tags && ctx.tags.length > 0) {
          for (const tag of ctx.tags) {
            await this.client.sAdd(`tag:${tag}`, key);
          }
        }
        
        logCacheOperation('SET', key, { 
          source: 'redis', 
          ttl,
          tags: ctx?.tags,
          size: serialized.length 
        });
      }
      
      // Always set in memory fallback
      this.#setMemoryFallback(key, data);
      
    } catch (error) {
      logCacheOperation('SET_ERROR', key, { error: error.message });
      this.#setMemoryFallback(key, data);
    }
  }

  async revalidateTag(tag) {
    await this.#connect();
    
    try {
      if (this.isConnected && this.client) {
        const keys = await this.client.sMembers(`tag:${tag}`);
        
        if (keys.length > 0) {
          // Delete all keys associated with this tag
          await this.client.del(keys);
          // Delete the tag set itself
          await this.client.del(`tag:${tag}`);
          
          // Clear from memory fallback too
          keys.forEach(key => this.memoryFallback.delete(key));
          
          logCacheOperation('REVALIDATE_TAG', tag, { 
            keys_invalidated: keys.length,
            keys: keys
          });
        }
      }
      
    } catch (error) {
      logCacheOperation('REVALIDATE_TAG_ERROR', tag, { error: error.message });
    }
  }

  resetRequestCache() {
    // This is called for each request to clear request-scoped cache
    logCacheOperation('RESET_REQUEST_CACHE', 'all');
  }

  #setMemoryFallback(key, data) {
    if (this.memoryFallback.size >= this.maxMemorySize) {
      const firstKey = this.memoryFallback.keys().next().value;
      this.memoryFallback.delete(firstKey);
    }
    this.memoryFallback.set(key, data);
  }
}

module.exports = RedisCacheHandler;
```

**2.4 Update next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable cache handler in production
  cacheHandler: process.env.NODE_ENV === 'production' 
    ? require.resolve('./cache-handler.js')
    : undefined,
    
  // Existing configuration
  experimental: {
    // Enable if using app directory features
    appDir: true,
  },
  
  // Add cache configuration
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Existing config...
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
```

**Debugging Commands for Phase 2:**

```bash
# Test cache handler
DEBUG_CACHE_HANDLER=true npm run build
DEBUG_CACHE_HANDLER=true npm run start

# Monitor Redis operations
redis-cli -a YOUR_PASSWORD monitor | grep -E "(GET|SET|DEL)"

# Check cache contents
redis-cli -a YOUR_PASSWORD keys "next-shared-cache*"
redis-cli -a YOUR_PASSWORD keys "tag:*"

# Check memory usage
redis-cli -a YOUR_PASSWORD info memory

# Webapp health check
curl http://localhost:3000/api/health
```


### Phase 3: Session Management with Redis (Days 6-7)

**3.1 Install NextAuth Redis Adapter**

```bash
pnpm add @auth/redis-adapter
pnpm add @next-auth/prisma-adapter
```

**3.2 Update auth.ts Configuration**

```typescript
import NextAuth from "next-auth"
import { RedisAdapter } from "@auth/redis-adapter"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { redisManager } from "./lib/redis-client"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: process.env.USE_REDIS_SESSIONS === 'true' 
    ? RedisAdapter(redisManager.getIORedisClient())
    : PrismaAdapter(prisma),
    
  providers: [
    // Your existing providers
  ],
  
  session: {
    strategy: process.env.USE_REDIS_SESSIONS === 'true' ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  callbacks: {
    async session({ session, user }) {
      // Log session activity to REDISLOG.md
      if (process.env.DEBUG_CACHE_HANDLER === 'true') {
        const logEntry = `\n[${new Date().toISOString()}] SESSION_ACCESS: ${user?.id || 'anonymous'} - ${session?.user?.email || 'no-email'}`;
        require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
      }
      
      return session;
    }
  },
  
  events: {
    async signIn(message) {
      console.log('[NextAuth] Sign in:', message.user.email);
    },
    async signOut(message) {
      console.log('[NextAuth] Sign out:', message.session?.userId);
    }
  }
})
```

**3.3 Environment Variables Update**

Add to `.env.local`:

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password
USE_REDIS_SESSIONS=true

# Cache Configuration  
DEBUG_CACHE_HANDLER=true
CACHE_TTL=3600
NEXT_PUBLIC_CACHE_IN_SECONDS=3600

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-make-it-strong
```

**Debugging Commands for Phase 3:**

```bash
# Check session storage in Redis
redis-cli -a YOUR_PASSWORD keys "user:*"
redis-cli -a YOUR_PASSWORD keys "session:*"
redis-cli -a YOUR_PASSWORD keys "account:*"

# Monitor session activity
redis-cli -a YOUR_PASSWORD monitor | grep -E "(user|session|account)"

# Test authentication flow
curl -X POST http://localhost:3000/api/auth/signin
curl http://localhost:3000/api/auth/session
```


### Phase 4: API Response Caching (Days 8-11)

**4.1 Create Redis-backed API Caching Middleware**

Create `lib/api-cache-middleware.ts`:

```typescript
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
      const request = args[^0] as NextRequest;
      const ttl = options.ttl || 300; // 5 minutes default
      
      // Generate cache key
      const cacheKey = options.keyGenerator 
        ? options.keyGenerator(request)
        : `api:${request.nextUrl.pathname}:${request.nextUrl.searchParams.toString()}`;

      try {
        // Try to get from Redis
        const client = redisManager.getClient();
        const cached = await client.get(cacheKey);
        
        if (cached) {
          const data = JSON.parse(cached);
          
          // Log cache hit
          const logEntry = `\n[${new Date().toISOString()}] API_CACHE_HIT: ${cacheKey}`;
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
          const logEntry = `\n[${new Date().toISOString()}] API_CACHE_SET: ${cacheKey} (TTL: ${ttl})`;
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
    const keys = await client.keys(pattern);
    
    if (keys.length > 0) {
      await client.del(keys);
      const logEntry = `\n[${new Date().toISOString()}] CACHE_INVALIDATED: ${pattern} (${keys.length} keys)`;
      require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
    }
    
    return keys.length;
  } catch (error) {
    console.error('[Cache Invalidation Error]', error);
    return 0;
  }
}
```

**4.2 Example API Route with Caching**

Create `src/app/api/example/cached/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withCache } from '../../../../lib/api-cache-middleware';

export class ExampleAPI {
  @withCache({ 
    ttl: 600, // 10 minutes
    tags: ['examples', 'api-data'],
    keyGenerator: (req) => `api:example:${req.nextUrl.searchParams.get('id') || 'default'}`
  })
  static async GET(request: NextRequest): Promise<NextResponse> {
    // Simulate expensive operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = {
      timestamp: new Date().toISOString(),
      id: request.nextUrl.searchParams.get('id') || 'default',
      message: 'This is cached data',
      expensive_calculation: Math.random() * 10000
    };

    return NextResponse.json(data);
  }

  static async POST(request: NextRequest): Promise<NextResponse> {
    // Handle POST requests (typically not cached)
    const body = await request.json();
    
    // Invalidate related cache
    const { invalidateCache } = await import('../../../../lib/api-cache-middleware');
    await invalidateCache('api:example:*');
    
    return NextResponse.json({ success: true, body });
  }
}

export const GET = ExampleAPI.GET;
export const POST = ExampleAPI.POST;
```

**Debugging Commands for Phase 4:**

```bash
# Test API caching
curl http://localhost:3000/api/example/cached
curl http://localhost:3000/api/example/cached?id=123

# Check API cache keys
redis-cli -a YOUR_PASSWORD keys "api:*"

# Monitor API cache activity
redis-cli -a YOUR_PASSWORD monitor | grep "api:"

# Test cache invalidation
curl -X POST http://localhost:3000/api/cache/invalidate -d '{"pattern":"api:example:*"}'
```


### Phase 5: Database Query Caching with Prisma (Days 12-14)

**5.1 Create Prisma Redis Middleware**

Create `packages/database/prisma-redis-cache.ts`:

```typescript
import { Prisma } from '@prisma/client';
import { redisManager } from '../../lib/redis-client';

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
    const logEntry = `\n[${new Date().toISOString()}] PRISMA_CACHE_${hit ? 'HIT' : 'MISS'}: ${model}.${operation} - ${key}`;
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
        // Delete all cached entries for this model
        await client.del(keys);
        await client.del(tagKey);
        
        if (defaultConfig.enableLogging) {
          const logEntry = `\n[${new Date().toISOString()}] PRISMA_INVALIDATE: ${model} - ${keys.length} keys removed`;
          require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);
        }
      }
    } catch (error) {
      console.error('[Prisma Invalidation Error]', error);
    }
  }

  return next(params);
};
```

**5.2 Update Prisma Client Configuration**

Modify `packages/database/index.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import { prismaRedisMiddleware, prismaInvalidationMiddleware } from './prisma-redis-cache';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Add Redis caching middleware
if (process.env.ENABLE_PRISMA_CACHE === 'true') {
  prisma.$use(prismaRedisMiddleware);
  prisma.$use(prismaInvalidationMiddleware);
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

**5.3 Update Environment Variables**

Add to `.env.local`:

```env
# Prisma Redis Caching
ENABLE_PRISMA_CACHE=true
PRISMA_CACHE_TTL=300
```

**Debugging Commands for Phase 5:**

```bash
# Monitor Prisma cache activity
redis-cli -a YOUR_PASSWORD keys "prisma:*"
redis-cli -a YOUR_PASSWORD keys "tag:model:*"

# Check cache hit rates
redis-cli -a YOUR_PASSWORD info stats | grep keyspace

# Test query caching
curl http://localhost:3000/api/test-prisma-cache

# Performance testing
ab -n 100 -c 10 http://localhost:3000/api/users
```


### Phase 6: Monitoring \& Health Checks (Days 15-16)

**6.1 Create Comprehensive Monitoring Dashboard**

Create `src/app/api/health/redis/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { redisManager } from '../../../../lib/redis-client';

export async function GET() {
  try {
    const client = redisManager.getClient();
    
    // Basic connectivity test
    const ping = await client.ping();
    
    // Get Redis info
    const info = await client.info();
    const memory = await client.info('memory');
    const stats = await client.info('stats');
    
    // Parse important metrics
    const metrics = {
      connected: ping === 'PONG',
      uptime: extractValue(info, 'uptime_in_seconds'),
      memory_used: extractValue(memory, 'used_memory_human'),
      memory_peak: extractValue(memory, 'used_memory_peak_human'),
      total_connections: extractValue(stats, 'total_connections_received'),
      total_commands: extractValue(stats, 'total_commands_processed'),
      keyspace_hits: extractValue(stats, 'keyspace_hits'),
      keyspace_misses: extractValue(stats, 'keyspace_misses'),
      hit_rate: calculateHitRate(
        extractValue(stats, 'keyspace_hits'),
        extractValue(stats, 'keyspace_misses')
      )
    };

    // Check cache keys
    const cacheKeysCount = {
      nextjs_cache: await client.eval(`return #redis.call('keys', 'next-shared-cache*')`, 0) as number,
      api_cache: await client.eval(`return #redis.call('keys', 'api:*')`, 0) as number,
      prisma_cache: await client.eval(`return #redis.call('keys', 'prisma:*')`, 0) as number,
      session_cache: await client.eval(`return #redis.call('keys', 'user:*')`, 0) as number,
    };

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      redis: metrics,
      cache_distribution: cacheKeysCount,
      total_cached_items: Object.values(cacheKeysCount).reduce((a, b) => a + b, 0)
    };

    return NextResponse.json(health);

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 });
  }
}

function extractValue(info: string, key: string): string | number {
  const match = info.match(new RegExp(`${key}:(\\S+)`));
  return match ? (isNaN(Number(match[^1])) ? match[^1] : Number(match[^1])) : 'N/A';
}

function calculateHitRate(hits: any, misses: any): string {
  const h = Number(hits) || 0;
  const m = Number(misses) || 0;
  const total = h + m;
  return total > 0 ? ((h / total) * 100).toFixed(2) + '%' : '0%';
}
```

**6.2 Create Performance Monitoring API**

Create `src/app/api/metrics/redis/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { redisManager } from '../../../../lib/redis-client';

export async function GET() {
  const client = redisManager.getClient();
  
  try {
    // Get comprehensive Redis metrics
    const info = await client.info('all');
    const slowlog = await client.eval(`return redis.call('slowlog', 'get', 10)`, 0) as any[];
    
    // Parse metrics into categories
    const metrics = {
      server: parseSection(info, 'Server'),
      clients: parseSection(info, 'Clients'),
      memory: parseSection(info, 'Memory'),
      persistence: parseSection(info, 'Persistence'),
      stats: parseSection(info, 'Stats'),
      replication: parseSection(info, 'Replication'),
      cpu: parseSection(info, 'CPU'),
      commandstats: parseSection(info, 'Commandstats'),
      keyspace: parseSection(info, 'Keyspace'),
      slow_queries: slowlog.map((log: any) => ({
        id: log[^0],
        timestamp: log[^1],
        duration: log[^2],
        command: log[^3],
        client: log[^4] || 'unknown'
      }))
    };

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metrics,
      alerts: generateAlerts(metrics)
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

function parseSection(info: string, section: string): Record<string, any> {
  const result: Record<string, any> = {};
  const sectionRegex = new RegExp(`# ${section}\\r?\\n([\\s\\S]*?)(?=\\r?\\n# |$)`, 'i');
  const match = info.match(sectionRegex);
  
  if (match) {
    const lines = match[^1].split('\n');
    for (const line of lines) {
      const [key, value] = line.split(':');
      if (key && value !== undefined) {
        result[key.trim()] = isNaN(Number(value)) ? value.trim() : Number(value);
      }
    }
  }
  
  return result;
}

function generateAlerts(metrics: any): string[] {
  const alerts: string[] = [];
  
  // Memory alerts
  if (metrics.memory.used_memory > 1073741824) { // 1GB
    alerts.push('High memory usage detected');
  }
  
  // Connection alerts
  if (metrics.clients.connected_clients > 100) {
    alerts.push('High number of connected clients');
  }
  
  // Performance alerts
  if (metrics.slow_queries.length > 0) {
    alerts.push(`${metrics.slow_queries.length} slow queries detected`);
  }
  
  return alerts;
}
```

**6.3 Create Cache Invalidation API**

Create `src/app/api/cache/invalidate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { redisManager } from '../../../../lib/redis-client';

export async function POST(request: NextRequest) {
  try {
    const { pattern, tags } = await request.json();
    
    if (!pattern && !tags) {
      return NextResponse.json({ 
        error: 'Either pattern or tags must be provided' 
      }, { status: 400 });
    }

    const client = redisManager.getClient();
    let deletedKeys = 0;

    if (pattern) {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
        deletedKeys += keys.length;
      }
    }

    if (tags) {
      for (const tag of tags) {
        const tagKeys = await client.sMembers(`tag:${tag}`);
        if (tagKeys.length > 0) {
          await client.del(tagKeys);
          await client.del(`tag:${tag}`);
          deletedKeys += tagKeys.length;
        }
      }
    }

    const logEntry = `\n[${new Date().toISOString()}] MANUAL_INVALIDATION: pattern=${pattern}, tags=${tags}, deleted=${deletedKeys}`;
    require('fs').appendFileSync(require('path').join(process.cwd(), 'REDISLOG.md'), logEntry);

    return NextResponse.json({
      success: true,
      deleted_keys: deletedKeys,
      pattern,
      tags,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}
```


## Final Configuration \& Production Deployment

**Update package.json scripts:**

```json
{
  "scripts": {
    "dev": "node scripts/runlog.cjs \"Dev start\" && next dev -p 3000",
    "build": "node scripts/prebuild-warn.cjs && node scripts/runlog.cjs \"Build start\" && cross-env DATABASE_URL=\"mysql://tbi_user:karta123@localhost:3306/tbi\" DEMO_NO_DB= NEXT_AUTH_URL=http://localhost:3000 NEXTAUTH_SECRET=super-secret-key-for-build next build",
    "start": "node scripts/runlog.cjs \"Prod start\" && next start -p 3000",
    "cache:health": "curl http://localhost:3000/api/health/redis",
    "cache:metrics": "curl http://localhost:3000/api/metrics/redis", 
    "cache:clear": "redis-cli -a $REDIS_PASSWORD flushall",
    "cache:monitor": "redis-cli -a $REDIS_PASSWORD monitor"
  }
}
```


## Production Monitoring \& Debugging Commands

```bash
# Health check commands
curl http://localhost:3000/api/health/redis | jq
curl http://localhost:3000/api/metrics/redis | jq

# Cache performance testing
ab -n 1000 -c 50 http://localhost:3000/api/example/cached

# Redis monitoring
redis-cli -a YOUR_PASSWORD --latency-history
redis-cli -a YOUR_PASSWORD info stats | grep -E "(hit|miss|command)"
redis-cli -a YOUR_PASSWORD slowlog get 20

# Memory analysis
redis-cli -a YOUR_PASSWORD info memory | grep -E "(used_memory|fragmentation|peak)"

# Key space analysis
redis-cli -a YOUR_PASSWORD eval "return redis.call('keys', ARGV[^1])" 0 "next-*" | wc -l
redis-cli -a YOUR_PASSWORD eval "return redis.call('keys', ARGV[^1])" 0 "api:*" | wc -l
redis-cli -a YOUR_PASSWORD eval "return redis.call('keys', ARGV[^1])" 0 "prisma:*" | wc -l

# Real-time monitoring dashboard
watch -n 5 'curl -s http://localhost:3000/api/health/redis | jq ".redis.hit_rate, .total_cached_items"'
```

![Redis caching architecture diagram for Next.js application with data flow](https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/4d984faf-aabd-4559-b08b-26ce6ecf30a6.png)

Redis caching architecture diagram for Next.js application with data flow

## Critical Security Considerations

1. **Production Redis Security:**
    - Change default port from 6379
    - Enable AUTH with strong password
    - Configure firewall rules
    - Use TLS for external connections
    - Regular security updates
2. **Application Security:**
    - Validate all cache keys
    - Sanitize user inputs before caching
    - Implement rate limiting on cache operations
    - Monitor for suspicious patterns
3. **Data Privacy:**
    - Never cache sensitive user data
    - Implement proper session handling
    - Use encryption for sensitive cached data
    - Regular cache cleanup procedures

This comprehensive integration provides a production-ready Redis caching system for your Next.js application with continuous monitoring, debugging capabilities, and detailed logging in the REDISLOG.md file. The implementation includes fallback mechanisms, error handling, and performance optimization tailored specifically for your repository structure.

<div style="text-align: center">⁂</div>

[^1]: https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform

[^2]: https://ieeexplore.ieee.org/document/9740986/

[^3]: https://www.semanticscholar.org/paper/8054ca28ed1eb497f8fe8787075e716d340805be

[^4]: https://s-lib.com/en/issues/eiu_2025_05_v5_a3/

[^5]: https://www.semanticscholar.org/paper/6f25df5ca4ac7a315762a6af122df243d845ee17

[^6]: https://arxiv.org/abs/2503.07701

[^7]: https://dl.acm.org/doi/10.1145/3524610.3527882

[^8]: https://www.semanticscholar.org/paper/5adc8360b9d64bff6bb6883e89e3aa0c0d4b516e

[^9]: https://dl.acm.org/doi/10.1145/3524610.3527876

[^10]: https://ieeexplore.ieee.org/document/10795282/

[^11]: https://link.springer.com/10.1007/s10664-022-10229-z

[^12]: https://arxiv.org/pdf/2408.09344v1.pdf

[^13]: https://linkinghub.elsevier.com/retrieve/pii/S0164121221002144

[^14]: https://arxiv.org/pdf/2103.09766.pdf

[^15]: https://arxiv.org/pdf/2407.20900.pdf

[^16]: https://aclanthology.org/2023.emnlp-main.151.pdf

[^17]: https://arxiv.org/html/2410.14684v1

[^18]: https://arxiv.org/pdf/2312.06382.pdf

[^19]: https://www.mdpi.com/2073-431X/13/2/33/pdf?version=1706174086

[^20]: https://arxiv.org/pdf/2012.03453.pdf

[^21]: https://arxiv.org/pdf/2303.12570.pdf

[^22]: https://github.blog/engineering/architecture-optimization/the-technology-behind-githubs-new-code-search/

[^23]: https://github.com/orgs/github/repositories

[^24]: https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform/blob/main/README.md

[^25]: https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform/blob/main/package.json

[^26]: https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform/blob/main/ARCHITECTURE.md

[^27]: https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform

[^28]: https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform/tree/main/src

[^29]: https://github.com/KartavyaDikshit/TheBrainyInsightsReplatform/tree/main/packages

[^30]: https://www.semanticscholar.org/paper/f5eeff4f4d7f3563cbcd9391c0df22a5d731a727

[^31]: https://arxiv.org/pdf/2411.05276.pdf

[^32]: https://arxiv.org/pdf/2203.08323.pdf

[^33]: https://arxiv.org/pdf/2412.10382.pdf

[^34]: https://www.mdpi.com/2073-431X/9/1/14/pdf

[^35]: https://jtsiskom.undip.ac.id/index.php/jtsiskom/article/download/13397/12583

[^36]: http://arxiv.org/pdf/2002.02017.pdf

[^37]: https://arxiv.org/pdf/2501.09383.pdf

[^38]: https://arxiv.org/pdf/2205.04575.pdf

[^39]: https://arxiv.org/html/2406.17565v2

[^40]: https://dl.acm.org/doi/pdf/10.1145/3603269.3604863

[^41]: https://arxiv.org/pdf/2402.17111.pdf

[^42]: https://linkinghub.elsevier.com/retrieve/pii/S1570870524000246

[^43]: https://arxiv.org/pdf/2104.13869.pdf

[^44]: http://arxiv.org/pdf/2501.12689.pdf

[^45]: https://arxiv.org/pdf/2503.17603.pdf

[^46]: http://arxiv.org/pdf/2404.12128.pdf

[^47]: https://arxiv.org/pdf/2403.02694.pdf

[^48]: http://arxiv.org/pdf/2404.12457.pdf

[^49]: https://arxiv.org/pdf/1708.09158.pdf

[^50]: https://dev.to/dee_codes/setting-up-redis-in-a-nextjs-application-1h1d

[^51]: https://dev.to/technnik/nextjs-15-app-router-caching-why-self-hosted-apps-need-redis-and-how-to-implement-it-23op

[^52]: https://stackoverflow.com/questions/76206898/issue-with-redis-caching-and-pagination-logic-causing-hanging-queries

[^53]: https://dev.to/rafalsz/scaling-nextjs-with-redis-cache-handler-55lh

[^54]: https://github.com/vercel/next.js/discussions/52203

[^55]: https://betterstack.com/community/guides/scaling-nodejs/nodejs-caching-redis/

[^56]: https://www.youtube.com/watch?v=xFxnvawpelU

[^57]: https://nextjs.org/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath

[^58]: https://upstash.com/blog/caching-prisma-redis

[^59]: https://redis.io/learn/howtos/solutions/microservices/caching

[^60]: https://blog.logrocket.com/dynamic-io-caching-next-js-15/

[^61]: https://www.reddit.com/r/nextjs/comments/1lexnei/caching_prisma_queries/

[^62]: https://dzone.com/articles/caching-rate-limiting-redis-nextjs

[^63]: https://redis.io/learn/howtos/solutions/microservices/api-gateway-caching

[^64]: https://nextjs.org/docs/app/guides/caching

[^65]: https://www.prisma.io/nextjs

[^66]: https://www.youtube.com/watch?v=JFM-o-csWLs

[^67]: https://upstash.com/docs/redis/tutorials/nextjs_with_redis

[^68]: https://onepetro.org/OTCONF/proceedings/24OTC/24OTC/D011S005R001/544985

[^69]: https://onepetro.org/SPEADIP/proceedings/24ADIP/24ADIP/D021S036R001/585654

[^70]: https://onepetro.org/SPECTWI/proceedings/22CTWI/22CTWI/D021S009R002/482910

[^71]: https://www.semanticscholar.org/paper/27baac0d8d2d6c58f4ccc6804c315c14b68f61ce

[^72]: https://onepetro.org/SPEADIP/proceedings/24ADIP/24ADIP/D041S143R003/585070

[^73]: https://arxiv.org/abs/2405.09972

[^74]: https://onepetro.org/SPEGOTS/proceedings/25GOTS/25GOTS/D022S003R003/652903

[^75]: https://ieeexplore.ieee.org/document/10885560/

[^76]: https://bssspublications.com/Home/IssueDetailPage?IsNo=413

[^77]: https://onepetro.org/SPEADIP/proceedings/24ADIP/24ADIP/D011S006R001/585008

[^78]: http://arxiv.org/pdf/0911.5438.pdf

[^79]: http://arxiv.org/pdf/0706.3008.pdf

[^80]: http://arxiv.org/pdf/1702.00311.pdf

[^81]: http://arxiv.org/pdf/2110.08588.pdf

[^82]: https://arxiv.org/pdf/2210.17261.pdf

[^83]: https://arxiv.org/pdf/2303.07876.pdf

[^84]: https://arxiv.org/pdf/2203.06559.pdf

[^85]: https://academic.oup.com/bioinformatics/article-pdf/32/2/301/6688963/btv553.pdf

[^86]: https://www.mdpi.com/2076-3417/8/6/965/pdf

[^87]: https://arxiv.org/pdf/2210.01073.pdf

[^88]: https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04

[^89]: https://www.eginnovations.com/supported-technologies/redis-monitoring

[^90]: https://github.com/redis-developer/session-store-nextjs

[^91]: https://redis.io/docs/latest/operate/kubernetes/deployment/

[^92]: https://betterstack.com/community/comparisons/redis-monitoring-tools/

[^93]: https://upstash.com/blog/authenticate-users-nextjs-authjs

[^94]: https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/

[^95]: https://www.groundcover.com/blog/monitor-redis

[^96]: https://upstash.com/blog/session-management-nextjs

[^97]: https://themythicalengineer.com/setup-production-redis-standalone.html

[^98]: https://middleware.io/blog/redis-monitoring/

[^99]: https://nextjs.org/docs/app/guides/authentication

[^100]: https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-linux/

[^101]: https://redis.io/docs/latest/commands/monitor/

[^102]: https://redis.io/learn/howtos/solutions/mobile-banking/session-management

[^103]: https://serveravatar.com/install-redis-cache-ubuntu/

[^104]: https://redis.io/docs/latest/operate/oss_and_stack/management/debugging/

[^105]: https://vercel.com/guides/session-store-nextjs-redis-vercel-kv

[^106]: https://success.outsystems.com/documentation/how_to_guides/infrastructure/configuring_outsystems_with_redis_in_memory_session_storage/set_up_a_redis_cluster_for_production_environments/

[^107]: https://redis.io/insight/

[^108]: https://arxiv.org/abs/1806.00779

[^109]: http://arxiv.org/pdf/2407.03157.pdf

[^110]: https://dl.acm.org/doi/pdf/10.1145/3600006.3613165

[^111]: http://arxiv.org/pdf/2406.06799.pdf

[^112]: http://arxiv.org/pdf/2212.07376.pdf

[^113]: https://res.mdpi.com/d_attachment/electronics/electronics-09-00296/article_deploy/electronics-09-00296-v2.pdf

[^114]: https://arxiv.org/pdf/2410.03065.pdf

[^115]: https://arxiv.org/pdf/2309.00166.pdf

[^116]: http://arxiv.org/pdf/2411.13820.pdf

[^117]: https://arxiv.org/pdf/2502.01960.pdf

[^118]: https://arxiv.org/html/2411.05787

[^119]: https://arxiv.org/pdf/2501.01792.pdf

[^120]: https://firebase.google.com/docs/app-hosting/vpc-network

[^121]: https://stackoverflow.com/questions/79500599/how-to-configure-redis-custom-cache-in-next-js-15

[^122]: https://www.npmjs.com/package/redis

[^123]: https://www.netdata.cloud/monitoring-101/redis-monitoring/

[^124]: https://caching-tools.github.io/next-shared-cache/installation

[^125]: https://cloud.google.com/memorystore/docs/redis

[^126]: https://sysdig.com/blog/redis-prometheus

[^127]: https://redis.io/learn/howtos/solutions/vector/ai-qa-videos-langchain-redis-openai-google

[^128]: https://caching-tools.github.io/next-shared-cache/redis

[^129]: https://stackoverflow.com/questions/14836053/how-can-i-change-the-cache-path-for-npm-or-completely-disable-the-cache-on-win

[^130]: https://www.solarwinds.com/solarwinds-observability/integrations/redis-monitoring

[^131]: https://www.reddit.com/r/ChatGPTCoding/comments/1lm3fxq/gemini_cli_is_awesome_but_only_when_you_make/

[^132]: https://www.datadoghq.com/blog/how-to-monitor-redis-performance-metrics/

[^133]: https://github.com/fortedigital/nextjs-cache-handler

[^134]: https://www.npmjs.com/package/@google/gemini-cli

[^135]: https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/49bc1fe3dd70f36c8904bf45d0e2b942/0ff6b10e-0912-4d0d-93bc-918a3edd0671/a7d93986.md

