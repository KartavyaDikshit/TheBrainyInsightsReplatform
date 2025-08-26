import { NextResponse } from 'next/server';
import { CategoryService } from '@/lib/db/categories';
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale') || 'en';
        const featured = searchParams.get('featured') === 'true';
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : undefined;
        const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')) : undefined;
        const categories = await CategoryService.getAll(locale, {
            featured,
            limit,
            offset
        });
        const response = {
            success: true,
            data: categories,
            message: `Found ${categories.length} categories`
        };
        return NextResponse.json(response);
    }
    catch (error) {
        console.error('Categories API error:', error);
        const errorResponse = {
            success: false,
            error: 'Failed to fetch categories',
            message: error instanceof Error ? error.message : 'Unknown error'
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
