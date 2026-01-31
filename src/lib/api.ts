// API service for communicating with the backend - Next.js version
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface GenerationJob {
  jobId: string;
  status: 'queued' | 'processing' | 'succeeded' | 'failed';
  estimatedTime: number;
  queuePosition?: number;
}

interface JobStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'succeeded' | 'failed';
  attempts: number;
  createdAt: string;
  updatedAt: string;
  estimatedTime: number;
  processingTime?: number;
  queueTime?: number;
  outputImage?: {
    id: string;
    url: string;
    width: number;
    height: number;
    sizeBytes: number;
  };
  error?: string;
  errorDetails?: any;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  plan: string;
  quota: {
    monthlyRequests: number;
    usedThisMonth: number;
    remaining: number;
    resetDate: string;
    hasQuota: boolean;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  gender: string;
  profilePicture: string;
  preferences: {
    defaultOutfitStyle: string;
    theme: string;
    notifications: boolean;
    emailUpdates: boolean;
  };
}

export interface SettingsResponse {
  profile: UserProfile;
}

class ApiService {
  private authToken: string | null = null;
  private user: User | null = null;

  constructor() {
    // Initialize with token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      let userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (error) {
          console.error('Failed to parse user data from storage:', error);
          // Clean up corrupted data
          localStorage.removeItem('userData');
          sessionStorage.removeItem('userData');
        }
      }
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.authToken;
    if (!token) {
      return {
        'Content-Type': 'application/json',
      };
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token and user data
   * @param rememberMe If true, store in localStorage (persistent). If false, store in sessionStorage (session-only).
   */
  setAuthData(token: string, user: User, rememberMe: boolean = true) {
    this.authToken = token;
    this.user = user;
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        // Clear any session storage entries to avoid conflicts
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userData', JSON.stringify(user));
        // Clear any local storage entries to avoid conflicts
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }

  /**
   * Clear authentication data
   */
  clearAuthData() {
    this.authToken = null;
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.user;
  }

  /**
   * Get Google OAuth URL for authentication
   */
  async getGoogleAuthUrl(): Promise<{ url: string }> {
    return this.request<{ url: string }>('/auth/google/url');
  }

  /**
   * Authenticate with Google token
   */
  async googleAuthWithToken(idToken: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/google/token', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });

    this.setAuthData(response.token, response.user);
    return response;
  }

  /**
   * Sign up with email and password
   */
  async signup(email: string, password: string, name: string): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    this.setAuthData(response.token, response.user);
    return response;
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<{ token: string; user: User }> {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe }),
    });

    this.setAuthData(response.token, response.user, rememberMe);
    return response;
  }

  /**
   * Send OTP for email verification
   */
  async sendOTP(email: string, purpose: 'signup' | 'login' | 'password_reset', name?: string): Promise<{ message: string; expiresIn: number }> {
    return this.request('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email, purpose, name }),
    });
  }

  /**
   * Verify OTP and complete authentication
   */
  async verifyOTP(
    email: string,
    code: string,
    purpose: 'signup' | 'login' | 'password_reset',
    name?: string,
    password?: string
  ): Promise<{ token?: string; user?: User; message?: string; resetToken?: string }> {
    const response = await this.request<{ token?: string; user?: User; message?: string; resetToken?: string }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code, purpose, name, password }),
    });

    if (response.token && response.user) {
      this.setAuthData(response.token, response.user);
    }

    return response;
  }

  /**
   * Resend OTP
   */
  async resendOTP(email: string, purpose: 'signup' | 'login' | 'password_reset'): Promise<{ message: string; expiresIn: number }> {
    return this.request('/auth/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ email, purpose }),
    });
  }

  /**
   * Get current user profile from server
   */
  async fetchCurrentUser(): Promise<{ user: User }> {
    const response = await this.request<{ user: User }>('/auth/me');
    if (response.user) {
      this.user = response.user;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(response.user));
      }
    }
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.request<{ message: string }>('/auth/logout', {
        method: 'POST',
      });
      return response;
    } finally {
      this.clearAuthData();
    }
  }

  /**
   * Get user quota information
   */
  async getUserQuota(): Promise<{
    monthlyRequests: number;
    usedThisMonth: number;
    remaining: number;
    resetDate: string;
    hasQuota: boolean;
  }> {
    return this.request('/auth/quota');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.authToken && !!this.user;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        
        // Handle authentication errors (401/403) by clearing auth
        if (response.status === 401 || response.status === 403) {
          // Check if this is an authentication endpoint
          const isAuthEndpoint = endpoint.includes('/auth/login') ||
                                 endpoint.includes('/auth/signup') ||
                                 endpoint.includes('/auth/otp/verify') ||
                                 endpoint.includes('/auth/otp/send') ||
                                 endpoint.includes('/auth/otp/resend');
          
          if (!isAuthEndpoint) {
            // Otherwise, treat as session expiration
            this.clearAuthData();
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // For network errors on non-critical endpoints, return a fallback response
      // This prevents console errors when backend is not running
      if (error instanceof Error &&
          (error.message.includes('Failed to fetch') ||
           error.message.includes('NetworkError') ||
           error.message.includes('Network request failed'))) {
        
        // Check if this is a non-critical endpoint that can fail silently
        const isNonCriticalEndpoint = endpoint.includes('/auth/quota') ||
                                      endpoint.includes('/auth/me') ||
                                      endpoint.includes('/subscription/details') ||
                                      endpoint.includes('/subscription/plans') ||
                                      endpoint.includes('/public/plans') ||
                                      endpoint.includes('/outfits/stats');
        
        if (isNonCriticalEndpoint) {
          console.warn(`Backend server not reachable for ${endpoint}. Returning fallback data.`);
          
          // Return appropriate fallback data based on endpoint
          if (endpoint.includes('/auth/quota')) {
            return {
              monthlyRequests: 25,
              usedThisMonth: 0,
              remaining: 25,
              resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              hasQuota: true
            } as T;
          } else if (endpoint.includes('/auth/me')) {
            return { user: this.user } as T;
          } else if (endpoint.includes('/subscription/details')) {
            return {
              subscription: {
                plan: 'free',
                status: 'active',
                trialStatus: {
                  hasTrialRemaining: false,
                  trialUsed: true,
                  trialEndsAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                  daysRemaining: 0
                },
                usage: {
                  used: 0,
                  limit: 25,
                  remaining: 25
                },
                resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              }
            } as T;
          } else if (endpoint.includes('/subscription/plans') || endpoint.includes('/public/plans')) {
            return {
              plans: [
                {
                  id: 'free',
                  name: 'Free',
                  description: 'Perfect for getting started',
                  price: { monthly: 0, yearly: 0 },
                  features: ['25 generations per month', 'Basic support', 'Standard queue priority'],
                  monthlyRequests: 25,
                  popular: false
                },
                {
                  id: 'pro',
                  name: 'Pro',
                  description: 'For serious creators',
                  price: { monthly: 19, yearly: 190 },
                  features: ['500 generations per month', 'Priority support', 'High queue priority', 'Advanced features'],
                  monthlyRequests: 500,
                  popular: true
                },
                {
                  id: 'enterprise',
                  name: 'Enterprise',
                  description: 'For businesses and teams',
                  price: { monthly: 99, yearly: 990 },
                  features: ['Unlimited generations', '24/7 support', 'Highest priority', 'Team management', 'Custom integrations'],
                  monthlyRequests: 999999,
                  popular: false
                }
              ]
            } as T;
          } else if (endpoint.includes('/outfits/stats')) {
            return {
              total: 0,
              byType: {
                model: 0,
                outfit: 0,
                output: 0
              },
              storageUsage: {
                totalBytes: 0,
                totalFiles: 0,
                byType: {}
              },
              favorites: 0,
              generationAttempts: 0
            } as T;
          }
        }
      }
      
      throw error;
    }
  }

  /**
   * Create a new generation job
   */
  async createGenerationJob(modelImageId: string, outfitImageId: string, options?: any): Promise<GenerationJob> {
    const payload = {
      modelImageId,
      outfitImageId,
      options: options || {
        strength: 0.9,
        preserveFace: true,
        background: 'transparent',
        style: 'artistic'
      }
    };

    return this.request<GenerationJob>('/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<JobStatus> {
    return this.request<JobStatus>(`/generate/${jobId}/status`);
  }

  /**
   * Upload a file directly
   */
  async uploadFile(
    file: File,
    purpose: 'model' | 'outfit' | 'other',
    options?: {
      name?: string;
      tags?: string[];
      isPublic?: boolean;
    }
  ): Promise<{
    imageAsset: {
      id: string;
      url: string;
      type: string;
      width?: number;
      height?: number;
      sizeBytes: number;
      mimeType: string;
    };
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    if (options?.name) {
      formData.append('name', options.name);
    }
    if (options?.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }
    if (options?.isPublic !== undefined) {
      formData.append('isPublic', options.isPublic.toString());
    }

    const url = `${API_BASE_URL}/uploads/direct`;
    
    try {
      const headers: HeadersInit = {};
      if (this.authToken) {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      }
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  /**
   * Get public images (models and outfits) with filtering
   */
  async getPublicImages(params?: {
    type?: 'model' | 'outfit';
    name?: string;
    tags?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{
    images: Array<{
      id: string;
      name: string;
      type: 'model' | 'outfit';
      url: string;
      width?: number;
      height?: number;
      tags: string[];
      metadata: any;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    filters: any;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/public/images?${queryParams}` : '/public/images';
    return this.request(endpoint);
  }

  /**
   * Get user's outfits or models
   */
  async getOutfits(params?: {
    type?: 'model' | 'outfit' | 'output' | 'all';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    favorite?: boolean;
  }): Promise<{
    outfits: any[];
    pagination: any;
    filters: any;
  }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = queryParams.toString() ? `/outfits?${queryParams}` : '/outfits';
    return this.request(endpoint);
  }

  /**
   * Get user's outfits statistics
   */
  async getOutfitsStats(): Promise<{
    total: number;
    byType: {
      model: number;
      outfit: number;
      output: number;
    };
    storageUsage: {
      totalBytes: number;
      totalFiles: number;
      byType: any;
    };
    favorites: number;
    generationAttempts: number;
  }> {
    return this.request('/outfits/stats');
  }

  /**
   * Toggle favorite status for an outfit
   */
  async toggleOutfitFavorite(outfitId: string, favorite: boolean): Promise<{
    message: string;
    image: {
      id: string;
      favorite: boolean;
    };
  }> {
    return this.request(`/outfits/${outfitId}/favorite`, {
      method: 'POST',
      body: JSON.stringify({ favorite }),
    });
  }

  /**
   * Delete an outfit (soft delete)
   */
  async deleteOutfit(outfitId: string): Promise<{
    message: string;
    image: {
      id: string;
      isDeleted: boolean;
    };
  }> {
    return this.request(`/outfits/${outfitId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Update asset metadata
   */
  async updateAssetMetadata(assetId: string, metadata: object): Promise<{
    message: string;
    metadata: object;
  }> {
    return this.request(`/assets/${assetId}/metadata`, {
      method: 'PUT',
      body: JSON.stringify({ metadata }),
    });
  }

  /**
   * Get user profile settings
   */
  async getProfileSettings(): Promise<SettingsResponse> {
    return this.request<SettingsResponse>('/settings/profile');
  }

  /**
   * Update user profile settings
   */
  async updateProfileSettings(profileData: Partial<UserProfile>): Promise<{ message: string; profile: UserProfile }> {
    return this.request<{ message: string; profile: UserProfile }>('/settings/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/settings/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  /**
   * Delete user account
   */
  async deleteAccount(confirmation: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/settings/account', {
      method: 'DELETE',
      body: JSON.stringify({ confirmation }),
    });
  }

  /**
   * Get subscription details
   */
  async getSubscriptionDetails(): Promise<{
    subscription: {
      plan: string;
      status: string;
      trialStatus: {
        hasTrialRemaining: boolean;
        trialUsed: boolean;
        trialEndsAt: string;
        daysRemaining: number;
      };
      usage: {
        used: number;
        limit: number;
        remaining: number;
      };
      resetDate: string;
      currentPeriodEnd?: string;
    };
  }> {
    return this.request('/subscription/details');
  }

  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans(): Promise<{
    plans: Array<{
      id: string;
      name: string;
      description: string;
      price: { monthly: number; yearly: number };
      features: string[];
      monthlyRequests: number;
      popular: boolean;
    }>;
  }> {
    return this.request('/subscription/plans');
  }

  /**
   * Get public subscription plans (does not require authentication)
   */
  async getPublicSubscriptionPlans(): Promise<{
    plans: Array<{
      id: string;
      name: string;
      description: string;
      price: { monthly: number; yearly: number };
      features: string[];
      monthlyRequests: number;
      popular: boolean;
    }>;
  }> {
    return this.request('/public/plans');
  }

  /**
   * Create a Dodo Payments checkout session for subscription upgrade
   */
  async createCheckoutSession(plan: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<{
    url: string;
  }> {
    return this.request('/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ plan, billingCycle }),
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<{
    message: string;
    subscription: {
      plan: string;
      status: string;
      trialStatus: {
        hasTrialRemaining: boolean;
        trialUsed: boolean;
        trialEndsAt: string;
        daysRemaining: number;
      };
      usage: {
        used: number;
        limit: number;
        remaining: number;
      };
      resetDate: string;
      currentPeriodEnd?: string;
    };
  }> {
    return this.request('/subscription/cancel', {
      method: 'POST',
    });
  }

  /**
   * Change subscription plan
   */
  async changeSubscriptionPlan(plan: string, prorationOption: 'prorated_immediately' | 'full_immediately' | 'difference_immediately' = 'prorated_immediately'): Promise<{
    message: string;
    subscription: {
      plan: string;
      status: string;
      trialStatus: {
        hasTrialRemaining: boolean;
        trialUsed: boolean;
        trialEndsAt: string;
        daysRemaining: number;
      };
      usage: {
        used: number;
        limit: number;
        remaining: number;
      };
      resetDate: string;
      currentPeriodEnd?: string;
    };
  }> {
    return this.request('/subscription/change-plan', {
      method: 'POST',
      body: JSON.stringify({ plan, prorationOption }),
    });
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(): Promise<{
    message: string;
    subscription: {
      plan: string;
      status: string;
      trialStatus: {
        hasTrialRemaining: boolean;
        trialUsed: boolean;
        trialEndsAt: string;
        daysRemaining: number;
      };
      usage: {
        used: number;
        limit: number;
        remaining: number;
      };
      resetDate: string;
      currentPeriodEnd?: string;
    };
  }> {
    return this.request('/subscription/reactivate', {
      method: 'POST',
    });
  }

  /**
   * Generate quilt design using AI
   */
  async generateQuiltDesign(prompt: string, options?: {
    style?: string;
    colorPalette?: string[];
    complexity?: number;
    size?: string;
    rows?: number;
    columns?: number;
    symmetry?: string;
  }): Promise<{
    jobId: string;
    status: 'queued' | 'processing' | 'succeeded' | 'failed';
    estimatedTime: number;
    queuePosition?: number;
  }> {
    const payload = {
      prompt,
      options: options || {
        style: 'modern',
        colorPalette: ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'],
        complexity: 3,
        size: 'throw',
        rows: 8,
        columns: 8,
        symmetry: 'mirror'
      }
    };

    return this.request<{
      jobId: string;
      status: 'queued' | 'processing' | 'succeeded' | 'failed';
      estimatedTime: number;
      queuePosition?: number;
    }>('/tools/quilt-design', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Get quilt design job status
   */
  async getQuiltDesignJobStatus(jobId: string): Promise<{
    jobId: string;
    status: 'queued' | 'processing' | 'succeeded' | 'failed';
    userId: string;
    createdAt: string;
    updatedAt: string;
    estimatedTime: number;
    processingTime?: number;
    outputImage?: {
      id: string;
      url: string;
      width: number;
      height: number;
      sizeBytes: number;
      prompt: string;
      metadata: {
        style: string;
        colorPalette: string[];
        complexity: number;
        size: string;
        rows: number;
        columns: number;
        symmetry: string;
      };
    };
    error?: string;
  }> {
    return this.request<{
      jobId: string;
      status: 'queued' | 'processing' | 'succeeded' | 'failed';
      userId: string;
      createdAt: string;
      updatedAt: string;
      estimatedTime: number;
      processingTime?: number;
      outputImage?: {
        id: string;
        url: string;
        width: number;
        height: number;
        sizeBytes: number;
        prompt: string;
        metadata: {
          style: string;
          colorPalette: string[];
          complexity: number;
          size: string;
          rows: number;
          columns: number;
          symmetry: string;
        };
      };
      error?: string;
    }>(`/tools/quilt-design/${jobId}/status`);
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<{ message: string; version: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}`);
      return await response.json();
    } catch (error) {
      throw new Error('Backend server is not running');
    }
  }
}

export const apiService = new ApiService();