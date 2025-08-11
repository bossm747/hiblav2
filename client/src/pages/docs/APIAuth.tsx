import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Key, 
  User, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Settings,
  Clock,
  Eye,
  UserCheck
} from 'lucide-react';

export default function APIAuth() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">API Authentication</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Secure authentication system with session-based access control and role-based permissions. 
          Learn how to authenticate and manage API access securely.
        </p>
      </div>

      {/* Authentication Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">Session-Based</h3>
              <p className="text-sm text-muted-foreground">Secure session management</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold">Role-Based</h3>
              <p className="text-sm text-muted-foreground">Permission-based access</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold">Secure</h3>
              <p className="text-sm text-muted-foreground">HTTPS encryption</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold">Session TTL</h3>
              <p className="text-sm text-muted-foreground">7-day expiration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Flow */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Authentication Flow</h2>
        <div className="space-y-6">
          {[
            {
              step: "1. Login Request",
              description: "Send credentials to authentication endpoint",
              method: "POST",
              endpoint: "/api/auth/login",
              body: {
                email: "user@company.com",
                password: "userpassword"
              },
              response: {
                success: true,
                user: {
                  id: "user-123",
                  email: "user@company.com",
                  role: "sales_staff"
                }
              }
            },
            {
              step: "2. Session Creation",
              description: "Server creates secure session and sets cookie",
              method: "Auto",
              endpoint: "Server-side",
              body: null,
              response: {
                "Set-Cookie": "connect.sid=s%3A...; HttpOnly; Secure"
              }
            },
            {
              step: "3. Authenticated Requests",
              description: "Include session cookie in subsequent requests",
              method: "GET",
              endpoint: "/api/quotations",
              body: null,
              response: {
                success: true,
                data: ["Array of quotations"]
              }
            }
          ].map((flow) => (
            <Card key={flow.step}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{flow.step}</CardTitle>
                  {flow.method !== "Auto" && (
                    <Badge variant="outline">{flow.method}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{flow.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Request:</h4>
                    <div className="space-y-2">
                      <code className="block p-2 bg-muted rounded text-sm">
                        {flow.method} {flow.endpoint}
                      </code>
                      {flow.body && (
                        <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
                          {JSON.stringify(flow.body, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Response:</h4>
                    <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
                      {JSON.stringify(flow.response, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Role-Based Access Control */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Role-Based Access Control</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>User Roles & Permissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  role: "Admin",
                  level: "Executive",
                  permissions: 35,
                  access: ["Full system access", "User management", "System configuration", "All API endpoints"],
                  color: "bg-red-100 text-red-800"
                },
                {
                  role: "Production Manager",
                  level: "Management",
                  permissions: 28,
                  access: ["Production operations", "Job order management", "Inventory oversight", "Staff coordination"],
                  color: "bg-purple-100 text-purple-800"
                },
                {
                  role: "Sales Manager",
                  level: "Management",
                  permissions: 22,
                  access: ["Sales operations", "Customer management", "Pricing control", "Quote approval"],
                  color: "bg-blue-100 text-blue-800"
                },
                {
                  role: "Sales Staff",
                  level: "Operational",
                  permissions: 12,
                  access: ["Create quotations", "Customer contact", "Order processing", "Basic reporting"],
                  color: "bg-green-100 text-green-800"
                }
              ].map((role) => (
                <div key={role.role} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge className={role.color}>{role.role}</Badge>
                      <span className="font-medium">{role.level} Level</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{role.permissions} permissions</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {role.access.map((access, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{access}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Authentication Endpoints</h2>
        <div className="space-y-4">
          {[
            {
              method: "POST",
              endpoint: "/api/auth/login",
              description: "Authenticate user and create session",
              parameters: ["email (string)", "password (string)"],
              responses: ["200: Success with user data", "401: Invalid credentials"]
            },
            {
              method: "GET",
              endpoint: "/api/auth/user",
              description: "Get current authenticated user information",
              parameters: ["None (requires session)"],
              responses: ["200: User data", "401: Not authenticated"]
            },
            {
              method: "POST",
              endpoint: "/api/auth/logout",
              description: "Destroy user session and log out",
              parameters: ["None (requires session)"],
              responses: ["200: Logout successful", "401: Not authenticated"]
            },
            {
              method: "GET",
              endpoint: "/api/auth/verify",
              description: "Verify session validity",
              parameters: ["None (requires session)"],
              responses: ["200: Session valid", "401: Session invalid"]
            }
          ].map((api) => (
            <Card key={api.endpoint}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Badge 
                    variant={api.method === 'GET' ? 'secondary' : 'default'}
                    className={api.method === 'POST' ? 'bg-blue-600' : ''}
                  >
                    {api.method}
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      <code>{api.endpoint}</code>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{api.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Parameters:</h4>
                        <ul className="space-y-1">
                          {api.parameters.map((param, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-1 rounded">{param}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Responses:</h4>
                        <ul className="space-y-1">
                          {api.responses.map((response, idx) => (
                            <li key={idx} className="text-sm">
                              <code className="bg-muted px-1 rounded">{response}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Security Best Practices */}
      <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
        <CardHeader>
          <CardTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Security Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-red-800 dark:text-red-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">API Security:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Always use HTTPS for API requests</li>
                <li>• Include session cookies in requests</li>
                <li>• Handle 401 responses appropriately</li>
                <li>• Implement proper error handling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Session Management:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Sessions expire after 7 days</li>
                <li>• Logout properly to destroy sessions</li>
                <li>• Handle session expiration gracefully</li>
                <li>• Don't store sensitive data in client</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Common Authentication Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Session Expired</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Solution: Check for 401 responses and redirect to login page. Implement automatic session refresh if needed.
              </p>
            </div>
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">CORS Issues</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Solution: Ensure requests are made from allowed origins and include credentials in requests.
              </p>
            </div>
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Permission Denied</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Solution: Verify user role has required permissions for the requested operation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}