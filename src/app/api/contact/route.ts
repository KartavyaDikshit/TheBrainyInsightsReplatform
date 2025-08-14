import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/data/adapter';
import { EnquiryStatus } from '@prisma/client'; // Import EnquiryStatus

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(req: NextRequest) {
  const { name, email, company, message, locale } = await req.json();
  const newLead = await createLead({
    name,
    email,
    company,
    message,
    locale,
    status: EnquiryStatus.Unseen, // Explicitly set status
    reportId: null, // Set optional fields to null
    phone: null,
    jobTitle: null,
  });
  return NextResponse.json(newLead, { status: 202 });
}