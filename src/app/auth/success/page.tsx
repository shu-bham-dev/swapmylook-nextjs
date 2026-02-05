"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

export default function AuthSuccessPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthSuccess = async () => {
      // Get URL parameters from current URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userId = urlParams.get('userId');

      if (!token || !userId) {
        toast.error('Authentication Failed', {
          description: 'Missing authentication information. Please try again.',
        });
        setIsLoading(false);
        return;
      }

      try {
        // Set the token and fetch user data
        apiService.setAuthData(token, {
          id: userId,
          email: '',
          name: '',
          avatarUrl: '',
          plan: 'free',
          quota: {
            monthlyRequests: 100,
            usedThisMonth: 0,
            remaining: 100,
            resetDate: new Date().toISOString(),
            hasQuota: true
          }
        }, true);

        // Fetch complete user data
        await apiService.fetchCurrentUser();
        toast.success('Welcome!', {
          description: 'Google authentication successful.',
        });
        
        // Redirect to home after a brief delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Authentication success handling failed:', error);
        setIsLoading(false);
      }
    };

    handleAuthSuccess();
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-linear-to-r from-green-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to SwapMyLook!
            </h1>
            <p className="text-muted-foreground">
              {isLoading ? 'Completing your authentication...' : 'Authentication successful! Redirecting...'}
            </p>
          </div>
        </div>

        <Card className="p-6 text-center">
          <div className="space-y-4">
            <div className="relative mx-auto w-12 h-12">
              <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500"></div>
              <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-pink-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to the main application in a moment.
            </p>
          </div>
        </Card>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Ready to transform your style with AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}