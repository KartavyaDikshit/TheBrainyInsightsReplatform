import { NextResponse } from 'next/server';
import { db } from '@tbi/database'; // Import db client

export async function GET() {
  try {
    // Test database connection
    const result = await db.query('SELECT COUNT(*) as count FROM categories');
    const categoryCount = parseInt(result.rows[0].count);
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        categories: categoryCount
      },
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}