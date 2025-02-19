import type { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { SessionProvider } from "next-auth/react";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TanstackProviders } from "@/libs/query-provider";
import { ToastProvider } from "@/components/ui/toast";

const geistSans = Space_Grotesk({
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
            <ToastProvider />
          </TanstackProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
