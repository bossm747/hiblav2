import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Bus, 
  Package,
  CreditCard,
  Clock,
  Mail,
  BarChart3,
  Settings, 
  LogOut,
  Waves,
  X,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Quotations", href: "/quotations", icon: Mail },
  { name: "Sales Orders", href: "/sales-orders", icon: CreditCard },
  { name: "Job Orders", href: "/job-orders", icon: Clock },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Staff", href: "/staff", icon: Bus },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

const secondaryNavigation = [
  { name: "Sign out", href: "/logout", icon: LogOut },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest('/api/auth/logout', {
        method: 'POST',
      });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      // Redirect to login page or home
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-80 glass-dark border-r border-white/20 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:inset-0 lg:w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center neon-glow-light">
              <Waves className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-foreground neon-text-cyan">Hibla Hair</h1>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.name} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center space-x-2 px-2 py-1.5 rounded-md transition-all duration-200 group cursor-pointer",
                      isActive 
                        ? "glass neon-glow-light border border-purple-400/50 text-foreground" 
                        : "hover:glass hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => onClose()}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 flex-shrink-0 transition-colors",
                      isActive ? "text-purple-400" : "group-hover:text-cyan-400"
                    )} />
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Secondary Navigation */}
          <div className="mt-4 pt-2 border-t border-white/20">
            <div className="space-y-0.5">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-md hover:glass hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all duration-200 group cursor-pointer"
              >
                <LogOut className="h-4 w-4 flex-shrink-0 group-hover:text-red-400 transition-colors" />
                <span className="text-xs font-medium">Sign out</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-white/20">
          <div className="glass p-2 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-semibold text-white">H</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">Admin Panel</p>
                <p className="text-[10px] text-muted-foreground truncate">Hibla Filipino Hair</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
