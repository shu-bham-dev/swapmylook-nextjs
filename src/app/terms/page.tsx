"use client";

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  FileText, 
  Eye, 
  Lock, 
  Download, 
  UserCheck, 
  AlertCircle,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  const lastUpdated = "December 15, 2025";

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Terms & Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy and security are our top priorities. Learn how we protect your data and what rights you have.
          </p>
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last updated: {lastUpdated}</span>
          </div>
        </div>

        {/* Quick Summary */}
        <Card className="p-6 mb-8 bg-linear-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-blue-800">Quick Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">We never sell your personal data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">Photos are processed securely and deleted after 30 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">You own all rights to your uploaded images</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">You can delete your account and data anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">We use industry-standard encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-700">GDPR and CCPA compliant</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="privacy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-pink-50">
            <TabsTrigger value="privacy" className="data-[state=active]:bg-pink-200">
              <Lock className="w-4 h-4 mr-2" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="data-[state=active]:bg-pink-200">
              <FileText className="w-4 h-4 mr-2" />
              Terms of Service
            </TabsTrigger>
          </TabsList>

          {/* Privacy Policy */}
          <TabsContent value="privacy">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Information We Collect</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Personal Information</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      When you create an account or use our services, we may collect:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Name and email address</li>
                      <li>• Profile information you choose to provide</li>
                      <li>• Payment information (processed securely by Dodo Payments)</li>
                      <li>• Communication preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Images and Content</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Photos you upload for outfit visualization:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Processed securely on our servers</li>
                      <li>• Used only for outfit visualization services</li>
                      <li>• Automatically deleted after 30 days</li>
                      <li>• Never shared with third parties</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Usage Data</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      To improve our services, we collect:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Features you use and how often</li>
                      <li>• Performance metrics and error reports</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">How We Use Your Information</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-3">
                    <UserCheck className="w-5 h-5 text-pink-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Provide Services</p>
                      <p>Process outfit visualizations, manage your account, and provide customer support</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Improve Platform</p>
                      <p>Analyze usage patterns to enhance features, fix bugs, and develop new capabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Communication</p>
                      <p>Send important updates, respond to inquiries, and provide optional marketing (with consent)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Security</p>
                      <p>Protect against fraud, abuse, and unauthorized access to our platform</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Data Security & Storage</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-pink-800">Encryption</h4>
                      <p className="text-sm text-pink-700">
                        All data is encrypted in transit (TLS 1.3) and at rest (AES-256) using industry standards.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-800">Access Control</h4>
                      <p className="text-sm text-blue-700">
                        Strict access controls ensure only authorized personnel can access user data.
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-green-800">Data Centers</h4>
                      <p className="text-sm text-green-700">
                        Data stored in secure, SOC 2 compliant data centers with 24/7 monitoring.
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium mb-2 text-purple-800">Backup & Recovery</h4>
                      <p className="text-sm text-purple-700">
                        Regular backups with disaster recovery plans to ensure data availability.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Your Rights & Choices</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Access & Control</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• View all data we have about you</li>
                        <li>• Download your data in a portable format</li>
                        <li>• Correct inaccurate information</li>
                        <li>• Delete your account and all data</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Communication Preferences</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• Opt out of marketing emails</li>
                        <li>• Choose notification preferences</li>
                        <li>• Control cookie settings</li>
                        <li>• Manage third-party integrations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Terms of Service */}
          <TabsContent value="terms">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Acceptance of Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using SwapMyLook ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you disagree with any part of these terms, you may not access the Service. These Terms apply to all 
                  visitors, users, and others who access or use the Service.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Use of Service</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">You May:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Use the Service for personal, non-commercial purposes</li>
                      <li>• Upload photos of yourself or with proper consent</li>
                      <li>• Share generated outfit visualizations on social media</li>
                      <li>• Cancel your subscription at any time</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-red-700">You May Not:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• Upload photos without proper consent or rights</li>
                      <li>• Use the Service for illegal or harmful purposes</li>
                      <li>• Attempt to reverse engineer or copy our technology</li>
                      <li>• Share your account credentials with others</li>
                      <li>• Use automated tools to access the Service</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Content & Intellectual Property</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Your Content</h4>
                    <p className="text-sm text-muted-foreground">
                      You retain all rights to photos and content you upload. By using our Service, you grant us a 
                      limited license to process your images for outfit visualization purposes only. We will never 
                      use your photos for marketing or share them without your explicit consent.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Our Content</h4>
                    <p className="text-sm text-muted-foreground">
                      The Service, including all software, designs, text, graphics, and other content, is owned by 
                      SwapMyLook and protected by intellectual property laws. You may not copy, modify, or distribute 
                      our content without written permission.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Subscription & Payments</h3>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Billing</h4>
                    <p>
                      Subscription fees are billed in advance on a monthly or yearly basis. All payments are processed 
                      securely through Dodo payments. Prices may change with 30 days notice to existing subscribers.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Cancellation</h4>
                    <p>
                      You may cancel your subscription at any time through your account settings. Cancellation takes 
                      effect at the end of the current billing period. No refunds for partial months, except as 
                      required by law.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Free Trial</h4>
                    <p>
                      New users may be eligible for a free trial. At the end of the trial, you'll be charged unless 
                      you cancel. Trial periods and terms may vary by promotion.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Disclaimers & Limitations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Service Availability</h4>
                        <p className="text-sm text-yellow-700">
                          While we strive for 99.9% uptime, the Service is provided "as is" without warranties. 
                          We may temporarily suspend the Service for maintenance or updates.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Accuracy</h4>
                    <p className="text-sm text-muted-foreground">
                      Outfit visualizations are AI-generated approximations. Results may vary based on image quality, 
                      lighting, and other factors. We do not guarantee perfect accuracy in all visualizations.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Limitation of Liability</h4>
                    <p className="text-sm text-muted-foreground">
                      Our liability is limited to the amount paid for the Service in the past 12 months. We are not 
                      liable for indirect, incidental, or consequential damages.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <p className="text-muted-foreground">
                    If you have questions about these Terms or our Privacy Policy, please contact us:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-pink-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">legal@swapmylook.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push('/contact')}
                    className="mt-4 bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Contact Legal Team
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Notice */}
        <Card className="mt-8 p-4 bg-gray-50 border-gray-200">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              These terms are effective as of {lastUpdated}. We may update these terms from time to time.
              Continued use of the Service constitutes acceptance of any changes.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}