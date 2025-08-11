import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  TrendingUp, 
  Database, 
  Globe, 
  Settings,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Clock
} from 'lucide-react';

export default function Performance() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Performance Optimization</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Optimize your Hibla Manufacturing System experience with performance tips, 
          best practices, and system optimization techniques.
        </p>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>System Performance Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">< 2s</div>
              <div className="text-sm text-muted-foreground">Page Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">< 500ms</div>
              <div className="text-sm text-muted-foreground">API Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">< 100ms</div>
              <div className="text-sm text-muted-foreground">Database Query</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Optimization */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Browser Optimization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Cache Management",
              description: "Optimize browser cache for better performance",
              icon: Globe,
              tips: [
                "Clear cache weekly for optimal performance",
                "Enable browser cache for static resources",
                "Use hard refresh (Ctrl+F5) when needed",
                "Configure cache expiration properly"
              ]
            },
            {
              title: "Browser Settings",
              description: "Configure browser for optimal experience",
              icon: Settings,
              tips: [
                "Enable JavaScript and cookies",
                "Disable unnecessary extensions",
                "Keep browser updated to latest version",
                "Use hardware acceleration when available"
              ]
            },
            {
              title: "Network Optimization",
              description: "Improve network performance",
              icon: Globe,
              tips: [
                "Use stable internet connection",
                "Avoid concurrent downloads during usage",
                "Consider using wired connection for critical tasks",
                "Monitor network latency and bandwidth"
              ]
            },
            {
              title: "System Resources",
              description: "Optimize system resource usage",
              icon: BarChart3,
              tips: [
                "Close unnecessary applications",
                "Ensure adequate RAM availability",
                "Monitor CPU usage during operations",
                "Use SSD for better disk performance"
              ]
            }
          ].map((optimization) => {
            const Icon = optimization.icon;
            return (
              <Card key={optimization.title}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{optimization.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{optimization.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {optimization.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Database Performance */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Database Performance Tips</h2>
        <div className="space-y-4">
          {[
            {
              category: "Query Optimization",
              description: "Optimize database queries for better performance",
              icon: Database,
              level: "Advanced",
              recommendations: [
                "Use proper indexing on frequently queried fields",
                "Limit result sets with pagination",
                "Avoid SELECT * queries when possible",
                "Use database query optimization tools",
                "Monitor slow query logs regularly"
              ]
            },
            {
              category: "Data Management",
              description: "Manage data efficiently for optimal performance",
              icon: Settings,
              level: "Intermediate",
              recommendations: [
                "Archive old data to reduce active dataset size",
                "Implement proper data cleanup procedures",
                "Use appropriate data types for fields",
                "Normalize database structure appropriately",
                "Regular database maintenance and optimization"
              ]
            },
            {
              category: "Connection Management",
              description: "Optimize database connections",
              icon: Globe,
              level: "Advanced",
              recommendations: [
                "Use connection pooling for better resource management",
                "Monitor connection timeouts and limits",
                "Implement proper connection retry logic",
                "Configure appropriate connection pool sizes",
                "Monitor database connection usage patterns"
              ]
            }
          ].map((perf) => {
            const Icon = perf.icon;
            return (
              <Card key={perf.category}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{perf.category}</CardTitle>
                    </div>
                    <Badge variant="outline">{perf.level}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{perf.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {perf.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* API Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>API Performance Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Request Optimization:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use pagination for large datasets</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Implement proper filtering to reduce data transfer</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Cache frequently accessed data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use compression when transferring large payloads</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Connection Management:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Reuse connections when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Implement proper timeout handling</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use connection pooling for high-volume applications</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Monitor API rate limits and usage patterns</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Monitoring</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Key Metrics to Monitor:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted rounded">
                  <h5 className="font-medium text-sm">Response Time</h5>
                  <p className="text-xs text-muted-foreground">API and page load times</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <h5 className="font-medium text-sm">Error Rate</h5>
                  <p className="text-xs text-muted-foreground">Frequency of errors and failures</p>
                </div>
                <div className="p-3 bg-muted rounded">
                  <h5 className="font-medium text-sm">Throughput</h5>
                  <p className="text-xs text-muted-foreground">Requests processed per second</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Browser Developer Tools:</h4>
              <div className="space-y-2 text-sm">
                <p><kbd className="bg-muted px-2 py-1 rounded">F12</kbd> - Open developer tools</p>
                <p><kbd className="bg-muted px-2 py-1 rounded">Network Tab</kbd> - Monitor API requests and response times</p>
                <p><kbd className="bg-muted px-2 py-1 rounded">Performance Tab</kbd> - Analyze page load performance</p>
                <p><kbd className="bg-muted px-2 py-1 rounded">Console Tab</kbd> - Check for JavaScript errors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Common Performance Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-red-400 bg-red-50 dark:bg-red-950/10">
              <h4 className="font-medium text-red-800 dark:text-red-200">Slow Page Loading</h4>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                <strong>Causes:</strong> Large datasets, unoptimized queries, network issues
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Solutions:</strong> Implement pagination, optimize database queries, use CDN
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">High Memory Usage</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                <strong>Causes:</strong> Memory leaks, large cached datasets, multiple browser tabs
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Solutions:</strong> Clear cache regularly, close unused tabs, restart browser
              </p>
            </div>
            
            <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/10">
              <h4 className="font-medium text-blue-800 dark:text-blue-200">API Timeouts</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                <strong>Causes:</strong> Network latency, server overload, complex operations
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Solutions:</strong> Optimize queries, implement retry logic, increase timeouts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Checklist */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200 flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Performance Optimization Checklist</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Daily Tasks:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Monitor system performance metrics</li>
                <li>• Check for error messages and resolve issues</li>
                <li>• Clear browser cache if experiencing slowdowns</li>
                <li>• Close unnecessary browser tabs and applications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Weekly Tasks:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Review performance trends and patterns</li>
                <li>• Update browser to latest version</li>
                <li>• Check database storage and cleanup old data</li>
                <li>• Monitor API usage and optimize calls</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}