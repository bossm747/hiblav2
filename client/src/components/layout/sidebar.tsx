import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
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
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Services", href: "/services", icon: Scissors },
  { name: "Staff", href: "/staff", icon: Bus },
  { name: "Point of Sale", href: "/pos", icon: CreditCard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "AI Images", href: "/ai-images", icon: Sparkles },
  { name: "Timesheet", href: "/timesheet", icon: Clock },
  { name: "Marketing", href: "/marketing", icon: Mail },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const secondaryNavigation = [
  { name: "Sign out", href: "/logout", icon: LogOut },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

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
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
              return (
                <Link key={item.name} href={item.href}>
                  <div 
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group cursor-pointer",
                      isActive 
                        ? "glass neon-glow-light border border-purple-400/50 text-foreground" 
                        : "hover:glass hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => onClose()}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-purple-400" : "group-hover:text-cyan-400"
                    )} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Secondary Navigation */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="space-y-2">
              {secondaryNavigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:glass hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all duration-200 group cursor-pointer"
                    onClick={() => onClose()}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0 group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <div className="glass p-3 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">H</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Admin Panel</p>
                <p className="text-xs text-muted-foreground truncate">Hibla Filipino Hair</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
