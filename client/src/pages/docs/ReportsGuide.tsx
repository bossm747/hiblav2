import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp,
  Users,
  Package,
  DollarSign,
  CheckCircle,
  Settings
} from 'lucide-react';

export default function ReportsGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive reporting system with advanced filtering, export capabilities, 
          and detailed analytics for business intelligence.
        </p>
      </div>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: "Summary Reports", count: "12", description: "High-level business overviews" },
              { type: "Financial Reports", count: "8", description: "Revenue and financial analytics" },
              { type: "Inventory Reports", count: "10", description: "Stock and warehouse analytics" },
              { type: "Customer Reports", count: "6", description: "Customer relationship insights" }
            ].map((report) => (
              <Card key={report.type}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{report.count}</div>
                  <div className="font-medium">{report.type}</div>
                  <div className="text-sm text-muted-foreground">{report.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Report Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Report Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Advanced Filtering",
              description: "Filter reports by multiple criteria",
              icon: Filter,
              features: ["Date range filtering", "Customer segmentation", "Product categories", "Warehouse locations", "Custom filters"]
            },
            {
              title: "Export Options",
              description: "Multiple export formats available",
              icon: Download,
              features: ["Excel (XLSX) export", "PDF generation", "CSV data export", "Bulk export", "Scheduled exports"]
            },
            {
              title: "Real-time Data",
              description: "Live data updates and refresh",
              icon: TrendingUp,
              features: ["Real-time metrics", "Auto-refresh", "Live dashboards", "Current status", "Up-to-date analytics"]
            },
            {
              title: "Custom Reports",
              description: "Build custom reports for specific needs",
              icon: Settings,
              features: ["Report builder", "Custom fields", "Calculated metrics", "Saved templates", "Personalization"]
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

      {/* Popular Reports */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Most Used Reports</h2>
        <div className="space-y-4">
          {[
            {
              name: "Sales Summary Report",
              description: "Complete overview of sales performance and trends",
              frequency: "Daily",
              metrics: ["Total sales", "Order count", "Customer growth", "Product performance"],
              icon: DollarSign,
              popularity: "95%"
            },
            {
              name: "Inventory Status Report",
              description: "Current stock levels and inventory health",
              frequency: "Real-time",
              metrics: ["Stock levels", "Low stock alerts", "Warehouse utilization", "Transfer status"],
              icon: Package,
              popularity: "87%"
            },
            {
              name: "Customer Activity Report",
              description: "Customer engagement and relationship metrics",
              frequency: "Weekly",
              metrics: ["Active customers", "Order frequency", "Customer satisfaction", "Retention rates"],
              icon: Users,
              popularity: "76%"
            },
            {
              name: "Production Performance",
              description: "Manufacturing efficiency and job order status",
              frequency: "Daily",
              metrics: ["Job completion", "Production time", "Quality metrics", "Resource utilization"],
              icon: BarChart3,
              popularity: "82%"
            }
          ].map((report) => {
            const Icon = report.icon;
            return (
              <Card key={report.name}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{report.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{report.frequency}</Badge>
                          <Badge variant="outline">{report.popularity} usage</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {report.metrics.map((metric, index) => (
                          <div key={index} className="p-2 bg-muted rounded text-xs text-center">
                            {metric}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Report Generation Process */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>How to Generate Reports</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "Select Report", description: "Choose report type from available options", icon: FileText },
              { step: "Set Filters", description: "Configure date range and filter criteria", icon: Filter },
              { step: "Generate", description: "Process data and create report", icon: Settings },
              { step: "Export", description: "Download or share the completed report", icon: Download }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-blue-200" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-1">{step.step}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Reporting Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Data Quality:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Ensure data accuracy before reporting</li>
                <li>• Use appropriate date ranges</li>
                <li>• Validate filter selections</li>
                <li>• Regular data cleanup</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Report Usage:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Schedule regular report generation</li>
                <li>• Share insights with stakeholders</li>
                <li>• Archive important reports</li>
                <li>• Track report performance metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}