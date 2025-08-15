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
  Settings,
  X,
  Plus
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
    path: '/sales-operations-dashboard', 
    label: 'Sales Operations Management', 
    icon: FileText,
    description: 'Unified sales management - quotations, orders, customers'
  },
  { 
    path: '/production-management-dashboard', 
    label: 'Production Management', 
    icon: Factory,
    description: 'Complete production workflow management'
  },
  { 
    path: '/inventory-warehouse-dashboard', 
    label: 'Inventory & Warehouse Management', 
    icon: Package,
    description: 'Comprehensive inventory and warehouse operations'
  },
  { 
    path: '/financial-operations-dashboard', 
    label: 'Financial Operations Management', 
    icon: CreditCard,
    description: 'Payment processing, invoices, and financial workflows'
  },
  { 
    path: '/reports-analytics-dashboard', 
    label: 'Reports & Analytics', 
    icon: FileBarChart,
    description: 'Business intelligence and performance analytics'
  },
  { 
    path: '/administration-dashboard', 
    label: 'Administration', 
    icon: Settings,
    description: 'System configuration and user management'
  },
];

// Legacy navigation items for pages that don't need module grouping
const standalonePages = [
  { path: '/admin-portal', label: 'Admin Portal', icon: Shield },
  { path: '/enhanced-system', label: 'Enhanced System', icon: Settings },
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
    setLocation('/login');
  };

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('space-y-2', mobile && 'px-0')}>
      {navigationModules.map((module) => {
        const Icon = module.icon;
        const isModuleActive = location === module.path;
        
        return (
          <Link key={module.path} href={module.path}>
            <Button
              variant={isModuleActive ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'w-full justify-start transition-all duration-200 h-auto py-2 relative group',
                mobile && 'min-h-[44px] text-left p-3 rounded-lg active:scale-[0.98]',
                mobile && 'hover:bg-muted',
                isModuleActive && 'bg-primary text-primary-foreground',
                !isModuleActive && 'text-foreground hover:bg-muted'
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <Icon className={cn(
                mobile ? "h-5 w-5 mr-3" : "h-4 w-4 mr-2",
                "flex-shrink-0 transition-transform duration-200",
                mobile && "group-hover:scale-110"
              )} />
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{module.label}</div>
              </div>
              {isModuleActive && mobile && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                </div>
              )}
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
        <header className="h-16 border-b bg-card px-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="md:hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg border-primary"
                >
                  <Menu className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] p-0 h-full max-w-sm min-w-80 bg-gradient-to-b from-background via-background to-muted/20">
                <div className="flex flex-col h-full">
                  {/* Enhanced Mobile Header */}
                  <div className="flex items-center justify-between h-16 px-4 border-b bg-gradient-to-r from-primary/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-sm flex-shrink-0">
                    <Link href="/" onClick={() => setSidebarOpen(false)} className="hover:opacity-90 transition-opacity">
                      <HiblaLogo size="md" showText />
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSidebarOpen(false)}
                      className="h-8 w-8 hover:bg-primary/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Enhanced Scrollable Navigation Content */}
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                    <nav className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
                          <Factory className="h-3 w-3" />
                          Manufacturing System
                        </div>
                        <NavItems mobile />
                        
                        {/* Quick Actions Section */}
                        <div className="mt-8 pt-6 border-t border-border/50">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Quick Actions
                          </div>
                          <div className="space-y-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start h-10"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Plus className="h-4 w-4 mr-3" />
                              New Quotation
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start h-10"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <FileText className="h-4 w-4 mr-3" />
                              View Reports
                            </Button>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                  
                  {/* Enhanced Mobile Footer with User Profile */}
                  <div className="border-t bg-gradient-to-r from-muted/30 to-muted/20 backdrop-blur-sm flex-shrink-0">
                    <div className="p-4 space-y-3">
                      {/* User Profile Section */}
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-primary via-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.role || 'Manufacturing Staff'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <div className="flex items-center space-x-1 flex-1">
                          <span className="text-xs font-medium text-muted-foreground">Theme</span>
                          <ThemeToggle />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3"
                          onClick={() => {
                            setSidebarOpen(false);
                            // Add settings action
                          }}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Settings
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-3"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground/70 text-center pt-1">
                        Hibla Filipino Hair Manufacturing
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="ml-3 md:ml-0 flex items-center">
              <div className="md:hidden">
                <HiblaLogo size="sm" showText={false} />
              </div>
              <h1 className="hidden md:block text-lg font-semibold">
                Hibla Filipino Hair
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Badge variant="outline" className="hidden md:flex">
              Production Ready
            </Badge>
            <Button variant="ghost" size="icon" className="hidden md:flex">
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

export default AppLayout;