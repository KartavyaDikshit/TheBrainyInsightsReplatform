import { NextRequest, NextResponse } from 'next/server';
import { getReportBySlug } from '@/lib/data/adapter';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;
  const lang = req.nextUrl.searchParams.get('lang') || 'en';
  const report = await getReportBySlug(slug, lang);
  if (report) {
    return NextResponse.json(report);
  } else {
    return new NextResponse('Report not found', { status: 404 });
  }
}