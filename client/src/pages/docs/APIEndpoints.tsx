import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  FileText, 
  ShoppingCart, 
  Briefcase, 
  Package, 
  Users,
  BarChart3,
  Settings
} from 'lucide-react';

export default function APIEndpoints() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">API Endpoints Reference</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete reference for all available API endpoints with request/response examples, 
          parameters, and authentication requirements.
        </p>
      </div>

      <Tabs defaultValue="quotations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="quotations">Quotations</TabsTrigger>
          <TabsTrigger value="sales">Sales Orders</TabsTrigger>
          <TabsTrigger value="jobs">Job Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="quotations" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <FileText className="h-6 w-6" />
              <span>Quotation Endpoints</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  method: "GET",
                  endpoint: "/api/quotations",
                  description: "Retrieve all quotations with optional filtering",
                  auth: "Required",
                  parameters: ["page (optional)", "limit (optional)", "status (optional)", "customer_id (optional)"],
                  response: `{
  "success": true,
  "data": [
    {
      "id": "quot-001",
      "quotation_number": "QUO-2025-001",
      "customer_id": "cust-123",
      "status": "sent",
      "total_amount": 1087.00,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5
  }
}`
                },
                {
                  method: "POST",
                  endpoint: "/api/quotations",
                  description: "Create a new quotation",
                  auth: "Required (Sales Staff+)",
                  parameters: ["customer_id", "items[]", "notes (optional)", "valid_until (optional)"],
                  response: `{
  "success": true,
  "data": {
    "id": "quot-002",
    "quotation_number": "QUO-2025-002",
    "customer_id": "cust-123",
    "status": "draft",
    "total_amount": 0,
    "created_at": "2025-01-01T00:00:00Z"
  }
}`
                },
                {
                  method: "GET",
                  endpoint: "/api/quotations/:id",
                  description: "Retrieve a specific quotation by ID",
                  auth: "Required",
                  parameters: ["id (path parameter)"],
                  response: `{
  "success": true,
  "data": {
    "id": "quot-001",
    "quotation_number": "QUO-2025-001",
    "customer": {
      "id": "cust-123",
      "name": "ABC Company",
      "email": "contact@abc.com"
    },
    "items": [
      {
        "product_id": "prod-001",
        "quantity": 10,
        "unit_price": 50.00,
        "total": 500.00
      }
    ],
    "subtotal": 947.00,
    "tax": 140.00,
    "total_amount": 1087.00,
    "status": "approved"
  }
}`
                },
                {
                  method: "POST",
                  endpoint: "/api/quotations/:id/convert",
                  description: "Convert approved quotation to sales order",
                  auth: "Required (Sales Manager+)",
                  parameters: ["id (path parameter)", "delivery_date (optional)"],
                  response: `{
  "success": true,
  "data": {
    "sales_order_id": "so-001",
    "sales_order_number": "SO-2025-001",
    "converted_from": "quot-001",
    "status": "confirmed"
  }
}`
                }
              ].map((api) => (
                <Card key={`${api.method}-${api.endpoint}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-lg font-mono">{api.endpoint}</code>
                      </div>
                      <Badge variant="outline">{api.auth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <ul className="space-y-1">
                          {api.parameters.map((param, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-2 py-1 rounded">{param}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Response Example:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-x-auto max-h-48">
                          {api.response}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6" />
              <span>Sales Order Endpoints</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  method: "GET",
                  endpoint: "/api/sales-orders",
                  description: "Retrieve all sales orders",
                  auth: "Required",
                  parameters: ["page (optional)", "limit (optional)", "status (optional)"],
                  response: `{
  "success": true,
  "data": [
    {
      "id": "so-001",
      "sales_order_number": "SO-2025-001",
      "customer_id": "cust-123",
      "status": "confirmed",
      "total_amount": 1087.00,
      "delivery_date": "2025-01-15",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ]
}`
                },
                {
                  method: "POST",
                  endpoint: "/api/sales-orders",
                  description: "Create a new sales order",
                  auth: "Required (Sales Staff+)",
                  parameters: ["customer_id", "items[]", "delivery_date", "notes (optional)"],
                  response: `{
  "success": true,
  "data": {
    "id": "so-002",
    "sales_order_number": "SO-2025-002",
    "status": "pending",
    "created_at": "2025-01-01T00:00:00Z"
  }
}`
                },
                {
                  method: "PATCH",
                  endpoint: "/api/sales-orders/:id/status",
                  description: "Update sales order status",
                  auth: "Required (Manager+)",
                  parameters: ["id (path)", "status", "notes (optional)"],
                  response: `{
  "success": true,
  "data": {
    "id": "so-001",
    "status": "in_production",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}`
                }
              ].map((api) => (
                <Card key={`${api.method}-${api.endpoint}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-lg font-mono">{api.endpoint}</code>
                      </div>
                      <Badge variant="outline">{api.auth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <ul className="space-y-1">
                          {api.parameters.map((param, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-2 py-1 rounded">{param}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Response Example:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-x-auto max-h-48">
                          {api.response}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span>Job Order Endpoints</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  method: "GET",
                  endpoint: "/api/job-orders",
                  description: "Retrieve all job orders",
                  auth: "Required (Production Staff+)",
                  parameters: ["page (optional)", "status (optional)", "assigned_to (optional)"],
                  response: `{
  "success": true,
  "data": [
    {
      "id": "jo-001",
      "job_order_number": "JO-2025-001",
      "sales_order_id": "so-001",
      "status": "in_progress",
      "assigned_staff": "John Doe",
      "due_date": "2025-01-15",
      "progress": 75
    }
  ]
}`
                },
                {
                  method: "POST",
                  endpoint: "/api/job-orders",
                  description: "Create job order from sales order",
                  auth: "Required (Production Manager+)",
                  parameters: ["sales_order_id", "assigned_staff", "due_date", "instructions (optional)"],
                  response: `{
  "success": true,
  "data": {
    "id": "jo-002",
    "job_order_number": "JO-2025-002",
    "status": "planning",
    "created_at": "2025-01-01T00:00:00Z"
  }
}`
                }
              ].map((api) => (
                <Card key={`${api.method}-${api.endpoint}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-lg font-mono">{api.endpoint}</code>
                      </div>
                      <Badge variant="outline">{api.auth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <ul className="space-y-1">
                          {api.parameters.map((param, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-2 py-1 rounded">{param}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Response Example:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-x-auto max-h-48">
                          {api.response}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span>Inventory Endpoints</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  method: "GET",
                  endpoint: "/api/inventory",
                  description: "Retrieve inventory items across warehouses",
                  auth: "Required",
                  parameters: ["warehouse_id (optional)", "low_stock (optional)", "category (optional)"],
                  response: `{
  "success": true,
  "data": [
    {
      "id": "inv-001",
      "product_id": "prod-001",
      "warehouse_id": "wh-ng",
      "quantity": 150,
      "reserved": 25,
      "available": 125,
      "reorder_point": 50,
      "last_updated": "2025-01-01T00:00:00Z"
    }
  ]
}`
                },
                {
                  method: "POST",
                  endpoint: "/api/inventory/adjust",
                  description: "Adjust inventory quantities",
                  auth: "Required (Inventory Staff+)",
                  parameters: ["product_id", "warehouse_id", "adjustment", "reason"],
                  response: `{
  "success": true,
  "data": {
    "transaction_id": "adj-001",
    "new_quantity": 175,
    "adjustment": 25,
    "reason": "Physical count correction"
  }
}`
                },
                {
                  method: "POST",
                  endpoint: "/api/inventory/transfer",
                  description: "Transfer inventory between warehouses",
                  auth: "Required (Inventory Manager+)",
                  parameters: ["product_id", "from_warehouse", "to_warehouse", "quantity", "notes (optional)"],
                  response: `{
  "success": true,
  "data": {
    "transfer_id": "tf-001",
    "status": "pending",
    "estimated_completion": "2025-01-03"
  }
}`
                }
              ].map((api) => (
                <Card key={`${api.method}-${api.endpoint}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-lg font-mono">{api.endpoint}</code>
                      </div>
                      <Badge variant="outline">{api.auth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <ul className="space-y-1">
                          {api.parameters.map((param, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-2 py-1 rounded">{param}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Response Example:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-x-auto max-h-48">
                          {api.response}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>Customer Endpoints</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  method: "GET",
                  endpoint: "/api/customers",
                  description: "Retrieve all customers",
                  auth: "Required",
                  parameters: ["page (optional)", "search (optional)", "tier (optional)"],
                  response: `{
  "success": true,
  "data": [
    {
      "id": "cust-123",
      "name": "ABC Company",
      "email": "contact@abc.com",
      "tier": "regular",
      "credit_limit": 10000,
      "total_orders": 5,
      "last_order_date": "2025-01-01"
    }
  ]
}`
                },
                {
                  method: "POST",
                  endpoint: "/api/customers",
                  description: "Create a new customer",
                  auth: "Required (Sales Staff+)",
                  parameters: ["name", "email", "phone (optional)", "address (optional)", "tier (optional)"],
                  response: `{
  "success": true,
  "data": {
    "id": "cust-124",
    "name": "XYZ Corp",
    "email": "info@xyz.com",
    "tier": "new",
    "created_at": "2025-01-01T00:00:00Z"
  }
}`
                }
              ].map((api) => (
                <Card key={`${api.method}-${api.endpoint}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-lg font-mono">{api.endpoint}</code>
                      </div>
                      <Badge variant="outline">{api.auth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <ul className="space-y-1">
                          {api.parameters.map((param, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-2 py-1 rounded">{param}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Response Example:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-x-auto max-h-48">
                          {api.response}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
              <BarChart3 className="h-6 w-6" />
              <span>Reports & Analytics Endpoints</span>
            </h2>
            <div className="space-y-4">
              {[
                {
                  method: "GET",
                  endpoint: "/api/dashboard/analytics",
                  description: "Get dashboard analytics data",
                  auth: "Required",
                  parameters: ["date_range (optional)", "warehouse_id (optional)"],
                  response: `{
  "success": true,
  "data": {
    "revenue": {
      "total": 1087,
      "trend": "+15%",
      "growth": "up"
    },
    "orders": {
      "total": 7,
      "trend": "+2",
      "growth": "up"
    },
    "inventory": {
      "lowStockCount": 5,
      "totalProducts": 20
    }
  }
}`
                },
                {
                  method: "GET",
                  endpoint: "/api/reports/summary",
                  description: "Generate summary reports with filtering",
                  auth: "Required",
                  parameters: ["start_date", "end_date", "report_type", "filters (optional)"],
                  response: `{
  "success": true,
  "data": {
    "report_id": "rep-001",
    "type": "sales_summary",
    "period": "2025-01-01 to 2025-01-31",
    "summary": {
      "total_sales": 25430.00,
      "order_count": 15,
      "avg_order_value": 1695.33
    },
    "generated_at": "2025-01-01T00:00:00Z"
  }
}`
                }
              ].map((api) => (
                <Card key={`${api.method}-${api.endpoint}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-lg font-mono">{api.endpoint}</code>
                      </div>
                      <Badge variant="outline">{api.auth}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Parameters:</h4>
                        <ul className="space-y-1">
                          {api.parameters.map((param, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-2 py-1 rounded">{param}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Response Example:</h4>
                        <pre className="p-3 bg-muted rounded text-xs overflow-x-auto max-h-48">
                          {api.response}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}