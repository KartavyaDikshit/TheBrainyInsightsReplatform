import { NextResponse } from 'next/server';
import { listAIQueue } from '@/lib/data/adapter';

export async function GET() {
  const items = await listAIQueue();
  return NextResponse.json(items);
}