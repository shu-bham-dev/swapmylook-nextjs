"use client";

import { useState, useEffect, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  Star,
  Users,
  CreditCard,
  Shield,
  Heart,
  RefreshCw
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

function SubscriptionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<{
    subscriptionId?: string;
    status?: string;
    message?: string;
    type?: 'success' | 'warning' | 'info';
  } | null>(null);

  useEffect(() => {
    // Check for payment return parameters
    const subscriptionId = searchParams.get('subscription_id');
    const status = searchParams.get('status');

    if (subscriptionId && status) {
      // Clear URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);

      // Set payment status message
      let message = '';
      let type: 'success' | 'warning' | 'info' = 'info';

      switch (status) {
        case 'active':
          message = '🎉 Your subscription has been activated successfully!';
          type = 'success';
          break;
        case 'pending':
          message = '⏳ Your payment is being processed. This may take a few minutes.';
          type = 'warning';
          break;
        case 'canceled':
          message = '❌ Your subscription was cancelled.';
          type = 'warning';
          break;
        case 'past_due':
          message = '⚠️ Your payment failed. Please update your payment method.';
          type = 'warning';
          break;
        default:
          message = `Payment status: ${status}`;
          type = 'info';
      }

      setPaymentStatus({
        subscriptionId,
        status,
        message,
        type
      });

      // Show toast notification
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'warning') {
        toast.warning(message);
      } else {
        toast.info(message);
      }
    }

    fetchSubscriptionData();
  }, []);

  // Poll for subscription status updates when payment is pending (only for authenticated users)
  useEffect(() => {
    if (paymentStatus?.status === 'pending' && apiService.isAuthenticated()) {
      const pollInterval = setInterval(async () => {
        try {
          const response = await apiService.getSubscriptionDetails();
          const currentStatus = response.subscription.status;

          if (currentStatus !== 'pending') {
            // Status has changed
            let message = '';
            let type: 'success' | 'warning' | 'info' = 'info';

            switch (currentStatus) {
              case 'active':
                message = '🎉 Your subscription has been activated successfully!';
                type = 'success';
                break;
              case 'canceled':
                message = '❌ Your subscription was cancelled.';
                type = 'warning';
                break;
              case 'past_due':
                message = '⚠️ Your payment failed. Please update your payment method.';
                type = 'warning';
                break;
              default:
                message = `Subscription status updated to: ${currentStatus}`;
                type = 'info';
            }

            setPaymentStatus({
              subscriptionId: paymentStatus.subscriptionId,
              status: currentStatus,
              message,
              type
            });

            // Show toast notification
            if (type === 'success') {
              toast.success(message);
            } else if (type === 'warning') {
              toast.warning(message);
            } else {
              toast.info(message);
            }

            // Refresh subscription data
            await fetchSubscriptionData();

            // Stop polling
            clearInterval(pollInterval);
          }
        } catch (error) {
          console.error('Error polling subscription status:', error);
        }
      }, 5000); // Poll every 5 seconds

      // Stop polling after 2 minutes
      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        setPaymentStatus(prev => prev ? {
          ...prev,
          message: '⏳ Payment processing is taking longer than expected. Please refresh the page to check status.',
          type: 'warning'
        } : null);
      }, 120000); // 2 minutes

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [paymentStatus?.status]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const isAuthenticated = apiService.isAuthenticated();
      
      if (isAuthenticated) {
        // For authenticated users, fetch both subscription details and plans
        const [subscriptionResponse, plansResponse] = await Promise.all([
          apiService.getSubscriptionDetails(),
          apiService.getSubscriptionPlans()
        ]);
        
        setSubscriptionData(subscriptionResponse.subscription);
        setPlans(plansResponse.plans);
        setSelectedPlan(subscriptionResponse.subscription.plan);
      } else {
        // For non-authenticated users, only fetch public plans
        const plansResponse = await apiService.getPublicSubscriptionPlans();
        setSubscriptionData(null); // No subscription data for non-logged-in users
        setPlans(plansResponse.plans);
        setSelectedPlan('free'); // Default to free plan for display
      }
    } catch (error) {
      console.error('Failed to fetch subscription data:', error);
      // Don't show error toast for non-authenticated users - it's expected
      if (apiService.isAuthenticated()) {
        toast.error('Failed to load subscription data');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentUsage = subscriptionData ? {
    visualizations: subscriptionData.usage.used,
    limit: subscriptionData.usage.limit,
    daysLeft: subscriptionData.trialStatus.daysRemaining || 0
  } : {
    visualizations: 0,
    limit: 1,
    daysLeft: 0
  };

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      return;
    }

    // Check if user is authenticated
    const isAuthenticated = apiService.isAuthenticated();
    if (!isAuthenticated) {
      // Redirect to login page with a message
      toast.info('Please login or sign up to upgrade your plan');
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    try {
      setSelectedPlan(planId);

      // If user has an active subscription, use change plan instead of checkout
      if (subscriptionData?.status === 'active' && subscriptionData?.plan !== 'free') {
        const prorationOption = 'prorated_immediately'; // Default proration
        await apiService.changeSubscriptionPlan(planId, prorationOption);
        toast.success('Plan change initiated successfully. Changes will apply once payment is processed.');
        await fetchSubscriptionData();
      } else {
        // New subscription or upgrading from free
        const { url } = await apiService.createCheckoutSession(planId, billingCycle);
        // Redirect to Dodo Payments hosted checkout
        window.location.href = url;
        // Note: after successful payment, webhook will update subscription
        // The user will be redirected back to return_url (configured in backend)
      }
    } catch (error) {
      console.error('Failed to process subscription change:', error);
      toast.error('Failed to process subscription change. Please try again.');
    }
  };

  const handleReactivate = async () => {
    try {
      await apiService.reactivateSubscription();
      toast.success('Subscription reactivation initiated successfully.');
      await fetchSubscriptionData();
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      toast.error('Failed to reactivate subscription. Please try again.');
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await apiService.cancelSubscription();
      toast.success('Subscription cancelled successfully');
      await fetchSubscriptionData();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  const getPrice = (plan: typeof plans[0]) => {
    const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
    const period = billingCycle === 'monthly' ? 'month' : 'year';
    return { price, period };
  };

  const getDiscount = () => {
    return billingCycle === 'yearly' ? 20 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Status Alert */}
        {paymentStatus && (
          <Card className={`p-4 mb-6 border-l-4 ${
            paymentStatus.type === 'success'
              ? 'border-l-green-500 bg-green-50'
              : paymentStatus.type === 'warning'
              ? 'border-l-yellow-500 bg-yellow-50'
              : 'border-l-blue-500 bg-blue-50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  paymentStatus.type === 'success'
                    ? 'bg-green-100 text-green-600'
                    : paymentStatus.type === 'warning'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {paymentStatus.type === 'success' ? '✓' :
                   paymentStatus.type === 'warning' ? '⚠' : 'ℹ'}
                </div>
                <div>
                  <p className={`font-medium ${
                    paymentStatus.type === 'success'
                      ? 'text-green-800'
                      : paymentStatus.type === 'warning'
                      ? 'text-yellow-800'
                      : 'text-blue-800'
                  }`}>
                    {paymentStatus.message}
                  </p>
                  {paymentStatus.subscriptionId && (
                    <p className="text-sm text-gray-600 mt-1">
                      Subscription ID: {paymentStatus.subscriptionId}
                    </p>
                  )}
                </div>
              </div>
              {paymentStatus.message?.includes('taking longer than expected') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="ml-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Choose Your Style Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your fashion potential with our AI-powered outfit visualization tools.
            Start your style journey today!
          </p>
        </div>

        {/* Current Usage (for logged-in users) */}
        {subscriptionData && (
          <Card className="p-6 mb-8 bg-linear-to-r from-pink-50 to-purple-50 border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-pink-800">Current Usage</h3>
                  <p className="text-sm text-pink-600">
                    {subscriptionData.plan.charAt(0).toUpperCase() + subscriptionData.plan.slice(1)} Plan •
                    {subscriptionData.trialStatus.hasTrialRemaining ? (
                      <> {subscriptionData.trialStatus.daysRemaining} days trial remaining</>
                    ) : subscriptionData.currentPeriodEnd ? (
                      <> Plan active until {new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()}</>
                    ) : (
                      <> Free plan</>
                    )}
                  </p>
                </div>
              </div>
              <Badge className="bg-pink-200 text-pink-800 border-pink-300">
                {currentUsage.visualizations}/{currentUsage.limit} used
              </Badge>
            </div>
            <Progress
              value={(currentUsage.visualizations / currentUsage.limit) * 100}
              className="h-3 mb-2"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-pink-700">
                You've used {currentUsage.visualizations} of {currentUsage.limit} outfit visualizations this month.
              </p>
              {subscriptionData.plan !== 'free' && (
                <Button variant="outline" size="sm" onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Billing Toggle - Tabs */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Tabs
            value={billingCycle}
            onValueChange={(value: string) => setBillingCycle(value as 'monthly' | 'yearly')}
            className="w-full max-w-md"
          >
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="monthly" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Yearly
                {billingCycle === 'yearly' && (
                  <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs">
                    Save 20%
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {billingCycle === 'yearly' && (
            <p className="text-sm text-green-600 mt-2">
              Get 2 months free when you choose yearly billing
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.length > 0 ? plans.map((plan) => {
            const { price, period } = getPrice(plan);
            const Icon = plan.id === 'free' ? Heart : plan.id === 'basic' ? Sparkles : plan.id === 'premium' ? Crown : Users;
            const isCurrentPlan = subscriptionData ? plan.id === subscriptionData.plan : false;
            
            // Define default styling for each plan
            const planStyles = {
              free: { color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
              basic: { color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
              premium: { color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: 'border-pink-200' },
              pro: { color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' }
            };
            
            const style = planStyles[plan.id as keyof typeof planStyles] || planStyles.free;
            
            return (
              <Card
                key={plan.id}
                className={`relative p-6 transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? 'ring-2 ring-pink-400 shadow-lg scale-105'
                    : `${style.borderColor} hover:ring-2 hover:ring-opacity-50`
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-pink-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className={`w-12 h-12 ${style.bgColor} rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${style.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">${price}</span>
                      <span className="text-muted-foreground">/{period}</span>
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <p className="text-sm text-green-600">
                        Save ${(plan.price.monthly * 12 - plan.price.yearly)} per year
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="font-medium">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features && plan.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      subscriptionData?.status === 'canceled' ? (
                        <Button
                          onClick={handleReactivate}
                          className="w-full bg-green-500 hover:bg-green-600 text-white"
                        >
                          Reactivate Subscription
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Current Plan
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={plan.id === 'free'}
                        className={`w-full ${
                          plan.id === 'free'
                            ? 'bg-gray-600 hover:bg-gray-700'
                            : plan.popular
                            ? 'bg-pink-500 hover:bg-pink-600'
                            : 'bg-purple-500 hover:bg-purple-600'
                        } text-white`}
                      >
                        {plan.id === 'free'
                          ? 'Free Plan'
                          : subscriptionData?.status === 'active' && subscriptionData?.plan !== 'free'
                          ? `Change to ${plan.name}`
                          : subscriptionData
                          ? `Upgrade to ${plan.name}`
                          : `Get ${plan.name}`}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          }) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">No subscription plans available.</p>
            </div>
          )}
        </div>

        {/* FAQ */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Can I change my plan anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! You can upgrade, downgrade, or cancel your subscription at any time.
                  Changes take effect at your next billing cycle.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">What happens to my credits when I upgrade?</h4>
                <p className="text-sm text-muted-foreground">
                  Unused credits from your current plan will be added to your new plan allowance.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! Every new user gets 1 free outfit visualization to try our platform.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Trust Indicators */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Join 10,000+ fashion enthusiasts already using SwapMyLook
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 rounded-full animate-spin border-t-pink-500 mx-auto"></div>
        </div>
      </div>
    }>
      <SubscriptionPageContent />
    </Suspense>
  );
}