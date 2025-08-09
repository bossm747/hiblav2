import React from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Factory, 
  FileText, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Brain,
  BookOpen,
  Home
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [location] = useLocation();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/quotations', label: 'Quotations', icon: FileText },
    { path: '/quotations-vlookup', label: 'VLOOKUP Quotations', icon: FileText },
    { path: '/sales-orders', label: 'Sales Orders', icon: ShoppingCart },
    { path: '/job-orders', label: 'Job Orders', icon: Factory },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/ai-insights', label: 'AI Insights', icon: Brain },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
    { path: '/documentation', label: 'Documentation', icon: BookOpen }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Factory className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Hibla Manufacturing</h1>
              <Badge variant="outline" className="ml-3">
                v1.0 - Production Ready
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Manufacturing & Supply System
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm min-h-screen p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start ${isActive ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;