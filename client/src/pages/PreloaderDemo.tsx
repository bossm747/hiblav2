import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Preloader } from '@/components/Preloader';
import { HiblaLogo } from '@/components/HiblaLogo';
import { PlayCircle, RotateCcw } from 'lucide-react';

export default function PreloaderDemo() {
  const [showPreloader, setShowPreloader] = useState(false);

  const startPreloaderDemo = () => {
    setShowPreloader(true);
  };

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <HiblaLogo size="lg" showText />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Preloader Component Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Animated Hibla logo preloader with non-rotating animations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Preloader Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong>Hibla Logo Animation:</strong> Non-rotating breathing effect with pulsing background
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong>Progress Tracking:</strong> Real-time progress bar with percentage display
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong>Dynamic Messages:</strong> Loading status updates based on progress
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong>Smooth Transitions:</strong> Elegant fade-in/fade-out animations
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <strong>Theme Support:</strong> Automatically adapts to light/dark themes
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Try the Preloader</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Click the button below to see the preloader in action. It will run for 3 seconds with:
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Animated Hibla logo with breathing effect</li>
                <li>• Floating background particles</li>
                <li>• Progress bar with system loading messages</li>
                <li>• Smooth completion transition</li>
              </ul>
              <div className="pt-4">
                <Button 
                  onClick={startPreloaderDemo}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  disabled={showPreloader}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {showPreloader ? 'Loading...' : 'Start Preloader Demo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`import { Preloader } from '@/components/Preloader';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    setLoading(false);
    // Navigate to main app or show content
  };

  return (
    <>
      {loading && (
        <Preloader 
          onLoadingComplete={handleLoadingComplete}
          duration={3000} // 3 seconds
        />
      )}
      {!loading && (
        <div>Your app content here</div>
      )}
    </>
  );
}`}
            </pre>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            The preloader is perfect for system initialization, manufacturing system startup, 
            or any loading sequence that needs a professional, branded animation.
          </p>
        </div>
      </div>

      {/* Preloader Overlay */}
      {showPreloader && (
        <Preloader 
          onLoadingComplete={handlePreloaderComplete}
          duration={3000}
        />
      )}
    </div>
  );
}