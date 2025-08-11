import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield,
  Database,
  Globe,
  Settings,
  Zap
} from 'lucide-react';

export default function Troubleshooting() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Troubleshooting Guide</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Common issues and solutions for Hibla Manufacturing System. 
          Find quick solutions to frequently encountered problems.
        </p>
      </div>

      {/* Quick Diagnostics */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200 flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Quick Diagnostics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">System Status Check:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Check internet connection</li>
                <li>• Verify system status page</li>
                <li>• Test basic login functionality</li>
                <li>• Confirm browser compatibility</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Common Quick Fixes:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Clear browser cache and cookies</li>
                <li>• Refresh the page (Ctrl+F5)</li>
                <li>• Try incognito/private browsing</li>
                <li>• Check for browser extensions conflicts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Issues */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Authentication & Access Issues</h2>
        <div className="space-y-4">
          {[
            {
              issue: "Cannot Login",
              symptoms: ["Invalid credentials error", "Login page not loading", "Session expired messages"],
              icon: Shield,
              severity: "high",
              solutions: [
                "Verify email and password are correct",
                "Check if account is active and not locked",
                "Clear browser cookies and cache",
                "Try different browser or incognito mode",
                "Contact administrator to reset password"
              ]
            },
            {
              issue: "Session Keeps Expiring",
              symptoms: ["Frequent logout prompts", "401 Unauthorized errors", "Session timeouts"],
              icon: Clock,
              severity: "medium",
              solutions: [
                "Check system clock synchronization",
                "Disable browser extensions that block cookies",
                "Ensure cookies are enabled in browser",
                "Check for network connectivity issues",
                "Contact support if sessions expire too quickly"
              ]
            },
            {
              issue: "Permission Denied",
              symptoms: ["403 Forbidden errors", "Missing menu items", "Cannot access features"],
              icon: Shield,
              severity: "medium",
              solutions: [
                "Verify your user role and permissions",
                "Contact administrator to check access rights",
                "Logout and login again to refresh permissions",
                "Check if account has required tier access",
                "Request permission upgrade if needed"
              ]
            }
          ].map((problem) => {
            const Icon = problem.icon;
            return (
              <Card key={problem.issue}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{problem.issue}</CardTitle>
                    </div>
                    <Badge variant={problem.severity === 'high' ? 'destructive' : 'secondary'}>
                      {problem.severity} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Symptoms:</h4>
                      <ul className="space-y-2">
                        {problem.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Solutions:</h4>
                      <ul className="space-y-2">
                        {problem.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{solution}</span>
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

      {/* Performance Issues */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Performance & Loading Issues</h2>
        <div className="space-y-4">
          {[
            {
              issue: "Slow Page Loading",
              symptoms: ["Pages take long to load", "Timeout errors", "Spinning loaders"],
              icon: Zap,
              severity: "medium",
              solutions: [
                "Check internet connection speed",
                "Close unnecessary browser tabs",
                "Clear browser cache and cookies",
                "Disable browser extensions temporarily",
                "Try using a different browser",
                "Contact support if issues persist"
              ]
            },
            {
              issue: "Data Not Updating",
              symptoms: ["Old data displayed", "Changes not saved", "Sync issues"],
              icon: Database,
              severity: "high",
              solutions: [
                "Refresh the page to reload data",
                "Check if you have required permissions",
                "Verify network connection is stable",
                "Clear browser cache and reload",
                "Check for any error messages in console",
                "Contact support for data synchronization issues"
              ]
            },
            {
              issue: "Features Not Working",
              symptoms: ["Buttons not responding", "Forms not submitting", "JavaScript errors"],
              icon: Settings,
              severity: "high",
              solutions: [
                "Check browser console for JavaScript errors",
                "Disable browser extensions and test again",
                "Try using a supported browser version",
                "Clear cache and reload the page",
                "Test in incognito/private browsing mode",
                "Report specific feature issues to support"
              ]
            }
          ].map((problem) => {
            const Icon = problem.icon;
            return (
              <Card key={problem.issue}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{problem.issue}</CardTitle>
                    </div>
                    <Badge variant={problem.severity === 'high' ? 'destructive' : 'secondary'}>
                      {problem.severity} priority
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Symptoms:</h4>
                      <ul className="space-y-2">
                        {problem.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm">
                            <XCircle className="h-3 w-3 text-red-600" />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Solutions:</h4>
                      <ul className="space-y-2">
                        {problem.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{solution}</span>
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

      {/* Browser Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Browser Compatibility Issues</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Supported Browsers:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Chrome</span>
                    <Badge variant="default">90+ ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Firefox</span>
                    <Badge variant="secondary">88+ ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Safari</span>
                    <Badge variant="secondary">14+ ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Edge</span>
                    <Badge variant="secondary">90+ ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Internet Explorer</span>
                    <Badge variant="destructive">Not Supported ✗</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Browser Settings:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>JavaScript must be enabled</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Cookies must be allowed</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Pop-up blockers may interfere</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>HTTPS must be supported</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Help */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/10">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-200">When to Contact Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-green-800 dark:text-green-200">
          <p>Contact our support team if you encounter:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Critical Issues:</h4>
              <ul className="space-y-2 text-sm">
                <li>• System-wide outages or downtime</li>
                <li>• Data loss or corruption</li>
                <li>• Security-related concerns</li>
                <li>• Account lockouts</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">General Support:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Feature requests or feedback</li>
                <li>• Training and onboarding help</li>
                <li>• Integration assistance</li>
                <li>• Performance optimization</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
            <h4 className="font-medium mb-2">Support Information to Include:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Detailed description of the problem</li>
              <li>• Steps to reproduce the issue</li>
              <li>• Browser and version information</li>
              <li>• Screenshots or error messages</li>
              <li>• Time when the issue occurred</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}