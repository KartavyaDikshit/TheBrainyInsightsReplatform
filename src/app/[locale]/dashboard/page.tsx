import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

interface DashboardPageProps {
  params: any; // Use any to bypass type checking for params
  searchParams: any; // Add searchParams to match Next.js PageProps structure, even if not used
}

export default async function Dashboard({ params }: DashboardPageProps) {
  const { locale } = params; // Destructure locale from params

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/auth/signin`); // Redirect to sign-in page with locale
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Welcome to your Dashboard, {session.user?.name || session.user?.email}!
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <p className="text-gray-700">You are logged in as {session.user?.role}.</p>
        <LogoutButton />
      </div>
    </div>
  );
}