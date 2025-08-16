import { NextResponse } from 'next/server';
import { createLead } from '@/lib/data/adapter'; // This will now be a server-side import
import { Lead, EnquiryStatus, Locale } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate incoming data (basic validation, enhance as needed)
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'> = {
      name: body.name,
      email: body.email,
      company: body.company || null,
      message: body.message,
      status: EnquiryStatus.Unseen, // Default status
      locale: body.locale as Locale,
      reportId: body.reportId || null,
      phone: body.phone || null,
      jobTitle: body.jobTitle || null,
    };

    const newLead = await createLead(leadData);

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
