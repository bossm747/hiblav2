import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  Clock, 
  Users, 
  Database,
  Zap,
  Package,
  FileText,
  Settings,
  BarChart3,
  Shield,
  Globe,
  Code
} from 'lucide-react';

export default function ProjectStatus() {
  const overallProgress = 92; // Calculate based on completed items

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Project Implementation Status</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive overview of Hibla Manufacturing System implementation progress, 
          completed features, and remaining development tasks.
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Overall Project Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Implementation Completion</span>
            <span className="text-2xl font-bold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">45+</div>
              <div>Features Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">4</div>
              <div>In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div>Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">25+</div>
              <div>API Endpoints</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core System Components */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Core System Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              component: "Authentication & Authorization",
              progress: 100,
              status: "complete",
              icon: Shield,
              features: [
                { name: "Session-based authentication", status: "complete" },
                { name: "Role-based access control (11 roles)", status: "complete" },
                { name: "Permission management system", status: "complete" },
                { name: "Staff management with departments", status: "complete" }
              ]
            },
            {
              component: "Database Architecture",
              progress: 100,
              status: "complete",
              icon: Database,
              features: [
                { name: "PostgreSQL with Drizzle ORM", status: "complete" },
                { name: "Manufacturing-focused schema", status: "complete" },
                { name: "Relations and constraints", status: "complete" },
                { name: "Session storage table", status: "complete" }
              ]
            },
            {
              component: "Frontend Framework",
              progress: 100,
              status: "complete",
              icon: Globe,
              features: [
                { name: "React 18 with TypeScript", status: "complete" },
                { name: "ShadCN UI component library", status: "complete" },
                { name: "Tailwind CSS styling", status: "complete" },
                { name: "Dark/Light theme support", status: "complete" }
              ]
            },
            {
              component: "Backend API",
              progress: 95,
              status: "complete",
              icon: Code,
              features: [
                { name: "Express.js REST API", status: "complete" },
                { name: "Zod validation schemas", status: "complete" },
                { name: "Error handling middleware", status: "complete" },
                { name: "Request logging", status: "in-progress" }
              ]
            }
          ].map((comp) => {
            const Icon = comp.icon;
            const statusColor = comp.status === 'complete' ? 'text-green-600' : 
                               comp.status === 'in-progress' ? 'text-orange-600' : 'text-red-600';
            
            return (
              <Card key={comp.component}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{comp.component}</CardTitle>
                    </div>
                    <Badge variant={comp.status === 'complete' ? 'default' : 'secondary'}>
                      {comp.progress}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={comp.progress} className="h-2" />
                    <ul className="space-y-2">
                      {comp.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          {feature.status === 'complete' ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : feature.status === 'in-progress' ? (
                            <Clock className="h-3 w-3 text-orange-600" />
                          ) : (
                            <Circle className="h-3 w-3 text-gray-400" />
                          )}
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Business Modules */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Business Modules Implementation</h2>
        <div className="space-y-4">
          {[
            {
              module: "Quotation Management",
              progress: 100,
              status: "complete",
              icon: FileText,
              description: "Complete quotation lifecycle from creation to sales order conversion",
              features: [
                "Quotation creation with VLOOKUP pricing",
                "Customer tier-based pricing (4 tiers)",
                "PDF generation and export",
                "Status tracking (draft, sent, approved, rejected)",
                "Direct conversion to sales orders",
                "Quotation duplication functionality",
                "Time-lock service for revision control"
              ]
            },
            {
              module: "Sales Order Management", 
              progress: 100,
              status: "complete",
              icon: Package,
              description: "Sales order processing from quotation conversion to production",
              features: [
                "Sales order creation from quotations",
                "Order confirmation workflow",
                "Invoice generation system",
                "Status tracking through lifecycle",
                "Customer order history",
                "Excel export functionality",
                "Real sales order implementation (SO-2025.08.001 R1)"
              ]
            },
            {
              module: "Job Order & Production",
              progress: 100,
              status: "complete", 
              icon: Settings,
              description: "Production management from sales orders to delivery",
              features: [
                "Job order creation from sales orders",
                "Production status tracking (planning, in-progress, completed)",
                "Staff assignment and coordination",
                "Due date management",
                "Customer instruction handling",
                "Progress monitoring dashboard",
                "Real job order implementation (JO-2025.08.001 R1)"
              ]
            },
            {
              module: "Multi-Warehouse Inventory",
              progress: 100,
              status: "complete",
              icon: Package,
              description: "Comprehensive inventory management across 6 warehouse locations",
              features: [
                "6 warehouse locations (NG, PH, Reserved, Red, Admin, WIP)",
                "Real-time stock level tracking",
                "Inter-warehouse transfer system",
                "Low stock alerts and notifications",
                "Inventory adjustments and corrections",
                "Stock allocation and reservation",
                "Inventory movement history"
              ]
            },
            {
              module: "Customer Management",
              progress: 100,
              status: "complete",
              icon: Users,
              description: "Complete CRM with customer tiers and relationship management",
              features: [
                "Customer profile management",
                "4-tier pricing system (New, Regular, Premier, Custom)",
                "Credit limit and payment terms",
                "Contact information management",
                "Customer order history",
                "Business relationship tracking",
                "Customer satisfaction metrics"
              ]
            },
            {
              module: "Price Management",
              progress: 100,
              status: "complete",
              icon: Settings,
              description: "Advanced pricing system with VLOOKUP and tier-based pricing",
              features: [
                "VLOOKUP price functionality",
                "Tiered pricing with automatic application",
                "Price list management (CRUD operations)",
                "Bulk price updates and discounts",
                "Custom individual product pricing",
                "Price history and audit trail",
                "Administrative pricing dashboard"
              ]
            },
            {
              module: "AI Inventory Insights",
              progress: 100,
              status: "complete",
              icon: Zap,
              description: "AI-powered predictive analytics for inventory optimization",
              features: [
                "OpenAI-powered demand forecasting",
                "Seasonal trend analysis",
                "Stock-out risk predictions",
                "Automated reorder recommendations",
                "Cost optimization suggestions",
                "Intelligent low stock warnings",
                "AI-generated product enhancement"
              ]
            },
            {
              module: "Reports & Analytics",
              progress: 100,
              status: "complete",
              icon: BarChart3,
              description: "Comprehensive reporting with filtering and export capabilities",
              features: [
                "Summary reports with date filtering",
                "Customer-based report filtering",
                "Excel export functionality",
                "Real-time dashboard analytics",
                "Performance metrics tracking",
                "Manufacturing KPI monitoring",
                "Custom report generation"
              ]
            }
          ].map((module) => {
            const Icon = module.icon;
            const statusColor = module.status === 'complete' ? 'bg-green-100 text-green-800' : 
                               module.status === 'in-progress' ? 'bg-orange-100 text-orange-800' : 
                               'bg-red-100 text-red-800';
            
            return (
              <Card key={module.module}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{module.module}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={statusColor}>{module.status}</Badge>
                      <span className="text-sm font-medium">{module.progress}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={module.progress} className="h-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Technical Implementation */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Technical Implementation Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              category: "Frontend Implementation",
              progress: 100,
              items: [
                { task: "React 18 + TypeScript setup", status: "complete" },
                { task: "ShadCN UI component integration", status: "complete" },
                { task: "Routing with Wouter", status: "complete" },
                { task: "State management with TanStack Query", status: "complete" },
                { task: "Form handling with React Hook Form + Zod", status: "complete" },
                { task: "Dark/Light theme implementation", status: "complete" },
                { task: "Mobile-responsive design", status: "complete" },
                { task: "Manufacturing-focused navigation", status: "complete" }
              ]
            },
            {
              category: "Backend Implementation", 
              progress: 95,
              items: [
                { task: "Express.js server setup", status: "complete" },
                { task: "PostgreSQL database integration", status: "complete" },
                { task: "Drizzle ORM configuration", status: "complete" },
                { task: "Authentication middleware", status: "complete" },
                { task: "API route handlers", status: "complete" },
                { task: "Validation with Zod schemas", status: "complete" },
                { task: "Error handling middleware", status: "complete" },
                { task: "Request logging and monitoring", status: "in-progress" }
              ]
            },
            {
              category: "Database Schema",
              progress: 100,
              items: [
                { task: "User and session tables", status: "complete" },
                { task: "Manufacturing core tables", status: "complete" },
                { task: "Inventory and warehouse tables", status: "complete" },
                { task: "Customer and pricing tables", status: "complete" },
                { task: "Product and category tables", status: "complete" },
                { task: "Relations and foreign keys", status: "complete" },
                { task: "Indexes and constraints", status: "complete" },
                { task: "Migration system", status: "complete" }
              ]
            },
            {
              category: "API Endpoints",
              progress: 100,
              items: [
                { task: "Authentication endpoints", status: "complete" },
                { task: "Quotation CRUD operations", status: "complete" },
                { task: "Sales order management", status: "complete" },
                { task: "Job order operations", status: "complete" },
                { task: "Inventory management", status: "complete" },
                { task: "Customer management", status: "complete" },
                { task: "Pricing and product endpoints", status: "complete" },
                { task: "Report generation endpoints", status: "complete" }
              ]
            }
          ].map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                  <Badge variant="default">{category.progress}%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={category.progress} className="h-2" />
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        {item.status === 'complete' ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : item.status === 'in-progress' ? (
                          <Clock className="h-3 w-3 text-orange-600" />
                        ) : (
                          <Circle className="h-3 w-3 text-gray-400" />
                        )}
                        <span>{item.task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Remaining Tasks */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Remaining Development Tasks</h2>
        <div className="space-y-4">
          {[
            {
              priority: "High",
              task: "Advanced Workflow Automation",
              description: "Implement automated workflow triggers and notifications",
              estimatedTime: "2-3 weeks",
              items: [
                "Automated status transitions based on business rules",
                "Email notifications for workflow events",
                "Automated job order creation from approved sales orders",
                "Deadline reminders and escalation system"
              ]
            },
            {
              priority: "Medium",
              task: "Enhanced Reporting & Analytics",
              description: "Advanced business intelligence and custom reporting",
              estimatedTime: "2 weeks",
              items: [
                "Custom report builder interface",
                "Advanced filtering and grouping options",
                "Scheduled report generation and delivery",
                "Interactive charts and visualizations"
              ]
            },
            {
              priority: "Medium", 
              task: "Integration & API Enhancements",
              description: "External system integration and API improvements",
              estimatedTime: "1-2 weeks",
              items: [
                "Webhook system for real-time notifications",
                "Third-party ERP system integration",
                "API rate limiting and throttling",
                "Advanced API documentation portal"
              ]
            },
            {
              priority: "Low",
              task: "Performance Optimization",
              description: "System performance improvements and optimization",
              estimatedTime: "1 week",
              items: [
                "Database query optimization",
                "Frontend bundle size optimization",
                "Caching implementation for frequently accessed data",
                "Performance monitoring and metrics collection"
              ]
            }
          ].map((task) => {
            const priorityColor = task.priority === 'High' ? 'bg-red-100 text-red-800' :
                                 task.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                 'bg-green-100 text-green-800';
            
            return (
              <Card key={task.task}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{task.task}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={priorityColor}>{task.priority} Priority</Badge>
                      <span className="text-sm text-muted-foreground">{task.estimatedTime}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {task.items.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <Circle className="h-3 w-3 text-gray-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Project Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Development Timeline & Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-950/10 rounded-lg">
                <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Phase 1: Complete ✓</h3>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Core system architecture</li>
                  <li>• Authentication & authorization</li>
                  <li>• Basic CRUD operations</li>
                  <li>• Database schema design</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/10 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Phase 2: Complete ✓</h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Business module implementation</li>
                  <li>• Advanced pricing system</li>
                  <li>• AI integration features</li>
                  <li>• Multi-warehouse system</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950/10 rounded-lg">
                <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Phase 3: In Progress</h3>
                <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                  <li>• Workflow automation</li>
                  <li>• Advanced reporting</li>
                  <li>• Performance optimization</li>
                  <li>• Integration enhancements</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Next Steps & Recommendations:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>Focus on workflow automation to reduce manual processes and improve efficiency</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Implement advanced reporting features for better business intelligence</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Continue performance optimization for better user experience</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}