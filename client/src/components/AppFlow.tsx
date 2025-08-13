import React, { useState, useEffect } from 'react';
import { Preloader } from './Preloader';
import Login from '@/pages/Login';
import { useAuth } from '@/contexts/AuthContext';

type FlowStage = 'preloader' | 'login' | 'authenticated';

interface AppFlowProps {
  children: React.ReactNode;
}

export function AppFlow({ children }: AppFlowProps) {
  const [currentStage, setCurrentStage] = useState<FlowStage>('preloader');
  const [showPreloader, setShowPreloader] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If auth is loading, stay in preloader
    if (isLoading) {
      setCurrentStage('preloader');
      return;
    }

    // If user is authenticated, show authenticated content
    if (isAuthenticated) {
      setCurrentStage('authenticated');
      return;
    }

    // Not authenticated - show login
    setCurrentStage('login');
  }, [isAuthenticated, isLoading]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  // For internal system, show preloader briefly then proceed
  if (showPreloader && currentStage === 'preloader') {
    return (
      <Preloader 
        onComplete={handlePreloaderComplete}
        duration={5000}
      />
    );
  }

  // Render based on current stage
  switch (currentStage) {
    case 'login':
      return <Login />;

    case 'authenticated':
    default:
      return <>{children}</>;
  }
}