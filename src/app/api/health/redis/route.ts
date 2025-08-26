import { NextResponse } from 'next/server';
import { redisManager } from 'C:/Users/User/TheBrainyInsightsReplatform/packages/lib/src/redis-client'; // Changed import path

export async function GET() {
  const redisConnected = await redisManager.connect();
  if (!redisConnected) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Redis client not connected'
    }, { status: 500 });
  }

  try {
    const client = redisManager.getClient();
    if (!client) {
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Redis client not available'
      }, { status: 500 });
    }
    
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
      nextjs_cache: await (client.eval as any)("return #redis.call('keys', 'next-shared-cache*')", 0) as number,
      api_cache: await (client.eval as any)("return #redis.call('keys', 'api:*')", 0) as number,
      prisma_cache: await (client.eval as any)("return #redis.call('keys', 'prisma:*')", 0) as number,
      session_cache: await (client.eval as any)("return #redis.call('keys', 'user:*')", 0) as number,
    };

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      redis: metrics,
      cache_distribution: cacheKeysCount,
      total_cached_items: Object.values(cacheKeysCount).reduce((a, b) => a + b, 0)
    };

    return NextResponse.json(health);

  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 });
  }
}

function extractValue(info: string, key: string): string | number {
  const match = info.match(new RegExp(`${key}:(\S+)`));
  return match ? (isNaN(Number(match[1])) ? match[1] : Number(match[1])) : 'N/A';
}

function calculateHitRate(hits: any, misses: any): string {
  const h = Number(hits) || 0;
  const m = Number(misses) || 0;
  const total = h + m;
  return total > 0 ? ((h / total) * 100).toFixed(2) + '%' : '0%';
}