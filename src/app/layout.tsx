import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { ToasterProvider } from "@/components/providers/ToasterProvider";
import Navbar from "@/components/layout/Navbar";
import MobileHeader from "@/components/layout/MobileHeader";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { AuthRouteWatcher } from "@/components/providers/AuthRouteWatcher";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HunarWala - Find Expert Helpers",
  description: "Connect with skilled professionals like Plumbers, Electricians, and more.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HunarWala",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <QueryProvider>
          <ToasterProvider />
          <AuthRouteWatcher>
            <SocketProvider>
              <NotificationsProvider>
                {/* Desktop nav — hidden on mobile */}
                <Navbar />
                {/* Mobile header — hidden on desktop */}
                <MobileHeader />

                <main className="flex-grow pt-14 md:pt-16 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
                  {children}
                </main>

                {/* Desktop footer — hidden on mobile */}
                <div className="hidden md:block">
                  <Footer />
                </div>

                {/* Mobile bottom tab bar — hidden on desktop */}
                <BottomNav />
                <Analytics />
              </NotificationsProvider>
            </SocketProvider>
          </AuthRouteWatcher>
        </QueryProvider>
      </body>
    </html>
  );
}
