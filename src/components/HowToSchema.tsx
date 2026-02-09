"use client";

import { useEffect } from "react";

export default function HowToSchema() {
  useEffect(() => {
    // Create script element for JSON-LD
    const script = document.createElement("script");
    script.type = "application/ld+json";
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Change Clothes in a Photo with AI",
      "description": "Learn how to use SwapMyLook's AI outfit changer to transform your photos with realistic clothing swaps in three simple steps.",
      "image": "https://swapmylook.com/images/ai-outfit-changer-hero.jpg",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "High-resolution photo"
        },
        {
          "@type": "HowToSupply",
          "name": "Good lighting"
        }
      ],
      "tool": [
        {
          "@type": "HowToTool",
          "name": "SwapMyLook AI Outfit Changer"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload your photo",
          "text": "Start with a clear, high-resolution photo with good lighting. The AI works best with front-facing photos where you're clearly visible. Upload your image to the SwapMyLook platform.",
          "image": "https://swapmylook.com/images/step1-upload.jpg",
          "url": "https://swapmylook.com/how-to-change-clothes#step1"
        },
        {
          "@type": "HowToStep",
          "name": "Mask the clothing",
          "text": "Use the intuitive brush tool to select the outfit area you want to change. Simply paint over the clothing you wish to replace. The AI will automatically detect edges and create a precise mask.",
          "image": "https://swapmylook.com/images/step2-mask.jpg",
          "url": "https://swapmylook.com/how-to-change-clothes#step2"
        },
        {
          "@type": "HowToStep",
          "name": "Enter a Prompt & Generate",
          "text": "Type a descriptive prompt like 'red silk dress' or 'denim jacket' and click generate. Our AI uses generative inpainting technology to replace the clothing while preserving body pose, lighting, and skin texture.",
          "image": "https://swapmylook.com/images/step3-generate.jpg",
          "url": "https://swapmylook.com/how-to-change-clothes#step3"
        }
      ],
      "totalTime": "PT5M"
    };
    
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    
    return () => {
      // Clean up script on component unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything visible
}