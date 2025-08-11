import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Puzzle, 
  CheckCircle, 
  AlertTriangle, 
  Zap,
  Settings,
  Database,
  Globe
} from 'lucide-react';

export default function APIIntegration() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Puzzle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">API Integration Guide</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Complete guide for integrating with Hibla Manufacturing API. 
          Learn best practices, code examples, and integration patterns.
        </p>
      </div>

      {/* Integration Examples */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Integration Examples</h2>
        <div className="space-y-6">
          {[
            {
              title: "JavaScript/Node.js Integration",
              description: "Complete authentication and API usage example",
              language: "JavaScript",
              code: `// Authentication and API client setup
const axios = require('axios');

class HiblaAPI {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL: baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async login(email, password) {
    try {
      const response = await this.client.post('/api/auth/login', {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw new Error(\`Login failed: \${error.response?.data?.message}\`);
    }
  }

  async getQuotations(filters = {}) {
    try {
      const response = await this.client.get('/api/quotations', {
        params: filters
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  async createQuotation(quotationData) {
    try {
      const response = await this.client.post('/api/quotations', quotationData);
      return response.data;
    } catch (error) {
      throw new Error(\`Failed to create quotation: \${error.response?.data?.message}\`);
    }
  }
}

// Usage example
const api = new HiblaAPI('https://your-domain.replit.app');

async function main() {
  try {
    // Authenticate
    await api.login('user@company.com', 'password');
    
    // Get quotations
    const quotations = await api.getQuotations({ status: 'pending' });
    console.log('Pending quotations:', quotations.data);
    
    // Create new quotation
    const newQuotation = await api.createQuotation({
      customer_id: 'cust-123',
      items: [
        { product_id: 'prod-001', quantity: 10, unit_price: 50.00 }
      ]
    });
    console.log('Created quotation:', newQuotation.data);
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

main();`
            },
            {
              title: "Python Integration",
              description: "Python client with requests library",
              language: "Python",
              code: `import requests
import json
from typing import Dict, Any, Optional

class HiblaAPI:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json'
        })
    
    def login(self, email: str, password: str) -> Dict[str, Any]:
        """Authenticate and create session"""
        url = f"{self.base_url}/api/auth/login"
        data = {"email": email, "password": password}
        
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.json()
    
    def get_quotations(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """Retrieve quotations with optional filtering"""
        url = f"{self.base_url}/api/quotations"
        params = filters or {}
        
        response = self.session.get(url, params=params)
        if response.status_code == 401:
            raise Exception("Authentication required")
        response.raise_for_status()
        return response.json()
    
    def create_quotation(self, quotation_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new quotation"""
        url = f"{self.base_url}/api/quotations"
        
        response = self.session.post(url, json=quotation_data)
        response.raise_for_status()
        return response.json()

# Usage example
if __name__ == "__main__":
    api = HiblaAPI("https://your-domain.replit.app")
    
    try:
        # Authenticate
        login_result = api.login("user@company.com", "password")
        print(f"Logged in as: {login_result['user']['email']}")
        
        # Get quotations
        quotations = api.get_quotations({"status": "pending"})
        print(f"Found {len(quotations['data'])} pending quotations")
        
        # Create quotation
        new_quotation = api.create_quotation({
            "customer_id": "cust-123",
            "items": [
                {"product_id": "prod-001", "quantity": 10, "unit_price": 50.00}
            ]
        })
        print(f"Created quotation: {new_quotation['data']['quotation_number']}")
        
    except Exception as e:
        print(f"Error: {e}")`
            },
            {
              title: "curl Command Examples",
              description: "Direct HTTP requests using curl",
              language: "bash",
              code: `#!/bin/bash

# Set base URL
BASE_URL="https://your-domain.replit.app"

# 1. Login and save session cookie
curl -X POST "$BASE_URL/api/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@company.com","password":"password"}' \\
  -c cookies.txt \\
  -b cookies.txt

# 2. Get quotations (using saved session)
curl -X GET "$BASE_URL/api/quotations" \\
  -H "Content-Type: application/json" \\
  -b cookies.txt

# 3. Get specific quotation
curl -X GET "$BASE_URL/api/quotations/quot-001" \\
  -H "Content-Type: application/json" \\
  -b cookies.txt

# 4. Create new quotation
curl -X POST "$BASE_URL/api/quotations" \\
  -H "Content-Type: application/json" \\
  -b cookies.txt \\
  -d '{
    "customer_id": "cust-123",
    "items": [
      {
        "product_id": "prod-001",
        "quantity": 10,
        "unit_price": 50.00
      }
    ],
    "notes": "Sample quotation via API"
  }'

# 5. Update quotation status
curl -X PATCH "$BASE_URL/api/quotations/quot-001/status" \\
  -H "Content-Type: application/json" \\
  -b cookies.txt \\
  -d '{"status": "sent"}'

# 6. Convert quotation to sales order
curl -X POST "$BASE_URL/api/quotations/quot-001/convert" \\
  -H "Content-Type: application/json" \\
  -b cookies.txt \\
  -d '{"delivery_date": "2025-01-15"}'

# 7. Logout
curl -X POST "$BASE_URL/api/auth/logout" \\
  -b cookies.txt

# Clean up
rm cookies.txt`
            }
          ].map((example) => (
            <Card key={example.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                  <Badge variant="outline">{example.language}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-muted rounded text-sm overflow-x-auto max-h-96">
                  <code>{example.code}</code>
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration Patterns */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Common Integration Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              pattern: "Webhook Integration",
              description: "Receive real-time notifications from Hibla",
              icon: Zap,
              features: ["Real-time updates", "Event-driven architecture", "Reliable delivery", "Retry mechanisms"]
            },
            {
              pattern: "Batch Synchronization",
              description: "Periodic data synchronization with external systems",
              icon: Database,
              features: ["Scheduled sync", "Large data sets", "Error handling", "Progress tracking"]
            },
            {
              pattern: "Real-time Dashboard",
              description: "Live dashboard with API polling",
              icon: Globe,
              features: ["Live updates", "WebSocket support", "Caching", "Performance optimization"]
            },
            {
              pattern: "Microservice Integration",
              description: "Service-to-service communication",
              icon: Settings,
              features: ["Service mesh", "Circuit breakers", "Load balancing", "Health checks"]
            }
          ].map((pattern) => {
            const Icon = pattern.icon;
            return (
              <Card key={pattern.pattern}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{pattern.pattern}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pattern.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Error Handling Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Error Response Format:</h4>
              <pre className="p-4 bg-muted rounded text-sm overflow-x-auto">
{`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid quotation data",
    "details": {
      "field": "customer_id",
      "issue": "Customer not found"
    }
  }
}`}
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">JavaScript Error Handling:</h4>
                <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
{`try {
  const response = await api.createQuotation(data);
  return response;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
    redirectToLogin();
  } else if (error.response?.status === 400) {
    // Handle validation error
    showValidationErrors(error.response.data.error.details);
  } else {
    // Handle other errors
    showGenericError(error.message);
  }
}`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Python Error Handling:</h4>
                <pre className="p-3 bg-muted rounded text-sm overflow-x-auto">
{`try:
    response = api.create_quotation(data)
    return response
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 401:
        # Handle authentication error
        handle_auth_error()
    elif e.response.status_code == 400:
        # Handle validation error
        error_data = e.response.json()
        handle_validation_error(error_data['error'])
    else:
        # Handle other HTTP errors
        handle_http_error(e)
except requests.exceptions.RequestException as e:
    # Handle network errors
    handle_network_error(e)`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Limiting */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/10">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200">Rate Limiting & Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-yellow-800 dark:text-yellow-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Rate Limits:</h4>
              <ul className="space-y-2 text-sm">
                <li>• 1000 requests per hour per user</li>
                <li>• 100 requests per minute burst</li>
                <li>• Monitor via X-RateLimit headers</li>
                <li>• Implement exponential backoff</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Performance Tips:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Use pagination for large datasets</li>
                <li>• Cache frequently accessed data</li>
                <li>• Implement connection pooling</li>
                <li>• Use compression when available</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Testing Your Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Test Environment:</h4>
              <div className="p-3 bg-muted rounded">
                <code>Base URL: https://test.your-domain.replit.app</code>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Use test environment for development and testing. Data is reset weekly.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Integration Checklist:</h4>
              <div className="space-y-2">
                {[
                  "Authentication flow works correctly",
                  "Error handling for common scenarios",
                  "Session management and renewal",
                  "Rate limiting compliance",
                  "Data validation and sanitization",
                  "Logging and monitoring setup",
                  "Fallback mechanisms for failures",
                  "Performance optimization"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}