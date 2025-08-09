import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { HiblaLogo } from '@/components/HiblaLogo';
import {
  Factory,
  FileText,
  ShoppingCart,
  Package2,
  Package,
  BarChart3,
  Menu,
  Home,
  Bell,
  User,
  DollarSign,
  Boxes,
  Zap,
  FileBarChart,
  UserCheck,
  Users
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/quotations', label: 'Quotations', icon: FileText },
  { path: '/sales-orders', label: 'Sales Orders', icon: ShoppingCart },
  { path: '/job-orders', label: 'Job Orders', icon: Factory },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/inventory-insights', label: 'AI Insights', icon: Zap },
  { path: '/summary-reports', label: 'Reports', icon: FileBarChart },
  { path: '/price-management', label: 'Price Management', icon: DollarSign },
  { path: '/customer-management', label: 'Customers', icon: Users },
  { path: '/staff-management', label: 'Staff', icon: UserCheck },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('space-y-2', mobile && 'px-4')}>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        
        return (
          <Link key={item.path} href={item.path}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              size={mobile ? 'lg' : 'default'}
              className={cn(
                'w-full justify-start touch-target',
                mobile && 'min-h-[3rem] text-left p-4',
                isActive && 'bg-primary text-primary-foreground shadow-lg'
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <Icon className={cn(
                mobile ? "h-5 w-5 mr-4" : "h-4 w-4 mr-3",
                "flex-shrink-0"
              )} />
              <span className="truncate">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:bg-card md:border-r">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b bg-gradient-to-r from-primary/5 to-cyan-500/5">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <HiblaLogo size="md" showText />
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <NavItems />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="h-16 border-b bg-card px-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex items-center h-16 px-4 border-b bg-gradient-to-r from-primary/5 to-cyan-500/5">
                  <Link href="/" onClick={() => setSidebarOpen(false)} className="hover:opacity-90 transition-opacity">
                    <HiblaLogo size="md" showText />
                  </Link>
                </div>
                <nav className="flex-1 px-4 py-6">
                  <NavItems mobile />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="ml-4 md:ml-0 flex items-center">
              <div className="md:hidden">
                <HiblaLogo size="sm" showText />
              </div>
              <h1 className="hidden md:block text-lg font-semibold">
                Hibla Filipino Hair
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="hidden md:flex">
              Production Ready
            </Badge>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}