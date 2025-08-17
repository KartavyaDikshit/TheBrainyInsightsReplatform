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
  private circuitBreakerOpen = false;
  private lastAttemptTimestamp = 0;
  private cooldownPeriod = 5000; // 5 seconds
  private failedAttempts = 0;
  private maxFailedAttempts = 3;

  private constructor() {}

  static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  async connect(): Promise<boolean> {
    if (this.isConnected) return true; // Already connected

    const now = Date.now();
    if (this.circuitBreakerOpen && (now - this.lastAttemptTimestamp < this.cooldownPeriod)) {
      console.warn('[Redis] Circuit breaker is open. Skipping connection attempt.');
      return false; // Circuit breaker is open, don't try to connect
    }

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
        this.failedAttempts++;
        this.lastAttemptTimestamp = Date.now();
        if (this.failedAttempts >= this.maxFailedAttempts) {
          this.circuitBreakerOpen = true;
          console.warn('[Redis] Circuit breaker opened due to multiple failures.');
        }
      });

      this.client.on('connect', () => {
        console.log('[Redis] Client connected successfully');
        this.isConnected = true;
        this.circuitBreakerOpen = false; // Reset circuit breaker on successful connection
        this.failedAttempts = 0;
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
      this.failedAttempts++;
      this.lastAttemptTimestamp = Date.now();
      if (this.failedAttempts >= this.maxFailedAttempts) {
        this.circuitBreakerOpen = true;
        console.warn('[Redis] Circuit breaker opened due to multiple failures.');
      }
      return false; // Connection failed
    }
  }

  getClient(): RedisClientType | null {
    if (!this.isConnected) {
      return null;
    }
    return this.client;
  }

  getIORedisClient(): Redis | null {
    if (!this.isConnected) {
      return null;
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
    this.circuitBreakerOpen = false;
    this.failedAttempts = 0;
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

export const redisManager = RedisManager.getInstance();
export default redisManager;
