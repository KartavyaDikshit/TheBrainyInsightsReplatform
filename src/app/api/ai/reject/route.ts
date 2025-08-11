import { NextRequest, NextResponse } from 'next/server';
import { rejectAIItem } from '@/lib/data/adapter';

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  const updatedItem = await rejectAIItem(id);
  if (updatedItem) {
    return NextResponse.json(updatedItem);
  } else {
    return new NextResponse('AI item not found', { status: 404 });
  }
}