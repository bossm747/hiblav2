import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import AppointmentModal from "@/components/modals/appointment-modal";

export default function Appointments() {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments", "date", selectedDate],
    queryFn: () => fetch(`/api/appointments?date=${selectedDate}`).then(res => res.json()),
  });

  const { data: allAppointments } = useQuery({
    queryKey: ["/api/appointments"],
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 sm:space-y-8">
        <div className="h-8 bg-slate-200 rounded w-64"></div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
        <div className="h-96 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const currentDay = today.getDate();

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex-responsive justify-between">
          <div>
            <h2 className="text-responsive-lg font-bold text-slate-900">Appointments</h2>
            <p className="mt-2 text-responsive-base text-slate-600">Manage bookings and schedule appointments</p>
          </div>
          <Button 
            className="button-responsive"
            onClick={() => setAppointmentModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>

        {/* Calendar View */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <CardTitle>December 2024</CardTitle>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">Today</Button>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mini Calendar */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-medium text-slate-600 py-2">{day}</div>
              ))}
              
              {/* Empty cells for month start */}
              {Array.from({ length: 3 }, (_, i) => (
                <div key={`empty-${i}`} className="py-2"></div>
              ))}
              
              {/* Calendar days */}
              {calendarDays.map(day => {
                const dateStr = `2024-12-${day.toString().padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;
                const isToday = day === currentDay;
                
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`py-2 text-sm rounded-lg transition-colors ${
                      isSelected 
                        ? 'bg-primary text-white font-medium' 
                        : isToday 
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            {!appointments || !Array.isArray(appointments) || appointments.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <p>No appointments scheduled for this date</p>
                <Button 
                  className="mt-4"
                  onClick={() => setAppointmentModalOpen(true)}
                >
                  Schedule Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(appointments) && appointments.map((appointment: any) => (
                  <div key={appointment.id} className="p-6 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="text-center min-w-0">
                          <div className="text-lg font-semibold text-slate-900">{appointment.time}</div>
                          <div className="text-xs text-slate-500">{appointment.duration} min</div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-900">{appointment.clientName}</div>
                          <div className="text-sm text-slate-500">{appointment.serviceName}</div>
                          <div className="text-xs text-slate-400 mt-1">
                            {appointment.staffName && `with ${appointment.staffName}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                        <Badge variant={
                          appointment.status === 'confirmed' ? 'default' : 
                          appointment.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {appointment.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AppointmentModal 
        open={appointmentModalOpen} 
        onOpenChange={setAppointmentModalOpen} 
      />
    </>
  );
}
