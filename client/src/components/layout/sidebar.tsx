import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Bus, 
  BarChart3, 
  Settings, 
  LogOut,
  Waves,
  X
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
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Sign out", href: "/logout", icon: LogOut },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={cn(
      "sidebar-mobile bg-white shadow-lg lg:translate-x-0 lg:static lg:inset-0",
      isOpen ? "" : "closed"
    )}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 spa-gradient rounded-lg flex items-center justify-center">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Serenity Spa</h1>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden text-slate-500 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <span 
                  className={cn(
                    "spa-sidebar-item",
                    isActive && "active"
                  )}
                  onClick={() => onClose()}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="spa-sidebar-item">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
