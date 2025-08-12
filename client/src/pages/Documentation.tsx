import { useState } from "react";
import processFlowDiagram from '@assets/generated_images/Business_process_flow_diagram_58c3752a.png';
import dashboardMetrics from '@assets/generated_images/Dashboard_KPI_metrics_mockup_05716b27.png';
import userJourneyPhases from '@assets/generated_images/User_journey_4_phases_c0b0d654.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MobileHeader } from "@/components/MobileHeader";
import { 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Package, 
  TrendingUp, 
  Users, 
  Workflow,
  BookOpen,
  Zap,
  Target,
  AlertCircle,
  Lightbulb,
  Play,
  BarChart,
  Clock,
  DollarSign,
  ShoppingCart,
  Truck,
  CreditCard,
  FileSpreadsheet
} from "lucide-react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "journey", label: "User Journey", icon: Workflow },
    { id: "process", label: "Process Flow", icon: Target },
    { id: "quickstart", label: "Quick Start", icon: Play },
    { id: "roles", label: "Role Workflows", icon: Users },
    { id: "best-practices", label: "Best Practices", icon: Lightbulb },
    { id: "troubleshooting", label: "Troubleshooting", icon: AlertCircle },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Documentation
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Complete guide to Hibla system
        </p>
      </div>
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="px-3 pb-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start mb-1"
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileSidebarOpen(false);
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Mobile Header - Only visible on mobile */}
      <div className="md:hidden">
        <MobileHeader 
          showBackButton={true} 
          backButtonHref="/"
          title="Documentation"
          showMenu={true}
        >
          <SidebarContent />
        </MobileHeader>
      </div>

      <div className="flex flex-1">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden md:block w-64 border-r bg-card/50 backdrop-blur-sm">
          <SidebarContent />
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-5xl mx-auto p-4 md:p-8">
            {activeSection === "overview" && <OverviewSection />}
            {activeSection === "journey" && <UserJourneySection />}
            {activeSection === "process" && <ProcessFlowSection />}
            {activeSection === "quickstart" && <QuickStartSection />}
            {activeSection === "roles" && <RoleWorkflowsSection />}
            {activeSection === "best-practices" && <BestPracticesSection />}
            {activeSection === "troubleshooting" && <TroubleshootingSection />}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
          Hibla Filipino Hair System
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete manufacturing and supply chain management platform
        </p>
      </div>

      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
          <CardDescription>
            End-to-end business process management from quotation to delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Core Features</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Quotation management with automatic pricing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Sales order confirmation workflow</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Automated job order creation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Multi-warehouse inventory tracking</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Invoice generation and payment tracking</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-primary">Key Metrics</h3>
              <img 
                src={dashboardMetrics} 
                alt="Dashboard KPIs" 
                className="w-full rounded-lg mb-4 shadow-md"
              />
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">40%+</div>
                    <div className="text-xs text-blue-600/80 dark:text-blue-400/80">Quote Conversion</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%</div>
                    <div className="text-xs text-green-600/80 dark:text-green-400/80">On-Time Delivery</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">30</div>
                    <div className="text-xs text-purple-600/80 dark:text-purple-400/80">Days Payment</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
                  <CardContent className="p-3">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">99%</div>
                    <div className="text-xs text-orange-600/80 dark:text-orange-400/80">Inventory Accuracy</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Cycle Visual */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Business Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <img 
            src={processFlowDiagram} 
            alt="Business Process Flow" 
            className="w-full rounded-lg mb-6 shadow-md"
          />
          <div className="flex items-center justify-between flex-wrap gap-4">
            {[
              { icon: FileText, label: "Quotation", color: "text-blue-500" },
              { icon: ShoppingCart, label: "Sales Order", color: "text-green-500" },
              { icon: CheckCircle, label: "Confirmation", color: "text-yellow-500" },
              { icon: Package, label: "Job Order", color: "text-purple-500" },
              { icon: Truck, label: "Shipment", color: "text-orange-500" },
              { icon: CreditCard, label: "Payment", color: "text-emerald-500" },
            ].map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`p-3 rounded-full bg-gradient-to-br from-${step.color.split('-')[1]}-100 to-${step.color.split('-')[1]}-200 dark:from-${step.color.split('-')[1]}-900 dark:to-${step.color.split('-')[1]}-800`}>
                    <step.icon className={`h-6 w-6 ${step.color}`} />
                  </div>
                  <span className="text-sm mt-2 font-medium">{step.label}</span>
                </div>
                {index < 5 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserJourneySection() {
  const phases = [
    {
      title: "Phase 1: Foundation Setup",
      color: "blue",
      steps: [
        "Add staff members and roles",
        "Register customers with codes",
        "Configure product pricing",
        "Set up warehouses",
      ],
    },
    {
      title: "Phase 2: Sales Cycle",
      color: "green",
      steps: [
        "Create quotation for customer",
        "Customer approves quotation",
        "Generate sales order",
        "Confirm order to lock pricing",
      ],
    },
    {
      title: "Phase 3: Production",
      color: "purple",
      steps: [
        "Auto-created job order",
        "Track production progress",
        "Quality control checks",
        "Package for shipment",
      ],
    },
    {
      title: "Phase 4: Fulfillment",
      color: "orange",
      steps: [
        "Generate invoice",
        "Create shipment",
        "Update tracking",
        "Process payment",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">User Journey</h1>
        <p className="text-muted-foreground">
          Complete path from customer inquiry to successful delivery
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <img 
            src={userJourneyPhases} 
            alt="User Journey Phases" 
            className="w-full rounded-lg shadow-md sticky top-4"
          />
        </div>
        <div className="lg:w-2/3 grid gap-6">
        {phases.map((phase, index) => (
          <Card key={index} className={`border-${phase.color}-200 dark:border-${phase.color}-800 shadow-lg`}>
            <CardHeader className={`bg-gradient-to-r from-${phase.color}-50 to-${phase.color}-100 dark:from-${phase.color}-950 dark:to-${phase.color}-900`}>
              <CardTitle className="flex items-center">
                <Badge className="mr-2">{index + 1}</Badge>
                {phase.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {phase.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center">
                    <div className={`h-8 w-8 rounded-full bg-${phase.color}-100 dark:bg-${phase.color}-900 flex items-center justify-center mr-3`}>
                      <span className="text-sm font-semibold">{stepIndex + 1}</span>
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Timeline Visual */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Typical Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-purple-600"></div>
            {[
              { day: "Day 1", task: "Customer inquiry received", icon: FileText },
              { day: "Day 2", task: "Quotation sent", icon: ArrowRight },
              { day: "Day 3-5", task: "Customer approval", icon: CheckCircle },
              { day: "Day 6", task: "Sales order confirmed", icon: ShoppingCart },
              { day: "Day 7-15", task: "Production", icon: Package },
              { day: "Day 16", task: "Shipment", icon: Truck },
              { day: "Day 17-30", task: "Payment received", icon: CreditCard },
            ].map((item, index) => (
              <div key={index} className="flex items-center mb-6 relative">
                <div className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-full p-2 z-10">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="ml-6">
                  <Badge variant="outline" className="mb-1">{item.day}</Badge>
                  <p className="font-medium">{item.task}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProcessFlowSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Process Flow</h1>
        <p className="text-muted-foreground">
          Visual representation of the business workflow
        </p>
      </div>

      {/* Main Process Flow */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Core Business Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Quotation Process */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary">1. Quotation Process</h3>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Badge className="bg-blue-500">Start</Badge>
                  <ArrowRight className="text-blue-500" />
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Create Quote</span>
                  </div>
                  <ArrowRight className="text-blue-500" />
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Customer Review</span>
                  </div>
                  <ArrowRight className="text-blue-500" />
                  <Badge className="bg-green-500">Approved</Badge>
                </div>
              </div>
            </div>

            {/* Order Confirmation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary">2. Order Confirmation</h3>
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/50 dark:bg-black/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Sales Order</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Generated from quotation</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/50 dark:bg-black/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Confirm</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Lock pricing & specs</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/50 dark:bg-black/20">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">Auto-Trigger</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Job order & invoice</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Production Flow */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary">3. Production & Delivery</h3>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="text-center">
                    <Package className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                    <span className="text-sm">Production</span>
                  </div>
                  <ArrowRight className="text-purple-500" />
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                    <span className="text-sm">Quality Check</span>
                  </div>
                  <ArrowRight className="text-purple-500" />
                  <div className="text-center">
                    <Truck className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                    <span className="text-sm">Shipment</span>
                  </div>
                  <ArrowRight className="text-purple-500" />
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                    <span className="text-sm">Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Flows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Quotation Status Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Draft", "Sent", "Under Review", "Approved/Rejected", "Converted"].map((status, index) => (
                <div key={index} className="flex items-center">
                  <Badge variant={index === 4 ? "default" : "outline"} className="w-32">
                    {status}
                  </Badge>
                  {index < 4 && <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Order Status Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Draft", "Confirmed", "In Production", "Shipped", "Delivered"].map((status, index) => (
                <div key={index} className="flex items-center">
                  <Badge variant={index === 4 ? "default" : "outline"} className="w-32">
                    {status}
                  </Badge>
                  {index < 4 && <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickStartSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Quick Start Guide</h1>
        <p className="text-muted-foreground">
          Get up and running in your first week
        </p>
      </div>

      <Tabs defaultValue="day1" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="day1">Day 1-2</TabsTrigger>
          <TabsTrigger value="day3">Day 3-4</TabsTrigger>
          <TabsTrigger value="day5">Day 5-7</TabsTrigger>
          <TabsTrigger value="week2">Week 2</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        </TabsList>

        <TabsContent value="day1" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Foundation Setup</CardTitle>
              <CardDescription>Establish your business foundation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Add Staff Members</p>
                    <p className="text-sm text-muted-foreground">Create admin account and team members</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Import Customers</p>
                    <p className="text-sm text-muted-foreground">Add your top 10-20 customers (ABA, LEA, TRI)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Configure Products</p>
                    <p className="text-sm text-muted-foreground">Set up product catalog with pricing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Setup Pricing Tiers</p>
                    <p className="text-sm text-muted-foreground">Configure New (+15%), Regular, Premier (-15%)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day3" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Test the System</CardTitle>
              <CardDescription>Practice the complete workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Play className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Create Test Quotation</p>
                    <p className="text-sm text-muted-foreground">Practice with customer ABA</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Play className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Convert to Sales Order</p>
                    <p className="text-sm text-muted-foreground">Test the conversion process</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Play className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Confirm Order</p>
                    <p className="text-sm text-muted-foreground">Trigger job order creation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Play className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Generate Invoice</p>
                    <p className="text-sm text-muted-foreground">Test invoice generation</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day5" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Go Live</CardTitle>
              <CardDescription>Start processing real orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Process First Real Order</p>
                    <p className="text-sm text-muted-foreground">Complete end-to-end cycle</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Train Your Team</p>
                    <p className="text-sm text-muted-foreground">Role-specific training sessions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Setup Daily Routines</p>
                    <p className="text-sm text-muted-foreground">Establish operational procedures</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week2" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Optimization</CardTitle>
              <CardDescription>Fine-tune your operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Review Performance</p>
                    <p className="text-sm text-muted-foreground">Analyze first week metrics</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Adjust Workflows</p>
                    <p className="text-sm text-muted-foreground">Optimize based on experience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Expand Usage</p>
                    <p className="text-sm text-muted-foreground">Add more products and customers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ongoing" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Daily Operations</CardTitle>
              <CardDescription>Maintain smooth operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Morning (9 AM)
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Check dashboard metrics</li>
                    <li>• Review pending quotations</li>
                    <li>• Process overnight orders</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Midday (12 PM)
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Update job order status</li>
                    <li>• Generate invoices</li>
                    <li>• Send customer updates</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Afternoon (3 PM)
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground ml-6">
                    <li>• Process new quotations</li>
                    <li>• Review payment status</li>
                    <li>• Plan tomorrow's production</li>
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

function RoleWorkflowsSection() {
  const roles = [
    {
      title: "Sales Team",
      icon: Users,
      color: "blue",
      tasks: [
        "Create and manage quotations",
        "Convert approved quotes to sales orders",
        "Monitor customer interactions",
        "Track quotation success rates",
        "Follow up on pending approvals",
      ],
    },
    {
      title: "Production Team",
      icon: Package,
      color: "purple",
      tasks: [
        "Monitor job orders dashboard",
        "Update production status daily",
        "Manage inventory movements",
        "Track completion rates",
        "Coordinate quality checks",
      ],
    },
    {
      title: "Finance Team",
      icon: DollarSign,
      color: "green",
      tasks: [
        "Generate invoices from confirmed orders",
        "Track payment status",
        "Run financial reports",
        "Monitor credit limits",
        "Process payment records",
      ],
    },
    {
      title: "Management",
      icon: BarChart,
      color: "orange",
      tasks: [
        "View dashboard KPIs",
        "Analyze business performance",
        "Make pricing decisions",
        "Review customer satisfaction",
        "Strategic planning",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Role-Based Workflows</h1>
        <p className="text-muted-foreground">
          Specific workflows for each team member
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <Card key={index} className={`border-${role.color}-200 dark:border-${role.color}-800 shadow-lg`}>
              <CardHeader className={`bg-gradient-to-r from-${role.color}-50 to-${role.color}-100 dark:from-${role.color}-950 dark:to-${role.color}-900`}>
                <CardTitle className="flex items-center">
                  <Icon className={`h-5 w-5 mr-2 text-${role.color}-600`} />
                  {role.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {role.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="flex items-start">
                      <CheckCircle className={`h-4 w-4 text-${role.color}-500 mr-2 mt-0.5`} />
                      <span className="text-sm">{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function BestPracticesSection() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Best Practices</h1>
        <p className="text-muted-foreground">
          Guidelines for optimal system usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Do's
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Always confirm customer details before quotations</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Use customer instructions field for special requirements</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Confirm orders promptly to lock pricing</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Update job order status daily</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Generate invoices immediately after confirmation</span>
              </li>
              <li className="flex items-start">
                <Lightbulb className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                <span className="text-sm">Use AI insights for demand planning</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Don'ts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span className="text-sm">Don't edit confirmed sales orders</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span className="text-sm">Don't skip confirmation before production</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span className="text-sm">Don't generate invoices before confirmation</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span className="text-sm">Don't forget to update shipment tracking</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span className="text-sm">Don't ignore low inventory alerts</span>
              </li>
              <li className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                <span className="text-sm">Don't revise quotations after creation date</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Key Rules */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Key Business Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Quotation Rules</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Badge className="mr-2">Rule</Badge>
                  <span>Can only be edited on the same day</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2">Rule</Badge>
                  <span>Must duplicate for revisions after creation date</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2">Rule</Badge>
                  <span>Auto-generates number: YYYY.MM.###</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Order Rules</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Badge className="mr-2">Rule</Badge>
                  <span>Confirmation locks pricing and specs</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2">Rule</Badge>
                  <span>Auto-creates job order on confirmation</span>
                </li>
                <li className="flex items-start">
                  <Badge className="mr-2">Rule</Badge>
                  <span>Invoice number matches sales order number</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TroubleshootingSection() {
  const scenarios = [
    {
      title: "Customer wants to change confirmed order",
      solution: "Create a revision with new sales order number, cancel original if needed",
      icon: AlertCircle,
      color: "yellow",
    },
    {
      title: "Inventory shortage after confirmation",
      solution: "Update job order timeline, notify customer, adjust shipment date",
      icon: Package,
      color: "orange",
    },
    {
      title: "Rush order request",
      solution: "Create quotation with expedited shipping, mark as priority in job order",
      icon: Zap,
      color: "red",
    },
    {
      title: "Payment dispute",
      solution: "Reference original quotation and sales order, use audit trail for verification",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Quotation needs revision next day",
      solution: "Use duplicate function to create new quotation with updated details",
      icon: FileText,
      color: "blue",
    },
    {
      title: "Multiple shipments for one order",
      solution: "Create partial shipments in job order, track each separately",
      icon: Truck,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-4">Troubleshooting</h1>
        <p className="text-muted-foreground">
          Solutions for common scenarios
        </p>
      </div>

      <div className="grid gap-4">
        {scenarios.map((scenario, index) => {
          const Icon = scenario.icon;
          return (
            <Card key={index} className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className={`p-2 rounded-lg bg-${scenario.color}-100 dark:bg-${scenario.color}-900 mr-4`}>
                    <Icon className={`h-5 w-5 text-${scenario.color}-600 dark:text-${scenario.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{scenario.title}</h3>
                    <p className="text-sm text-muted-foreground">{scenario.solution}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Reference */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Format Standards</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Quotation:</strong> YYYY.MM.### (2025.08.001)</li>
                <li><strong>Sales Order:</strong> YYYY.MM.### (2025.08.001)</li>
                <li><strong>Job Order:</strong> YYYY.MM.### (2025.08.001)</li>
                <li><strong>Invoice:</strong> Same as Sales Order</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Payment & Shipping</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Payment:</strong> TT, PayPal, Western Union</li>
                <li><strong>Shipping:</strong> Air, Sea, Express</li>
                <li><strong>Terms:</strong> 30 days standard</li>
                <li><strong>Tiers:</strong> New +15%, Regular, Premier -15%</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}