import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { HiblaLogo } from '@/components/HiblaLogo';
import { motion } from 'framer-motion';

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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
        </div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center space-y-8 max-w-md w-full px-6"
        >
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-6">
              <HiblaLogo size="2xl" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Hibla Manufacturing
            </h1>
            <p className="text-slate-300 text-lg">
              Premium Real Filipino Hair
            </p>
          </motion.div>

          {/* Loading Progress */}
          <div className="space-y-4">
            <div className="relative">
              <Progress value={progress} className="h-1 bg-slate-800" />
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <motion.p 
              key={loadingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-400 text-sm font-medium"
            >
              {loadingText}
            </motion.p>
          </div>

          {/* Version */}
          <div className="text-xs text-slate-500 mt-8">
            Version 2.0.1 • Manufacturing Management System
          </div>
        </motion.div>
      </div>
    </div>
  );
}