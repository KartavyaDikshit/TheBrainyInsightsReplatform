"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
  messages: any;
  locale: string;
}

export function Providers({ children, messages, locale }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider>{children}</SessionProvider>
    </NextIntlClientProvider>
  );
}
