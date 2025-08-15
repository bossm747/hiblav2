import React from 'react';
import { cn } from '@/lib/utils';

interface MobileTableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileTableWrapper({ children, className }: MobileTableWrapperProps) {
  return (
    <div className={cn(
      "w-full overflow-x-auto overflow-y-hidden",
      "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
      "touch-pan-x", // Enable horizontal touch scrolling
      className
    )}>
      <div className="min-w-max">
        {children}
      </div>
    </div>
  );
}

// Mobile-responsive table container with visual indicators
export function MobileScrollableTable({ children, className }: MobileTableWrapperProps) {
  const [showLeftGradient, setShowLeftGradient] = React.useState(false);
  const [showRightGradient, setShowRightGradient] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftGradient(scrollLeft > 0);
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Left gradient indicator */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity",
        showLeftGradient ? "opacity-100" : "opacity-0"
      )} />
      
      {/* Right gradient indicator */}
      <div className={cn(
        "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity",
        showRightGradient ? "opacity-100" : "opacity-0"
      )} />
      
      {/* Scrollable container */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className={cn(
          "w-full overflow-x-auto overflow-y-hidden",
          "scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent",
          "touch-pan-x scroll-smooth", // Enable smooth horizontal touch scrolling
          "-mx-1 px-1", // Prevent edge cutoff
          "md:overflow-x-visible" // Show full table on desktop
        )}
      >
        <div className="min-w-max md:min-w-0">
          {children}
        </div>
      </div>
      
      {/* Mobile swipe hint */}
      <div className="md:hidden flex justify-center mt-2 text-xs text-muted-foreground">
        {(showLeftGradient || showRightGradient) && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swipe to see more
          </span>
        )}
      </div>
    </div>
  );
}