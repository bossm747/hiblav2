import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  User, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  XCircle,
  Users,
  TrendingUp,
  Phone,
  MapPin
} from "lucide-react";

export default function StaffDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Fetch staff member's appointments for selected date
  const { data: appointments = [] } = useQuery({
    queryKey: ["/api/appointments", selectedDate.toISOString().split('T')[0]],
    queryFn: async () => {
      const date = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/appointments?date=${date}`);
      return response.json();
    },
  });

  // Fetch staff member's schedule for selected date
  const { data: schedule } = useQuery({
    queryKey: ["/api/staff-schedules", selectedDate.toISOString().split('T')[0]],
    queryFn: async () => {
      const date = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/staff-schedules?date=${date}`);
      const data = await response.json();
      return data[0]; // Assuming current staff member
    },
  });

  // Fetch today's stats
  const { data: todayStats = { total: 0, completed: 0, pending: 0, cancelled: 0, totalRevenue: 0 } } = useQuery({
    queryKey: ["/api/staff/today-stats"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const appointmentsRes = await fetch(`/api/appointments?date=${today}`);
      const appointments = await appointmentsRes.json();
      
      const completed = appointments.filter((apt: any) => apt.status === 'completed').length;
      const pending = appointments.filter((apt: any) => apt.status === 'confirmed').length;
      const cancelled = appointments.filter((apt: any) => apt.status === 'cancelled').length;
      
      const totalRevenue = appointments
        .filter((apt: any) => apt.status === 'completed')
        .reduce((sum: number, apt: any) => sum + parseFloat(apt.totalAmount || '0'), 0);

      return {
        completed,
        pending,
        cancelled,
        totalRevenue,
        total: appointments.length
      };
    },
  });

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
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Staff Dashboard
          </h1>
          <p className="text-gray-600">Manage your schedule and appointments</p>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold">{todayStats.total || 0}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{todayStats.completed || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{todayStats.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₱{(todayStats.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Schedule Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />
              
              {schedule && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Working Hours</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Start:</span>
                      <span>{formatTime(schedule.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>End:</span>
                      <span>{formatTime(schedule.endTime)}</span>
                    </div>
                    {schedule.breakStart && schedule.breakEnd && (
                      <div className="flex justify-between">
                        <span>Break:</span>
                        <span>{formatTime(schedule.breakStart)} - {formatTime(schedule.breakEnd)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={schedule.isAvailable ? "default" : "destructive"}>
                        {schedule.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Appointments for {selectedDate.toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment: any) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {appointment.client?.name?.split(' ').map((n: string) => n[0]).join('') || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-1">
                            <h4 className="font-semibold">{appointment.client?.name || 'Unknown Client'}</h4>
                            <p className="text-sm text-gray-600">{appointment.service?.name || 'Service'}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(appointment.time)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {appointment.client?.phone || 'No phone'}
                              </div>
                            </div>
                            
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 italic mt-2">
                                "{appointment.notes}"
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                          <p className="text-sm font-semibold">
                            ₱{parseFloat(appointment.totalAmount || '0').toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {appointment.duration || 60} mins
                          </p>
                        </div>
                      </div>
                      
                      {appointment.status === 'confirmed' && (
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}