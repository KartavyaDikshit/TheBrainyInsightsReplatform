import { NextRequest, NextResponse } from 'next/server';
import { redisManager } from '@/packages/lib/src/redis-client';

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

    const logEntry = `
[${new Date().toISOString()}] MANUAL_INVALIDATION: pattern=${pattern}, tags=${tags}, deleted=${deletedKeys}`;
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