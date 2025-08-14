import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth'; // Use alias for auth.ts

const prisma = new PrismaClient();

export async function GET(request: Request) {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: Request) {
  // Manual fix: Bypass API logic during build phase
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({ message: 'API bypassed during build' }, { status: 200 });
  }

  const session = await auth();
  if (!session || session.user?.role !== 'Admin') { // Changed role check to 'Admin'
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json(); // Expect the ID of the AI queue item

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    // Update the status in AIGenerationQueue
    const updatedItem = await prisma.aIGenerationQueue.update({
      where: { id: id },
      data: { status: 'APPROVED' },
    });

    return NextResponse.json({ message: 'AI item approved', item: updatedItem }, { status: 200 });
  } catch (error) {
    console.error('Error approving AI item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
