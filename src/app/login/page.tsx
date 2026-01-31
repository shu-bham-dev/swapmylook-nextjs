"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  Facebook,
  Apple,
  ArrowRight,
  Heart,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pass)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pass)) return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(pass)) return 'Password must contain at least one number';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) return 'Password must contain at least one special character';
    const common = ['password', '123456', 'qwerty', 'letmein', 'welcome'];
    if (common.includes(pass.toLowerCase())) return 'Password is too common, please choose a stronger password';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login with email and password
      setIsLoading(true);
      toast.dismiss(); // Clear any previous toasts before API call
      
      try {
        await apiService.login(email, password, rememberMe);
        toast.dismiss();
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.',
        });
        router.push('/');
      } catch (error) {
        // Error handling is now done by the API service
        console.error('Authentication failed:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Signup: validate and send OTP
      if (!email || !name || !password) {
        toast.error('Validation failed', {
          description: 'All fields are required for signup.',
        });
        return;
      }
      
      // Validate password
      const passwordError = validatePassword(password);
      if (passwordError) {
        setPasswordError(passwordError);
        toast.dismiss();
        toast.error('Password validation failed', {
          description: passwordError,
        });
        return;
      }
      
      setIsLoading(true);
      toast.dismiss();
      
      try {
        // Send OTP for signup (password will be used during OTP verification)
        await apiService.sendOTP(email, 'signup', name);
        toast.dismiss();
        toast.success('OTP sent!', {
          description: 'A verification code has been sent to your email.',
        });
        
        // Navigate to OTP verification page with email, name, and password
        router.push(`/otp-verification?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}&purpose=signup`);
      } catch (error) {
        console.error('Failed to send OTP:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    toast.dismiss(); // Clear any previous toasts before API call
    setIsLoading(true);
    
    try {
      // Get Google OAuth URL and redirect
      const { url } = await apiService.getGoogleAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {isLogin ? 'Welcome Back!' : 'Join SwapMyLook'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? 'Sign in to continue your fashion journey' 
                : 'Start transforming your style with AI'
              }
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-6 space-y-6">
          {/* Social Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-pink-100 focus:border-pink-300"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 border-pink-100 focus:border-pink-300"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Password field - always show for both login and signup */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  onBlur={() => {
                    if (!isLogin) {
                      const error = validatePassword(password);
                      setPasswordError(error);
                    }
                  }}
                  required
                  className={`pl-10 pr-10 ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-pink-100 focus:border-pink-300'}`}
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="text-pink-600 h-auto p-0">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Switch between Login/Signup */}
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="text-pink-600 h-auto p-0 ml-1"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </p>

          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Trusted by 10,000+ fashion enthusiasts</span>
          </div>
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <Button 
              variant="link" 
              className="text-pink-600 h-auto p-0 text-xs"
              onClick={() => router.push('/terms')}
            >
              Terms & Privacy Policy
            </Button>
          </p>
        </div>

        {/* Feature Highlights */}
        <Card className="p-4 bg-linear-to-r from-pink-50 to-purple-50 border-pink-200">
          <div className="space-y-3">
            <h3 className="font-medium text-pink-800 text-center">Why join SwapMyLook?</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-pink-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Unlimited AI outfit visualizations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Save and organize your favorite looks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Personalized style recommendations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Access to premium outfit collections</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}