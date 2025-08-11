import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Server, 
  Database, 
  Cloud, 
  Shield, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Smartphone,
  Globe,
  HardDrive
} from 'lucide-react';

const browserRequirements = [
  { name: "Chrome", version: "90+", status: "recommended", icon: "🌐" },
  { name: "Firefox", version: "88+", status: "supported", icon: "🦊" },
  { name: "Safari", version: "14+", status: "supported", icon: "🧭" },
  { name: "Edge", version: "90+", status: "supported", icon: "🔷" },
  { name: "Internet Explorer", version: "Any", status: "not-supported", icon: "❌" }
];

const serverRequirements = [
  { component: "Node.js", version: "18.0+", required: true, current: "20.19.3" },
  { component: "PostgreSQL", version: "13.0+", required: true, current: "15.0" },
  { component: "Memory (RAM)", version: "4GB minimum", required: true, current: "8GB recommended" },
  { component: "Storage", version: "20GB free space", required: true, current: "SSD recommended" },
  { component: "CPU", version: "2 cores minimum", required: false, current: "4 cores recommended" }
];

const networkRequirements = [
  { feature: "HTTPS Support", required: true, description: "SSL/TLS encryption for secure communication" },
  { feature: "WebSocket Support", required: true, description: "Real-time updates and notifications" },
  { feature: "API Access", required: true, description: "RESTful API endpoints for integrations" },
  { feature: "Email SMTP", required: false, description: "For sending quotations and notifications" },
  { feature: "File Upload", required: true, description: "Product images and document attachments" }
];

const mobileSupport = [
  { device: "iOS", version: "13.0+", features: ["Touch navigation", "Responsive design", "Offline viewing"] },
  { device: "Android", version: "8.0+", features: ["Touch navigation", "Responsive design", "PWA support"] },
  { device: "Tablet", version: "iPad/Android", features: ["Split-screen view", "Enhanced touch targets", "Landscape mode"] }
];

export default function SystemRequirements() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Monitor className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">System Requirements</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Technical specifications and compatibility requirements for Hibla Manufacturing System. Ensure your environment meets these requirements for optimal performance.
        </p>
      </div>

      {/* Browser Compatibility */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Browser Compatibility</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {browserRequirements.map((browser) => (
            <Card key={browser.name} className={`${
              browser.status === 'not-supported' ? 'border-red-200 bg-red-50 dark:bg-red-950/10' :
              browser.status === 'recommended' ? 'border-green-200 bg-green-50 dark:bg-green-950/10' :
              'border-blue-200 bg-blue-50 dark:bg-blue-950/10'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{browser.icon}</span>
                    <CardTitle className="text-lg">{browser.name}</CardTitle>
                  </div>
                  {browser.status === 'recommended' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  {browser.status === 'supported' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                  {browser.status === 'not-supported' && <XCircle className="h-5 w-5 text-red-600" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Version: </span>
                    <span>{browser.version}</span>
                  </div>
                  <Badge variant={
                    browser.status === 'recommended' ? 'default' :
                    browser.status === 'supported' ? 'secondary' : 'destructive'
                  }>
                    {browser.status === 'recommended' ? 'Recommended' :
                     browser.status === 'supported' ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Server Requirements */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <span>Server Requirements</span>
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {serverRequirements.map((req) => (
                <div key={req.component} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${req.required ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <div>
                      <div className="font-medium">{req.component}</div>
                      <div className="text-sm text-muted-foreground">{req.version}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{req.current}</div>
                    <Badge variant={req.required ? 'destructive' : 'secondary'} className="text-xs">
                      {req.required ? 'Required' : 'Recommended'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Requirements */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>Network & Security</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {networkRequirements.map((req) => (
            <Card key={req.feature}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{req.feature}</CardTitle>
                  {req.required ? (
                    <Badge variant="destructive">Required</Badge>
                  ) : (
                    <Badge variant="secondary">Optional</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{req.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Support */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <span>Mobile Support</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mobileSupport.map((device) => (
            <Card key={device.device}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{device.device}</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">{device.version}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {device.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Recommendations */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800 dark:text-yellow-200">Performance Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-yellow-800 dark:text-yellow-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">For Optimal Performance:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Use SSD storage for database</li>
                <li>• Enable browser caching</li>
                <li>• Use CDN for static assets</li>
                <li>• Configure database indexing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Security Best Practices:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Enable HTTPS encryption</li>
                <li>• Use strong passwords</li>
                <li>• Regular security updates</li>
                <li>• Backup data regularly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Configuration */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Database Configuration</span>
        </h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">PostgreSQL Settings</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>max_connections:</span>
                      <code className="bg-muted px-2 py-1 rounded">100</code>
                    </div>
                    <div className="flex justify-between">
                      <span>shared_buffers:</span>
                      <code className="bg-muted px-2 py-1 rounded">256MB</code>
                    </div>
                    <div className="flex justify-between">
                      <span>work_mem:</span>
                      <code className="bg-muted px-2 py-1 rounded">4MB</code>
                    </div>
                    <div className="flex justify-between">
                      <span>maintenance_work_mem:</span>
                      <code className="bg-muted px-2 py-1 rounded">64MB</code>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Environment Variables</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>DATABASE_URL:</span>
                      <code className="bg-muted px-2 py-1 rounded">Required</code>
                    </div>
                    <div className="flex justify-between">
                      <span>NODE_ENV:</span>
                      <code className="bg-muted px-2 py-1 rounded">production</code>
                    </div>
                    <div className="flex justify-between">
                      <span>PORT:</span>
                      <code className="bg-muted px-2 py-1 rounded">5000</code>
                    </div>
                    <div className="flex justify-between">
                      <span>SESSION_SECRET:</span>
                      <code className="bg-muted px-2 py-1 rounded">Required</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}