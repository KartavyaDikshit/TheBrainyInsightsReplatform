import { NextRequest, NextResponse } from 'next/server';
import { db } from '@tbi/database';

export async function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, company, country, message, enquiryType, reportId } = await req.json();

    const newEnquiry = await db.query(
      `INSERT INTO enquiries (
        first_name, last_name, email, phone, company, country, message, enquiry_type, report_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
      `,
      [firstName, lastName, email, phone, company, country, message, enquiryType, reportId, 'NEW']
    );

    return NextResponse.json(newEnquiry.rows[0], { status: 202 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({ error: 'Failed to create enquiry' }, { status: 500 });
  }
}