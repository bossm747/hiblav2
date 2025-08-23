import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Hibla System...');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading core modules...' },
      { progress: 40, text: 'Connecting to database...' },
      { progress: 60, text: 'Initializing security protocols...' },
      { progress: 80, text: 'Loading user interface...' },
      { progress: 100, text: 'System ready!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setProgress(loadingSteps[currentStep].progress);
        setLoadingText(loadingSteps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center z-50">
      <div className="text-center space-y-8 max-w-md w-full px-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-800 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">H</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Hibla Manufacturing</h1>
          <p className="text-blue-200">Premium Real Filipino Hair Manufacturer</p>
        </div>

        {/* Loading Progress */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2 bg-blue-800" />
          <p className="text-white text-sm">{loadingText}</p>
        </div>

        {/* Version */}
        <div className="text-xs text-blue-300 mt-8">
          Version 2.0.1 • Manufacturing Management System
        </div>
      </div>
    </div>
  );
}