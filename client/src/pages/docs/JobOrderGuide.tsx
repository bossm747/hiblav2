import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Play, 
  Pause, 
  CheckCircle, 
  Users, 
  Calendar, 
  Package,
  AlertTriangle,
  Clock,
  Target,
  Settings,
  FileText
} from 'lucide-react';

export default function JobOrderGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Job Orders & Production</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete guide to production management through job orders. Learn how to plan, execute, 
          and track manufacturing operations from sales orders to delivery.
        </p>
      </div>

      {/* Production Workflow */}
      <Card>
        <CardHeader>
          <CardTitle>Production Workflow Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: "Sales Order", icon: FileText, color: "bg-blue-100 text-blue-800" },
              { title: "Job Order", icon: Briefcase, color: "bg-purple-100 text-purple-800" },
              { title: "Production", icon: Settings, color: "bg-orange-100 text-orange-800" },
              { title: "Delivery", icon: Package, color: "bg-green-100 text-green-800" }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="text-center">
                  <div className="relative">
                    <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300" />
                    )}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Job Order States */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Job Order Lifecycle</h2>
        <div className="space-y-4">
          {[
            {
              status: "Planning",
              description: "Job order created, planning resources and timeline",
              color: "bg-yellow-100 text-yellow-800",
              icon: Calendar,
              tasks: ["Resource allocation", "Timeline planning", "Material preparation", "Team assignment"]
            },
            {
              status: "In Progress",
              description: "Production actively underway",
              color: "bg-blue-100 text-blue-800",
              icon: Play,
              tasks: ["Active manufacturing", "Progress tracking", "Quality checks", "Time logging"]
            },
            {
              status: "On Hold",
              description: "Production temporarily paused",
              color: "bg-orange-100 text-orange-800",
              icon: Pause,
              tasks: ["Issue resolution", "Resource waiting", "Quality review", "Customer clarification"]
            },
            {
              status: "Quality Check",
              description: "Production complete, undergoing quality inspection",
              color: "bg-purple-100 text-purple-800",
              icon: Target,
              tasks: ["Quality inspection", "Compliance check", "Customer specs review", "Final approval"]
            },
            {
              status: "Completed",
              description: "Job order successfully completed",
              color: "bg-green-100 text-green-800",
              icon: CheckCircle,
              tasks: ["Final packaging", "Delivery preparation", "Documentation", "Customer notification"]
            }
          ].map((state) => {
            const Icon = state.icon;
            return (
              <Card key={state.status}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Icon className="h-8 w-8 text-primary mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{state.status}</h3>
                          <Badge className={state.color}>{state.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{state.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {state.tasks.map((task, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Production Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Production Management Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Resource Planning",
              description: "Allocate materials, equipment, and personnel",
              icon: Users,
              features: ["Staff assignment", "Material allocation", "Equipment scheduling", "Capacity planning"]
            },
            {
              title: "Time Tracking",
              description: "Monitor production time and efficiency",
              icon: Clock,
              features: ["Start/stop tracking", "Break management", "Overtime calculation", "Efficiency metrics"]
            },
            {
              title: "Quality Control",
              description: "Ensure products meet specifications",
              icon: Target,
              features: ["Inspection checkpoints", "Quality metrics", "Defect tracking", "Compliance verification"]
            },
            {
              title: "Progress Monitoring",
              description: "Real-time production progress updates",
              icon: Package,
              features: ["Milestone tracking", "Completion percentage", "Bottleneck identification", "Delivery estimates"]
            }
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
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

      {/* Best Practices */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">Production Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Planning Phase:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Review all requirements before starting</li>
                <li>• Ensure material availability</li>
                <li>• Assign skilled team members</li>
                <li>• Set realistic timelines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Execution Phase:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Follow standard operating procedures</li>
                <li>• Document progress regularly</li>
                <li>• Address issues immediately</li>
                <li>• Maintain quality standards</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Common Production Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Material Shortage</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Check inventory levels before starting production and set up automatic reorder points.
              </p>
            </div>
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Production Delays</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Identify bottlenecks early and communicate delivery date changes to customers promptly.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Quality Issues</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Solution: Implement regular quality checkpoints and train staff on quality standards.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}