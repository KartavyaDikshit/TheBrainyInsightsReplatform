import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Admin</h1>
      {children}
    </div>
  );
}
