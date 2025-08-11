import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
// import { auth } from '@/auth'; // Import auth from your auth.ts

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(request: Request) {
  // const session = await auth();
  // if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'EDITOR')) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

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

    // Optionally, move the content to reports/report_translations here
    // This part needs more logic based on your schema and requirements
    // For example:
    // const reportContent = JSON.parse(updatedItem.outputJson);
    // await prisma.report.create({ data: { ... } });
    // await prisma.reportTranslation.create({ data: { ... } });

    return NextResponse.json({ message: 'AI item approved', item: updatedItem }, { status: 200 });
  } catch (error) {
    console.error('Error approving AI item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}