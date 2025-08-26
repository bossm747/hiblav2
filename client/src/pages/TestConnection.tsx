import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { clientsApi } from '@/api/clients';
import { productsApi } from '@/api/products';
import { salesOrdersApi } from '@/api/sales-orders';
import { dashboardApi } from '@/api/dashboard';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export function TestConnection() {
  const { user, isAuthenticated } = useAuth();

  // Test multiple API endpoints
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = useQuery({
    queryKey: ['test', 'analytics'],
    queryFn: dashboardApi.getAnalytics,
    retry: false,
  });

  const { data: clients, isLoading: clientsLoading, error: clientsError, refetch: refetchClients } = useQuery({
    queryKey: ['test', 'clients'],
    queryFn: clientsApi.getAll,
    retry: false,
  });

  const { data: products, isLoading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery({
    queryKey: ['test', 'products'],
    queryFn: productsApi.getAll,
    retry: false,
  });

  const { data: salesOrders, isLoading: salesOrdersLoading, error: salesOrdersError, refetch: refetchSalesOrders } = useQuery({
    queryKey: ['test', 'sales-orders'],
    queryFn: salesOrdersApi.getAll,
    retry: false,
  });

  const tests = [
    {
      name: 'Dashboard Analytics',
      loading: analyticsLoading,
      error: analyticsError,
      data: analytics,
      refetch: refetchAnalytics,
    },
    {
      name: 'Clients API',
      loading: clientsLoading,
      error: clientsError,
      data: clients,
      refetch: refetchClients,
    },
    {
      name: 'Products API',
      loading: productsLoading,
      error: productsError,
      data: products,
      refetch: refetchProducts,
    },
    {
      name: 'Sales Orders API',
      loading: salesOrdersLoading,
      error: salesOrdersError,
      data: salesOrders,
      refetch: refetchSalesOrders,
    },
  ];

  const refetchAll = () => {
    tests.forEach(test => test.refetch());
  };

  return (
    <div className="container-responsive space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Connection Test</h1>
          <p className="text-muted-foreground">Testing frontend-backend connectivity</p>
        </div>
        <Button onClick={refetchAll} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
      </div>

      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {isAuthenticated ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>User Authenticated:</span>
              <Badge variant={isAuthenticated ? 'default' : 'destructive'}>
                {isAuthenticated ? 'Yes' : 'No'}
              </Badge>
            </div>
            {user && (
              <>
                <div className="flex items-center justify-between">
                  <span>User Email:</span>
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Role:</span>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>User ID:</span>
                  <span className="text-sm font-mono">{user.id}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Tests */}
      <div className="grid gap-4 md:grid-cols-2">
        {tests.map((test) => (
          <Card key={test.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  {test.loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500 mr-2" />
                  ) : test.error ? (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  )}
                  {test.name}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => test.refetch()}
                  disabled={test.loading}
                >
                  <RefreshCw className={`h-3 w-3 ${test.loading ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant={test.error ? 'destructive' : test.loading ? 'secondary' : 'default'}>
                    {test.loading ? 'Loading...' : test.error ? 'Error' : 'Success'}
                  </Badge>
                </div>
                {test.error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {test.error.message}
                  </div>
                )}
                {test.data && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    Data loaded: {Array.isArray(test.data) ? `${test.data.length} items` : 'Object'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Raw Data Display */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Analytics Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(analytics, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}