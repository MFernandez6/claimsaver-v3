import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import { FourteenDayBanner } from "@/components/fourteen-day-banner";
import { ProductionTestingNotice } from "@/components/production-testing-notice";
import { AppProviders } from "@/components/app-providers";
import { siteUrl } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { PATIENT_PRICE_USD } from "@claimsaver/shared";
import { organizationJsonLd } from "@/lib/seo/json-ld";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d9488",
};

const url = siteUrl();

const defaultTitle = "File a Florida PIP claim yourself | ClaimSaver+";
const defaultDescription = `Self-help software for Florida PIP after a crash: file no-fault paperwork yourself. Guided forms, vault, 14-day reminders. Flat $${PATIENT_PRICE_USD}. Not a law firm.`;

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: defaultTitle,
    template: "%s | ClaimSaver+",
  },
  description: defaultDescription,
  keywords: [
    "file PIP claim Florida",
    "Florida no-fault claim",
    "PIP claim without a lawyer",
    "Florida PIP 14 day rule",
    "file your own PIP claim",
    "car accident PIP benefits Florida",
    "lawyer won't take my PIP claim",
    "Florida PIP paperwork",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "ClaimSaver+" },
  openGraph: {
    title: defaultTitle,
    description:
      `Hurt in a Florida crash? File your no-fault (PIP) claim yourself. Flat $${PATIENT_PRICE_USD}. You stay the filer.`,
    url,
    siteName: "ClaimSaver+",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/brand/claimsaver-og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "File a Florida PIP claim yourself with ClaimSaver+",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description:
      `Hurt in a Florida crash? File your no-fault (PIP) claim yourself. Flat $${PATIENT_PRICE_USD}. You stay the filer.`,
    images: ["/images/brand/claimsaver-og-share-1200x630.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${plusJakarta.variable} antialiased`}>
        <AppProviders>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd()),
            }}
          />
          <div className="min-h-screen min-w-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30 print:min-h-0 print:bg-white">
            <div className="print:hidden">
              <Navbar />
            </div>
            <main className="min-w-0 w-full overflow-x-hidden pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-[max(1rem,env(safe-area-inset-bottom))] print:overflow-visible print:p-0 print:pt-0">
              <div className="print:hidden">
                <ProductionTestingNotice />
                <FourteenDayBanner />
              </div>
              {children}
            </main>
            <div className="print:hidden">
              <Footer />
            </div>
          </div>
          <Analytics />
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
