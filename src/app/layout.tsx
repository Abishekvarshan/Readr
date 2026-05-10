import type { Metadata } from "next";
import { FirebaseSessionSync } from "@/components/auth/firebase-session-sync";
import { DevServiceWorkerCleanup } from "@/components/layout/dev-service-worker-cleanup";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Readr | Second-hand Book Marketplace",
  description:
    "A mobile-first marketplace for browsing and buying second-hand books.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <DevServiceWorkerCleanup />
        <FirebaseSessionSync />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
