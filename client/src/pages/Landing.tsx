import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HiblaLogo } from '@/components/HiblaLogo';
import { 
  Factory, 
  Package, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  FileText,
  Truck,
  TrendingUp
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Factory,
      title: 'Production Management',
      description: 'Complete job order tracking from quotation to delivery with real-time production monitoring.'
    },
    {
      icon: Package,
      title: 'Multi-Warehouse Inventory',
      description: 'Manage inventory across 6+ warehouse locations with automated stock alerts and transfers.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time dashboards and comprehensive reports for data-driven manufacturing decisions.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Predictive inventory management and demand forecasting powered by artificial intelligence.'
    },
    {
      icon: Shield,
      title: 'Dual-Portal Access',
      description: 'Separate secure portals for customers and administrative staff with role-based permissions.'
    },
    {
      icon: Globe,
      title: 'Global Distribution',
      description: 'Complete supply chain management for international Filipino hair product distribution.'
    }
  ];

  const stats = [
    { label: 'Manufacturing Orders', value: '500+', icon: Factory },
    { label: 'Warehouse Locations', value: '6+', icon: Package },
    { label: 'Global Customers', value: '100+', icon: Users },
    { label: 'System Uptime', value: '99.9%', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-200/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }} />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-200/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-pink-200/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-300/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }} />
        </div>

        <div className="container mx-auto text-center relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 -m-4 bg-gradient-to-br from-purple-100/50 via-cyan-100/50 to-pink-100/50 dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-pink-900/20 rounded-full blur-xl" />
              <HiblaLogo size="xl" showText />
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 bg-clip-text text-transparent">
              Hibla Filipino Hair
            </span>
            <br />
            <span className="text-3xl lg:text-4xl">Manufacturing System</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Complete manufacturing and supply chain management platform for premium real Filipino hair products. 
            Streamline your production workflow from customer quotations to global distribution.
          </p>

          {/* Status badge */}
          <div className="flex justify-center mb-8">
            <Badge className="px-4 py-2 bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              Production Ready System
            </Badge>
          </div>


        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-full">
                      <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Manufacturing Solution
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Integrated tools and features designed specifically for hair manufacturing and global distribution operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 shadow-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600/5 via-cyan-600/5 to-pink-600/5 dark:from-purple-900/10 dark:via-cyan-900/10 dark:to-pink-900/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Built for Filipino Hair Manufacturing Excellence
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Quotation to Delivery:</strong> Complete workflow management from initial customer inquiry to final product delivery.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Real-time Monitoring:</strong> Track production status, inventory levels, and order fulfillment across all operations.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Global Distribution:</strong> Manage international shipping, customs documentation, and customer communications.
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Business Intelligence:</strong> AI-powered insights for demand forecasting and inventory optimization.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-lg">Smart Quotation System</h4>
                      <p className="text-gray-600 dark:text-gray-400">Automated pricing, VLOOKUP integration, and instant PDF generation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Truck className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-lg">Shipment Tracking</h4>
                      <p className="text-gray-600 dark:text-gray-400">Real-time tracking with customer notifications and delivery confirmation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                    <div>
                      <h4 className="font-semibold text-lg">Secure Access Control</h4>
                      <p className="text-gray-600 dark:text-gray-400">Role-based permissions with separate customer and admin portals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <HiblaLogo size="md" showText />
          </div>
          <p className="text-gray-400 mb-4">
            Premium Real Filipino Hair Manufacturing & Global Distribution
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span>© 2025 Hibla Filipino Hair</span>
            <span>Manufacturing Excellence</span>
            <span>Global Quality Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}