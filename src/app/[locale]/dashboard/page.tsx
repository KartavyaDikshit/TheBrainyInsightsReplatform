import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton"

interface DashboardPageProps {
  params: Promise<any>
  searchParams: Promise<any>
}

export default async function Dashboard(props: DashboardPageProps) {
  const params = await props.params;
  const { locale } = params
  const session = await auth()

  if (!session) {
    redirect(`/${locale}/auth/signin`)
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
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
        <h3 className="text-xl font-bold mb-4">Quick Access Widgets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">My Reports</h4>
            <p className="text-gray-600">View your recently accessed reports.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">Saved Searches</h4>
            <p className="text-gray-600">Access your saved search queries.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-gray-600">Check your latest notifications.</p>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
        <h3 className="text-xl font-bold mb-4">Activity Timeline</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <ul className="space-y-2">
            <li className="text-gray-700">- Accessed "Global Market Report 2024" (2 hours ago)</li>
            <li className="text-gray-700">- Saved search: "AI in Healthcare" (yesterday)</li>
            <li className="text-gray-700">- Downloaded "Q3 Financial Analysis" (3 days ago)</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <LogoutButton />
      </div>
    </div>
  )
}