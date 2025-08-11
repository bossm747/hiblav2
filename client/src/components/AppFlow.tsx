import React, { useState, useEffect } from 'react';
import { Preloader } from './Preloader';
import Landing from '@/pages/Landing';
import PortalHub from '@/pages/PortalHub';
import { useAuth } from '@/contexts/AuthContext';

type FlowStage = 'preloader' | 'landing' | 'portal' | 'authenticated';

interface AppFlowProps {
  children: React.ReactNode;
}

export function AppFlow({ children }: AppFlowProps) {
  const [currentStage, setCurrentStage] = useState<FlowStage>('preloader');
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If auth is loading, stay in preloader
    if (isLoading) {
      setCurrentStage('preloader');
      return;
    }

    // If user is authenticated, skip to authenticated content
    if (isAuthenticated) {
      setCurrentStage('authenticated');
      return;
    }

    // Check if user has seen the landing page in this session
    const hasSeenLanding = sessionStorage.getItem('hibla_seen_landing');
    if (hasSeenLanding) {
      setCurrentStage('portal');
    } else {
      // First time visitor or new session - show full flow
      setCurrentStage('preloader');
    }
  }, [isAuthenticated, isLoading]);

  const handlePreloaderComplete = () => {
    setCurrentStage('landing');
  };

  const handleLandingComplete = () => {
    sessionStorage.setItem('hibla_seen_landing', 'true');
    setCurrentStage('portal');
  };

  const handleAuthenticationComplete = () => {
    setCurrentStage('authenticated');
  };

  // Render based on current stage
  switch (currentStage) {
    case 'preloader':
      return (
        <Preloader 
          onLoadingComplete={handlePreloaderComplete}
          duration={3000}
        />
      );

    case 'landing':
      return (
        <div className="relative">
          <Landing />
          {/* Auto-advance to portal after user interaction or timeout */}
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={handleLandingComplete}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            >
              Continue to System →
            </button>
          </div>
        </div>
      );

    case 'portal':
      return <PortalHub onAuthenticationComplete={handleAuthenticationComplete} />;

    case 'authenticated':
    default:
      return <>{children}</>;
  }
}