import React from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  User, 
  FileText, 
  ShoppingCart, 
  Briefcase,
  BarChart3,
  Shield,
  Play,
  Clock,
  AlertCircle
} from 'lucide-react';

const quickSteps = [
  {
    step: 1,
    title: "Access Your Account",
    description: "Log in with your assigned credentials",
    icon: User,
    details: [
      "Use your email and password provided by administrator",
      "Role-based access will determine your available features",
      "Contact admin if you need account activation"
    ],
    time: "1 min"
  },
  {
    step: 2,
    title: "Explore the Dashboard",
    description: "Get familiar with key metrics and navigation",
    icon: BarChart3,
    details: [
      "View real-time production metrics",
      "Check active orders and inventory levels", 
      "Navigate using the sidebar menu"
    ],
    time: "2 min"
  },
  {
    step: 3,
    title: "Create Your First Quotation",
    description: "Learn the basic quotation workflow",
    icon: FileText,
    details: [
      "Go to Quotations → Create New",
      "Select customer and add products",
      "Review pricing and send to customer"
    ],
    time: "5 min"
  },
  {
    step: 4,
    title: "Convert to Sales Order",
    description: "Turn approved quotations into sales orders",
    icon: ShoppingCart,
    details: [
      "Open approved quotation",
      "Click 'Convert to Sales Order'",
      "Confirm details and create order"
    ],
    time: "2 min"
  },
  {
    step: 5,
    title: "Create Job Order",
    description: "Start the production process",
    icon: Briefcase,
    details: [
      "Convert sales order to job order",
      "Assign production team",
      "Set delivery timeline"
    ],
    time: "3 min"
  }
];

const userRoles = [
  {
    role: "Admin",
    description: "Full system access and user management",
    features: ["All modules", "User management", "System settings"],
    color: "text-red-600 bg-red-100"
  },
  {
    role: "Production Manager",
    description: "Oversee manufacturing operations",
    features: ["Production planning", "Job orders", "Inventory oversight"],
    color: "text-purple-600 bg-purple-100"
  },
  {
    role: "Sales Manager",
    description: "Manage sales operations and customer relations",
    features: ["Sales oversight", "Customer management", "Pricing control"],
    color: "text-blue-600 bg-blue-100"
  },
  {
    role: "Sales Staff",
    description: "Handle quotations and customer inquiries",
    features: ["Create quotations", "Customer contact", "Basic reporting"],
    color: "text-green-600 bg-green-100"
  }
];

export default function QuickStartGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Quick Start Guide</h1>
          <Badge>5 min setup</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Get up and running with Hibla Manufacturing System in just 5 minutes. This guide will walk you through the essential steps to start managing your manufacturing workflow.
        </p>
      </div>

      {/* Prerequisites */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800 dark:text-yellow-200">Before You Start</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-yellow-800 dark:text-yellow-200">
          <p>• Ensure you have login credentials from your system administrator</p>
          <p>• Familiarize yourself with your assigned role and permissions</p>
          <p>• Have sample customer and product data ready for testing</p>
        </CardContent>
      </Card>

      {/* Step-by-step Guide */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Step-by-Step Setup</h2>
        <div className="space-y-6">
          {quickSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                        </div>
                        <p className="text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{step.time}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* User Roles Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Understanding User Roles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userRoles.map((role) => (
            <Card key={role.role}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{role.role}</CardTitle>
                  <Badge className={role.color}>{role.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Key Features:</h4>
                  <ul className="space-y-1">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo Credentials */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-800 dark:text-blue-200">Demo Credentials</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="font-medium">Admin Access</div>
              <div className="text-xs opacity-75">admin@hibla.com</div>
              <div className="text-xs opacity-75">admin123</div>
            </div>
            <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="font-medium">Manager Access</div>
              <div className="text-xs opacity-75">manager@hibla.com</div>
              <div className="text-xs opacity-75">manager123</div>
            </div>
            <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="font-medium">Staff Access</div>
              <div className="text-xs opacity-75">staff@hibla.com</div>
              <div className="text-xs opacity-75">staff123</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div>
        <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Learn Quotation Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Master the complete quotation workflow from creation to approval.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/docs/quotations">
                  Read Guide
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>Production Workflow</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Understand how to manage job orders and production scheduling.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/docs/workflow-production">
                  View Workflow
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            If you encounter any issues or have questions, our support team is here to help.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link href="/docs/troubleshooting">
                <AlertCircle className="h-4 w-4 mr-2" />
                Troubleshooting
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/support">
                <User className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}