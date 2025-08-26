import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { HiblaLogo } from '@/components/HiblaLogo';


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
          <div className="w-24 h-24 mx-auto mb-6 bg-white/30 rounded-2xl flex items-center justify-center border border-white/40">
            <HiblaLogo size="xl" className="drop-shadow-lg" />
          </div>
        </div>

        {/* Loading Progress */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2 bg-white/30" />
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