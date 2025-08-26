"use client";
import { signOut } from "next-auth/react";
import { useParams } from "next/navigation"; // Import useParams
export default function LogoutButton() {
    const params = useParams();
    const locale = params.locale;
    return (<button onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })} className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
      Sign Out
    </button>);
}
