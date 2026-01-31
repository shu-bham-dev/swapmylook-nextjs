"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Sparkles,
  Menu,
  X,
  User,
  Settings,
  CreditCard,
  LogOut,
  Heart,
  Shirt,
  Loader2,
  BookOpen,
  Wrench
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { apiService } from '@/lib/api';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationProps {
  onLogout?: () => void;
  isLoggedIn?: boolean;
  userCredits?: number;
  logoutLoading?: boolean;
}

export function Navigation({ onLogout, isLoggedIn = false, userCredits = 25, logoutLoading = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userQuota, setUserQuota] = useState<{
    monthlyRequests: number;
    usedThisMonth: number;
    remaining: number;
    resetDate: string;
    hasQuota: boolean;
  } | null>(null);
  const [authState, setAuthState] = useState<{ isAuthenticated: boolean; user: any }>({
    isAuthenticated: false,
    user: null
  });
  
  const pathname = usePathname();
  const router = useRouter();
  
  // Get current page from pathname
  const currentPage = pathname === '/' ? 'home' : pathname.replace('/', '');

  // Check authentication state
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = apiService.isAuthenticated();
      const user = apiService.getCurrentUser();
      setAuthState({ isAuthenticated, user });
      
      // Fetch user quota when logged in
      if (isAuthenticated) {
        const fetchUserQuota = async () => {
          try {
            const quota = await apiService.getUserQuota();
            setUserQuota(quota);
          } catch (error) {
            console.error('Failed to fetch user quota:', error);
            // If we get a network error, the backend might be down
            // Don't clear auth data immediately, just don't show quota
            // Set fallback quota to prevent UI issues
            setUserQuota({
              monthlyRequests: 25,
              usedThisMonth: 0,
              remaining: 25,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              hasQuota: true
            });
          }
        };
        fetchUserQuota();
      } else {
        // Clear user quota when not authenticated
        setUserQuota(null);
      }
    };

    checkAuth();
    
    // Check auth on route changes
    const handleRouteChange = () => {
      checkAuth();
    };
    
    // Check auth periodically (every 5 seconds) to catch login/logout from other tabs
    const interval = setInterval(checkAuth, 5000);
    
    return () => clearInterval(interval);
  }, [pathname]); // Re-run when pathname changes

  const displayCredits = userQuota?.remaining ?? userCredits;
  const isLoggedInState = isLoggedIn || authState.isAuthenticated;
  const currentUser = authState.user || apiService.getCurrentUser();

  const navigationItems = [
    { id: 'home', label: 'Style Studio', icon: Sparkles },
    ...(isLoggedInState ? [{ id: 'history', label: 'My History', icon: Shirt }] : []),
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'about', label: 'About', icon: Heart },
    { id: 'subscription', label: 'Pricing', icon: CreditCard },
  ];

  const userMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handlePageChange = (page: string) => {
    const route = page === 'home' ? '/' : `/${page}`;
    router.push(route);
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handlePageChange('home')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img src="/images/favicon.svg" alt="SwapMyLook Logo" className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                SwapMyLook
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI-Powered Fashion Visualization
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handlePageChange(item.id)}
                className={currentPage === item.id ? "bg-pink-500 text-white" : "text-gray-600 hover:text-pink-600"}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedInState ? (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop"} alt="User" />
                        <AvatarFallback>
                          {currentUser?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{currentUser?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser?.email || 'user@example.com'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem key={item.id} onClick={() => handlePageChange(item.id)}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        if (!logoutLoading && onLogout) {
                          onLogout();
                        } else if (!logoutLoading) {
                          handlePageChange('login');
                        }
                      }}
                      disabled={logoutLoading}
                    >
                      {logoutLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      <span>{logoutLoading ? 'Logging out...' : 'Log out'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange('login')}
                  className="text-gray-600 hover:text-pink-600"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-pink-100">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    handlePageChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start ${
                    currentPage === item.id ? "bg-pink-500 text-white" : "text-gray-600"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
              
              {isLoggedInState ? (
                <>
                  {userMenuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handlePageChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full justify-start text-gray-600"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (!logoutLoading && onLogout) {
                        onLogout();
                      } else if (!logoutLoading) {
                        handlePageChange('login');
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={logoutLoading}
                    className="w-full justify-start text-gray-600"
                  >
                    {logoutLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
                    )}
                    {logoutLoading ? 'Logging out...' : 'Sign Out'}
                  </Button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handlePageChange('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-600"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}