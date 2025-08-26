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
  onLogout?: () => void;
}

// Consolidated navigation structure - clean mobile design without descriptions
const navigationModules = [
  { 
    path: '/', 
    label: 'Dashboard', 
    icon: Home
  },
  { 
    path: '/sales', 
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

export function AppLayout({ children, onLogout }: AppLayoutProps) {
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
              size={mobile ? 'lg' : 'default'}
              className={cn(
                'w-full justify-start transition-all duration-200 relative group',
                mobile ? 'h-14 text-left px-4 rounded-xl active:scale-[0.98] text-base font-medium' : 'h-11 px-3 rounded-lg font-medium',
                mobile && 'hover:bg-muted/50 shadow-sm',
                isModuleActive && 'bg-primary text-primary-foreground shadow-sm',
                !isModuleActive && 'text-foreground hover:bg-muted/50 hover:text-foreground'
              )}
              onClick={() => mobile && setSidebarOpen(false)}
            >
              <Icon className={cn(
                mobile ? "h-5 w-5 mr-4" : "h-4 w-4 mr-3",
                "flex-shrink-0 transition-transform duration-200",
                mobile && "group-hover:scale-105"
              )} />
              <span className={cn(
                "truncate",
                mobile ? "text-base" : "text-sm"
              )}>{module.label}</span>
              {isModuleActive && mobile && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
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
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:bg-card md:border-r md:border-border/40">
        <div className="flex flex-col flex-1">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b bg-card">
            <Link href="/">
              <HiblaLogo size="md" showText />
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 bg-card">
            <NavItems />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="h-16 border-b bg-background px-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="default" 
                  size="default" 
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-background">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
                    <Link href="/" onClick={() => setSidebarOpen(false)}>
                      <HiblaLogo size="md" showText />
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSidebarOpen(false)}

                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Navigation Content */}
                  <div className="flex-1 overflow-y-auto">
                    <nav className="p-4">
                      <div className="space-y-2">
                        <div className="px-3 py-2">
                          <h2 className="mb-2 text-lg font-semibold">Navigation</h2>
                        </div>
                        <NavItems mobile />
                      </div>
                    </nav>
                  </div>
                  
                  {/* Mobile Footer */}
                  <div className="border-t bg-card p-4">
                    <div className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">{user?.role || 'Staff'}</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Settings
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="ml-3 md:ml-0">
              <h1 className="text-lg font-semibold">
                Hibla Manufacturing
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="hidden lg:flex text-xs font-medium">
              Production Ready
            </Badge>
            <Button variant="ghost" size="icon" className="hidden sm:flex h-9 w-9 hover:bg-muted">
              <Bell className="h-4 w-4" />
            </Button>
            
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-muted">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
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
        <main className="flex-1 p-6 lg:p-8">
          <div className="w-full max-w-none space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;