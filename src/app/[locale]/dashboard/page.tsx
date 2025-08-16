import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import LogoutButton from "./LogoutButton"

interface DashboardPageProps {
  params: any
  searchParams: any
}

export default async function Dashboard({ params }: DashboardPageProps) {
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
        <LogoutButton />
      </div>
    </div>
  )
}