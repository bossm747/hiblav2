import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Lock, User, LogIn, Shield } from 'lucide-react';
import { HiblaLogo } from '@/components/HiblaLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: result.message || 'Login successful',
        });
        setLocation('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'manager' | 'staff') => {
    const demoCredentials = {
      admin: { email: 'admin@hibla.com', password: 'admin123' },
      manager: { email: 'manager@hibla.com', password: 'manager123' },
      staff: { email: 'staff@hibla.com', password: 'staff123' }
    };

    const creds = demoCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    
    setError('');
    setIsLoading(true);

    try {
      const result = await login(creds.email, creds.password);
      
      if (result.success) {
        toast({
          title: `Welcome ${role}!`,
          description: 'Logged in with demo credentials',
        });
        setLocation('/');
      } else {
        setError('Demo login failed. Please ensure demo users are seeded.');
      }
    } catch (error) {
      setError('Failed to login with demo credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-center mb-8">
          <HiblaLogo size="large" showText={true} />
        </div>
        
        <Card className="shadow-elevated-container">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to Hibla Manufacturing
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Sign in to access the manufacturing management system
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                  Or use demo account
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="text-xs"
              >
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('manager')}
                disabled={isLoading}
                className="text-xs"
              >
                Manager
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('staff')}
                disabled={isLoading}
                className="text-xs"
              >
                Staff
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>For testing, use demo accounts above or contact admin for credentials.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}