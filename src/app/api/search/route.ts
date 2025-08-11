import { NextRequest, NextResponse } from 'next/server';
import { search } from '@/lib/data/adapter';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const lang = req.nextUrl.searchParams.get('lang') || 'en';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const size = parseInt(req.nextUrl.searchParams.get('size') || '10');
  const results = await search({ q, locale: lang, page, size });
  return NextResponse.json(results);
}