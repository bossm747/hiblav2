import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  BarChart3,
  Brain,
} from 'lucide-react';

export function InventoryInsightsPage() {
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/dashboard/analytics'],
  });

  // AI-powered insights calculations
  const getLowStockProducts = () => {
    return products.filter((product: any) => {
      const totalStock = (
        parseFloat(product.ngWarehouse || 0) +
        parseFloat(product.phWarehouse || 0) +
        parseFloat(product.reservedWarehouse || 0) +
        parseFloat(product.redWarehouse || 0) +
        parseFloat(product.adminWarehouse || 0) +
        parseFloat(product.wipWarehouse || 0)
      );
      return totalStock <= parseFloat(product.lowStockThreshold || 5);
    });
  };

  const getHighDemandProducts = () => {
    // Mock AI prediction - in real app this would use ML models
    return products.slice(0, 5).map((product: any) => ({
      ...product,
      predictedDemand: Math.floor(Math.random() * 100) + 50,
      confidence: (Math.random() * 40 + 60).toFixed(1),
    }));
  };

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingInsights(false);
  };

  const lowStockProducts = getLowStockProducts();
  const highDemandProducts = getHighDemandProducts();

  const insights = [
    {
      title: 'Low Stock Alert',
      count: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      description: 'Products below safety threshold',
    },
    {
      title: 'High Demand Forecast',
      count: highDemandProducts.length,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      description: 'AI-predicted high demand items',
    },
    {
      title: 'Reorder Recommendations',
      count: Math.floor(lowStockProducts.length * 0.8),
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      description: 'AI-suggested reorder quantities',
    },
    {
      title: 'Optimization Score',
      count: 85,
      icon: Brain,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      description: 'Current inventory efficiency',
      suffix: '%',
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Inventory Insights</h1>
          <p className="text-muted-foreground">
            Predictive analytics and AI-powered inventory optimization
          </p>
        </div>
        <Button 
          onClick={generateAIInsights}
          disabled={isGeneratingInsights}
          className="flex items-center gap-2"
        >
          <Brain className="h-4 w-4" />
          {isGeneratingInsights ? 'Generating...' : 'Generate Insights'}
        </Button>
      </div>

      {/* AI Insights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title} className="floating-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {insight.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {insight.count}{insight.suffix || ''}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alerts */}
      <Card className="elevated-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading inventory data...</div>
          ) : lowStockProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>All products are well-stocked!</p>
            </div>
          ) : (
            <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recommendation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map((product: any) => {
                    const totalStock = (
                      parseFloat(product.ngWarehouse || 0) +
                      parseFloat(product.phWarehouse || 0) +
                      parseFloat(product.reservedWarehouse || 0) +
                      parseFloat(product.redWarehouse || 0) +
                      parseFloat(product.adminWarehouse || 0) +
                      parseFloat(product.wipWarehouse || 0)
                    );
                    const threshold = parseFloat(product.lowStockThreshold || 5);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {product.sku}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={totalStock === 0 ? 'destructive' : 'secondary'}>
                            {totalStock.toFixed(1)} {product.unit}
                          </Badge>
                        </TableCell>
                        <TableCell>{threshold} {product.unit}</TableCell>
                        <TableCell>
                          <Badge variant={totalStock === 0 ? 'destructive' : 'default'}>
                            {totalStock === 0 ? 'Out of Stock' : 'Low Stock'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-blue-600 dark:text-blue-400">
                            Reorder {Math.max(50, threshold * 3)} {product.unit}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Demand Predictions */}
      <Card className="elevated-container">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Demand Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Predicted Demand</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Recommendation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {highDemandProducts.map((product: any) => {
                  const totalStock = (
                    parseFloat(product.ngWarehouse || 0) +
                    parseFloat(product.phWarehouse || 0) +
                    parseFloat(product.reservedWarehouse || 0) +
                    parseFloat(product.redWarehouse || 0) +
                    parseFloat(product.adminWarehouse || 0) +
                    parseFloat(product.wipWarehouse || 0)
                  );
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {totalStock.toFixed(1)} {product.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          {product.predictedDemand} {product.unit}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.confidence}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {totalStock < product.predictedDemand 
                            ? `Increase stock by ${product.predictedDemand - totalStock}` 
                            : 'Stock sufficient'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}