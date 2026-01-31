import type { Metadata } from "next";
import ToolsClient from "./ToolsClient";

export const metadata: Metadata = {
  title: "Developer & Design Tools - SwapMyLook",
  description: "Free collection of handy tools for developers, designers, and content creators. Color pickers, image resizers, URL shorteners, character counters, and more.",
  keywords: ["developer tools", "design tools", "free tools", "color picker", "image resizer", "URL shortener", "character counter", "QR code generator"],
  openGraph: {
    title: "Developer & Design Tools - SwapMyLook",
    description: "Free collection of handy tools for developers, designers, and content creators.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer & Design Tools - SwapMyLook",
    description: "Free collection of handy tools for developers, designers, and content creators.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}