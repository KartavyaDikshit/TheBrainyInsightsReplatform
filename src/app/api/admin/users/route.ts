import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth'; // Import auth from your auth.ts

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await auth(); // Get the session
  if (!session || session.user?.role !== 'ADMIN') { // Check if user is authenticated and is an ADMIN
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: 'User created successfully', user: { id: newUser.id, email: newUser.email, role: newUser.role } }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}