import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Target,
  BarChart3,
  Clock,
  DollarSign,
  CheckCircle
} from 'lucide-react';

export default function AIInsightsGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">AI Inventory Insights</h1>
          <Badge className="bg-purple-600 text-white">AI Powered</Badge>
        </div>
        <p className="text-lg text-muted-foreground">
          Leverage artificial intelligence for predictive inventory management, demand forecasting, 
          and intelligent optimization recommendations.
        </p>
      </div>

      {/* AI Features Overview */}
      <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/10">
        <CardHeader>
          <CardTitle className="text-purple-800 dark:text-purple-200 flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI-Powered Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-purple-800 dark:text-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Predictive Analytics:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Demand forecasting based on historical data</li>
                <li>• Seasonal trend analysis and predictions</li>
                <li>• Stock-out risk assessment</li>
                <li>• Optimal reorder point calculation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Smart Recommendations:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Intelligent reorder suggestions</li>
                <li>• Overstock identification</li>
                <li>• Slow-moving inventory alerts</li>
                <li>• Cost optimization recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insight Types */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Types of AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Demand Forecasting",
              description: "Predict future demand based on historical patterns",
              icon: TrendingUp,
              accuracy: "85-92%",
              timeframe: "1-12 months",
              factors: ["Historical sales", "Seasonal trends", "Market conditions", "Economic indicators"]
            },
            {
              title: "Stock Optimization",
              description: "Optimize inventory levels to reduce costs",
              icon: Package,
              accuracy: "80-95%",
              timeframe: "Real-time",
              factors: ["Current stock", "Lead times", "Demand patterns", "Storage costs"]
            },
            {
              title: "Risk Assessment",
              description: "Identify potential stock-out and overstock risks",
              icon: AlertTriangle,
              accuracy: "90-96%",
              timeframe: "1-6 weeks",
              factors: ["Supply chain data", "Demand volatility", "Lead time variance", "Supplier reliability"]
            },
            {
              title: "Cost Optimization",
              description: "Recommendations to minimize inventory costs",
              icon: DollarSign,
              accuracy: "75-88%",
              timeframe: "Ongoing",
              factors: ["Carrying costs", "Ordering costs", "Opportunity costs", "Storage efficiency"]
            }
          ].map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.title}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-semibold text-green-600">{insight.accuracy}</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-semibold text-blue-600">{insight.timeframe}</div>
                        <div className="text-xs text-muted-foreground">Timeframe</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Factors:</h4>
                      <ul className="space-y-1">
                        {insight.factors.map((factor, index) => (
                          <li key={index} className="flex items-center space-x-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{factor}</span>
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

      {/* How AI Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>How AI Analysis Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { step: "Data Collection", icon: BarChart3, description: "Gather historical sales, inventory, and market data" },
                { step: "Pattern Analysis", icon: Brain, description: "AI identifies trends, seasonality, and patterns" },
                { step: "Prediction Generation", icon: Target, description: "Generate forecasts and recommendations" },
                { step: "Continuous Learning", icon: TrendingUp, description: "Model improves with new data and feedback" }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-8 w-8" />
                      </div>
                      {index < 3 && (
                        <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-purple-200" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{step.step}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interpreting AI Insights */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Interpreting AI Insights</h2>
        <div className="space-y-4">
          {[
            {
              insight: "High Demand Forecast",
              meaning: "AI predicts significant increase in demand",
              action: "Increase inventory levels, secure additional suppliers",
              confidence: "High",
              color: "border-green-400 bg-green-50 dark:bg-green-950/10"
            },
            {
              insight: "Stock-Out Risk",
              meaning: "Current inventory may not meet upcoming demand",
              action: "Expedite orders, consider alternative products",
              confidence: "High",
              color: "border-red-400 bg-red-50 dark:bg-red-950/10"
            },
            {
              insight: "Overstock Warning",
              meaning: "Inventory levels exceed projected demand",
              action: "Implement promotions, consider redistribution",
              confidence: "Medium",
              color: "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/10"
            },
            {
              insight: "Seasonal Trend Alert",
              meaning: "Seasonal pattern detected in demand",
              action: "Adjust ordering schedule, prepare for peak season",
              confidence: "High",
              color: "border-blue-400 bg-blue-50 dark:bg-blue-950/10"
            }
          ].map((item) => (
            <Card key={item.insight} className={item.color}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{item.insight}</h3>
                      <Badge variant={item.confidence === 'High' ? 'default' : 'secondary'}>
                        {item.confidence} Confidence
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{item.meaning}</p>
                    <p className="text-sm font-medium">Recommended Action: {item.action}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/10">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">AI Insights Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-blue-800 dark:text-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Data Quality:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Ensure accurate historical data</li>
                <li>• Regular data cleanup and validation</li>
                <li>• Include external factors when possible</li>
                <li>• Maintain consistent data recording</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">Action Planning:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Review insights regularly</li>
                <li>• Combine AI with human expertise</li>
                <li>• Track recommendation effectiveness</li>
                <li>• Adjust based on results</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}