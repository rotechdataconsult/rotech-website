import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ui/ChatWidget";
import Analytics from "@/components/marketing/Analytics";
import { SITE } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const TITLE = "Rotech Data Consult | Data, AI & Tech Training in Abuja, Nigeria";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: "%s | Rotech Data Consult",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "data analytics training Nigeria",
    "data analysis course Abuja",
    "Python course Nigeria",
    "AI automation training",
    "Power BI training Abuja",
    "cyber security course Nigeria",
    "UI/UX design course",
    "business data consulting Nigeria",
    "Rotech Data Consult",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "education",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    locale: "en_NG",
    title: TITLE,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
  },
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
  // Google Search Console: set NEXT_PUBLIC_GSC_VERIFICATION to the code from the HTML-tag method.
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport = {
  themeColor: "#683AA6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NG">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
