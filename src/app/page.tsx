import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { homePageSEO } from "@/lib/seo.config";

export const metadata: Metadata = {
  ...homePageSEO,
  keywords: ["AI Outfit Changer", "swapmylook" , "virtual try-on", "outfit changer", "AI clothes changer", "virtual outfit try-on", "fashion AI"],
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

export default function Home() {
  return <HomeClient />;
}