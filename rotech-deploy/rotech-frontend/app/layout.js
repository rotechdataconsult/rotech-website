import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ui/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Rotech Data Consult — Monitor. Analyse. Thrive.",
  description: "Africa's data analytics academy. Learn Excel, SQL, Power BI, and Python. Analyse your business data with AI. Empowering individuals and businesses to compete in a data-driven economy.",
  keywords: "data analytics, Nigeria, Africa, Excel training, SQL course, Power BI, Python, business intelligence, LMS, EdTech",
  openGraph: {
    title: "Rotech Data Consult — Monitor. Analyse. Thrive.",
    description: "Learn data analytics and grow your business with AI-powered insights. Built for Africa.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotech Data Consult",
    description: "Africa's data analytics academy and business intelligence platform.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
