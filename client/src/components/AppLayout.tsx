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
  Warehouse,
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
  { path: '/products', label: 'Products', icon: Package2 },
  { path: '/warehouses', label: 'Warehouses', icon: Warehouse },
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
                'w-full justify-start touch-target transition-all duration-200',
                mobile && 'min-h-[3.5rem] text-left p-4 rounded-xl active:scale-95',
                mobile && 'hover:bg-muted/50 hover:shadow-sm',
                isActive && mobile && 'bg-primary/15 text-primary border border-primary/30 shadow-lg font-medium',
                isActive && !mobile && 'bg-primary text-primary-foreground shadow-lg',
                !isActive && mobile && 'text-foreground/80'
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
              <SheetContent side="left" className="w-80 p-0 max-w-[90vw]">
                {/* Enhanced Mobile Header */}
                <div className="flex items-center h-20 px-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                  <Link href="/" onClick={() => setSidebarOpen(false)} className="hover:opacity-90 transition-opacity">
                    <HiblaLogo size="lg" showText />
                  </Link>
                </div>
                
                {/* Enhanced Mobile Navigation */}
                <nav className="flex-1 px-6 py-8 overflow-y-auto">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                      Manufacturing System
                    </div>
                    <NavItems mobile />
                  </div>
                  
                  {/* Mobile Footer */}
                  <div className="mt-auto pt-8 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Hibla Filipino Hair Manufacturing
                    </div>
                  </div>
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