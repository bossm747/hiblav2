import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Users, 
  Workflow, 
  Package, 
  FileText, 
  ShoppingCart, 
  Briefcase,
  BarChart3,
  Zap,
  Building2,
  Star,
  CheckCircle,
  ArrowRight,
  Download,
  ExternalLink,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

const features = [
  {
    icon: BarChart3,
    title: "Manufacturing Dashboard",
    description: "Real-time production metrics, order tracking, and performance analytics",
    details: ["Production overview", "Key performance indicators", "Recent activity tracking", "Customer satisfaction metrics"]
  },
  {
    icon: FileText,
    title: "Quotation Management",
    description: "Complete quotation lifecycle from creation to sales order conversion",
    details: ["Automatic quotation numbering", "Multi-item quotations", "Revision tracking", "Price list integration"]
  },
  {
    icon: ShoppingCart,
    title: "Sales Order Processing",
    description: "Streamlined order management with confirmation workflow",
    details: ["System-generated order numbers", "Order confirmation process", "Due date management", "Invoice generation"]
  },
  {
    icon: Briefcase,
    title: "Job Order Management",
    description: "Production tracking and order fulfillment monitoring",
    details: ["Production reference forms", "Customer instruction handling", "Shipment tracking", "Order balance calculations"]
  },
  {
    icon: Package,
    title: "Multi-Warehouse Inventory",
    description: "Comprehensive inventory tracking across 6 warehouse locations",
    details: ["NG, PH, Reserved, Red, Admin, WIP warehouses", "Stock level monitoring", "Movement tracking", "Valuation reports"]
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    description: "Predictive analytics for demand forecasting and inventory optimization",
    details: ["Demand prediction", "Seasonal pattern recognition", "Restock recommendations", "Market trend analysis"]
  }
];

const workflow = [
  {
    step: 1,
    title: "Customer Inquiry",
    description: "Customer requests pricing information",
    icon: Users
  },
  {
    step: 2,
    title: "Quotation Creation",
    description: "Generate detailed quotation with multiple price lists",
    icon: FileText
  },
  {
    step: 3,
    title: "Quotation Approval",
    description: "Customer approves quotation terms",
    icon: CheckCircle
  },
  {
    step: 4,
    title: "Sales Order Generation",
    description: "Convert approved quotation to confirmed sales order",
    icon: ShoppingCart
  },
  {
    step: 5,
    title: "Production Planning",
    description: "Create job orders for manufacturing",
    icon: Briefcase
  },
  {
    step: 6,
    title: "Inventory Management",
    description: "Track stock across multiple warehouses",
    icon: Package
  },
  {
    step: 7,
    title: "Order Fulfillment",
    description: "Ship products and update order status",
    icon: TrendingUp
  }
];

