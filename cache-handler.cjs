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
      console.log("REDIS_PASSWORD in cache-handler:", process.env.REDIS_PASSWORD);

      const clientOptions = {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        socket: {
          reconnectStrategy: (retries) => {
            logCacheOperation('RECONNECT_ATTEMPT', 'redis', { retries });
            return retries < 3 ? Math.min(retries * 50, 500) : false;
          }
        }
      };

      if (process.env.REDIS_PASSWORD) {
        clientOptions.password = process.env.REDIS_PASSWORD;
      }

      this.client = createClient(clientOptions);

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
