import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwapMyLook - Free AI Outfit Changer & Virtual Try-On",
  description: "Transform your photos instantly with our powerful AI outfit changer technology. Try on outfits virtually with perfect fit and realistic lighting.",
  keywords: ["AI fashion", "virtual try-on", "outfit changer", "photo editing", "fashion visualization"],
  verification: {
    google: "ZgQb14abdw4YYRrs2mfWq6OqlRKJuyJg_14Aq7ug3tU",
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "SwapMyLook - Free AI Outfit Changer & Virtual Try-On",
    description: "Transform your photos instantly with our powerful AI outfit changer technology.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50`}>
        {/* Google Tag (gtag.js) */}
        <GoogleAnalytics gaId="G-S45Y9V291E" />
        <div className="min-h-svh overflow-auto">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            duration={4000}
            expand={true}
            richColors
            closeButton
            visibleToasts={3}
          />
        </div>
      </body>
    </html>
  );
}
