import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Menu, 
  X, 
  Home, 
  Settings, 
  Users, 
  Package, 
  FileText, 
  ShoppingCart, 
  Briefcase,
  BarChart3,
  Shield,
  DollarSign,
  Zap,
  ArrowLeft,
  ChevronRight,
  Search,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import hiblaLogo from '@assets/Hiblalogo_1753513948082.png';

interface DocsLayoutProps {
  children: React.ReactNode;
}

interface DocSection {
  title: string;
  items: DocItem[];
  collapsed?: boolean;
}

interface DocItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const docSections: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Overview", href: "/docs", icon: Home },
      { title: "Project Status", href: "/docs/project-status", icon: BarChart3, badge: "New" },
      { title: "Quick Start Guide", href: "/docs/quick-start", icon: Zap },
      { title: "System Requirements", href: "/docs/requirements", icon: Settings },
      { title: "User Roles & Access", href: "/docs/roles", icon: Shield },
    ]
  },
  {
    title: "Core Modules",
    items: [
      { title: "Dashboard & Analytics", href: "/docs/dashboard", icon: BarChart3 },
      { title: "Quotation Management", href: "/docs/quotations", icon: FileText },
      { title: "Sales Orders", href: "/docs/sales-orders", icon: ShoppingCart },
      { title: "Job Orders & Production", href: "/docs/job-orders", icon: Briefcase },
      { title: "Inventory Management", href: "/docs/inventory", icon: Package },
      { title: "Customer Management", href: "/docs/customers", icon: Users },
    ]
  },
  {
    title: "Advanced Features",
    items: [
      { title: "Price Management", href: "/docs/pricing", icon: DollarSign },
      { title: "AI Inventory Insights", href: "/docs/ai-insights", icon: Zap, badge: "AI" },
      { title: "Multi-Warehouse System", href: "/docs/warehouses", icon: Package },
      { title: "Reporting & Analytics", href: "/docs/reports", icon: BarChart3 },
      { title: "Staff & Access Control", href: "/docs/staff-management", icon: Shield },
    ]
  },
  {
    title: "Workflows",
    items: [
      { title: "Quotation to Sales Flow", href: "/docs/workflow-quotation", icon: FileText },
      { title: "Production Workflow", href: "/docs/workflow-production", icon: Briefcase },
      { title: "Inventory Tracking", href: "/docs/workflow-inventory", icon: Package },
      { title: "Customer Onboarding", href: "/docs/workflow-customer", icon: Users },
    ]
  },
  {
    title: "API Documentation",
    items: [
      { title: "API Overview", href: "/docs/api", icon: Settings },
      { title: "Authentication", href: "/docs/api-auth", icon: Shield },
      { title: "Endpoints Reference", href: "/docs/api-endpoints", icon: FileText },
      { title: "Integration Guide", href: "/docs/api-integration", icon: ExternalLink },
    ]
  },
  {
    title: "Troubleshooting",
    items: [
      { title: "Common Issues", href: "/docs/troubleshooting", icon: Settings },
      { title: "Error Codes", href: "/docs/error-codes", icon: FileText },
      { title: "Performance Tips", href: "/docs/performance", icon: Zap },
      { title: "Contact Support", href: "/docs/support", icon: Users },
    ]
  }
];

export function DocsLayout({ children }: DocsLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [location] = useLocation();

  const filteredSections = docSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 bg-background border-r transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:z-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img src={hiblaLogo} alt="Hibla Logo" className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">Hibla Docs</div>
                <div className="text-xs text-muted-foreground">Manufacturing System</div>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    
                    return (
                      <Link key={item.href} href={item.href}>
                        <div className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground font-medium"
                        )}>
                          <div className="flex items-center space-x-2">
                            {Icon && <Icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center space-x-1">
              <ArrowLeft className="h-3 w-3" />
              <span>Back to App</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="hidden lg:block text-sm text-muted-foreground">
              Hibla Manufacturing Documentation
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back to App
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}