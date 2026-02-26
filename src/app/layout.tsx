import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fabian Becker — Product Manager",
    template: "%s | Fabian Becker",
  },
  description:
    "Product Manager portfolio showcasing digital product work, technical projects, and case studies.",
  openGraph: {
    title: "Fabian Becker — Product Manager",
    description:
      "Product Manager portfolio showcasing digital product work, technical projects, and case studies.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <Header />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
          <ToastContainer />
        </LanguageProvider>
      </body>
    </html>
  );
}
