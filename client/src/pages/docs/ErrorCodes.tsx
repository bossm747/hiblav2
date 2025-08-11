import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Shield, 
  Database, 
  Globe, 
  Settings,
  Search,
  Code
} from 'lucide-react';

export default function ErrorCodes() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Error Codes Reference</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Comprehensive reference for all error codes in Hibla Manufacturing System. 
          Understand error messages and find solutions quickly.
        </p>
      </div>

      {/* Search Helper */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Quick Error Lookup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 dark:text-blue-200">
          <p className="text-sm">
            Use Ctrl+F (or Cmd+F on Mac) to quickly search for specific error codes or messages on this page.
          </p>
        </CardContent>
      </Card>

      {/* HTTP Status Codes */}
      <div>
        <h2 className="text-2xl font-bold mb-6">HTTP Status Codes</h2>
        <div className="space-y-4">
          {[
            {
              code: "200",
              title: "OK",
              description: "Request successful",
              category: "success",
              icon: Globe,
              details: "The request has succeeded. The information returned with the response is dependent on the method used in the request.",
              examples: ["Successful login", "Data retrieved successfully", "Operation completed"]
            },
            {
              code: "201", 
              title: "Created",
              description: "Resource created successfully",
              category: "success",
              icon: Globe,
              details: "The request has been fulfilled and resulted in a new resource being created.",
              examples: ["New quotation created", "Customer account created", "Product added to inventory"]
            },
            {
              code: "400",
              title: "Bad Request",
              description: "Invalid request data",
              category: "client",
              icon: AlertCircle,
              details: "The server cannot or will not process the request due to something that is perceived to be a client error.",
              examples: ["Missing required fields", "Invalid data format", "Validation errors"]
            },
            {
              code: "401",
              title: "Unauthorized",
              description: "Authentication required",
              category: "client",
              icon: Shield,
              details: "The request has not been applied because it lacks valid authentication credentials for the target resource.",
              examples: ["Not logged in", "Session expired", "Invalid credentials"]
            },
            {
              code: "403",
              title: "Forbidden",
              description: "Insufficient permissions",
              category: "client",
              icon: Shield,
              details: "The server understood the request but refuses to authorize it.",
              examples: ["User role lacks permission", "Account disabled", "Feature restricted"]
            },
            {
              code: "404",
              title: "Not Found",
              description: "Resource not found",
              category: "client",
              icon: Search,
              details: "The server can't find the requested resource.",
              examples: ["Quotation not found", "Customer doesn't exist", "Invalid URL"]
            },
            {
              code: "422",
              title: "Unprocessable Entity",
              description: "Validation errors",
              category: "client",
              icon: AlertCircle,
              details: "The request was well-formed but was unable to be followed due to semantic errors.",
              examples: ["Business rule violations", "Data constraints", "Invalid relationships"]
            },
            {
              code: "500",
              title: "Internal Server Error",
              description: "Server encountered an error",
              category: "server",
              icon: Settings,
              details: "The server has encountered a situation it doesn't know how to handle.",
              examples: ["Database connection error", "Unexpected system error", "Configuration issues"]
            },
            {
              code: "502",
              title: "Bad Gateway",
              description: "Gateway error",
              category: "server",
              icon: Globe,
              details: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
              examples: ["Service unavailable", "Network connectivity issues", "Upstream service down"]
            },
            {
              code: "503",
              title: "Service Unavailable",
              description: "Service temporarily unavailable",
              category: "server",
              icon: Settings,
              details: "The server is currently unable to handle the request due to a temporary overloading or maintenance.",
              examples: ["System maintenance", "Server overloaded", "Database maintenance"]
            }
          ].map((error) => {
            const Icon = error.icon;
            const badgeVariant = error.category === 'success' ? 'default' : 
                               error.category === 'client' ? 'destructive' : 'secondary';
            
            return (
              <Card key={error.code}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        <code>{error.code} {error.title}</code>
                      </CardTitle>
                    </div>
                    <Badge variant={badgeVariant}>{error.category}</Badge>
                  </div>
                  <p className="text-muted-foreground">{error.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Details:</h4>
                      <p className="text-sm text-muted-foreground">{error.details}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Common Examples:</h4>
                      <ul className="space-y-1">
                        {error.examples.map((example, idx) => (
                          <li key={idx} className="text-sm">
                            <code className="bg-muted px-2 py-1 rounded">{example}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Application Error Codes */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Application Error Codes</h2>
        <div className="space-y-4">
          {[
            {
              code: "AUTH_001",
              title: "Invalid Credentials",
              description: "Email or password is incorrect",
              category: "Authentication",
              icon: Shield,
              solution: "Verify email and password. Check for typos and ensure correct case.",
              prevention: "Use password manager. Enable account lockout protection."
            },
            {
              code: "AUTH_002",
              title: "Session Expired",
              description: "User session has expired",
              category: "Authentication",
              icon: Shield,
              solution: "Login again to create new session. Check system time synchronization.",
              prevention: "Enable 'Remember me' option. Extend session timeout if appropriate."
            },
            {
              code: "PERM_001",
              title: "Insufficient Permissions",
              description: "User role lacks required permissions",
              category: "Authorization",
              icon: Shield,
              solution: "Contact administrator to review permissions. Verify user role assignment.",
              prevention: "Regular permission audits. Clear role documentation."
            },
            {
              code: "VAL_001",
              title: "Required Field Missing",
              description: "Mandatory field not provided",
              category: "Validation",
              icon: AlertCircle,
              solution: "Complete all required fields marked with asterisk (*). Check form validation.",
              prevention: "Use form validation. Provide clear field requirements."
            },
            {
              code: "VAL_002",
              title: "Invalid Data Format",
              description: "Data format doesn't match requirements",
              category: "Validation",
              icon: AlertCircle,
              solution: "Check data format requirements. Use correct date/number formats.",
              prevention: "Input masks and format helpers. Clear format examples."
            },
            {
              code: "BIZ_001",
              title: "Business Rule Violation",
              description: "Operation violates business logic",
              category: "Business Logic",
              icon: Settings,
              solution: "Review business rules. Check for conflicting operations or invalid states.",
              prevention: "Clear business rule documentation. Preventive validation."
            },
            {
              code: "DB_001",
              title: "Database Connection Error",
              description: "Cannot connect to database",
              category: "Database",
              icon: Database,
              solution: "Check network connectivity. Verify database server status.",
              prevention: "Connection pooling. Health monitoring. Failover systems."
            },
            {
              code: "DB_002",
              title: "Data Constraint Violation",
              description: "Data violates database constraints",
              category: "Database",
              icon: Database,
              solution: "Check data relationships. Ensure referential integrity.",
              prevention: "Proper foreign key handling. Data validation before save."
            },
            {
              code: "SYS_001",
              title: "System Overload",
              description: "System temporarily overloaded",
              category: "System",
              icon: Settings,
              solution: "Wait and retry operation. Consider reducing concurrent operations.",
              prevention: "Load balancing. Performance monitoring. Capacity planning."
            },
            {
              code: "NET_001",
              title: "Network Timeout",
              description: "Network request timed out",
              category: "Network",
              icon: Globe,
              solution: "Check internet connection. Retry operation. Contact support if persistent.",
              prevention: "Connection monitoring. Timeout optimization. Retry mechanisms."
            }
          ].map((error) => {
            const Icon = error.icon;
            
            return (
              <Card key={error.code}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        <code>{error.code}</code> - {error.title}
                      </CardTitle>
                    </div>
                    <Badge variant="outline">{error.category}</Badge>
                  </div>
                  <p className="text-muted-foreground">{error.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Solution:</h4>
                      <p className="text-sm text-muted-foreground">{error.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Prevention:</h4>
                      <p className="text-sm text-muted-foreground">{error.prevention}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Error Response Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Error Response Format</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Standard Error Response:</h4>
              <pre className="p-4 bg-muted rounded text-sm overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Required field missing",
    "details": {
      "field": "customer_id",
      "requirement": "Customer ID is required for quotation creation"
    },
    "timestamp": "2025-01-01T12:00:00Z",
    "request_id": "req_abc123"
  }
}`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Validation Error Response:</h4>
              <pre className="p-4 bg-muted rounded text-sm overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "VAL_002",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Invalid email format"
        },
        {
          "field": "quantity",
          "message": "Must be greater than 0"
        }
      ]
    }
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Handling Guidelines */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200">Error Handling Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-yellow-800 dark:text-yellow-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">For Users:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Read error messages carefully</li>
                <li>• Note error codes for support requests</li>
                <li>• Try suggested solutions before contacting support</li>
                <li>• Provide screenshots when reporting issues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">For Developers:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Always check HTTP status codes</li>
                <li>• Parse error response JSON for details</li>
                <li>• Implement proper error handling</li>
                <li>• Log errors with request IDs</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}