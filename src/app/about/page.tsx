"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Users, 
  Sparkles, 
  Target, 
  Zap,
  Camera,
  Palette,
  Shield,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  
  const stats = [
    { number: '10K+', label: 'Happy Users', icon: Users },
    { number: '1M+', label: 'Outfits Visualized', icon: Camera },
    { number: '500+', label: 'Outfit Styles', icon: Palette },
    { number: '99.9%', label: 'Uptime', icon: Zap }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Inclusivity',
      description: 'Fashion should be accessible to everyone, regardless of body type, style preference, or budget.',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'We push the boundaries of AI and fashion technology to create magical experiences.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Your photos and data are secure. We never share personal information without consent.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Empowerment',
      description: 'We help people discover their unique style and build confidence through fashion.',
      color: 'bg-green-50 text-green-600'
    }
  ];


  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-linear-to-r from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Redefining Fashion with AI
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              At SwapMyLook, we believe everyone deserves to look and feel their best. 
              Our AI-powered platform makes fashion exploration fun, accessible, and personal.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-pink-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To democratize fashion by making style exploration accessible, fun, and personal for everyone. 
                We're breaking down barriers between imagination and reality, helping people discover their 
                unique style without the traditional constraints of time, budget, or availability.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A world where everyone feels confident and empowered through fashion. We envision a future 
                where AI-powered tools help people express their authentic selves, discover new styles, 
                and build confidence that extends far beyond their wardrobe.
              </p>
            </div>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${value.color}`}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-linear-to-r from-pink-500 to-purple-600 text-white">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Transform Your Style?</h2>
              <p className="text-lg text-pink-100 max-w-2xl mx-auto">
                Join thousands of fashion enthusiasts who are already discovering their perfect style with SwapMyLook.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => router.push('/login')}
                className="bg-white text-pink-600 hover:bg-pink-50"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}