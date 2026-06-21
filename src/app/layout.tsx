import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
import { GoogleProvider } from "@/components/providers/GoogleProvider";
import SupportButton from "@/components/SupportButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BRAND_KEYWORDS = [
  "HunarWalaa", "HunarWala", "Hunar Walaa", "Hunar Wala",
  "hunarwalaa", "hunarwala", "hunar walaa", "hunar wala", "hunar", "ہنروالا",
];

const STATIC_FALLBACK_KEYWORDS = [
  "Plumbing", "Electrical", "Cleaning", "Carpentry", "Tutoring",
  "Painting", "Home Repair", "AC Repair & Servicing", "Deep Cleaning",
  "Appliance Repair", "Pest Control", "Solar Installation",
];

const NEAR_ME_SUFFIXES = ["near me", "near me Pakistan", "in Pakistan", "in Lahore", "in Karachi", "in Islamabad"];
const HIRE_PREFIXES = ["hire", "book", "find"];

function buildCategoryKeywords(categoryNames: string[]): string[] {
  const keywords: string[] = [];
  for (const name of categoryNames) {
    keywords.push(name);
    for (const suffix of NEAR_ME_SUFFIXES) keywords.push(`${name} ${suffix}`);
    for (const prefix of HIRE_PREFIXES) keywords.push(`${prefix} ${name.toLowerCase()}`);
  }
  return keywords;
}

async function fetchCategories(): Promise<string[]> {
  try {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hunarwalaa.com').replace(/\/api$/i, '');
    const res = await fetch(`${apiBase}/skills/categories`, {
      next: { revalidate: 3600 }, // re-fetch every 1 hour
    });
    if (!res.ok) return STATIC_FALLBACK_KEYWORDS;
    const json = await res.json();
    return (json.data as { name: string }[]).map((c) => c.name);
  } catch {
    return STATIC_FALLBACK_KEYWORDS;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const categoryNames = await fetchCategories();
  const categoryKeywords = buildCategoryKeywords(categoryNames);

  const allKeywords = [
    ...BRAND_KEYWORDS,
    ...categoryKeywords,
    "home services Pakistan",
    "service provider near me",
    "skilled professionals Pakistan",
    "verified workers Pakistan",
    "online booking Pakistan",
    "skill marketplace Pakistan",
    "Pakistan home services app",
  ];

  return {
    title: "HunarWalaa — Find Skilled Professionals in Pakistan",
    description: "HunarWalaa (HunarWala) — Pakistan's #1 skill marketplace. Book verified plumbers, electricians, cleaners, mechanics and 20+ skilled professionals near you. Fast, safe and affordable home services across Pakistan.",
    keywords: allKeywords,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "HunarWalaa",
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      title: "HunarWalaa — Find Skilled Professionals in Pakistan",
      description: "Pakistan's #1 skill marketplace. Book verified plumbers, electricians, cleaners and 20+ professionals near you. Fast, safe and affordable.",
      url: "https://hunarwalaa.com",
      siteName: "HunarWalaa",
      locale: "en_PK",
      type: "website",
    },
    alternates: {
      canonical: "https://hunarwalaa.com",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://hunarwalaa.com/#organization",
      "name": "HunarWalaa",
      "alternateName": ["HunarWala", "Hunar Walaa", "Hunar Wala"],
      "url": "https://hunarwalaa.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hunarwalaa.com/logo.png",
      },
      "description": "Pakistan's #1 skill marketplace connecting clients with verified local professionals.",
      "areaServed": {
        "@type": "Country",
        "name": "Pakistan",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "url": "https://hunarwalaa.com/contact",
        "availableLanguage": ["English", "Urdu"],
      },
      "sameAs": [
        "https://www.facebook.com/hunarwalaa",
        "https://www.instagram.com/hunarwalaa",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://hunarwalaa.com/#website",
      "url": "https://hunarwalaa.com",
      "name": "HunarWalaa",
      "publisher": { "@id": "https://hunarwalaa.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://hunarwalaa.com/services?skill={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://hunarwalaa.com/#localbusiness",
      "name": "HunarWalaa",
      "description": "Book verified plumbers, electricians, cleaners and 20+ skilled professionals near you across Pakistan.",
      "url": "https://hunarwalaa.com",
      "logo": "https://hunarwalaa.com/logo.png",
      "image": "https://hunarwalaa.com/logo.png",
      "telephone": "+92-323-019-6061",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Blue Area",
        "addressLocality": "Islamabad",
        "addressRegion": "Islamabad Capital Territory",
        "postalCode": "44000",
        "addressCountry": "PK",
      },
      "areaServed": [
        { "@type": "City", "name": "Lahore" },
        { "@type": "City", "name": "Karachi" },
        { "@type": "City", "name": "Islamabad" },
        { "@type": "City", "name": "Rawalpindi" },
        { "@type": "City", "name": "Faisalabad" },
        { "@type": "City", "name": "Peshawar" },
        { "@type": "City", "name": "Multan" },
        { "@type": "City", "name": "Quetta" },
        { "@type": "City", "name": "Mardan" },
      ],
      "serviceType": [
        "Plumbing", "Electrical", "AC Repair", "Cleaning", "Carpentry",
        "Painting", "Tutoring", "Pest Control", "Solar Installation",
        "Home Repair", "Appliance Repair", "Deep Cleaning",
      ],
      "priceRange": "Rs-RsRs",
      "currenciesAccepted": "PKR",
      "paymentAccepted": "Cash",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <GoogleProvider>
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

                {/* Floating support button — desktop only */}
                <SupportButton />

                {/* Mobile bottom tab bar — hidden on desktop */}
                <BottomNav />
                <Analytics />
                <SpeedInsights />
              </NotificationsProvider>
            </SocketProvider>
          </AuthRouteWatcher>
        </QueryProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
