import type { Metadata } from "next";
import GenerativeAIQuiltDesignClient from "./GenerativeAIQuiltDesignClient";

export const metadata: Metadata = {
  title: "Generative AI Quilt Design - Create Unique Quilt Patterns with AI | SwapMyLook",
  description: "Generate beautiful, unique quilt patterns using artificial intelligence. Free AI quilt design tool for quilters, designers, and craft enthusiasts. Create custom quilt designs in seconds.",
  keywords: ["AI quilt design", "generative AI quilt design", "quilt patterns", "quilt maker", "AI design tool", "custom quilt patterns", "free quilt design", "ai quilt maker"],
  openGraph: {
    title: "Generative AI Quilt Design - Create Unique Quilt Patterns with AI | SwapMyLook",
    description: "Generate beautiful, unique quilt patterns using artificial intelligence. Free AI quilt design tool for quilters, designers, and craft enthusiasts.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Generative AI Quilt Design - Create Unique Quilt Patterns with AI | SwapMyLook",
    description: "Generate beautiful, unique quilt patterns using artificial intelligence. Free AI quilt design tool.",
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

export default function GenerativeAIQuiltDesignPage() {
  return <GenerativeAIQuiltDesignClient />;
}