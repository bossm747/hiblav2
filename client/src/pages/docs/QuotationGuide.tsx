import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  User, 
  Package, 
  DollarSign, 
  Send, 
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Download,
  Edit,
  Trash2,
  Copy
} from 'lucide-react';

const quotationSteps = [
  {
    step: 1,
    title: "Customer Selection",
    description: "Choose existing customer or create new one",
    details: ["Search customer database", "Verify contact information", "Check credit status", "Review purchase history"],
    icon: User,
    status: "required"
  },
  {
    step: 2,
    title: "Product Configuration",
    description: "Add products and configure specifications",
    details: ["Browse product catalog", "Set quantities", "Configure specifications", "Apply custom pricing"],
    icon: Package,
    status: "required"
  },
  {
    step: 3,
    title: "Pricing & Terms",
    description: "Set pricing, discounts, and payment terms",
    details: ["Apply tier-based pricing", "Add bulk discounts", "Set payment terms", "Include shipping costs"],
    icon: DollarSign,
    status: "required"
  },
  {
    step: 4,
    title: "Review & Send",
    description: "Final review and delivery to customer",
    details: ["Verify all details", "Add special instructions", "Generate PDF", "Send via email"],
    icon: Send,
    status: "required"
  }
];

const quotationFeatures = [
  {
    title: "Automatic Numbering",
    description: "Sequential quotation numbers with customizable format",
    example: "QUO-2025-001",
    benefits: ["Easy tracking", "Professional appearance", "Audit trail"]
  },
  {
    title: "Tier-Based Pricing",
    description: "Automatic pricing based on customer tier and volume",
    example: "Premier customers get 15% discount",
    benefits: ["Consistent pricing", "Customer incentives", "Margin protection"]
  },
  {
    title: "Product VLOOKUP",
    description: "Real-time product information and pricing lookup",
    example: "Automatic price updates from master catalog",
    benefits: ["Accurate pricing", "Real-time updates", "Reduced errors"]
  },
  {
    title: "Multi-Currency Support",
    description: "Support for different currencies and exchange rates",
    example: "USD, EUR, PHP supported",
    benefits: ["Global customers", "Accurate conversion", "Local compliance"]
  },
  {
    title: "PDF Generation",
    description: "Professional PDF quotations with company branding",
    example: "Branded templates with logo and colors",
    benefits: ["Professional image", "Easy sharing", "Print ready"]
  },
  {
    title: "Email Integration",
    description: "Direct email delivery with tracking",
    example: "Automatic delivery confirmation",
    benefits: ["Instant delivery", "Tracking", "Professional communication"]
  }
];

const quotationStates = [
  {
    status: "Draft",
    description: "Quotation being prepared, not yet sent",
    actions: ["Edit", "Delete", "Send"],
    color: "bg-gray-100 text-gray-800",
    icon: Edit
  },
  {
    status: "Sent",
    description: "Quotation sent to customer, awaiting response",
    actions: ["View", "Resend", "Follow up"],
    color: "bg-blue-100 text-blue-800",
    icon: Send
  },
  {
    status: "Approved",
    description: "Customer has approved the quotation",
    actions: ["Convert to Sales Order", "View", "Download"],
    color: "bg-green-100 text-green-800",
    icon: CheckCircle
  },
  {
    status: "Rejected",
    description: "Customer has declined the quotation",
    actions: ["View", "Revise", "Archive"],
    color: "bg-red-100 text-red-800",
    icon: AlertCircle
  },
  {
    status: "Expired",
    description: "Quotation validity period has passed",
    actions: ["Renew", "Archive", "Create new"],
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock
  }
];

const bestPractices = [
  {
    category: "Customer Communication",
    tips: [
      "Always verify customer requirements before creating quotation",
      "Include clear product specifications and delivery terms",
      "Set realistic delivery timelines and communicate clearly",
      "Follow up within 48 hours of sending quotation"
    ]
  },
  {
    category: "Pricing Strategy",
    tips: [
      "Use tier-based pricing for consistent customer treatment",
      "Consider volume discounts for large orders",
      "Include all costs (materials, labor, shipping) in pricing",
      "Review competitor pricing regularly"
    ]
  },
  {
    category: "Documentation",
    tips: [
      "Include detailed product specifications",
      "Clearly state payment terms and conditions",
      "Add validity period to create urgency",
      "Include contact information for questions"
    ]
  },
  {
    category: "Process Efficiency",
    tips: [
      "Use templates for common product combinations",
      "Set up automatic pricing rules where possible",
      "Regularly review and update product catalogs",
      "Track conversion rates and optimize accordingly"
    ]
  }
];

export default function QuotationGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Quotation Management</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Master the complete quotation workflow from creation to conversion. 
          Learn how to create professional quotations, manage customer communications, and convert to sales orders.
        </p>
      </div>

      <Tabs defaultValue="process" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="process">Creation Process</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="tips">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="process" className="space-y-6">
          {/* Step-by-step Process */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Quotation Creation Process</h2>
            <div className="space-y-6">
              {quotationSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                            <Badge variant="destructive">{step.status}</Badge>
                          </div>
                          <p className="text-muted-foreground mt-1">{step.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {step.details.map((detail, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-700 dark:text-green-300">
                Ready to create your first quotation? Follow these quick steps:
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Create New Quotation
                </Button>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Manage Customers
                </Button>
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Feature Overview */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotationFeatures.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Example:</p>
                      <p className="text-sm text-muted-foreground">{feature.example}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Benefits:</p>
                      <ul className="space-y-1">
                        {feature.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Quotation States */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Quotation Lifecycle</h2>
            <div className="space-y-4">
              {quotationStates.map((state) => {
                const Icon = state.icon;
                return (
                  <Card key={state.status}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Icon className="h-8 w-8 text-primary" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-lg">{state.status}</h3>
                              <Badge className={state.color}>{state.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{state.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {state.actions.map((action, index) => (
                            <Button key={index} variant="outline" size="sm">
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bulk Operations */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage multiple quotations efficiently with bulk operations
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <Copy className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-medium">Duplicate Quotations</h4>
                  <p className="text-sm text-muted-foreground">Create similar quotations quickly</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Download className="h-8 w-8 text-green-600 mb-2" />
                  <h4 className="font-medium">Batch Export</h4>
                  <p className="text-sm text-muted-foreground">Export multiple quotations as PDF</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Send className="h-8 w-8 text-purple-600 mb-2" />
                  <h4 className="font-medium">Mass Email</h4>
                  <p className="text-sm text-muted-foreground">Send follow-ups to multiple customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="space-y-6">
          {/* Best Practices */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Best Practices</h2>
            <div className="space-y-6">
              {bestPractices.map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Track Your Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
              <p>Monitor these key metrics to improve your quotation process:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Conversion Metrics:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Quotation to Sales Order conversion rate</li>
                    <li>• Average time from quotation to approval</li>
                    <li>• Customer response rate</li>
                    <li>• Average quotation value</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Efficiency Metrics:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Time to create quotation</li>
                    <li>• Number of revisions per quotation</li>
                    <li>• Quote accuracy rate</li>
                    <li>• Customer satisfaction scores</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}