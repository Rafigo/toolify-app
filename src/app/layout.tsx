import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { Manrope } from "next/font/google";
import "./globals.css";
import { TanstackProviders } from "@/libs/query-provider";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Manrope({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} antialiased bg-gray-50 text-gray-800`}
      >
        <NextIntlClientProvider messages={messages}>
          <TanstackProviders>
            <SessionProvider>{children}</SessionProvider>
            <Toaster />
          </TanstackProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
