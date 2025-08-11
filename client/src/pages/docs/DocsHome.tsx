import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Zap, 
  Settings, 
  Shield, 
  BarChart3, 
  FileText, 
  ShoppingCart, 
  Briefcase,
  Package,
  Users,
  DollarSign,
  ArrowRight,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

const featuredGuides = [
  {
    title: "Quick Start Guide",
    description: "Get up and running with Hibla in 5 minutes",
    href: "/docs/quick-start",
    icon: Zap,
    badge: "Popular",
    time: "5 min read"
  },
  {
    title: "Quotation Management",
    description: "Learn how to create and manage customer quotations",
    href: "/docs/quotations",
    icon: FileText,
    badge: "Essential",
    time: "10 min read"
  },
  {
    title: "Production Workflow",
    description: "Master the complete production workflow from order to delivery",
    href: "/docs/workflow-production",
    icon: Briefcase,
    badge: "Workflow",
    time: "15 min read"
  },
  {
    title: "AI Inventory Insights",
    description: "Leverage AI for predictive inventory management",
    href: "/docs/ai-insights",
    icon: Zap,
    badge: "AI",
    time: "8 min read"
  }
];

const moduleOverview = [
  {
    title: "Dashboard & Analytics",
    description: "Real-time production metrics and business insights",
    href: "/docs/dashboard",
    icon: BarChart3,
    color: "text-blue-600"
  },
  {
    title: "Quotation System",
    description: "Professional quotation generation and management",
    href: "/docs/quotations",
    icon: FileText,
    color: "text-green-600"
  },
  {
    title: "Sales Orders",
    description: "Convert quotations to sales orders seamlessly",
    href: "/docs/sales-orders",
    icon: ShoppingCart,
    color: "text-purple-600"
  },
  {
    title: "Job Orders & Production",
    description: "Manage manufacturing workflows and job tracking",
    href: "/docs/job-orders",
    icon: Briefcase,
    color: "text-orange-600"
  },
  {
    title: "Inventory Management",
    description: "Multi-warehouse inventory tracking and optimization",
    href: "/docs/inventory",
    icon: Package,
    color: "text-red-600"
  },
  {
    title: "Customer Management",
    description: "Complete CRM and customer relationship tools",
    href: "/docs/customers",
    icon: Users,
    color: "text-teal-600"
  }
];

const recentUpdates = [
  {
    date: "Aug 11, 2025",
    title: "Enhanced Role-Based Access Control",
    description: "New permission system with 11 specialized roles",
    type: "Feature"
  },
  {
    date: "Aug 10, 2025", 
    title: "AI Inventory Insights",
    description: "Predictive analytics for inventory management",
    type: "AI Feature"
  },
  {
    date: "Aug 9, 2025",
    title: "Multi-Warehouse Support",
    description: "Complete multi-location inventory tracking",
    type: "Feature"
  }
];

export default function DocsHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Hibla Documentation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive guide to Hibla Manufacturing & Supply System. Learn how to manage your complete manufacturing workflow from quotations to delivery.
        </p>
        <div className="flex items-center justify-center space-x-4 pt-4">
          <Button asChild size="lg">
            <Link href="/docs/quick-start">
              <Zap className="h-4 w-4 mr-2" />
              Quick Start
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/docs/api">
              <Settings className="h-4 w-4 mr-2" />
              API Reference
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-muted-foreground">Documentation Pages</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">25+</div>
            <div className="text-sm text-muted-foreground">API Endpoints</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">15+</div>
            <div className="text-sm text-muted-foreground">Workflow Guides</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">11</div>
            <div className="text-sm text-muted-foreground">User Roles</div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Guides */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Star className="h-5 w-5 text-yellow-500" />
          <h2 className="text-2xl font-bold">Featured Guides</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredGuides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Card key={guide.href} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{guide.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{guide.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{guide.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{guide.time}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={guide.href}>
                        Read Guide
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Module Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-6">System Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleOverview.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.href} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-6 w-6 ${module.color}`} />
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{module.description}</p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={module.href}>
                      Learn More
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Recent Updates</h2>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{update.type}</Badge>
                        <span className="text-sm text-muted-foreground">{update.date}</span>
                      </div>
                      <h3 className="font-semibold mb-1">{update.title}</h3>
                      <p className="text-sm text-muted-foreground">{update.description}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Link href="/docs/troubleshooting" className="block">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Troubleshooting</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
              
              <Link href="/docs/api" className="block">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">API Reference</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
              
              <Link href="/docs/roles" className="block">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">User Roles</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
              
              <Link href="/docs/support" className="block">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Get Support</span>
                  </div>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}