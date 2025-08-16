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

  async connect(): Promise<boolean> {
    if (this.isConnected) return true; // Already connected

    try {
      console.log("REDIS_PASSWORD in redis-client:", process.env.REDIS_PASSWORD);

      const url = process.env.REDIS_URL || 'redis://localhost:6379';
      const password = process.env.REDIS_PASSWORD;

      const clientOptions: any = {
        url,
        socket: {
          reconnectStrategy: (retries: number) => {
            // Only retry a few times during build to avoid excessive logging
            if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
              if (retries < 3) {
                return Math.min(retries * 50, 500);
              }
            }
            return false; // Do not retry further
          }
        }
      };

      if (password) {
        clientOptions.password = password;
      }

      this.client = createClient(clientOptions);

      const ioredisOptions: any = {
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        lazyConnect: true
      };

      if (password) {
        ioredisOptions.password = password;
      }

      this.ioredisClient = new Redis(url, ioredisOptions);


      this.client.on('error', (error) => {
        console.error('[Redis Client Error]', {
          error: error.message,
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
        this.isConnected = false; // Ensure connection status is updated on error
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
      return true; // Connection successful

    } catch (error) {
      console.error('[Redis] Connection failed:', error);
      this.isConnected = false; // Ensure connection status is updated on failure
      return false; // Connection failed
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
