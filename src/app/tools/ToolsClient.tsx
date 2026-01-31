"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Grid3x3
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ToolsPage() {
  const router = useRouter();

  const tools = [
    // Empty array as in original
  ];

  const featuredTools = [
    {
      id: 'generative-ai-quilt-design',
      title: 'Generative AI Quilt Design',
      description: 'Create beautiful, unique quilt patterns using artificial intelligence',
      icon: Grid3x3,
      color: 'bg-linear-to-r from-blue-500 to-purple-600 text-white',
      isFeatured: true
    },
    {
      id: 'ai-outfit-visualizer',
      title: 'AI Outfit Visualizer',
      description: 'Our flagship tool for visualizing outfits on different models',
      icon: Sparkles,
      color: 'bg-linear-to-r from-pink-500 to-purple-600 text-white',
      isFeatured: true
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-linear-to-r from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Developer & Design Tools
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A collection of free, handy tools for developers, designers, and content creators.
              From color pickers to URL shorteners, we've got you covered.
            </p>
          </div>
        </div>

        {/* Featured Tools */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Featured Tools</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our most popular and powerful tools that integrate with SwapMyLook's AI fashion platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTools.map((tool) => (
              <Card key={tool.id} className={`p-8 hover:shadow-lg transition-shadow ${tool.color}`}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{tool.title}</h3>
                      <p className="text-sm opacity-90">{tool.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      if (tool.id === 'generative-ai-quilt-design') {
                        router.push('/tools/generative-ai-quilt-design');
                      } else if (tool.id === 'ai-outfit-visualizer') {
                        router.push('/');
                      } else {
                        router.push('/ai-clothes-changer');
                      }
                    }}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100"
                  >
                    Try Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-linear-to-r from-pink-500 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Have a Tool Idea?</h2>
              <p className="text-lg text-pink-100 max-w-2xl mx-auto">
                We're constantly adding new tools. Suggest a tool you'd like to see, or contribute to our open-source tools collection.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => router.push('/contact')}
                className="bg-white text-pink-600 hover:bg-pink-50"
              >
                Suggest a Tool
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Common questions about our tools collection.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Are these tools free to use?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! All tools in our collection are completely free to use. Some tools may have usage limits for free users, but basic functionality is always available.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Do I need an account to use the tools?</h3>
              <p className="text-sm text-muted-foreground">
                Most tools can be used without an account. However, creating an account allows you to save your work, access premium features, and get higher usage limits.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I suggest a new tool?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! We welcome tool suggestions from our community. Use the "Suggest a Tool" button above or contact us through our contact page.
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Are the tools open source?</h3>
              <p className="text-sm text-muted-foreground">
                Many of our tools are open source and available on GitHub. You can contribute, report issues, or even fork them for your own projects.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}