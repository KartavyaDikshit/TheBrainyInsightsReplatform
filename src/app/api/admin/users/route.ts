import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Added to prevent prerendering

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'User API bypassed for build debugging' }, { status: 200 });
}