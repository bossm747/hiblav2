import React from 'react';
import { cn } from '@/lib/utils';
import hiblaLogo from '@assets/Hiblalogo_1753513948082.png';

interface HiblaLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-40 w-40'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl'
};

export function HiblaLogo({ className, showText = false, size = 'md' }: HiblaLogoProps) {
  return (
    <div className={cn('flex items-center', className)}>
      <div className="relative">
        <img
          src={hiblaLogo}
          alt="Hibla Manufacturing"
          className={cn(
            sizeClasses[size],
            'object-contain rounded-full bg-white shadow-sm border border-border'
          )}
        />
      </div>
      {showText && (
        <div className="ml-3 flex flex-col">
          <span className={cn(
            'font-bold text-foreground leading-tight tracking-tight',
            textSizeClasses[size]
          )}>
            HIBLA
          </span>
          <span className={cn(
            'text-muted-foreground font-medium tracking-wider',
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-xs' : 'text-sm'
          )}>
            FILIPINO HAIR
          </span>
        </div>
      )}
    </div>
  );
}