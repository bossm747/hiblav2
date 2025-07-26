import { useEffect, useState } from 'react';
import logoPath from "@assets/Untitled design_1753503650014.png";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 blur-xl opacity-50" />
          <img 
            src={logoPath} 
            alt="Hibla Filipino Hair" 
            className="relative h-32 w-auto brightness-200 invert animate-spin-slow"
          />
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-foreground neon-text-purple mb-4">
          Hibla Filipino Hair
        </h2>
        <p className="text-muted-foreground mb-8">
          Loading premium hair extensions...
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">{progress}%</p>

        {/* Animated Hair Strands */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-30 animate-float-1" />
          <div className="absolute top-1/2 left-1/2 w-px h-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent opacity-30 animate-float-2" />
          <div className="absolute top-1/2 right-1/4 w-px h-36 bg-gradient-to-b from-transparent via-pink-500 to-transparent opacity-30 animate-float-3" />
        </div>
      </div>
    </div>
  );
}