import type { Metadata } from 'next';

export const homePageSEO: Metadata = {
  title: "AI Clothes Changer & Virtual Outfit Try-On | SwapMyLook",
  description:
    "Try clothes online using SwapMyLook's AI outfit changer. Upload your photo and clothing image to swap outfits instantly with realistic virtual try-on results.",
  openGraph: {
    title: "AI Clothes Changer & Virtual Outfit Try-On | SwapMyLook",
    description: "Try clothes online using SwapMyLook's AI outfit changer. Upload your photo and clothing image to swap outfits instantly with realistic virtual try-on results.",
    type: "website",
    url: "https://swapmylook.com/",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Clothes Changer & Virtual Outfit Try-On | SwapMyLook",
    description: "Try clothes online using SwapMyLook's AI outfit changer.",
  },
};

export const aboutPageSEO: Metadata = {
  title: "About SwapMyLook – AI Clothes Changer Technology",
  description:
    "Learn how SwapMyLook uses advanced AI to swap clothes in photos and create realistic virtual outfit try-on experiences.",
  openGraph: {
    title: "About SwapMyLook – AI Clothes Changer Technology",
    description: "Learn how SwapMyLook uses advanced AI to swap clothes in photos and create realistic virtual outfit try-on experiences.",
    type: "website",
    url: "https://swapmylook.com/about",
  },
};

export const contactPageSEO: Metadata = {
  title: "Contact SwapMyLook – AI Outfit Changer Support",
  description:
    "Get in touch with SwapMyLook for support, partnerships, or questions about our AI clothes changer and virtual try-on platform.",
  openGraph: {
    title: "Contact SwapMyLook – AI Outfit Changer Support",
    description: "Get in touch with SwapMyLook for support, partnerships, or questions about our AI clothes changer and virtual try-on platform.",
    type: "website",
    url: "https://swapmylook.com/contact",
  },
};

export const aiClothesChangerSEO: Metadata = {
  title: "AI Clothes Changer – Swap Clothes in Photos Instantly | SwapMyLook",
  description:
    "Upload photo + upload outfit → instant realistic results. Free AI clothes changer for fashion creators, e-commerce sellers & shoppers. Try now!",
  openGraph: {
    title: "AI Clothes Changer – Swap Clothes in Photos Instantly | SwapMyLook",
    description: "Upload photo + upload outfit → instant realistic results. Free AI clothes changer for fashion creators, e-commerce sellers & shoppers. Try now!",
    type: "website",
    url: "https://swapmylook.com/ai-clothes-changer",
  },
};

export const toolsPageSEO: Metadata = {
  title: "Developer & Design Tools - SwapMyLook",
  description:
    "Free collection of handy tools for developers, designers, and content creators. Color pickers, image resizers, URL shorteners, character counters, and more.",
  openGraph: {
    title: "Developer & Design Tools - SwapMyLook",
    description: "Free collection of handy tools for developers, designers, and content creators. Color pickers, image resizers, URL shorteners, character counters, and more.",
    type: "website",
    url: "https://swapmylook.com/tools",
  },
};

export const generativeAIQuiltDesignSEO: Metadata = {
  title: "Generative AI Quilt Design - Create Unique Quilt Patterns with AI | SwapMyLook",
  description:
    "Generate beautiful, unique quilt patterns using artificial intelligence. Free AI quilt design tool for quilters, designers, and craft enthusiasts. Create custom quilt designs in seconds.",
  openGraph: {
    title: "Generative AI Quilt Design - Create Unique Quilt Patterns with AI | SwapMyLook",
    description: "Generate beautiful, unique quilt patterns using artificial intelligence. Free AI quilt design tool for quilters, designers, and craft enthusiasts. Create custom quilt designs in seconds.",
    type: "website",
    url: "https://swapmylook.com/tools/generative-ai-quilt-design",
  },
};

export const blogPageSEO: Metadata = {
  title: "AI Fashion Blog – Latest Trends, Tips & Technology | SwapMyLook",
  description:
    "Explore the SwapMyLook blog for insights on AI fashion, virtual try-on technology, style tips, and industry trends. Stay updated with the latest in fashion tech.",
  openGraph: {
    title: "AI Fashion Blog – Latest Trends, Tips & Technology | SwapMyLook",
    description: "Explore the SwapMyLook blog for insights on AI fashion, virtual try-on technology, style tips, and industry trends. Stay updated with the latest in fashion tech.",
    type: "website",
    url: "https://swapmylook.com/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fashion Blog – Latest Trends, Tips & Technology | SwapMyLook",
    description: "Explore insights on AI fashion, virtual try-on technology, and style tips.",
  },
};

export const blogDetailPageSEO = (postTitle?: string, postExcerpt?: string, postImage?: string): Metadata => {
  const title = postTitle
    ? `${postTitle} – AI Fashion Blog | SwapMyLook`
    : "Blog Post – AI Fashion Blog | SwapMyLook";
  
  const description = postExcerpt
    ? `${postExcerpt.substring(0, 155)}...`
    : "Read this insightful article about AI fashion and virtual try-on technology on the SwapMyLook blog.";
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: "https://swapmylook.com/blog",
      images: postImage ? [{ url: postImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: postImage ? [postImage] : [],
    },
  };
};