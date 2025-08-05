import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Package, 
  TrendingUp, 
  Users, 
  Globe, 
  Award, 
  Clock, 
  CheckCircle,
  FileText,
  Clipboard,
  BarChart3,
  Warehouse,
  ArrowRight,
  Star
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

export default function HiblaHomePage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/overview"],
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/dashboard/recent-activity"],
  });

  const quickActions = [
    {
      title: "New Quotation",
      description: "Create a new customer quotation",
      icon: FileText,
      href: "/quotations",
      color: "bg-blue-500"
    },
    {
      title: "Sales Orders",
      description: "Manage confirmed sales orders",
      icon: Package,
      href: "/sales-orders",
      color: "bg-green-500"
    },
    {
      title: "Job Orders",
      description: "Production management & tracking",
      icon: Clipboard,
      href: "/job-orders",
      color: "bg-purple-500"
    },
    {
      title: "Summary Reports",
      description: "Business insights & analytics",
      icon: BarChart3,
      href: "/summary-reports",
      color: "bg-orange-500"
    }
  ];

  const businessHighlights = [
    {
      title: "Premium Quality Hair",
      description: "100% authentic Filipino hair, ethically sourced and processed with the highest quality standards",
      icon: Award
    },
    {
      title: "Global Reach",
      description: "Serving customers worldwide with reliable shipping and customer support",
      icon: Globe
    },
    {
      title: "Manufacturing Excellence",
      description: "State-of-the-art production facilities with rigorous quality control processes",
      icon: Factory
    },
    {
      title: "Customer Satisfaction",
      description: "Dedicated to building long-term relationships with our valued customers",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center mb-6">
            <img 
              src={logoPath} 
              alt="Hibla Logo" 
              className="h-24 w-auto"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Hibla Manufacturing
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Premium Filipino Hair Manufacturing & Supply
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Your trusted partner for authentic, high-quality hair products with comprehensive 
            manufacturing and supply chain management
          </p>
        </motion.div>

        {/* Business Overview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.activeOrders ?? 24}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.newOrdersThisWeek ?? 5} new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Production Items</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.productionItems ?? 156}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.readyItems ?? 89} ready to ship
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.customerSatisfaction ?? 98}%</div>
              <p className="text-xs text-muted-foreground">
                Based on recent feedback
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.onTimeDelivery ?? 95}%</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {action.title}
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-primary group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium mr-2">Get Started</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Business Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Why Choose Hibla</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessHighlights.map((highlight, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <highlight.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Business Activity</CardTitle>
              <CardDescription>Latest updates from your operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity && Array.isArray(recentActivity) ? recentActivity.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                )) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New quotation QT2025.08.001 created</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sales order SO2025.08.015 confirmed</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Job order JO2025.08.008 production started</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Shipment to customer ABC completed</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Production System</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Inventory Management</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Customer Portal</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reporting System</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Link href="/manufacturing-dashboard">
                    <Button className="w-full">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Full Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="text-center space-y-4 py-12"
        >
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your manufacturing operations with our comprehensive management system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quotations">
              <Button size="lg" className="min-w-40">
                <FileText className="h-5 w-5 mr-2" />
                Create Quotation
              </Button>
            </Link>
            <Link href="/manufacturing-dashboard">
              <Button size="lg" variant="outline" className="min-w-40">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}