import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Globe, 
  Shield, 
  Zap, 
  Database, 
  CheckCircle,
  Code,
  FileText,
  Users,
  Package
} from 'lucide-react';

export default function APIOverview() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">API Documentation</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive REST API documentation for Hibla Manufacturing System. 
          Integrate with our platform using secure, well-documented endpoints.
        </p>
      </div>

      {/* API Overview */}
      <Card>
        <CardHeader>
          <CardTitle>API Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25+</div>
              <div className="text-sm text-muted-foreground">API Endpoints</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">REST</div>
              <div className="text-sm text-muted-foreground">API Standard</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">JSON</div>
              <div className="text-sm text-muted-foreground">Data Format</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">HTTPS</div>
              <div className="text-sm text-muted-foreground">Secure Protocol</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <div>
        <h2 className="text-2xl font-bold mb-6">API Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "RESTful Architecture",
              description: "Standard REST API design with predictable endpoints",
              icon: Globe,
              features: ["HTTP methods (GET, POST, PUT, DELETE)", "Resource-based URLs", "Standard status codes", "Consistent response format"]
            },
            {
              title: "Secure Authentication",
              description: "Robust security with multiple authentication options",
              icon: Shield,
              features: ["Session-based authentication", "Role-based access control", "Secure token handling", "Permission validation"]
            },
            {
              title: "High Performance",
              description: "Optimized for speed and reliability",
              icon: Zap,
              features: ["Fast response times", "Efficient data queries", "Caching mechanisms", "Scalable architecture"]
            },
            {
              title: "Data Integrity",
              description: "Reliable data handling and validation",
              icon: Database,
              features: ["Input validation", "Error handling", "Transaction support", "Data consistency"]
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

      {/* API Endpoints Overview */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Endpoint Categories</h2>
        <div className="space-y-4">
          {[
            {
              category: "Authentication",
              description: "User authentication and session management",
              baseUrl: "/api/auth",
              endpoints: 4,
              icon: Shield,
              methods: ["POST /login", "GET /user", "POST /logout", "GET /verify"]
            },
            {
              category: "Quotations",
              description: "Quotation creation, management, and conversion",
              baseUrl: "/api/quotations",
              endpoints: 6,
              icon: FileText,
              methods: ["GET /", "POST /", "GET /:id", "PUT /:id", "DELETE /:id", "POST /:id/convert"]
            },
            {
              category: "Sales Orders",
              description: "Sales order processing and management",
              baseUrl: "/api/sales-orders",
              endpoints: 5,
              icon: Package,
              methods: ["GET /", "POST /", "GET /:id", "PUT /:id", "DELETE /:id"]
            },
            {
              category: "Job Orders",
              description: "Production job order tracking and management",
              baseUrl: "/api/job-orders",
              endpoints: 5,
              icon: Settings,
              methods: ["GET /", "POST /", "GET /:id", "PUT /:id", "PATCH /:id/status"]
            },
            {
              category: "Inventory",
              description: "Inventory management and tracking",
              baseUrl: "/api/inventory",
              endpoints: 8,
              icon: Package,
              methods: ["GET /", "POST /", "PUT /:id", "POST /adjust", "POST /transfer"]
            },
            {
              category: "Customers",
              description: "Customer relationship management",
              baseUrl: "/api/customers",
              endpoints: 5,
              icon: Users,
              methods: ["GET /", "POST /", "GET /:id", "PUT /:id", "DELETE /:id"]
            }
          ].map((api) => {
            const Icon = api.icon;
            return (
              <Card key={api.category}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{api.category}</h3>
                        <Badge variant="outline">{api.endpoints} endpoints</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-sm">Base URL:</span>
                          <code className="block mt-1 p-2 bg-muted rounded text-sm">{api.baseUrl}</code>
                        </div>
                        <div>
                          <span className="font-medium text-sm">Available Methods:</span>
                          <div className="mt-1 space-y-1">
                            {api.methods.slice(0, 3).map((method, idx) => (
                              <code key={idx} className="block p-1 bg-muted rounded text-xs">
                                {method}
                              </code>
                            ))}
                            {api.methods.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{api.methods.length - 3} more...
                              </span>
                            )}
                          </div>
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

      {/* Getting Started */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Quick Start:</h4>
              <ol className="space-y-2 text-sm">
                <li>1. Obtain authentication credentials</li>
                <li>2. Authenticate via /api/auth/login</li>
                <li>3. Use session for subsequent requests</li>
                <li>4. Start with GET endpoints to explore data</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-3">Base URL:</h4>
              <code className="block p-3 bg-white/50 dark:bg-black/20 rounded text-sm">
                https://your-domain.replit.app/api
              </code>
              <p className="text-xs mt-2">All API requests should be made to this base URL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Standard Response Format</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Success Response:</h4>
              <pre className="p-4 bg-muted rounded text-sm overflow-x-auto">
{`{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Error Response:</h4>
              <pre className="p-4 bg-muted rounded text-sm overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      // Error details
    }
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HTTP Status Codes */}
      <Card>
        <CardHeader>
          <CardTitle>HTTP Status Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Success Codes:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code>200 OK</code>
                  <span>Request successful</span>
                </div>
                <div className="flex justify-between">
                  <code>201 Created</code>
                  <span>Resource created</span>
                </div>
                <div className="flex justify-between">
                  <code>204 No Content</code>
                  <span>Successful deletion</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Error Codes:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <code>400 Bad Request</code>
                  <span>Invalid input</span>
                </div>
                <div className="flex justify-between">
                  <code>401 Unauthorized</code>
                  <span>Authentication required</span>
                </div>
                <div className="flex justify-between">
                  <code>403 Forbidden</code>
                  <span>Insufficient permissions</span>
                </div>
                <div className="flex justify-between">
                  <code>404 Not Found</code>
                  <span>Resource not found</span>
                </div>
                <div className="flex justify-between">
                  <code>500 Server Error</code>
                  <span>Internal server error</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}