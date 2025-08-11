import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HiblaLogo } from '@/components/HiblaLogo';
import { Link } from 'wouter';
import { 
  Shield, 
  Users, 
  User,
  ArrowRight,
  Lock,
  Settings,
  Activity,
  Package
} from 'lucide-react';

export default function PortalHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-cyan-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <HiblaLogo size="xl" showText />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Portal Access Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your portal to access the appropriate system features and manage your business operations
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Customer Portal */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 shadow-card">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">Customer Portal</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Access your orders, quotations, and account information
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <Package className="h-5 w-5 text-blue-600" />
                  <span>Track orders and shipments</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>View quotations and invoices</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>Manage account settings</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <span>Secure customer access</span>
                </div>
              </div>
              
              <Link href="/customer-portal">
                <Button className="w-full group/btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  <User className="h-4 w-4 mr-2" />
                  Access Customer Portal
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Portal */}
          <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 shadow-card">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">Admin Portal</CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Administrative access for staff and management
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Manage customers and accounts</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span>Oversee orders and quotations</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <span>View system analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>Administrative privileges</span>
                </div>
              </div>
              
              <Link href="/admin-portal">
                <Button className="w-full group/btn bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  <Shield className="h-4 w-4 mr-2" />
                  Access Admin Portal
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-white/60 backdrop-blur-sm border border-white/20 shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Portal Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Customer Portal Features
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Order tracking and history</li>
                    <li>• Quotation status and downloads</li>
                    <li>• Invoice access and payment</li>
                    <li>• Account profile management</li>
                    <li>• Support ticket system</li>
                    <li>• Shipment notifications</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Portal Features
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Customer account management</li>
                    <li>• Order status administration</li>
                    <li>• Quotation approval workflow</li>
                    <li>• System analytics and reporting</li>
                    <li>• User privilege management</li>
                    <li>• Business operation oversight</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400">
            For technical support, contact{' '}
            <a href="mailto:support@hiblafilipinohair.com" className="text-blue-600 hover:underline">
              support@hiblafilipinohair.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}