import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Book, 
  Calendar, 
  Users, 
  Package, 
  CreditCard, 
  Settings,
  BarChart3,
  UserPlus,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Upload,
  Bell,
  Shield,
  Smartphone,
  QrCode,
  Banknote,
  ArrowLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";

interface DocumentationProps {
  onBack: () => void;
}

export default function Documentation({ onBack }: DocumentationProps) {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview", icon: <Book className="h-4 w-4" /> },
    { id: "getting-started", title: "Getting Started", icon: <CheckCircle className="h-4 w-4" /> },
    { id: "appointments", title: "Appointments", icon: <Calendar className="h-4 w-4" /> },
    { id: "clients", title: "Client Management", icon: <Users className="h-4 w-4" /> },
    { id: "services", title: "Services", icon: <Edit className="h-4 w-4" /> },
    { id: "inventory", title: "Inventory", icon: <Package className="h-4 w-4" /> },
    { id: "pos", title: "Point of Sale", icon: <CreditCard className="h-4 w-4" /> },
    { id: "reports", title: "Reports", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "settings", title: "Settings", icon: <Settings className="h-4 w-4" /> },
    { id: "troubleshooting", title: "Troubleshooting", icon: <AlertCircle className="h-4 w-4" /> }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">System Overview</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Serenity Spa & Salon Management System is a comprehensive solution designed specifically for Philippine beauty businesses. 
                It provides all the tools needed to manage appointments, clients, services, inventory, and payments in one unified platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-pink-500" />
                    Smart Scheduling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Advanced appointment booking with automated SMS/email reminders and conflict prevention.</p>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-pink-500" />
                    Philippine Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Full support for Cash, GCash, Maya, QR PH, and card payments with real-time processing.</p>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-pink-500" />
                    Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Comprehensive analytics and reports to track performance and growth opportunities.</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Appointment scheduling and management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Client database with visit history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Service catalog with pricing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Inventory tracking and alerts</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>POS system with cashier features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Staff management and scheduling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Automated notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobile-responsive design</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "getting-started":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Getting Started</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Follow this step-by-step guide to set up your salon management system and start managing your business efficiently.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm font-bold">1</span>
                    Initial Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Business Profile Configuration</h4>
                    <p className="text-slate-600 mb-3">Navigate to Settings → Profile to configure your business information:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Business name and logo</li>
                      <li>Contact information (phone, email, address)</li>
                      <li>Operating hours</li>
                      <li>Tax settings (if applicable)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm font-bold">2</span>
                    Add Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Service Catalog Setup</h4>
                    <p className="text-slate-600 mb-3">Go to Services page and add your offerings:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Facial treatments, massages, hair services</li>
                      <li>Set pricing and duration for each service</li>
                      <li>Organize services by categories</li>
                      <li>Add service descriptions and requirements</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm font-bold">3</span>
                    Staff Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Add Team Members</h4>
                    <p className="text-slate-600 mb-3">Register your staff in the Staff section:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Add therapists, stylists, and other staff</li>
                      <li>Set specialties and skill levels</li>
                      <li>Configure working schedules</li>
                      <li>Set commission rates (optional)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-pink-500 text-white text-sm font-bold">4</span>
                    Inventory Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Product Management</h4>
                    <p className="text-slate-600 mb-3">Stock your inventory in the Inventory section:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Add retail products and treatment supplies</li>
                      <li>Set purchase and retail prices</li>
                      <li>Configure low stock alerts</li>
                      <li>Upload product images</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Appointment Management</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Comprehensive appointment booking and scheduling system with automated reminders and conflict prevention.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-pink-500" />
                    Creating Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-slate-600">To book a new appointment:</p>
                  <ol className="list-decimal list-inside text-slate-600 space-y-1">
                    <li>Click "New Appointment" button</li>
                    <li>Select client (or create new)</li>
                    <li>Choose service and staff member</li>
                    <li>Pick date and time</li>
                    <li>Add any special notes</li>
                    <li>Confirm booking</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-pink-500" />
                    Automated Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-slate-600">Reminder system features:</p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>SMS reminders 24 hours before</li>
                    <li>Email confirmations</li>
                    <li>Customizable message templates</li>
                    <li>Automatic follow-up messages</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="spa-card-shadow">
              <CardHeader>
                <CardTitle>Appointment Status Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">Scheduled</Badge>
                    <p className="text-sm text-slate-600">Confirmed booking</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2">In Progress</Badge>
                    <p className="text-sm text-slate-600">Service ongoing</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="default" className="mb-2 bg-green-500">Completed</Badge>
                    <p className="text-sm text-slate-600">Service finished</p>
                  </div>
                  <div className="text-center">
                    <Badge variant="destructive" className="mb-2">Cancelled</Badge>
                    <p className="text-sm text-slate-600">Booking cancelled</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Pro Tips</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Use the calendar view to see daily/weekly schedules</li>
                    <li>• Double-click appointments to quickly edit details</li>
                    <li>• Set buffer time between appointments for preparation</li>
                    <li>• Use the search function to quickly find specific bookings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "pos":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Point of Sale System</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Professional cashier system designed for walk-in customers with full Philippine payment method support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-pink-500" />
                    Processing Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-slate-600">Steps to process a sale:</p>
                  <ol className="list-decimal list-inside text-slate-600 space-y-1">
                    <li>Browse services by category</li>
                    <li>Add items to cart</li>
                    <li>Select or create customer</li>
                    <li>Choose staff member</li>
                    <li>Select payment method</li>
                    <li>Process payment</li>
                    <li>Print receipt</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-pink-500" />
                    Quick Customer Registration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-slate-600">For new walk-in customers:</p>
                  <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>Click "Add New Customer"</li>
                    <li>Enter basic information</li>
                    <li>Phone number required for SMS</li>
                    <li>Customer automatically selected</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="spa-card-shadow">
              <CardHeader>
                <CardTitle>Philippine Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <Banknote className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium">Cash</h4>
                    <p className="text-sm text-slate-600">With change calculation</p>
                  </div>
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium">GCash</h4>
                    <p className="text-sm text-slate-600">Digital wallet</p>
                  </div>
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <h4 className="font-medium">Maya</h4>
                    <p className="text-sm text-slate-600">PayMaya wallet</p>
                  </div>
                  <div className="text-center">
                    <QrCode className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium">QR PH</h4>
                    <p className="text-sm text-slate-600">InstaPay QR</p>
                  </div>
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <h4 className="font-medium">Cards</h4>
                    <p className="text-sm text-slate-600">Credit/Debit</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Cash Payment Features</h4>
                  <ul className="text-green-700 space-y-1">
                    <li>• Automatic change calculation</li>
                    <li>• Amount paid tracking</li>
                    <li>• Receipt with change amount</li>
                    <li>• Overpayment protection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "troubleshooting":
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Troubleshooting Guide</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Common issues and their solutions to keep your salon management system running smoothly.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Payment Processing Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">GCash/Maya Not Working</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Check internet connection</li>
                      <li>Verify payment reference number</li>
                      <li>Ensure sufficient wallet balance</li>
                      <li>Contact customer support if issues persist</li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Receipt Not Printing</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Check printer connection and power</li>
                      <li>Verify paper is loaded correctly</li>
                      <li>Use browser print function as backup</li>
                      <li>Clear browser cache and retry</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-500" />
                    Notification Problems
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">SMS Reminders Not Sending</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Verify phone numbers include country code (+63)</li>
                      <li>Check SMS service status in Settings</li>
                      <li>Ensure sufficient SMS credits</li>
                      <li>Test with your own number first</li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Email Notifications Failing</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Check spam/junk folders</li>
                      <li>Verify email addresses are correct</li>
                      <li>Test email service in Settings</li>
                      <li>Check internet connectivity</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="spa-card-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    Inventory Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Stock Numbers Incorrect</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Manually adjust stock levels in Inventory</li>
                      <li>Check for unreported sales/usage</li>
                      <li>Verify product codes are unique</li>
                      <li>Review transaction history</li>
                    </ul>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Low Stock Alerts Not Working</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Check alert thresholds in product settings</li>
                      <li>Verify notification preferences</li>
                      <li>Update current stock quantities</li>
                      <li>Test with a known low-stock item</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Need Additional Help?</h4>
                  <div className="text-red-700 space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Support Hotline: +63 917 123 4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>Email: support@serenity-spa.ph</span>
                    </div>
                    <p className="text-sm">Available Monday-Friday, 8AM-6PM (PST)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a section to view documentation</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Documentation</h1>
              <p className="text-slate-600">Complete guide to using your salon management system</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="spa-card-shadow sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Contents</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                        activeSection === section.id 
                          ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-500' 
                          : 'text-slate-700'
                      }`}
                    >
                      {section.icon}
                      <span className="text-sm font-medium">{section.title}</span>
                      {activeSection === section.id && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-lg border-0 p-8"
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}