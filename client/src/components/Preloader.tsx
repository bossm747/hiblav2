import React, { useEffect, useState } from 'react';
import { HiblaLogo } from './HiblaLogo';

interface PreloaderProps {
  onComplete: () => void;
  duration?: number; // Duration in milliseconds
}

export function Preloader({ onComplete, duration = 5000 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 500); // Wait for fade out animation
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping">
            <div className="h-48 w-48 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-20"></div>
          </div>
          <div className="relative animate-pulse">
            <HiblaLogo size="2xl" showText={false} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 space-y-2">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Initializing system...
          </p>
        </div>

        {/* Loading Dots Animation */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}