import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { HiblaLogo } from '@/components/HiblaLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  Users,
  Receipt,
  Mail,
  ExternalLink,
  Shield,
  CheckCircle,
  FileCheck,
  CreditCard,
  Truck,
  ArrowLeftRight,
  LogOut,
  Settings
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Consolidated navigation structure based on client requirements and workflow analysis
const navigationModules = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: Home,
    description: 'Real-time manufacturing overview'
  },
  { 
    path: '/sales-operations', 
    label: 'Sales Operations', 
    icon: FileText,
    description: 'Quotations, Sales Orders, Customers',
    subItems: [
      { path: '/quotations', label: 'Quotations', icon: FileText },
      { path: '/quotations-vlookup', label: 'VLOOKUP Quotations', icon: FileText },
      { path: '/sales-orders', label: 'Sales Orders', icon: ShoppingCart },
      { path: '/customer-management', label: 'Customer Management', icon: Users },
      { path: '/price-management', label: 'Price Management', icon: DollarSign },
    ]
  },
  { 
    path: '/production', 
    label: 'Production', 
    icon: Factory,
    description: 'Job Orders, Production Tracking',
    subItems: [
      { path: '/job-orders', label: 'Job Orders', icon: Factory },
      { path: '/production', label: 'Production Tracking', icon: Factory },
      { path: '/ready-items-summary', label: 'Ready Items Summary', icon: CheckCircle },
    ]
  },
  { 
    path: '/inventory-warehouses', 
    label: 'Inventory & Warehouses', 
    icon: Package,
    description: 'Stock Management, Transfers, AI Insights',
    subItems: [
      { path: '/inventory', label: 'Inventory Management', icon: Package },
      { path: '/inventory-transfers', label: 'Stock Transfers', icon: ArrowLeftRight },
      { path: '/products', label: 'Product Master', icon: Package2 },
      { path: '/warehouses', label: 'Warehouse Management', icon: Warehouse },
      { path: '/inventory-insights', label: 'AI Inventory Insights', icon: Zap },
    ]
  },
  { 
    path: '/financial-operations', 
    label: 'Financial Operations', 
    icon: CreditCard,
    description: 'Invoices, Payments, Accounting',
    subItems: [
      { path: '/invoices', label: 'Invoices', icon: FileCheck },
      { path: '/payment-recording', label: 'Payment Recording', icon: Receipt },
    ]
  },
  { 
    path: '/reports-analytics', 
    label: 'Reports & Analytics', 
    icon: FileBarChart,
    description: 'Comprehensive reporting across all modules',
    subItems: [
      { path: '/summary-reports', label: 'Summary Reports', icon: FileBarChart },
    ]
  },
  { 
    path: '/administration', 
    label: 'Administration', 
    icon: Settings,
    description: 'System Configuration, User Management',
    subItems: [
      { path: '/staff-management', label: 'Staff Management', icon: UserCheck },
      { path: '/access-management', label: 'Access Management', icon: Shield },
      { path: '/email-settings', label: 'Email Settings', icon: Mail },
    ]
  },
];

// Legacy navigation items for pages that don't need module grouping
const standalonePages = [
  { path: '/admin-portal', label: 'Admin Portal', icon: Shield },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    setLocation('/admin-portal');
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('space-y-3', mobile && 'px-4')}>
      {navigationModules.map((module) => {
        const Icon = module.icon;
        const isModuleActive = location === module.path || 
          (module.subItems && module.subItems.some(sub => location === sub.path));
        
        // For modules with sub-items, show as expandable
        if (module.subItems && module.subItems.length > 0) {
          return (
            <div key={module.path} className="space-y-1">
              {/* Module Header */}
              <div className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground',
                'flex items-center space-x-3',
                mobile && 'px-4 py-3 min-h-[44px]'
              )}>
                <Icon className={cn(
                  mobile ? "h-5 w-5" : "h-4 w-4",
                  "flex-shrink-0",
                  isModuleActive && 'text-primary'
                )} />
                <span className="truncate">{module.label}</span>
              </div>
              
              {/* Sub-items */}
              <div className="space-y-1 ml-6">
                {module.subItems.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = location === subItem.path;
                  
                  return (
                    <Link key={subItem.path} href={subItem.path}>
                      <Button
                        variant={isSubActive ? 'default' : 'ghost'}
                        size={mobile ? 'sm' : 'sm'}
                        className={cn(
                          'w-full justify-start touch-target transition-all duration-200',
                          mobile && 'min-h-[40px] text-left p-3 rounded-lg active:scale-95',
                          mobile && 'hover:bg-muted/80 hover:shadow-sm',
                          isSubActive && mobile && 'bg-primary text-primary-foreground shadow-md font-medium',
                          isSubActive && !mobile && 'bg-primary text-primary-foreground shadow-lg',
                          !isSubActive && mobile && 'text-foreground hover:text-foreground',
                          'text-sm'
                        )}
                        onClick={() => mobile && setSidebarOpen(false)}
                      >
                        <SubIcon className={cn(
                          mobile ? "h-4 w-4 mr-3" : "h-3 w-3 mr-2",
                          "flex-shrink-0"
                        )} />
                        <span className="truncate">{subItem.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }
        
        // For standalone modules (like Dashboard)
        return (
          <Link key={module.path} href={module.path}>
            <Button
              variant={isModuleActive ? 'default' : 'ghost'}
              size={mobile ? 'lg' : 'default'}
              className={cn(
                'w-full justify-start touch-target transition-all duration-200',
                mobile && 'min-h-[44px] text-left p-3 rounded-lg active:scale-95',
                mobile && 'hover:bg-muted/80 hover:shadow-sm',
                isModuleActive && mobile && 'bg-primary text-primary-foreground shadow-md font-medium',
                isModuleActive && !mobile && 'bg-primary text-primary-foreground shadow-lg',
                !isModuleActive && mobile && 'text-foreground hover:text-foreground'
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <Icon className={cn(
                mobile ? "h-5 w-5 mr-4" : "h-4 w-4 mr-3",
                "flex-shrink-0"
              )} />
              <span className="truncate">{module.label}</span>
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
              <SheetContent side="left" className="w-[50vw] p-0 h-full max-w-md min-w-72">
                <div className="flex flex-col h-full">
                  {/* Fixed Mobile Header */}
                  <div className="flex items-center h-16 px-4 border-b bg-gradient-to-r from-primary/5 to-cyan-500/5 flex-shrink-0">
                    <Link href="/" onClick={() => setSidebarOpen(false)} className="hover:opacity-90 transition-opacity">
                      <HiblaLogo size="md" showText />
                    </Link>
                  </div>
                  
                  {/* Scrollable Navigation Content */}
                  <div className="flex-1 overflow-y-auto">
                    <nav className="px-4 py-6">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
                          Manufacturing System
                        </div>
                        <NavItems mobile />
                      </div>
                    </nav>
                  </div>
                  
                  {/* Fixed Mobile Footer */}
                  <div className="border-t bg-card/50 p-4 flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      Hibla Filipino Hair Manufacturing
                    </div>
                  </div>
                </div>
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
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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