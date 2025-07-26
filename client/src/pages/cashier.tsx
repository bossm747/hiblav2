import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Clock,
  LogOut,
  TrendingUp,
  Users,
  BarChart3
} from "lucide-react";
import logoPath from "@assets/Hiblalogo_1753513948082.png";

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
      description: "Search and view product information",
      icon: Package,
      href: "/products-lookup",
      color: "neon-purple",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Sales History",
      description: "View transaction history and reports",
      icon: BarChart3,
      href: "/sales-history",
      color: "neon-pink",
      bgColor: "bg-pink-500/20",
    },
    {
      title: "Customer Lookup",
      description: "Find customer information and history",
      icon: Users,
      href: "/customer-lookup",
      color: "neon-green",
      bgColor: "bg-green-500/20",
    },
  ];

  // Mock statistics - replace with real data
  const todayStats = [
    { label: "Sales Today", value: "₱8,450", icon: DollarSign, color: "text-green-400" },
    { label: "Transactions", value: "23", icon: ShoppingCart, color: "text-blue-400" },
    { label: "Items Sold", value: "47", icon: Package, color: "text-purple-400" },
    { label: "Hours Worked", value: "6.5", icon: Clock, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-dark shadow-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden glass-card neon-glow-light flex items-center justify-center">
                <img src={logoPath} alt="Hibla Filipino Hair" className="h-8 w-8 object-contain" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-foreground neon-text-cyan">Cashier Panel</h1>
                <p className="text-sm text-muted-foreground">Hibla Filipino Hair</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-primary hover:bg-primary/20 hover:neon-text-pink transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Today's Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {todayStats.map((stat, index) => (
            <Card key={index} className="glass-card border-white/20 neon-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main POS Button */}
        <div className="mb-8">
          <Link href="/pos">
            <Card className="glass-card border-white/20 hover:scale-105 transition-all cursor-pointer neon-cyan group bg-cyan-500/10">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <CreditCard className="h-10 w-10 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2 neon-text-cyan">Start New Sale</h2>
                <p className="text-lg text-muted-foreground">Process customer transactions</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Cashier Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cashierMenuItems.filter(item => !item.primary).map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className={`glass-card border-white/20 hover:scale-105 transition-all cursor-pointer ${item.color} group`}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${item.bgColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 neon-text-purple">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/pos">
              <Button className="w-full h-16 bg-primary text-primary-foreground hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                <CreditCard className="h-5 w-5 mr-2" />
                New Transaction
              </Button>
            </Link>
            <Link href="/products-lookup">
              <Button className="w-full h-16 bg-secondary text-secondary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                <Package className="h-5 w-5 mr-2" />
                Check Price
              </Button>
            </Link>
            <Link href="/sales-history">
              <Button className="w-full h-16 bg-accent text-accent-foreground hover:shadow-lg hover:shadow-pink-500/50 transition-all">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Sales
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 neon-text-cyan">Recent Transactions</h2>
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Sale #1245</p>
                      <p className="text-sm text-muted-foreground">2x Korean HD Lace</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-medium">₱8,500</p>
                    <p className="text-sm text-muted-foreground">2 min ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Sale #1244</p>
                      <p className="text-sm text-muted-foreground">1x Single Drawn Straight</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-medium">₱2,850</p>
                    <p className="text-sm text-muted-foreground">15 min ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">Sale #1243</p>
                      <p className="text-sm text-muted-foreground">3x Synthetic Curly</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-medium">₱2,850</p>
                    <p className="text-sm text-muted-foreground">45 min ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}