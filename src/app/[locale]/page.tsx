import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth";

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Welcome to TheBrainyInsights Replatform!
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm text-center">
        {!session ? (
          <p>
            <Link href={`/${locale}/auth/signin`} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        ) : (
          <p>
            You are logged in. Go to your{' '}
            <Link href={`/${locale}/dashboard`} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Dashboard
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}