import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/db/categories';
import type { ApiResponse } from '@/types/global';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    const category = await CategoryService.getBySlug(slug, locale);

    if (!category) {
      const notFoundResponse: ApiResponse<null> = {
        success: false,
        error: 'Category not found',
        message: `No category found with slug: ${slug}`
      };
      return NextResponse.json(notFoundResponse, { status: 404 });
    }

    const response: ApiResponse<typeof category> = {
      success: true,
      data: category
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Category API error:', error);
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch category',
      message: error instanceof Error ? error.message : 'Unknown error'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}