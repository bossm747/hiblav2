import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { 
  Home,
  Menu,
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Book,
  Code,
  Rocket,
  Package,
  FileText,
  Users,
  Settings,
  HelpCircle,
  GitBranch,
  Sun,
  Moon,
  Github,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import hiblaLogo from '@assets/Hiblalogo_1753513948082.png';

interface DocsLayoutProps {
  children: React.ReactNode;
}

interface DocSection {
  title: string;
  items: DocItem[];
}

interface DocItem {
  title: string;
  href: string;
  badge?: string;
}

const docSections: DocSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Project Status", href: "/docs/project-status", badge: "New" },
      { title: "Quick Start", href: "/docs/quick-start" },
      { title: "Installation", href: "/docs/requirements" },
      { title: "Authentication", href: "/docs/roles" },
    ]
  },
  {
    title: "Core Features",
    items: [
      { title: "Dashboard", href: "/docs/dashboard" },
      { title: "Quotations", href: "/docs/quotations" },
      { title: "Sales Orders", href: "/docs/sales-orders" },
      { title: "Job Orders", href: "/docs/job-orders" },
      { title: "Inventory", href: "/docs/inventory" },
      { title: "Customers", href: "/docs/customers" },
    ]
  },
  {
    title: "Advanced",
    items: [
      { title: "Price Management", href: "/docs/pricing" },
      { title: "AI Insights", href: "/docs/ai-insights", badge: "AI" },
      { title: "Multi-Warehouse", href: "/docs/warehouses" },
      { title: "Reports", href: "/docs/reports" },
      { title: "Staff Management", href: "/docs/staff-management" },
    ]
  },
  {
    title: "Workflows",
    items: [
      { title: "Quotation Flow", href: "/docs/workflow-quotation" },
      { title: "Production", href: "/docs/workflow-production" },
      { title: "Inventory", href: "/docs/workflow-inventory" },
      { title: "Customer", href: "/docs/workflow-customer" },
    ]
  },
  {
    title: "API Reference",
    items: [
      { title: "Overview", href: "/docs/api" },
      { title: "Authentication", href: "/docs/api-auth" },
      { title: "Endpoints", href: "/docs/api-endpoints" },
      { title: "Integration", href: "/docs/api-integration" },
    ]
  },
  {
    title: "Resources",
    items: [
      { title: "Troubleshooting", href: "/docs/troubleshooting" },
      { title: "Error Codes", href: "/docs/error-codes" },
      { title: "Performance", href: "/docs/performance" },
      { title: "Support", href: "/docs/support" },
    ]
  }
];

export function DocsLayout({ children }: DocsLayoutProps) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(docSections.map(s => s.title)) // All sections expanded by default
  );
  const { theme, setTheme } = useTheme();

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(title)) {
      newExpanded.delete(title);
    } else {
      newExpanded.add(title);
    }
    setExpandedSections(newExpanded);
  };

  const filteredSections = searchQuery
    ? docSections.map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.items.length > 0)
    : docSections;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex flex-1 items-center space-x-4">
            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/">
              <a className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <img src={hiblaLogo} alt="Hibla" className="h-8 w-8" />
                <span className="font-bold hidden sm:inline-block">Hibla Docs</span>
              </a>
            </Link>

            {/* Version Badge */}
            <Badge variant="secondary" className="hidden md:inline-flex">
              v1.0.0
            </Badge>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search - Desktop Only */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search docs..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Notification Bell - Mobile & Desktop */}
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Profile - Mobile & Desktop */}
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>

            {/* Theme Toggle - Mobile & Desktop */}
            <ThemeToggle />

            {/* GitHub - Desktop Only */}
            <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>

            {/* Back to App - Desktop Only */}
            <Link href="/">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-14 z-30 w-64 overflow-y-auto border-r bg-background lg:sticky lg:block",
          "transition-transform duration-300 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Mobile Search */}
          <div className="p-2 lg:hidden">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search docs..."
                className="pl-7 h-8 text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-2">
            {filteredSections.map((section) => (
              <div key={section.title} className="mb-0.5">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span>{section.title}</span>
                  {expandedSections.has(section.title) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
                
                {expandedSections.has(section.title) && (
                  <div className="ml-1">
                    {section.items.map((item) => {
                      const isActive = location === item.href;
                      return (
                        <Link key={item.href} href={item.href}>
                          <a
                            className={cn(
                              "flex items-center justify-between rounded-md px-2 py-0.5 text-xs transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                                {item.badge}
                              </Badge>
                            )}
                          </a>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 py-8 px-4 md:px-8 lg:px-12 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}