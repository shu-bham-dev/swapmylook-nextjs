"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Image as ImageIcon,
  Zap,
  Shield,
  Smartphone,
  Download,
  Users,
  Clock,
  DollarSign,
  Palette,
  Sparkles,
  ArrowRight,
  Star,
  ShoppingBag,
  Camera,
  Store,
  User
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';
//routers
export default function AIClothesChangerPage() {
  const router = useRouter();

  const features = [
    {
      icon: Sparkles,
      title: 'Realistic Outfit Fitting',
      description: 'AI adapts clothing to body shape, fabric texture, and lighting for natural results.',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: Upload,
      title: 'Upload Your Own Clothes',
      description: 'Use photos of your actual wardrobe or browse our extensive outfit library.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Palette,
      title: 'No Photo Editing Skills Needed',
      description: 'Fully automated process - just upload and let AI do the magic.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Get results in seconds, not hours. Perfect for quick style decisions.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Smartphone,
      title: 'Works on Mobile & Desktop',
      description: 'Access our AI clothes changer from any device, anywhere.',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Download,
      title: 'HD Download',
      description: 'Download high-resolution images ready for social media or e-commerce.',
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  const useCases = [
    {
      title: 'Online Shopping Preview',
      description: 'Try clothes before buying to reduce returns and make confident purchases.',
      icon: ShoppingBag
    },
    {
      title: 'Social Media Content',
      description: 'Create engaging fashion content without expensive photoshoots.',
      icon: Camera
    },
    {
      title: 'Fashion & E-commerce Listings',
      description: 'Showcase products on models without hiring photographers.',
      icon: Store
    },
    {
      title: 'Personal Styling',
      description: 'Experiment with new styles and discover what works for you.',
      icon: User
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Upload Your Photo',
      description: 'Start with a clear, well-lit photo where you\'re clearly visible.',
      icon: Upload
    },
    {
      number: '2',
      title: 'Upload Outfit Image',
      description: 'Choose from our library or upload your own clothing photo.',
      icon: ImageIcon
    },
    {
      number: '3',
      title: 'AI Swaps Clothes Realistically',
      description: 'Our AI seamlessly swaps outfits while preserving fabric texture, shadows, and folds.',
      icon: Sparkles
    }
  ];

  const valueProps = [
    {
      icon: DollarSign,
      title: 'Saves Money',
      description: 'No need for expensive photoshoots, studio rentals, or professional photographers.'
    },
    {
      icon: Clock,
      title: 'Saves Time',
      description: 'Get instant results instead of hours of manual photo editing.'
    },
    {
      icon: Camera,
      title: 'No Reshoots',
      description: 'Perfect results every time without multiple photography sessions.'
    },
    {
      icon: ShoppingBag,
      title: 'No Returns',
      description: 'Try before you buy to ensure perfect fit and style match.'
    },
    {
      icon: Palette,
      title: 'No Design Skills',
      description: 'Professional results without any photo editing experience needed.'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              AI Clothes Changer
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Upload your photo + upload any outfit → Get instant realistic results. 
              The easiest way to swap clothes in photos with AI.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => router.push('/login')}
              className="bg-linear-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 px-8 py-6 text-lg"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Try AI Clothes Changer Free
            </Button>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="px-8 py-6 text-lg border-2"
              size="lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Photo
            </Button>
          </div>

          {/* Trust & Social Proof */}
          <div className="pt-8">
            <p className="text-lg text-muted-foreground">
              Trusted by fashion creators, e-commerce sellers, photographers, and casual users worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-pink-600 mr-2" />
                <span className="font-medium">10,000+ Happy Users</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="font-medium">4.8/5 Average Rating</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <span className="font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS AI CLOTHES CHANGER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            What is AI Clothes Changer?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">The Problem: Fashion Frustrations</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Online shopping comes with uncertainty. Will the clothes fit? Do they match your style? 
                  Returns are costly and time-consuming. Professional photoshoots are expensive, and 
                  experimenting with new styles requires buying clothes you might never wear.
                </p>
                <p className="text-muted-foreground">
                  Fashion creators and e-commerce sellers struggle with product photography costs. 
                  Hiring models, photographers, and studios adds up quickly, making it hard to showcase 
                  products effectively.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-linear-to-br from-pink-50 to-purple-50">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">The Solution: SwapMyLook AI</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  SwapMyLook's AI Clothes Changer solves these problems instantly. Upload any photo of yourself 
                  and any clothing image, and our advanced AI seamlessly swaps outfits while preserving 
                  realistic fabric textures, shadows, and body proportions.
                </p>
                <p className="text-muted-foreground">
                  Whether you're a shopper avoiding returns, a creator making content, or a seller showcasing 
                  products, our AI delivers professional-quality results in seconds, not hours.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/login')}
                className="bg-linear-to-r from-pink-600 to-purple-600 text-white"
              >
                Start Changing Clothes with AI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* HOW TO CHANGE CLOTHES IN PHOTOS (3 STEPS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            How to Change Clothes in Photos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform any photo with AI magic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index === 2 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-pink-600">
                    AI preserves fabric texture, shadows, folds, and lighting for maximum realism
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for perfect AI outfit changes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color} flex-shrink-0`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-linear-to-r from-pink-50 to-purple-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Use Cases
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Who benefits from our AI clothes changer technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <useCase.icon className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Why Choose SwapMyLook AI Clothes Changer?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {valueProps.map((value, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-linear-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about our AI clothes changer
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-semibold">
              Is AI clothes changer free?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! SwapMyLook offers free access with 5 credits per month. You can try our AI clothes changer
              and see realistic results without any cost. For unlimited usage, we offer affordable subscription
              plans starting at $9.99/month.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-semibold">
              What photo works best for AI clothes changing?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              For best results, use clear, well-lit front-facing photos where you're clearly visible.
              Avoid photos with complex backgrounds, extreme poses, or poor lighting. The AI works best
              with photos where clothing areas are unobstructed.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-semibold">
              Can I use the results commercially?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! All images generated with SwapMyLook can be used for commercial purposes, including
              e-commerce listings, social media content, advertising, and marketing materials. You own
              the rights to all images you create with our platform.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-semibold">
              How realistic are the results?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our AI achieves 95%+ realism by preserving fabric texture, shadows, body proportions, and lighting.
              The results look natural and professional, suitable for e-commerce, social media, and personal use.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left font-semibold">
              Does SwapMyLook store images?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              We temporarily store images for processing (up to 24 hours) to deliver your results.
              After processing, images are automatically deleted from our servers. We never share or sell your images.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left font-semibold">
              Can I change clothes on mobile?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! SwapMyLook works perfectly on mobile devices. Our responsive design allows you to
              upload photos, choose outfits, and download results directly from your smartphone or tablet.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-12 text-center bg-linear-to-r from-pink-600 to-purple-600 text-white rounded-3xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Try AI Clothes Changer Now – Free & Instant
              </h2>
              <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                Join thousands of users who are transforming their photos with AI magic.
                No credit card required for free trial.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/login')}
                className="bg-white text-pink-600 hover:bg-pink-50 px-8 py-6 text-lg"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                size="lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Photo Now
              </Button>
            </div>
            <p className="text-pink-200 text-sm">
              Free plan includes 5 credits. No hidden fees, cancel anytime.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
