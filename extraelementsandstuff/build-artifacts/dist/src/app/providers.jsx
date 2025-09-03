"use client";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
export function Providers({ children, messages, locale }) {
    return (<NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider>{children}</SessionProvider>
    </NextIntlClientProvider>);
}
