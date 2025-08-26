import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Zap, Users, BarChart3, Globe, CheckCircle } from 'lucide-react';
import { HiblaLogo } from '@/components/HiblaLogo';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <HiblaLogo size="md" showText />
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
              System Online
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-10 dark:opacity-5" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-10 dark:opacity-5" />
        </div>
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-5xl mx-auto text-center">
            <Badge className="mb-6" variant="outline">
              Internal Manufacturing Operations
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="text-slate-900 dark:text-white">Manufacturing</span>
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                Excellence Redefined
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Streamline your entire manufacturing workflow with our comprehensive platform. 
              From quotations to global distribution, experience unparalleled operational efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7"
                onClick={onLogin}
              >
                Access System
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold">22</div>
                <div className="text-sm text-muted-foreground mt-1">Active Quotations</div>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold">10</div>
                <div className="text-sm text-muted-foreground mt-1">Sales Orders</div>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-muted-foreground mt-1">Job Orders</div>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-sm border">
                <div className="text-3xl font-bold">16</div>
                <div className="text-sm text-muted-foreground mt-1">Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 text-emerald-700 dark:text-emerald-300 border-0 px-4 py-2 animate-scale-in">
              🚀 Powerful Features
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Manufacturing
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">
                Solutions
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              Everything you need to manage your manufacturing operations with precision and efficiency
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group relative overflow-hidden border-0 bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-in-left" style={{animationDelay: '0.6s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '1.0s'}}>
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sales Operations</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Complete quotation management with automated workflows and comprehensive tracking
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '0.7s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900 dark:to-green-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '1.1s'}}>
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3">Production Management</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Real-time production tracking and job order management with quality control
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-in-right" style={{animationDelay: '0.8s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '1.2s'}}>
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3">Inventory & Warehousing</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Multi-location inventory management and tracking with automated updates
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-in-left" style={{animationDelay: '0.9s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '1.3s'}}>
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3">Financial Operations</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Comprehensive financial tracking and payment processing with detailed reporting
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{animationDelay: '1.0s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '1.4s'}}>
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3">Reports & Analytics</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Advanced reporting and business intelligence with real-time dashboards
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-white dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slide-in-right" style={{animationDelay: '1.1s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 animate-float" style={{animationDelay: '1.5s'}}>
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white mb-3">Administration</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  User management and system administration with role-based access control
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Access the System?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Log in to access your manufacturing operations dashboard and manage your business efficiently.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            onClick={onLogin}
          >
            Staff Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="relative">
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-12 mb-12">
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <HiblaLogo size="md" showText={true} />
                <p className="text-slate-300 leading-relaxed max-w-sm">
                  Transforming manufacturing operations with cutting-edge technology and seamless workflow management.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover-lift animate-float" style={{animationDelay: '0.4s'}}>
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-lg flex items-center justify-center hover-lift animate-float" style={{animationDelay: '0.6s'}}>
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center hover-lift animate-float" style={{animationDelay: '0.8s'}}>
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <h3 className="text-xl font-bold text-white mb-4">Platform Features</h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center animate-slide-in-left" style={{animationDelay: '0.6s'}}>
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />
                    Quotation Management
                  </li>
                  <li className="flex items-center animate-slide-in-left" style={{animationDelay: '0.7s'}}>
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />
                    Production Tracking
                  </li>
                  <li className="flex items-center animate-slide-in-left" style={{animationDelay: '0.8s'}}>
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />
                    Inventory Control
                  </li>
                  <li className="flex items-center animate-slide-in-left" style={{animationDelay: '0.9s'}}>
                    <CheckCircle className="h-4 w-4 text-emerald-400 mr-3" />
                    Financial Operations
                  </li>
                </ul>
              </div>
              
              <div className="space-y-6 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover-lift animate-scale-in" style={{animationDelay: '0.8s'}}>
                    <span className="text-slate-300">Platform Status</span>
                    <Badge className="bg-emerald-600 text-white border-0">
                      ● Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover-lift animate-scale-in" style={{animationDelay: '0.9s'}}>
                    <span className="text-slate-300">Last Updated</span>
                    <span className="text-slate-400 text-sm">Just now</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover-lift animate-scale-in" style={{animationDelay: '1.0s'}}>
                    <span className="text-slate-300">Version</span>
                    <span className="text-slate-400 text-sm">v2.0.1</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center animate-fade-in-up" style={{animationDelay: '1.2s'}}>
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-slate-400">
                    Premium Real Filipino Hair Manufacturer - Internal Operations Platform
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    © 2025 Hibla Manufacturing. All rights reserved.
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-slate-400">
                  <span>Secure Platform</span>
                  <span>•</span>
                  <span>24/7 Support</span>
                  <span>•</span>
                  <span>Enterprise Grade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}