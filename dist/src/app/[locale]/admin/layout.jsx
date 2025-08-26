import React from 'react';
// Removed auth and redirect as middleware handles it
export const dynamic = 'force-dynamic';
export default async function AdminLayout({ children }) {
    // No need for auth() or redirect here, middleware ensures user is admin
    return (<div>
      {/* The h1 here is from the original layout, it will be styled by admin.module.css in page.tsx */}
      {children}
    </div>);
}
