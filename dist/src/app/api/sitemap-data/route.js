import { NextResponse } from 'next/server';
import { listSitemapEntries } from '@/lib/data/adapter';
export async function GET() {
    const urls = await listSitemapEntries();
    return NextResponse.json(urls);
}
