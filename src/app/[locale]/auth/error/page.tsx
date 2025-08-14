"use client";

import { useSearchParams, useParams } from "next/navigation"; // Import useParams
import Link from "next/link"; // Import Link

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const params = useParams();
  const locale = params.locale as string;

  const errorMap: Record<string, string> = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailSignin: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
    EmailCreateAccount: "Try signing in with a different account.",
    CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Please sign in to access this page.",
    default: "Unable to sign in.",
  };
  const errorMessage = errorMap[error as string] || errorMap.default;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Authentication Error
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-red-500 text-center">{errorMessage}</p>
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href={`/${locale}/auth/signin`} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Return to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}