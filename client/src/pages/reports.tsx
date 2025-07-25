import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  CalendarCheck, 
  Heart, 
  Star,
  BarChart3
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: appointments } = useQuery({
    queryKey: ["/api/appointments"],
  });

  const { data: services } = useQuery({
    queryKey: ["/api/services"],
  });

  // Calculate service popularity
  const servicePopularity = services?.map((service: any) => ({
    name: service.name,
    bookings: Math.floor(Math.random() * 50) + 10, // Mock data
    percentage: Math.floor(Math.random() * 40) + 60,
  })).sort((a: any, b: any) => b.percentage - a.percentage).slice(0, 5) || [];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Reports & Analytics</h2>
        <p className="mt-2 text-sm text-slate-600">Business insights and performance metrics</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-slate-900">$45,280</p>
                <p className="text-sm text-secondary">+12% from last month</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-slate-900">{stats?.totalAppointments || 0}</p>
                <p className="text-sm text-secondary">+8% from last month</p>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <CalendarCheck className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Customer Retention</p>
                <p className="text-2xl font-semibold text-slate-900">87%</p>
                <p className="text-sm text-secondary">+3% from last month</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Heart className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg. Rating</p>
                <p className="text-2xl font-semibold text-slate-900">4.8</p>
                <p className="text-sm text-secondary">Based on 156 reviews</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-500">Revenue Chart</p>
                <p className="text-xs text-slate-400 mt-2">Chart implementation required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Popularity */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePopularity.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <BarChart3 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p>No service data available</p>
                </div>
              ) : (
                servicePopularity.map((service: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{service.name}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={service.percentage} className="w-24" />
                      <span className="text-sm text-slate-900 w-10 text-right">{service.percentage}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
