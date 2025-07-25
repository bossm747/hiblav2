import { useQuery } from "@tanstack/react-query";
import { Sparkles, Heart } from "lucide-react";

interface SalonLogoProps {
  className?: string;
  showSubtext?: boolean;
}

export default function SalonLogo({ className = "", showSubtext = false }: SalonLogoProps) {
  const { data: profileData } = useQuery({
    queryKey: ["/api/settings/profile"],
  });

  const businessName = profileData?.businessName || "Elegant Spa";
  const businessType = profileData?.businessType || "spa";

  const getSubtext = () => {
    switch (businessType) {
      case "spa":
        return "Wellness & Beauty";
      case "salon":
        return "Hair & Beauty";
      case "both":
        return "Spa & Salon";
      default:
        return "Beauty & Wellness";
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Decorative elements */}
      <div className="absolute -top-2 -left-2 text-pink-300 opacity-60 animate-pulse">
        <Heart className="h-3 w-3" />
      </div>
      <div className="absolute -top-1 -right-2 text-purple-300 opacity-60 animate-pulse delay-300">
        <Sparkles className="h-3 w-3" />
      </div>
      
      {/* Main logo text */}
      <div className="relative">
        <h1 
          className="handwritten-logo text-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-bold tracking-wide"
          style={{
            fontFamily: "'Dancing Script', cursive",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {businessName}
        </h1>
        
        {/* Subtle underline decoration */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-70"></div>
      </div>
      
      {/* Subtext */}
      {showSubtext && (
        <p className="text-xs text-slate-500 mt-1 font-medium tracking-wider uppercase">
          {getSubtext()}
        </p>
      )}
      
      {/* Bottom decorative elements */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-pink-200 opacity-40">
        <Sparkles className="h-2 w-2" />
      </div>
    </div>
  );
}