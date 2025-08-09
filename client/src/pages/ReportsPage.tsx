import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Download, TrendingUp, DollarSign } from 'lucide-react';

export function ReportsPage() {
  const reportTypes = [
    {
      title: 'Quotation Summary Report',
      description: 'Comprehensive overview of all quotations with filtering options',
      icon: FileText,
      available: true
    },
    {
      title: 'Sales Order Report',
      description: 'Track sales performance and order fulfillment',
      icon: BarChart3,
      available: true
    },
    {
      title: 'Production Report',
      description: 'Manufacturing efficiency and production metrics',
      icon: TrendingUp,
      available: true
    },
    {
      title: 'Financial Report',
      description: 'Revenue, costs, and profit analysis',
      icon: DollarSign,
      available: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Generate comprehensive business reports and analytics
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <div className="text-xs text-green-600">↗ +15% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <div className="text-xs text-green-600">↗ +8% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-xs text-green-600">↗ +3% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,087</div>
            <div className="text-xs text-blue-600">→ Stable</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card key={report.title} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Icon className="h-5 w-5 mr-2" />
                      {report.title}
                      {report.available ? (
                        <Badge className="ml-auto">Available</Badge>
                      ) : (
                        <Badge variant="secondary" className="ml-auto">Coming Soon</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {report.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        disabled={!report.available}
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                      <Button 
                        size="sm" 
                        disabled={!report.available}
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Quotation Summary - August 2025</p>
                  <p className="text-sm text-muted-foreground">Generated 2 hours ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Sales Performance - July 2025</p>
                  <p className="text-sm text-muted-foreground">Generated yesterday</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}