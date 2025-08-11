import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Rocket,
  GitBranch,
  Globe,
  Terminal,
  Database,
  Shield,
  FileText,
  Users,
  Package,
  Settings,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Code2,
  Zap,
  ChevronRight,
  Download,
  Github
} from 'lucide-react';

export default function DocsHome() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-background to-muted/20 pb-8">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Docs</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Home</span>
          </nav>

          {/* Title Section */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Learn how to use Hibla Manufacturing System - a comprehensive platform for managing 
              manufacturing operations, inventory, and business workflows.
            </p>
          </div>

          {/* Version Info */}
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="default" className="px-3 py-1">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              v1.0.0 Stable
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              Latest Release
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Updated: January 2025
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/docs/quick-start">
              <Button size="lg" className="group">
                <Rocket className="mr-2 h-4 w-4" />
                Quick Start
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/docs/project-status">
              <Button size="lg" variant="outline" className="group">
                <GitBranch className="mr-2 h-4 w-4" />
                Project Status
                <Badge variant="secondary" className="ml-2">New</Badge>
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="group">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Getting Started Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/docs/quick-start">
              <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Rocket className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">Quick Start Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Get up and running with Hibla in under 5 minutes. Learn the basics and start managing your operations.
                  </p>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <Terminal className="h-3 w-3 mr-1" />
                    5 min read
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/docs/requirements">
              <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Settings className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">Installation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    System requirements, installation steps, and initial configuration for your environment.
                  </p>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <Terminal className="h-3 w-3 mr-1" />
                    10 min read
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/docs/roles">
              <Card className="h-full hover:shadow-lg transition-all hover:border-primary cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Shield className="h-8 w-8 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">Authentication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    User roles, permissions, and access control configuration for secure operations.
                  </p>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <Terminal className="h-3 w-3 mr-1" />
                    8 min read
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-2xl font-semibold">Core Features</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/docs/quotations">
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">Quotation Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create professional quotations, manage pricing, and convert to sales orders.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/docs/job-orders">
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base">Production & Job Orders</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Track manufacturing workflows, manage production schedules, and monitor progress.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/docs/inventory">
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Database className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-base">Inventory System</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Multi-warehouse inventory tracking with real-time stock levels and AI insights.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/docs/customers">
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-base">Customer Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complete CRM system for managing customer relationships and business data.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Developer Resources */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="h-px flex-1 bg-border" />
            <h2 className="text-2xl font-semibold">Developer Resources</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/docs/api">
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Code2 className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-base">API Reference</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Complete API documentation with endpoints, authentication, and examples.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/docs/api-integration">
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-cyan-600" />
                    <CardTitle className="text-base">Integration Guide</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect Hibla with external systems and third-party services.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/docs/troubleshooting">
              <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-red-600" />
                    <CardTitle className="text-base">Troubleshooting</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Common issues, error codes, and solutions for system problems.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="border-t pt-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/workflow-quotation">
                    <a className="text-sm hover:text-primary transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                      Workflow Guides
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/docs/performance">
                    <a className="text-sm hover:text-primary transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                      Performance Tips
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/docs/error-codes">
                    <a className="text-sm hover:text-primary transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                      Error Reference
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Community
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm hover:text-primary transition-colors flex items-center group">
                    <Github className="h-3 w-3 mr-2" />
                    GitHub Repository
                  </a>
                </li>
                <li>
                  <Link href="/docs/support">
                    <a className="text-sm hover:text-primary transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                      Contact Support
                    </a>
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-sm hover:text-primary transition-colors flex items-center group">
                    <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                    Release Notes
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/docs/ai-insights">
                    <a className="text-sm hover:text-primary transition-colors flex items-center group">
                      <Zap className="h-3 w-3 mr-2 text-yellow-600" />
                      AI Features
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/docs/pricing">
                    <a className="text-sm hover:text-primary transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                      Price Management
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/docs/reports">
                    <a className="text-sm hover:text-primary transition-colors flex items-center group">
                      <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover:translate-x-1" />
                      Reporting System
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t pt-8 pb-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Hibla Manufacturing System. All rights reserved.</p>
          <p className="mt-2">
            Need help? <Link href="/docs/support"><a className="text-primary hover:underline">Contact Support</a></Link>
          </p>
        </footer>
      </div>
    </div>
  );
}