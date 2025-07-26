import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users,
  LogOut,
  BarChart3,
  Clock
} from "lucide-react";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

interface User {
  id: string;
  name: string;
  username: string;
  role: string;
  email: string;
}

export default function CashierPage() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "cashier" && parsedUser.role !== "admin") {
        setLocation("/login");
        return;
      }
      setUser(parsedUser);
    } else {
      setLocation("/login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLocation("/login");
  };

  if (!user) return null;

  const cashierMenuItems = [
    {
      title: "Point of Sale (POS)",
      description: "Process customer transactions and sales",
      icon: CreditCard,
      href: "/pos",
      color: "neon-cyan",
      bgColor: "bg-cyan-500/20",
      primary: true,
    },
    {
      title: "Product Lookup",
      description: "Search products and check inventory",
      icon: Package,
      href: "/products-admin",
      color: "neon-purple",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Daily Sales",
      description: "View today's sales reports and statistics",
      icon: BarChart3,
      href: "/reports",
      color: "neon-pink",
      bgColor: "bg-pink-500/20",
    },
    {
      title: "Customer Info",
      description: "Access customer accounts and history",
      icon: Users,
      href: "/clients",
      color: "neon-green",
      bgColor: "bg-green-500/20",
    },
  ];

  const todayStats = [
    { title: "Today's Sales", value: "₱15,420", icon: DollarSign, color: "text-green-400" },
    { title: "Transactions", value: "23", icon: TrendingUp, color: "text-blue-400" },
    { title: "Items Sold", value: "47", icon: Package, color: "text-purple-400" },
    { title: "Hours Worked", value: "7.5", icon: Clock, color: "text-cyan-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-dark border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={logoPath} alt="Hibla Filipino Hair" className="h-8 w-auto brightness-200 invert" />
              <div>
                <h1 className="text-xl font-bold text-foreground neon-text-cyan">Cashier Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="glass">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {todayStats.map((stat) => (
            <Card key={stat.title} className="glass-card border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Menu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cashierMenuItems.map((item) => (
            <Link key={item.title} href={item.href}>
              <Card className={`glass-card border-white/20 hover:scale-105 transition-all cursor-pointer group ${item.color} ${item.primary ? 'ring-2 ring-cyan-400/50' : ''}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${item.bgColor}`}>
                      <item.icon className="h-6 w-6 text-foreground" />
                    </div>
                    {item.primary && (
                      <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
                        Primary
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:neon-text-cyan transition-all">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="glass-card border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="text-foreground neon-text-purple">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 glass-card rounded">
                <div>
                  <p className="text-foreground font-medium">Sale completed</p>
                  <p className="text-sm text-muted-foreground">Korean HD Lace 18" - ₱4,500</p>
                </div>
                <p className="text-sm text-muted-foreground">2 minutes ago</p>
              </div>
              <div className="flex items-center justify-between p-3 glass-card rounded">
                <div>
                  <p className="text-foreground font-medium">Product lookup</p>
                  <p className="text-sm text-muted-foreground">Double Drawn Straight 20"</p>
                </div>
                <p className="text-sm text-muted-foreground">15 minutes ago</p>
              </div>
              <div className="flex items-center justify-between p-3 glass-card rounded">
                <div>
                  <p className="text-foreground font-medium">Sale completed</p>
                  <p className="text-sm text-muted-foreground">Synthetic Body Wave Bundle - ₱1,200</p>
                </div>
                <p className="text-sm text-muted-foreground">32 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}