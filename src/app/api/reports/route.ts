import { NextRequest, NextResponse } from 'next/server';
import { ReportService } from '@/lib/db/reports';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get all reports
    const { reports } = await ReportService.getAll(locale, {
      limit,
      sortBy: 'title',
      sortOrder: 'asc'
    });

    // Filter by search term if provided
    let filteredReports = reports;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredReports = reports.filter(report => 
        report.title?.toLowerCase().includes(searchLower) ||
        report.translated_title?.toLowerCase().includes(searchLower)
      );
    }

    // Map to simplified format for dropdown
    const simplifiedReports = filteredReports.map(report => ({
      id: report.id,
      title: report.translated_title || report.title,
      slug: report.translated_slug || report.slug,
      category: report.category_title
    }));

    return NextResponse.json({
      success: true,
      reports: simplifiedReports,
      total: simplifiedReports.length
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

