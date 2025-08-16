import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth'; // Use alias for auth.ts

export const dynamic = 'force-dynamic'; // Added to prevent prerendering

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Manual fix: Bypass API logic during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ message: 'API bypassed during build' }, { status: 200 });
  }

  const session = await auth();
  if (!session || session.user?.role !== 'Admin') { // Changed role check to 'Admin'
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all items from AIGenerationQueue that are pending review
    const stagedItems = await prisma.aIGenerationQueue.findMany({
      where: {
        status: 'PENDING_REVIEW',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(stagedItems, { status: 200 });
  } catch (error) {
    console.error('Error fetching staged AI items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
