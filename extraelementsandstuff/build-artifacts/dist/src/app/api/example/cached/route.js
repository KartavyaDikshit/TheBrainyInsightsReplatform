"use strict";
// import { NextRequest, NextResponse } from 'next/server'; // Commented out
// import { withCache } from 'C:/Users/User/TheBrainyInsightsReplatform/packages/lib/src/api-cache-middleware'; // Commented out
/* Commented out the entire class
export class ExampleAPI {
  @withCache({
    ttl: 600, // 10 minutes
    tags: ['examples', 'api-data'],
    keyGenerator: (req: NextRequest) => `api:example:${req.nextUrl.searchParams.get('id') || 'default'}` // Added type for req
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
    const { invalidateCache } = await import('C:/Users/User/TheBrainyInsightsReplatform/packages/lib/src/api-cache-middleware'); // Changed import path
    await invalidateCache('api:example:*');
    
    return NextResponse.json({ success: true, body });
  }
}

export const GET = ExampleAPI.GET;
export const POST = ExampleAPI.POST;
*/ 
