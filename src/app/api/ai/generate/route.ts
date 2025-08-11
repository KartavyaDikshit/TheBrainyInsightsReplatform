import { NextRequest, NextResponse } from 'next/server'
import { getConfig } from '@/lib/data/adapter'

export async function POST(req: NextRequest) {
  const { sourceDocId, reportId, locale, prompt } = await req.json()
  const { demo } = getConfig();

  if (demo) {
    // In demo mode, this is a no-op
    console.log('AI generation request received in demo mode (no-op):', { sourceDocId, reportId, locale, prompt });
    return new NextResponse('AI generation request accepted (demo mode)', { status: 202 });
  } else {
    // TODO: Switch back when Prisma is enabled.
    // Implement actual database call here
    return new NextResponse('AI generation not implemented in non-demo mode', { status: 501 });
  }
}