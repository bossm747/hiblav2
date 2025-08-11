import React, { useEffect, useState } from 'react';
import { HiblaLogo } from './HiblaLogo';
import { cn } from '@/lib/utils';

interface PreloaderProps {
  onLoadingComplete?: () => void;
  duration?: number; // in milliseconds
}

export function Preloader({ onLoadingComplete, duration = 3000 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'complete' | 'fadeOut'>('loading');

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setPhase('complete');
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(progressInterval);
  }, [duration]);

  useEffect(() => {
    if (phase === 'complete') {
      // Wait a moment before starting fade out
      const fadeTimeout = setTimeout(() => {
        setPhase('fadeOut');
        // Call completion callback after fade starts
        setTimeout(() => {
          onLoadingComplete?.();
        }, 500);
      }, 300);

      return () => clearTimeout(fadeTimeout);
    }
  }, [phase, onLoadingComplete]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-gradient-to-br from-purple-50 via-white to-cyan-50',
        'dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
        'transition-all duration-500',
        phase === 'fadeOut' && 'opacity-0 pointer-events-none'
      )}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-300/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-cyan-300/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '2.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-300/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.8s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400/20 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }} />
      </div>

      <div className="relative flex flex-col items-center space-y-8">
        {/* Animated logo container */}
        <div className="relative">
          {/* Pulsing background circle */}
          <div 
            className={cn(
              'absolute inset-0 -m-4 rounded-full',
              'bg-gradient-to-br from-purple-100/50 via-cyan-100/50 to-pink-100/50',
              'dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-pink-900/20',
              'animate-pulse'
            )}
            style={{ 
              animation: 'pulse 2s ease-in-out infinite',
              animationDelay: '0.5s'
            }}
          />
          
          {/* Glowing ring */}
          <div 
            className={cn(
              'absolute inset-0 -m-2 rounded-full border-2',
              'border-gradient-to-r from-purple-300 via-cyan-300 to-pink-300',
              'opacity-50'
            )}
            style={{
              animation: 'ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite',
              animationDelay: '1s'
            }}
          />

          {/* Logo with scale animation */}
          <div 
            className={cn(
              'transform transition-all duration-1000',
              phase === 'loading' && 'scale-100',
              phase === 'complete' && 'scale-110'
            )}
            style={{
              animation: 'breathe 3s ease-in-out infinite',
            }}
          >
            <HiblaLogo size="xl" showText />
          </div>
        </div>

        {/* Company name with typewriter effect */}
        <div className="text-center space-y-2">
          <h1 
            className={cn(
              'text-3xl font-bold text-gray-900 dark:text-white',
              'bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 bg-clip-text text-transparent'
            )}
            style={{
              animation: 'slideUp 1s ease-out 1s both'
            }}
          >
            Hibla Filipino Hair
          </h1>
          <p 
            className="text-lg text-gray-600 dark:text-gray-300 font-medium"
            style={{
              animation: 'slideUp 1s ease-out 1.3s both'
            }}
          >
            Manufacturing System
          </p>
        </div>

        {/* Progress bar */}
        <div 
          className="w-64 space-y-3"
          style={{
            animation: 'slideUp 1s ease-out 1.6s both'
          }}
        >
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Loading System...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-300 ease-out',
                'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500'
              )}
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
              }}
            />
          </div>
        </div>

        {/* Loading status messages */}
        <div 
          className="text-center space-y-1"
          style={{
            animation: 'slideUp 1s ease-out 1.9s both'
          }}
        >
          {progress < 30 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Initializing manufacturing systems...
            </p>
          )}
          {progress >= 30 && progress < 60 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Loading inventory management...
            </p>
          )}
          {progress >= 60 && progress < 90 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Connecting to production database...
            </p>
          )}
          {progress >= 90 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              System ready! Welcome to Hibla Manufacturing.
            </p>
          )}
        </div>
      </div>

      {/* Custom CSS animations - Note: In production, move these to a CSS file */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }

          @keyframes slideUp {
            from { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `
      }} />
    </div>
  );
}