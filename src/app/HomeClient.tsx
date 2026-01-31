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

      {/* How to Change Clothes in Photos with AI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            How to Change Clothes in Photos with AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your photos instantly with our powerful AI outfit changer technology.
            No technical skills needed - just follow these simple steps!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-pink-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload Your Photo</h3>
            <p className="text-muted-foreground">
              Start with a clear, well-lit photo. Our AI outfit changer works best with front-facing photos where you're clearly visible.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Choose Your Outfit</h3>
            <p className="text-muted-foreground">
              Browse our extensive library of outfits and styles. From casual to formal, find the perfect look for any occasion.
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">See the Magic</h3>
            <p className="text-muted-foreground">
              Watch as our AI automatically applies the outfit with perfect fit and realistic lighting. Results in seconds!
            </p>
          </Card>
        </div>
      </section>

      {/* Spacer between sections */}
      <div className="h-12"></div>

      {/* Customize and Design Your Own Outfit With AI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50">
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

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get answers to common questions about our AI outfit changer technology.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-semibold">
              How does AI change clothes in photos?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our AI uses advanced computer vision to analyze your photo and seamlessly overlay selected outfits while maintaining realistic proportions and natural appearance.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-semibold">
              Is the AI outfit changer free to use?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Yes! We offer free access with 5 credits per month. You can try our technology and see the magic for yourself without any cost.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-semibold">
              How accurate are the outfit visualizations?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Our AI achieves 95% accuracy in outfit placement, color matching, and realistic rendering. The visualizations account for body proportions and lighting conditions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-semibold">
              Can I customize colors and styles?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Absolutely! You can modify any aspect of your outfits - change colors, adjust fit, alter styles, and create completely original designs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Toaster />
    </div>
  );
}
