import { NextResponse } from 'next/server';
import { PrismaClient, EnquiryStatus } from '@tbi/database/src/generated';
const prisma = new PrismaClient();
export async function GET() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
export async function POST(req) {
    try {
        const { firstName, lastName, email, phone, company, country, message, enquiryType, reportId } = await req.json();
        const newEnquiry = await prisma.enquiry.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                company,
                country,
                message,
                enquiryType,
                reportId,
                status: EnquiryStatus.NEW,
            },
        });
        return NextResponse.json(newEnquiry, { status: 202 });
    }
    catch (error) {
        console.error('Error creating enquiry:', error);
        return NextResponse.json({ error: 'Failed to create enquiry' }, { status: 500 });
    }
}
