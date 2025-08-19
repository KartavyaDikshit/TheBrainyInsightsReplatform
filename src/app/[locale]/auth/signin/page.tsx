"use client"; // Mark as client component

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useParams } from "next/navigation"; // Import useParams
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const locale = params.locale as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      // Redirect to home or dashboard on success, preserving locale
            window.location.href = `/${locale}/`; // Redirect to home or dashboard on success, preserving locale
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: `/${locale}/` })}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#24292F]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.0003 4.75C14.0503 4.75 15.8303 5.45 17.2403 6.86L20.0003 4.1C17.9003 2 15.1003 0.75 12.0003 0.75C7.27031 0.75 3.19031 3.44 1.28031 7.5H4.63031C5.65031 5.05 8.50031 4.75 12.0003 4.75Z" fill="#EA4335" />
                    <path d="M23.25 12.0003C23.25 11.2003 23.18 10.4003 23.04 9.63031H12.25V14.3703H18.69C18.41 15.8903 17.58 17.1603 16.32 18.0303L19.06 20.7703C20.72 19.1103 21.99 16.7003 22.67 14.0003H23.25V12.0003Z" fill="#4285F4" />
                    <path d="M12.25 23.25C15.1003 23.25 17.5003 22.31 19.0603 20.77L16.3203 18.03C15.1603 18.84 13.7903 19.37 12.2503 19.37C8.50031 19.37 5.65031 18.07 4.63031 15.62L1.28031 18.37C3.19031 22.44 7.27031 23.25 12.2503 23.25Z" fill="#FBBC04" />
                    <path d="M0.75 12.0003C0.75 11.2003 0.88 10.4003 1.12 9.63031L4.47 6.88031C3.80031 8.54031 3.44031 10.2003 3.44031 12.0003C3.44031 13.8003 3.80031 15.4603 4.47031 17.1203L1.12031 14.3703C0.880312 13.6003 0.75 12.8003 0.75 12.0003Z" fill="#34A853" />
                  </svg>
                  <span className="text-sm font-semibold leading-6">Google</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: `/${locale}/` })}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#24292F]"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017 2 16.485 4.856 20.113 8.53 21.41c.5.092.646-.217.646-.483 0-.237-.007-.866-.012-1.703-2.754.598-3.333-1.259-3.333-1.259-.44-.118-.902-.371-1.098-.633-.36-.44-.027-.432.25-.421.3.042.462.145.623.283.337.52.893.46 1.113.35.035-.27.137-.46.25-.562-2.219-.259-4.554-1.133-4.554-4.931 0-1.09.39-1.98 1.029-2.681-.103-.25-.446-1.274.098-2.65 0 0 .84-.268 2.75 1.025A9.428 9.428 0 0112 6.83c.85.004 1.7.115 2.5.324 1.909-1.293 2.747-1.025 2.747-1.025.546 1.376.202 2.4-.102 2.651.64.701 1.028 1.591 1.028 2.681 0 3.79-2.339 4.666-4.566 4.92-.143.124-.27.38-.27.764 0 1.09.01 1.979.01 2.24 0 .268.153.576.655.483C19.141 20.11 22 16.485 22 12.017 22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link href={`/${locale}/auth/signup`} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}