const showcaseStats = [
  { label: "Manufacturing Efficiency", value: "95%", icon: Target },
  { label: "Order Accuracy", value: "99.8%", icon: CheckCircle },
  { label: "Warehouse Locations", value: "6", icon: Building2 },
  { label: "AI Prediction Accuracy", value: "92%", icon: Zap }
];

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="features">Features & Capabilities</TabsTrigger>
            <TabsTrigger value="workflow">Business Workflow</TabsTrigger>
            <TabsTrigger value="showcase">Client Showcase</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950/20 dark:to-cyan-950/20 rounded-xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-800">
                <img src={logoPath} alt="Hibla Manufacturing" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Hibla Manufacturing & Supply System
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                A comprehensive manufacturing and supplier management platform designed specifically for Hibla, 
                a manufacturer and supplier of premium real Filipino hair products for global distribution.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="px-4 py-2">Manufacturing Excellence</Badge>
                <Badge variant="outline" className="px-4 py-2">AI-Powered Insights</Badge>
                <Badge variant="outline" className="px-4 py-2">Multi-Warehouse Support</Badge>
                <Badge variant="outline" className="px-4 py-2">Real-time Analytics</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    System Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Frontend Technology</h4>
                    <p className="text-sm text-muted-foreground">
                      React 18 with TypeScript, featuring modern UI components, responsive design, 
                      and real-time data visualization for optimal user experience.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Backend Infrastructure</h4>
                    <p className="text-sm text-muted-foreground">
                      Node.js with Express.js, PostgreSQL database with Drizzle ORM, 
                      ensuring scalable and reliable data management.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">AI Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      OpenAI-powered predictive analytics for demand forecasting, 
                      inventory optimization, and market trend analysis.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Key Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Streamlined Operations</h4>
                      <p className="text-sm text-muted-foreground">
                        End-to-end workflow management from quotations to order fulfillment
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Multi-Warehouse Control</h4>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive inventory management across 6 warehouse locations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Real-time Insights</h4>
                      <p className="text-sm text-muted-foreground">
                        Live production metrics and predictive analytics for informed decisions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">System Features & Capabilities</h2>
              <p className="text-muted-foreground">
                Comprehensive manufacturing management tools designed for efficiency and growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-950/20 dark:to-cyan-950/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Technical Specifications</h3>
                  <div className="grid md:grid-cols-3 gap-6 mt-6">
                    <div>
                      <h4 className="font-semibold mb-2">Performance</h4>
                      <p className="text-sm text-muted-foreground">
                        Optimized for high-volume manufacturing operations with real-time data processing
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Scalability</h4>
                      <p className="text-sm text-muted-foreground">
                        Cloud-ready architecture supporting business growth and expansion
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Enterprise-grade security with role-based access control and data encryption
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="space-y-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Complete Business Workflow</h2>
              <p className="text-muted-foreground">
                From initial customer inquiry to order fulfillment - streamlined for efficiency
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-4 md:left-8 top-8 bottom-8 w-0.5 bg-border"></div>
              <div className="space-y-8">
                {workflow.map((step, index) => (
                  <div key={index} className="relative flex items-start gap-4 md:gap-8">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm relative z-10">
                      {step.step}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <step.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Workflow Automation</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    The system automates critical processes, reducing manual work and ensuring consistency 
                    across all manufacturing operations while maintaining full traceability.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="px-4 py-2">Automated Numbering</Badge>
                    <Badge variant="outline" className="px-4 py-2">Real-time Updates</Badge>
                    <Badge variant="outline" className="px-4 py-2">Document Generation</Badge>
                    <Badge variant="outline" className="px-4 py-2">Status Tracking</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="showcase" className="space-y-8">
            <div className="text-center py-12 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 rounded-xl">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-200 dark:border-purple-800 p-2">
                <img src={logoPath} alt="Hibla Manufacturing" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Transform Your Manufacturing Operations
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
                Experience the power of integrated manufacturing management with Hibla's cutting-edge platform. 
                Designed specifically for premium Filipino hair manufacturing and global distribution excellence.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="lg" className="px-8">
                  <Star className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  View Demo
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {showcaseStats.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Why Choose Hibla Manufacturing System?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Industry Expertise</h4>
                      <p className="text-sm text-muted-foreground">
                        Specifically designed for Filipino hair manufacturing with deep industry knowledge
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">AI-Powered Intelligence</h4>
                      <p className="text-sm text-muted-foreground">
                        Advanced predictive analytics for demand forecasting and inventory optimization
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Global Scale Ready</h4>
                      <p className="text-sm text-muted-foreground">
                        Multi-warehouse support designed for international distribution networks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold">Complete Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        End-to-end workflow from quotations to fulfillment in one unified platform
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Expected Business Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="font-medium">Efficiency Improvement</span>
                    <Badge className="bg-green-500">+40%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="font-medium">Order Accuracy</span>
                    <Badge className="bg-blue-500">+25%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="font-medium">Inventory Optimization</span>
                    <Badge className="bg-purple-500">+35%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="font-medium">Cost Reduction</span>
                    <Badge className="bg-orange-500">+30%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Manufacturing?</h2>
                <p className="text-cyan-100 mb-8 text-lg max-w-2xl mx-auto">
                  Join the future of manufacturing excellence with Hibla's comprehensive platform. 
                  Experience seamless operations, intelligent insights, and unprecedented growth potential.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="px-8">
                    <Clock className="h-5 w-5 mr-2" />
                    Schedule Demo
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-purple-600">
                    <Download className="h-5 w-5 mr-2" />
                    Download Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}