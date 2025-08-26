import { NextResponse } from 'next/server';
import { getReportBySlug } from '@/lib/data/adapter';
export async function GET(req, { params }) {
    const { slug } = await params;
    const lang = req.nextUrl.searchParams.get('lang') || 'en';
    const report = await getReportBySlug(slug, lang);
    if (report) {
        return NextResponse.json(report);
    }
    else {
        return new NextResponse('Report not found', { status: 404 });
    }
}
