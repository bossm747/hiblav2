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

// Consolidated navigation structure - clean mobile design without descriptions
const navigationModules = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: Home
  },
  { 
    path: '/sales-operations-dashboard', 
    label: 'Sales Operations', 
    icon: FileText
  },
  { 
    path: '/production-management-dashboard', 
    label: 'Production', 
    icon: Factory
  },
  { 
    path: '/inventory-warehouse-dashboard', 
    label: 'Inventory & Warehouses', 
    icon: Package
  },
  { 
    path: '/financial-operations-dashboard', 
    label: 'Financial Operations', 
    icon: CreditCard
  },
  { 
    path: '/reports-analytics-dashboard', 
    label: 'Reports & Analytics', 
    icon: FileBarChart
  },
  { 
    path: '/administration-dashboard', 
    label: 'Administration', 
    icon: Settings
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
    <div className={cn('space-y-3', mobile && 'px-0')}>
      {navigationModules.map((module) => {
        const Icon = module.icon;
        const isModuleActive = location === module.path;
        
        return (
          <Link key={module.path} href={module.path}>
            <Button
              variant={isModuleActive ? 'default' : 'ghost'}
              size={mobile ? 'lg' : 'sm'}
              className={cn(
                'w-full justify-start transition-all duration-200 h-auto relative group',
                mobile ? 'min-h-[52px] text-left p-4 rounded-xl active:scale-[0.98] text-base' : 'py-2',
                mobile && 'hover:bg-muted shadow-sm',
                isModuleActive && 'bg-primary text-primary-foreground shadow-md',
                !isModuleActive && 'text-foreground hover:bg-muted'
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <Icon className={cn(
                mobile ? "h-6 w-6 mr-4" : "h-4 w-4 mr-2",
                "flex-shrink-0 transition-transform duration-200",
                mobile && "group-hover:scale-105"
              )} />
              <div className="flex-1 text-left">
                <div className={cn(
                  "font-medium", 
                  mobile ? "text-base" : "text-sm"
                )}>{module.label}</div>
              </div>
              {isModuleActive && mobile && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 bg-white rounded-full opacity-90 shadow-sm"></div>
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
                  className="md:hidden bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg border-primary min-h-[44px] px-4 rounded-xl"
                >
                  <Menu className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[90vw] p-0 h-full max-w-sm bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
                <div className="flex flex-col h-full">
                  {/* Enhanced Mobile Header */}
                  <div className="flex items-center justify-between h-18 px-6 border-b bg-gradient-to-r from-primary/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-sm flex-shrink-0">
                    <Link href="/" onClick={() => setSidebarOpen(false)} className="hover:opacity-90 transition-opacity">
                      <HiblaLogo size="md" showText />
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSidebarOpen(false)}
                      className="h-10 w-10 hover:bg-primary/10 transition-colors rounded-full min-h-[44px]"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Enhanced Scrollable Navigation Content */}
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                    <nav className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 px-3">
                          <Factory className="h-4 w-4" />
                          Manufacturing System
                        </div>
                        <NavItems mobile />
                        
                        {/* Quick Actions Section */}
                        <div className="mt-10 pt-8 border-t border-border/50">
                          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                            Quick Actions
                          </div>
                          <div className="space-y-3">
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="w-full justify-start h-12 rounded-xl text-base"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Plus className="h-5 w-5 mr-3" />
                              New Quotation
                            </Button>
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="w-full justify-start h-12 rounded-xl text-base"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <FileText className="h-5 w-5 mr-3" />
                              View Reports
                            </Button>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>
                  
                  {/* Enhanced Mobile Footer with User Profile */}
                  <div className="border-t bg-gradient-to-r from-muted/30 to-muted/20 backdrop-blur-sm flex-shrink-0">
                    <div className="p-6 space-y-4">
                      {/* User Profile Section */}
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-primary via-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-semibold truncate">
                            {user?.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user?.role || 'Manufacturing Staff'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Theme</span>
                          <ThemeToggle />
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="lg"
                            className="flex-1 h-11 rounded-xl"
                            onClick={() => {
                              setSidebarOpen(false);
                              // Add settings action
                            }}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                          <Button
                            variant="destructive"
                            size="lg"
                            className="flex-1 h-11 rounded-xl"
                            onClick={handleLogout}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground/70 text-center pt-2">
                        Hibla Filipino Hair Manufacturing
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="ml-4 md:ml-0 flex items-center">
              <div className="md:hidden">
                <HiblaLogo size="sm" showText={false} />
              </div>
              <h1 className="hidden md:block text-lg font-semibold">
                Hibla Filipino Hair
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            <Badge variant="outline" className="hidden lg:flex">
              Production Ready
            </Badge>
            <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10">
              <Bell className="h-4 w-4" />
            </Button>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
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
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;