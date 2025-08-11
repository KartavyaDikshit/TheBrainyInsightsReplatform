import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
  // const session = await auth();
  // if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const queue = await prisma.aIGenerationQueue.findMany({
      where: { status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(queue);
  } catch (error) {
    console.error('Error fetching AI queue:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}