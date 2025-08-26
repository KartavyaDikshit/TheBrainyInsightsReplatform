import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/db/categories';
import type { ApiResponse } from '@/types/global';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const categories = await CategoryService.getAll(locale, {
      featured,
      limit,
      offset
    });

    const response: ApiResponse<typeof categories> = {
      success: true,
      data: categories,
      message: `Found ${categories.length} categories`
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Categories API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}