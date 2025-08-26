import { NextResponse } from 'next/server';
import { redisManager } from 'C:/Users/User/TheBrainyInsightsReplatform/packages/lib/src/redis-client'; // Changed import path
export async function GET() {
    const redisConnected = await redisManager.connect();
    if (!redisConnected) {
        return NextResponse.json({
            error: 'Redis client not connected',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
    const client = redisManager.getClient();
    if (!client) {
        return NextResponse.json({
            error: 'Redis client not available',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
    try {
        // Get comprehensive Redis metrics
        const info = await client.info('all');
        const slowlog = await client.eval("return redis.call('slowlog', 'get', 10)", 0);
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
            slow_queries: slowlog.map((log) => ({
                id: log[0],
                timestamp: log[1],
                duration: log[2],
                command: log[3],
                client: log[4] || 'unknown'
            }))
        };
        return NextResponse.json({
            timestamp: new Date().toISOString(),
            metrics,
            alerts: generateAlerts(metrics)
        });
    }
    catch (error) {
        return NextResponse.json({
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
function parseSection(info, section) {
    const result = {};
    const sectionRegex = new RegExp(`# ${section}\r?\n([\s\S]*?)(?=\r?\n# |$)`, 'i');
    const match = info.match(sectionRegex);
    if (match) {
        const lines = match[1].split('\n');
        for (const line of lines) {
            const [key, value] = line.split(':');
            if (key && value !== undefined) {
                result[key.trim()] = isNaN(Number(value)) ? value.trim() : Number(value);
            }
        }
    }
    return result;
}
function generateAlerts(metrics) {
    const alerts = [];
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
