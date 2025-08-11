import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || session.user?.role !== 'ADMIN') {
    redirect('/en/auth/signin'); // Redirect to sign-in if not authenticated or not admin
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {children}
    </div>
  );
}
