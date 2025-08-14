import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug } from '@/lib/data/adapter';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = req.nextUrl.searchParams.get('lang') || 'en';
  const category = await getCategoryBySlug(slug, lang);
  if (category) {
    return NextResponse.json(category);
  } else {
    return new NextResponse('Category not found', { status: 404 });
  }
}