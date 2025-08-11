import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Mail, 
  MessageCircle, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ExternalLink
} from 'lucide-react';

export default function Support() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Support & Contact</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Get help with Hibla Manufacturing System. Find support resources, 
          contact information, and assistance for all your questions.
        </p>
      </div>

      {/* Support Channels */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Support Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              channel: "Email Support",
              description: "Get detailed help via email",
              icon: Mail,
              contact: "support@hibla.com",
              response: "24-48 hours",
              availability: "24/7",
              best_for: ["Detailed technical questions", "Bug reports", "Feature requests", "Account issues"]
            },
            {
              channel: "Documentation",
              description: "Self-service help resources",
              icon: BookOpen,
              contact: "Available online",
              response: "Immediate",
              availability: "24/7",
              best_for: ["Quick answers", "How-to guides", "API documentation", "Troubleshooting"]
            },
            {
              channel: "Business Hours Support",
              description: "Priority support during business hours",
              icon: Clock,
              contact: "Available 9 AM - 6 PM PST",
              response: "2-4 hours",
              availability: "Business days",
              best_for: ["Urgent issues", "Training requests", "Implementation help", "System outages"]
            },
            {
              channel: "Community Forums",
              description: "Community-driven support",
              icon: MessageCircle,
              contact: "forum.hibla.com",
              response: "Varies",
              availability: "24/7",
              best_for: ["General questions", "Best practices", "User tips", "Feature discussions"]
            }
          ].map((support) => {
            const Icon = support.icon;
            return (
              <Card key={support.channel}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{support.channel}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{support.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Contact:</span>
                      <p className="text-muted-foreground">{support.contact}</p>
                    </div>
                    <div>
                      <span className="font-medium">Response:</span>
                      <p className="text-muted-foreground">{support.response}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Best for:</span>
                    <ul className="mt-2 space-y-1">
                      {support.best_for.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Badge variant="outline">{support.availability}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Priority Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Support Priority Levels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                priority: "Critical",
                response: "1-2 hours",
                description: "System down, data loss, security breach",
                color: "bg-red-100 text-red-800",
                examples: ["System outage affecting all users", "Data corruption or loss", "Security vulnerability", "Payment processing failures"]
              },
              {
                priority: "High",
                response: "4-8 hours",
                description: "Major functionality broken, blocking business",
                color: "bg-orange-100 text-orange-800",
                examples: ["Core features not working", "API endpoints down", "Login issues for multiple users", "Database performance problems"]
              },
              {
                priority: "Medium",
                response: "24-48 hours",
                description: "Non-critical features affected, workaround available",
                color: "bg-yellow-100 text-yellow-800",
                examples: ["Minor feature bugs", "Performance slowdowns", "UI/UX issues", "Report generation problems"]
              },
              {
                priority: "Low",
                response: "3-5 days",
                description: "Enhancement requests, documentation updates",
                color: "bg-green-100 text-green-800",
                examples: ["Feature requests", "Documentation updates", "Training requests", "General questions"]
              }
            ].map((level) => (
              <div key={level.priority} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={level.color}>{level.priority} Priority</Badge>
                    <span className="font-medium">{level.description}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Response: {level.response}</span>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Examples:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {level.examples.map((example, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground">
                        • {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Creating Support Requests */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Creating Effective Support Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>Information to Include</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Clear Problem Description</strong>
                    <p className="text-muted-foreground">Describe what happened and what you expected</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Steps to Reproduce</strong>
                    <p className="text-muted-foreground">Detailed steps to recreate the issue</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>System Information</strong>
                    <p className="text-muted-foreground">Browser, OS, version, screen resolution</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Screenshots/Videos</strong>
                    <p className="text-muted-foreground">Visual evidence of the problem</p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Error Messages</strong>
                    <p className="text-muted-foreground">Exact error codes and messages</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <span>Support Request Template</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
{`Subject: [Priority] Brief description of issue

Problem Description:
What happened and what you expected to happen.

Steps to Reproduce:
1. Go to [specific page]
2. Click on [specific button]
3. Enter [specific data]
4. Observe the error

System Information:
- Browser: Chrome 120.0
- Operating System: Windows 11
- Screen Resolution: 1920x1080
- Account Role: Sales Staff

Error Messages:
[Include exact error messages or codes]

Screenshots:
[Attach relevant screenshots]

Additional Context:
[Any other relevant information]

Priority Level: [Critical/High/Medium/Low]
Business Impact: [How this affects your work]`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Self-Help Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Self-Help Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                resource: "Documentation",
                description: "Comprehensive guides and tutorials",
                link: "/docs",
                icon: BookOpen
              },
              {
                resource: "Troubleshooting Guide",
                description: "Common issues and solutions",
                link: "/docs/troubleshooting",
                icon: AlertCircle
              },
              {
                resource: "API Reference",
                description: "Complete API documentation",
                link: "/docs/api",
                icon: ExternalLink
              },
              {
                resource: "Error Codes",
                description: "Error code reference guide",
                link: "/docs/error-codes",
                icon: AlertCircle
              },
              {
                resource: "Performance Tips",
                description: "Optimization best practices",
                link: "/docs/performance",
                icon: CheckCircle
              },
              {
                resource: "User Roles Guide",
                description: "Permissions and access control",
                link: "/docs/roles",
                icon: Users
              }
            ].map((resource) => {
              const Icon = resource.icon;
              return (
                <Card key={resource.resource} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">{resource.resource}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                        <a 
                          href={resource.link}
                          className="text-sm text-primary hover:underline flex items-center space-x-1"
                        >
                          <span>Learn more</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">General Support:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>support@hibla.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Response: 24-48 hours</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Business Hours:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Monday - Friday: 9 AM - 6 PM PST</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Priority support available</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}