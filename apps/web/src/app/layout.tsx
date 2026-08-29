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
import { SUPPORT_EMAIL } from "@claimsaver/shared";

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

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "ClaimSaver+ — Florida PIP claim software",
    template: "%s | ClaimSaver+",
  },
  description:
    "Self-service software for Florida no-fault (PIP) claims: guided forms, secure storage, and tracking. Flat $500 platform access. Not a law firm.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "ClaimSaver+" },
  openGraph: {
    title: "ClaimSaver+ — Florida PIP claim software",
    description:
      "File your Florida no-fault claim. Keep what’s yours. Flat $500 guided software—you stay in control.",
    url,
    siteName: "ClaimSaver+",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/brand/claimsaver-og-share-1200x630.png",
        width: 1200,
        height: 630,
        alt: "ClaimSaver+ — Florida PIP claim software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimSaver+ — Florida PIP claim software",
    description:
      "File your Florida no-fault claim. Keep what’s yours. Flat $500 guided software—you stay in control.",
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
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "ClaimSaver+",
                url,
                email: SUPPORT_EMAIL,
                logo: `${url.replace(/\/$/, "")}/images/brand/claimsaver-plus-lockup.png`,
              }),
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
