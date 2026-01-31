"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Grid3x3,
  Sparkles,
  LogIn,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/lib/api';

export default function GenerativeAIQuiltDesignPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = apiService.isAuthenticated();
      setIsLoggedIn(loggedIn);
    };
    checkAuth();
  }, []);

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      toast.error('Authentication Required', {
        description: 'Please log in to use the AI Quilt Design tool.',
      });
      router.push('/login');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Prompt Required', {
        description: 'Please enter a description for your quilt design.',
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiService.generateQuiltDesign(prompt, {
        style: 'modern',
        colorPalette: ['#FF6B6B', '#4ECDC4', '#FFD166'],
        complexity: 3,
        size: 'throw',
        rows: 8,
        columns: 8,
        symmetry: 'mirror'
      });
      
      toast.success('Design Generation Started!', {
        description: 'Your AI quilt design is being generated. This may take a few moments.',
      });
      
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
      toast.error('Generation Failed', {
        description: 'Failed to generate quilt design. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-12">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Grid3x3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Generative AI Quilt Design
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Create beautiful, unique quilt patterns using artificial intelligence. 
              Describe your vision and watch as AI generates stunning quilt designs in seconds.
            </p>
          </div>
        </div>

        {!isLoggedIn ? (
          <Card className="mb-8 p-6 bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <LogIn className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Login Required</h3>
                  <p className="text-sm text-muted-foreground">
                    You need to be logged in to generate AI quilt designs.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <LogIn className="w-4 h-4 mr-2 text-white" />
                Log In to Continue
              </Button>
            </div>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="prompt" className="text-lg font-semibold mb-2 block">
                    Design Prompt
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your quilt design... (e.g., 'A modern geometric quilt with blue and gold colors, inspired by Moroccan tiles')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !isLoggedIn}
                  className="w-full py-6 text-lg bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⟳</span>
                      Generating...
                    </>
                  ) : !isLoggedIn ? (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Log In to Generate
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Quilt Design
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Describe Your Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      Tell us what kind of quilt design you want using natural language.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Customize Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose style, colors, and complexity to match your preferences.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Generate & Refine</h3>
                    <p className="text-sm text-muted-foreground">
                      AI creates unique designs that you can download, share, or regenerate.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
