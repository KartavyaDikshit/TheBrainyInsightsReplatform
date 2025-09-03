import { NextResponse } from 'next/server';
import { CategoryService } from '@/lib/db/categories';
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale') || 'en';
        const category = await CategoryService.getBySlug(slug, locale);
        if (!category) {
            const notFoundResponse = {
                success: false,
                error: 'Category not found',
                message: `No category found with slug: ${slug}`
            };
            return NextResponse.json(notFoundResponse, { status: 404 });
        }
        const response = {
            success: true,
            data: category
        };
        return NextResponse.json(response);
    }
    catch (error) {
        console.error('Category API error:', error);
        const errorResponse = {
            success: false,
            error: 'Failed to fetch category',
            message: error instanceof Error ? error.message : 'Unknown error'
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
