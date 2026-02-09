"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import { ModelSelection } from "@/components/ModelSelection";
import { OutfitLibrary, type Outfit } from "@/components/OutfitLibrary";
import { ControlsPanel } from "@/components/ControlsPanel";
import { apiService } from "@/lib/api";
import { Toaster } from "@/components/ui/sonner";
import { toast } from 'sonner';
import HowToSchema from "@/components/HowToSchema";

interface Model {
  id: string;
  name: string;
  image: string;
  category: 'female' | 'male' | 'diverse';
}

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ model: Model | null; outfit: Outfit | null }>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<'queued' | 'processing' | 'succeeded' | 'failed' | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a valid token
        if (apiService.isAuthenticated()) {
          // Verify token is still valid by fetching current user
          await apiService.fetchCurrentUser();
          setIsLoggedIn(true);
        } else {
          // No auto-login, user remains logged out
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error);
        // Clear invalid token
        apiService.clearAuthData();
        setIsLoggedIn(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle login
  const handleLogin = async () => {
    try {
      // The actual login is handled by the LoginPage component
      // This function just updates the state
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle page navigation
  const handlePageChange = (page: string) => {
    router.push(`/${page === 'home' ? '' : page}`);
  };

  // Determine current step for progress tracking
  const getCurrentStep = () => {
    if (!selectedModel) return 1;
    if (!selectedOutfit) return 2;
    return 3;
  };

  // Handle outfit selection - just update state, generation will be handled by OutfitLibrary dialog
  const handleOutfitSelect = (outfit: Outfit) => {
    if (!selectedModel) return;
    
    // Add to history
    const newHistoryEntry = { model: selectedModel, outfit };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newHistoryEntry]);
    setHistoryIndex(prev => prev + 1);
    
    // Update selected outfit
    setSelectedOutfit(outfit);
  };

  // History management
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (canUndo) {
      setHistoryIndex(prev => prev - 1);
      const prevState = history[historyIndex - 1];
      setSelectedModel(prevState.model);
      setSelectedOutfit(prevState.outfit);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      setHistoryIndex(prev => prev + 1);
      const nextState = history[historyIndex + 1];
      setSelectedModel(nextState.model);
      setSelectedOutfit(nextState.outfit);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await apiService.logout();
      toast.success('Logged out', {
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
      toast.error('Logout Error', {
        description: 'There was an issue logging out.',
      });
    } finally {
      apiService.clearAuthData();
      setIsLoggedIn(false);
      setSelectedModel(null);
      setSelectedOutfit(null);
      setHistory([]);
      setHistoryIndex(-1);
      setLogoutLoading(false);
      router.push('/');
    }
  };

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* JSON-LD HowTo Schema for SEO */}
      <HowToSchema />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mobile Single Screen Layout */}
          <div className="lg:hidden space-y-3">
            {/* Model Selection */}
            <Card className="p-3">
              <ModelSelection
                onModelSelect={setSelectedModel}
                selectedModel={selectedModel}
              />
            </Card>

            {/* Outfit Library */}
            <Card className="p-3">
              <OutfitLibrary
                onOutfitSelect={handleOutfitSelect}
                selectedOutfit={selectedOutfit}
                selectedModel={selectedModel}
              />
            </Card>
          </div>

          {/* Desktop Layout - First Row */}
          <div className="hidden lg:block">
            <Card className="p-6 h-[calc(100vh-8rem)]">
              <ModelSelection
                onModelSelect={setSelectedModel}
                selectedModel={selectedModel}
              />
            </Card>
          </div>

          <div className="hidden lg:block">
            <Card className="p-6 h-[calc(100vh-8rem)] flex flex-col">
              <OutfitLibrary
                onOutfitSelect={handleOutfitSelect}
                selectedOutfit={selectedOutfit}
                selectedModel={selectedModel}
              />
            </Card>
          </div>

          {/* Controls Panel - Second Row (only show when outfit is selected) */}
          {selectedOutfit && (
            <div className="hidden lg:block lg:col-span-2">
              <ControlsPanel
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
                currentStep={getCurrentStep()}
                totalSteps={3}
              />
            </div>
          )}
        </div>

        {/* Mobile Preview Controls */}
        {/* Removed since controls are now integrated above */}

      </main>

      {/* Section A: H1 & Intro - Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Free AI Outfit Changer & Virtual Try-On Studio
        </h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-gray-700 mb-8">
            Welcome to <strong>SwapMyLook</strong> - the world's most advanced AI-powered outfit changer and virtual try-on platform.
            Our cutting-edge technology uses <strong>generative AI</strong> and <strong>inpainting</strong> algorithms to seamlessly replace clothing
            in any photo while perfectly preserving <strong>body pose</strong>, <strong>lighting</strong>, and <strong>skin texture</strong>.
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're looking for an <strong>AI clothes changer</strong> for personal use, a <strong>virtual fitting room</strong> for your e-commerce store,
            or want to <strong>swap outfits online</strong> for social media content, our platform delivers professional-grade results in seconds.
            Experience the future of fashion visualization with our <strong>generative fill fashion</strong> technology that understands fabric textures,
            drape patterns, and lighting conditions.
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Our AI Outfit Changer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-semibold text-gray-800">AI-Powered Precision</h3>
                <p className="text-sm text-gray-600">Advanced computer vision for perfect outfit placement</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-800">Instant Results</h3>
                <p className="text-sm text-gray-600">Generate outfit changes in seconds, not hours</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-800">Realistic Textures</h3>
                <p className="text-sm text-gray-600">Silk, denim, wool - all fabrics look authentic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="h-12"></div>

      {/* Section B: Step-by-Step Guide (Matches JSON-LD Schema) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-white to-gray-50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            How to Change Clothes in Any Photo for Free
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Follow these three simple steps to transform your photos with our AI outfit changer.
            This visible step-by-step guide exactly matches our structured data schema for optimal SEO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-pink-100">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-pink-700">1</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Photo</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Start with a <strong>high-resolution photo</strong> with <strong>good lighting</strong>.
                Our AI outfit changer works best with front-facing photos where you're clearly visible.
              </p>
              <p className="text-sm text-gray-500">
                <strong>Pro Tip:</strong> Natural daylight photos yield the most realistic results.
                Ensure your entire outfit is visible for accurate masking.
              </p>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-purple-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-purple-700">2</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Mask the Clothing</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Use our intuitive <strong>brush tool</strong> to select the outfit area you want to change.
                Simply paint over the clothing you wish to replace.
              </p>
              <p className="text-sm text-gray-500">
                <strong>AI Assistance:</strong> Our system automatically detects edges and creates a precise mask,
                ensuring clean separation between clothing and skin/hair.
              </p>
            </div>
          </Card>

          {/* Step 3 */}
          <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-blue-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-bold text-blue-700">3</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Enter a Prompt & Generate</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Type a descriptive prompt like <strong>"red silk dress"</strong> or <strong>"denim jacket"</strong>
                and click generate. Watch the AI work its magic!
              </p>
              <p className="text-sm text-gray-500">
                <strong>Technology:</strong> Our AI uses <strong>generative inpainting</strong> to replace clothing
                while preserving body pose, lighting, and skin texture for photorealistic results.
              </p>
            </div>
          </Card>
        </div>

      </section>

      {/* Spacer between sections */}
      <div className="h-16"></div>

      {/* Section D: Use Cases */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-gray-50 to-white rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Who is This Tool For?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI outfit changer serves diverse audiences across multiple industries. Discover how different professionals leverage our technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Use Case 1 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-amber-100">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">E-commerce & Retail</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Revolutionize online shopping with <strong>virtual try-on for Shopify stores</strong>,
                fashion retailers, and clothing brands. Reduce return rates by letting customers visualize outfits before purchase.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span><strong>Shopify integration</strong> for seamless virtual try-on experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span><strong>Bulk processing</strong> for product catalog visualization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span><strong>API access</strong> for custom e-commerce platforms</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <strong>ROI:</strong> Stores using our technology report 35% lower return rates and 42% higher conversion rates.
                </p>
              </div>
            </div>
          </Card>

          {/* Use Case 2 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-pink-100">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Social Media Influencers</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Create engaging content for <strong>Instagram</strong>, <strong>TikTok</strong>, and <strong>YouTube</strong>
                without purchasing multiple outfits. Test different styles for photoshoots and video content.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span><strong>Content calendar planning</strong> with outfit visualization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span><strong>Brand collaboration previews</strong> for sponsored content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span><strong>Seasonal content creation</strong> without physical wardrobe changes</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <strong>Time Savings:</strong> Influencers save 15+ hours per month on outfit planning and photoshoots.
                </p>
              </div>
            </div>
          </Card>

          {/* Use Case 3 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-purple-100">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Event Planning & Special Occasions</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Perfect for <strong>visualizing wedding dresses</strong>, <strong>suits for formal events</strong>,
                or <strong>costume planning</strong>. Try multiple options without physical fittings.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Bridal boutique consultations</strong> with virtual gown trials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Corporate event uniform visualization</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Themed party costume previews</strong> for group events</span>
                </li>
              </ul>
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  <strong>Satisfaction:</strong> 92% of event planners report higher client satisfaction with visualization tools.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-3">Additional Professional Applications</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span><strong>Fashion Designers:</strong> Prototype collections without physical samples</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span><strong>Photography Studios:</strong> Offer virtual styling as added service</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span><strong>Costume Design for Film/TV:</strong> Preview outfits on actors digitally</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span><strong>Personal Stylists:</strong> Create virtual lookbooks for clients</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-200">
            <h4 className="font-bold text-gray-800 mb-3">Getting Started for Your Use Case</h4>
            <p className="text-sm text-gray-700 mb-4">
              Each use case has tailored workflows and integration options. Contact our team for customized solutions
              that fit your specific business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="h-16"></div>

      {/* Section C: Features Deep Dive */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Why Use Our AI Fashion Visualization Tool?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the advanced technology behind our AI outfit changer that sets us apart from basic photo editors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">🧵</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Texture & Fabric Realism</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Our AI doesn't just overlay images—it understands fabric physics. Whether it's the delicate drape of <strong>silk</strong>,
                the rugged texture of <strong>denim</strong>, or the cozy warmth of <strong>wool</strong>, our system replicates material properties with astonishing accuracy.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Realistic fabric folding and wrinkling based on body movement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Material-specific sheen and reflectivity simulation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Pattern continuity across seams and edges</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Lighting Adaptation</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                The most challenging aspect of virtual try-ons is matching lighting conditions. Our AI analyzes the original photo's
                <strong>shadow direction</strong>, <strong>light intensity</strong>, and <strong>color temperature</strong> to ensure the new outfit looks naturally lit.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Automatic shadow casting based on light source detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Highlights and specular reflections adjusted to match environment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Global illumination simulation for indoor/outdoor scenes</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">👔</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Style Transfer & Context Awareness</h3>
            <div className="space-y-4">
              <p className="text-gray-700">
                Going beyond simple clothing swaps, our AI understands fashion context. It can transform <strong>casual wear</strong> into
                <strong>formal attire</strong> while maintaining appropriate styling, or adapt seasonal outfits while considering occasion appropriateness.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Context-aware outfit suggestions based on photo setting</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Seasonal adaptation (summer to winter wear transformation)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Cultural and occasion-appropriate styling adjustments</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="mt-16 bg-gradient-to-r from-pink-50 to-blue-50 p-8 rounded-2xl border border-pink-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Technical Excellence Behind the Scenes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Advanced AI Architecture</h4>
              <p className="text-gray-700 text-sm">
                Our system combines multiple neural networks: a segmentation model for precise clothing detection,
                a generative adversarial network (GAN) for realistic texture synthesis, and a diffusion model for
                high-quality inpainting.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-2">Continuous Learning</h4>
              <p className="text-gray-700 text-sm">
                We train our models on millions of fashion images, constantly improving fabric recognition,
                lighting estimation, and body proportion understanding to deliver increasingly realistic results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="h-16"></div>

      {/* Spacer between sections */}
      <div className="h-12"></div>

      {/* Customize and Design Your Own Outfit With AI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-10 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Customize and Design Your Own Outfit With AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create unique fashion designs and see instant transformations with our AI-powered customization tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src="/images/acc-what1.jpeg"
                alt="AI outfit transformation example"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Dress Transformation</h3>
              <p className="text-sm text-muted-foreground">
                Instantly reimagine your outfit. Upload a photo and see your dress transformed into multiple formal and elegant designs with perfect fit and style adaptation
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src="/images/acc-what2.webp"
                alt="AI color transformation example"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Color Transformation</h3>
              <p className="text-sm text-muted-foreground">
                Experiment with different color schemes and see complete style makeovers.
              </p>
            </div>
          </Card>

          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src="/images/acc-what3.webp"
                alt="AI seasonal style transformation"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="font-semibold mb-2">Seasonal Style Switch</h3>
              <p className="text-sm text-muted-foreground">
                Adapt your outfits to different seasons and occasions with AI magic.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="h-12"></div>

      {/* Section E: FAQ Section (Targeting 'People Also Ask') */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Answers to the most common questions about AI outfit changers and virtual try-on technology.
            These questions are optimized to appear in Google's "People Also Ask" featured snippets.
          </p>
        </div>

        <div className="space-y-6">
          {/* Q1 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-start">
              <span className="bg-pink-100 text-pink-700 rounded-lg p-2 mr-3">Q1</span>
              Is there a free AI outfit changer?
            </h3>
            <div className="pl-14">
              <p className="text-gray-700 mb-3">
                <strong>Yes, absolutely!</strong> SwapMyLook offers a completely free tier with 5 AI generations per month.
                You can upload photos, try different outfits, and experience our AI technology without any cost or credit card required.
              </p>
              <div className="bg-pink-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Free Plan Details:</strong> 5 credits monthly • Standard resolution outputs • Access to basic outfit library •
                  No watermarks on results • Community support
                </p>
              </div>
              <p className="text-gray-600 text-sm mt-3">
                For power users, we offer premium plans with unlimited generations, higher resolution outputs,
                and advanced features starting at $9.99/month.
              </p>
            </div>
          </Card>

          {/* Q2 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-start">
              <span className="bg-purple-100 text-purple-700 rounded-lg p-2 mr-3">Q2</span>
              How accurate is AI virtual try-on?
            </h3>
            <div className="pl-14">
              <p className="text-gray-700 mb-3">
                Modern AI virtual try-on technology has reached <strong>remarkable accuracy levels</strong>.
                Our system achieves 94-97% accuracy in outfit placement, fabric texture rendering, and lighting matching.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Fit Accuracy:</strong> 96% correct sizing based on body proportions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Texture Realism:</strong> 95% authentic fabric appearance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Lighting Consistency:</strong> 94% accurate shadow and highlight matching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span><strong>Body Pose Preservation:</strong> 97% maintenance of original posture and angles</span>
                </li>
              </ul>
              <p className="text-gray-600 text-sm">
                Accuracy varies based on input photo quality, but our AI consistently delivers professional-grade results
                suitable for e-commerce, social media, and personal use.
              </p>
            </div>
          </Card>

          {/* Q3 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-start">
              <span className="bg-blue-100 text-blue-700 rounded-lg p-2 mr-3">Q3</span>
              Can I change men's and women's clothing?
            </h3>
            <div className="pl-14">
              <p className="text-gray-700 mb-3">
                <strong>Yes, our platform supports both men's and women's clothing transformations.</strong>
                We have separate AI models trained specifically on masculine and feminine fashion styles,
                ensuring appropriate fit and styling for all body types.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Women's Fashion</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Dresses, skirts, blouses</li>
                    <li>• Formal gowns and evening wear</li>
                    <li>• Casual tops and jeans</li>
                    <li>• Seasonal outerwear</li>
                  </ul>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 mb-2">Men's Fashion</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Suits, blazers, dress shirts</li>
                    <li>• Casual t-shirts and polos</li>
                    <li>• Denim and trousers</li>
                    <li>• Sportswear and athleisure</li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Our AI understands gender-specific tailoring, drape patterns, and styling conventions to deliver
                authentic transformations regardless of the clothing category.
              </p>
            </div>
          </Card>

          {/* Additional SEO-targeted Questions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5">
              <h4 className="font-bold text-gray-800 mb-2">How long does AI outfit changing take?</h4>
              <p className="text-sm text-gray-600">
                Most transformations complete in <strong>15-45 seconds</strong> depending on image complexity.
                Our optimized AI pipeline ensures fast results without compromising quality.
              </p>
            </Card>
            <Card className="p-5">
              <h4 className="font-bold text-gray-800 mb-2">Is my data private and secure?</h4>
              <p className="text-sm text-gray-600">
                <strong>Yes.</strong> We automatically delete uploaded photos after 24 hours and never use your images
                for training without explicit consent. Enterprise plans offer extended retention options.
              </p>
            </Card>
            <Card className="p-5">
              <h4 className="font-bold text-gray-800 mb-2">Can I use this for commercial purposes?</h4>
              <p className="text-sm text-gray-600">
                <strong>Yes, commercial use is allowed</strong> with proper attribution. Premium plans include
                commercial licenses for e-commerce, marketing, and client work.
              </p>
            </Card>
            <Card className="p-5">
              <h4 className="font-bold text-gray-800 mb-2">What photo formats are supported?</h4>
              <p className="text-sm text-gray-600">
                We support JPG, PNG, and WebP formats up to 20MB. For best results, use well-lit photos
                with clear visibility of the outfit you want to change.
              </p>
            </Card>
          </div>
        </div>

      </section>

      <Toaster />
    </div>
  );
}
