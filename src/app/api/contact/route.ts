import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/data/adapter';

export async function POST(req: NextRequest) {
  const { name, email, company, message, locale } = await req.json();
  const newLead = await createLead({ name, email, company, message, locale });
  return NextResponse.json(newLead, { status: 202 });
}