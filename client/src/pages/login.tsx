import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import logoPath from "@assets/Hiblalogo_1753513948082.png";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user session
        localStorage.setItem("user", JSON.stringify(data.user));
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.name}!`,
        });

        // Redirect based on user role
        if (data.user.role === "admin") {
          setLocation("/admin");
        } else if (data.user.role === "cashier") {
          setLocation("/cashier");
        } else {
          setLocation("/");
        }
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: "admin" | "cashier") => {
    const demoUser = {
      id: `demo-${role}`,
      name: role === "admin" ? "Admin Demo" : "Cashier Demo",
      username: role,
      role,
      email: `${role}@demo.com`,
    };

    localStorage.setItem("user", JSON.stringify(demoUser));
    
    toast({
      title: "Demo Login",
      description: `Logged in as ${role}`,
    });

    if (role === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/cashier");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="glass-card border-white/20 neon-purple">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden glass-card neon-glow-light flex items-center justify-center">
                <img src={logoPath} alt="Hibla Filipino Hair" className="h-12 w-12 object-contain" />
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground neon-text-cyan">Staff Login</CardTitle>
            <p className="text-muted-foreground">Access your account to continue</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="pl-10 glass"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 glass"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Access</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  className="border-primary hover:bg-primary/20 hover:neon-text-pink transition-all"
                >
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("cashier")}
                  className="border-primary hover:bg-primary/20 hover:neon-text-cyan transition-all"
                >
                  Cashier Demo
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all"
              >
                Back to Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}