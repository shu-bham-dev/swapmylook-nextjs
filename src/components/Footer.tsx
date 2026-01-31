import { Heart, Mail, Github, Twitter, Instagram, Wrench, Sparkles, Grid3x3 } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-pink-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linear-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                SwapMyLook
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              AI‑powered fashion visualization for everyone. Try on outfits virtually with cutting‑edge technology.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-pink-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Tools</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-pink-600 transition-colors flex items-center">
                  <Wrench className="w-4 h-4 mr-2" />
                  All Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/generative-ai-quilt-design" className="text-muted-foreground hover:text-pink-600 transition-colors flex items-center">
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Generative AI Quilt Design
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border border-pink-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mt-4">
            © {currentYear} SwapMyLook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}