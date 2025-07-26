import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone,
  Star,
  Plus,
  History,
  User,
  Settings,
  CreditCard
} from "lucide-react";

export default function ClientPortal() {
  const [currentUser] = useState({ 
    id: "client-1", 
    name: "Isabella Garcia",
    email: "isabella.garcia@gmail.com" 
  });

  // Fetch client's appointments
  const { data: appointments = [] } = useQuery<any[]>({
    queryKey: ["/api/appointments", { clientId: currentUser.id }],
    queryFn: async () => {
      const response = await fetch(`/api/appointments?clientId=${currentUser.id}`);
      return response.json();
    },
  });

  // Fetch available services
  const { data: services = [] } = useQuery<any[]>({
    queryKey: ["/api/services"],
  });

  // Fetch client details
  const { data: clientDetails } = useQuery({
    queryKey: ["/api/clients", currentUser.id],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${currentUser.id}`);
      return response.json();
    },
  });

  const upcomingAppointments = appointments.filter((apt: any) => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = appointments.filter((apt: any) => 
    new Date(apt.date) < new Date() || apt.status === 'completed'
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Account
          </h1>
          <p className="text-gray-600">Welcome back, {currentUser.name}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                  <p className="text-gray-600">{currentUser.email}</p>
                  {clientDetails?.phone && (
                    <p className="text-gray-600 flex items-center gap-1 mt-1">
                      <Phone className="h-4 w-4" />
                      {clientDetails.phone}
                    </p>
                  )}
                </div>
              </div>
              
              {clientDetails?.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{clientDetails.address}</span>
                </div>
              )}

              <Separator className="my-4" />
              
              <div className="space-y-3">
                <Link href="/book-appointment">
                  <Button className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Book New Appointment
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
                
                <Button variant="outline" className="w-full" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Loyalty Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.floor(Math.random() * 500) + 100}
                </div>
                <p className="text-sm text-gray-600">Points Available</p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-800">
                    Earn 1 point for every ₱10 spent. Redeem 100 points for ₱50 discount!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <Link href="/book-appointment">
                    <Button>Book Your First Appointment</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-semibold">
                            {appointment.service?.name || 'Service'}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(appointment.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(appointment.time)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            with {appointment.staff?.name || 'Staff Member'}
                          </p>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                          <p className="text-sm font-semibold">
                            ₱{parseFloat(appointment.totalAmount || '0').toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600 italic">
                            "{appointment.notes}"
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="destructive">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Service History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pastAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No service history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.slice(0, 5).map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">
                            {appointment.service?.name || 'Service'}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(appointment.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatTime(appointment.time)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            with {appointment.staff?.name || 'Staff Member'}
                          </p>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                          <p className="text-sm font-semibold">
                            ₱{parseFloat(appointment.totalAmount || '0').toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      {appointment.status === 'completed' && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            Book Again
                          </Button>
                          <Button size="sm" variant="outline">
                            <Star className="h-4 w-4 mr-1" />
                            Rate Service
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {pastAppointments.length > 5 && (
                    <Button variant="outline" className="w-full">
                      View All History
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}