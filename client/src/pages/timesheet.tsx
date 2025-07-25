import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
  PlayCircle,
  StopCircle,
  Calendar,
  User,
  Timer,
} from "lucide-react";

const clockInSchema = z.object({
  staffId: z.string().min(1, "Staff member is required"),
  notes: z.string().optional(),
});

const clockOutSchema = z.object({
  notes: z.string().optional(),
});

const breakSchema = z.object({
  notes: z.string().optional(),
});

export default function Timesheet() {
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<string>("");

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
  });

  const { data: timeRecords = [] } = useQuery({
    queryKey: ["/api/time-records"],
  });

  const { data: activeTimeRecord } = useQuery({
    queryKey: ["/api/time-records/active", selectedStaff],
    enabled: !!selectedStaff,
  });

  const clockInForm = useForm<z.infer<typeof clockInSchema>>({
    resolver: zodResolver(clockInSchema),
    defaultValues: {
      staffId: "",
      notes: "",
    },
  });

  const clockOutForm = useForm<z.infer<typeof clockOutSchema>>({
    resolver: zodResolver(clockOutSchema),
    defaultValues: {
      notes: "",
    },
  });

  const breakForm = useForm<z.infer<typeof breakSchema>>({
    resolver: zodResolver(breakSchema),
    defaultValues: {
      notes: "",
    },
  });

  const clockInMutation = useMutation({
    mutationFn: async (data: z.infer<typeof clockInSchema>) => {
      const response = await apiRequest("POST", "/api/time-records/clock-in", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Clocked In",
        description: "Successfully clocked in",
      });
      clockInForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/time-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-records/active"] });
    },
    onError: (error: any) => {
      toast({
        title: "Clock In Failed",
        description: error.message || "Failed to clock in",
        variant: "destructive",
      });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async (data: z.infer<typeof clockOutSchema>) => {
      const response = await apiRequest("POST", `/api/time-records/clock-out/${activeTimeRecord?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Clocked Out",
        description: "Successfully clocked out",
      });
      clockOutForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/time-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/time-records/active"] });
    },
    onError: (error: any) => {
      toast({
        title: "Clock Out Failed",
        description: error.message || "Failed to clock out",
        variant: "destructive",
      });
    },
  });

  const startBreakMutation = useMutation({
    mutationFn: async (data: z.infer<typeof breakSchema>) => {
      const response = await apiRequest("POST", `/api/time-records/break-start/${activeTimeRecord?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Break Started",
        description: "Break time started",
      });
      breakForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/time-records/active"] });
    },
    onError: (error: any) => {
      toast({
        title: "Break Start Failed",
        description: error.message || "Failed to start break",
        variant: "destructive",
      });
    },
  });

  const endBreakMutation = useMutation({
    mutationFn: async (data: z.infer<typeof breakSchema>) => {
      const response = await apiRequest("POST", `/api/time-records/break-end/${activeTimeRecord?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Break Ended",
        description: "Back from break",
      });
      breakForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/time-records/active"] });
    },
    onError: (error: any) => {
      toast({
        title: "Break End Failed",
        description: error.message || "Failed to end break",
        variant: "destructive",
      });
    },
  });

  const onClockIn = (data: z.infer<typeof clockInSchema>) => {
    setSelectedStaff(data.staffId);
    clockInMutation.mutate(data);
  };

  const onClockOut = (data: z.infer<typeof clockOutSchema>) => {
    clockOutMutation.mutate(data);
  };

  const onStartBreak = (data: z.infer<typeof breakSchema>) => {
    startBreakMutation.mutate(data);
  };

  const onEndBreak = (data: z.infer<typeof breakSchema>) => {
    endBreakMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "on-break":
        return <Badge className="bg-yellow-100 text-yellow-800">On Break</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateHours = (clockIn: string, clockOut?: string) => {
    const start = new Date(clockIn);
    const end = clockOut ? new Date(clockOut) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const hours = diffMs / (1000 * 60 * 60);
    return hours.toFixed(2);
  };

  const todayRecords = timeRecords.filter((record: any) => {
    const recordDate = new Date(record.createdAt);
    const today = new Date();
    return recordDate.toDateString() === today.toDateString();
  });

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Staff Timesheet</h2>
          <p className="text-muted-foreground">
            Track staff clock in/out times and manage work hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clock In/Out Controls */}
        <div className="space-y-6">
          {/* Clock In */}
          {!activeTimeRecord && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIn className="h-5 w-5" />
                  Clock In
                </CardTitle>
                <CardDescription>
                  Start your work shift
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...clockInForm}>
                  <form onSubmit={clockInForm.handleSubmit(onClockIn)} className="space-y-4">
                    <FormField
                      control={clockInForm.control}
                      name="staffId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Staff Member *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select staff member" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {staff.map((member: any) => (
                                <SelectItem key={member.id} value={member.id}>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {member.firstName} {member.lastName}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={clockInForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Any notes for this shift" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" size="lg">
                      <LogIn className="h-4 w-4 mr-2" />
                      Clock In
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Active Shift Controls */}
          {activeTimeRecord && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Active Shift
                </CardTitle>
                <CardDescription>
                  Currently working: {calculateHours(activeTimeRecord.clockIn)} hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Clocked in at:</span>
                    <span className="text-sm">{format(new Date(activeTimeRecord.clockIn), "h:mm a")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(activeTimeRecord.status)}
                  </div>
                </div>

                {/* Break Controls */}
                <div className="grid grid-cols-2 gap-4">
                  {!activeTimeRecord.breakStart ? (
                    <Form {...breakForm}>
                      <form onSubmit={breakForm.handleSubmit(onStartBreak)}>
                        <Button type="submit" variant="outline" className="w-full" size="sm">
                          <Coffee className="h-4 w-4 mr-2" />
                          Start Break
                        </Button>
                      </form>
                    </Form>
                  ) : !activeTimeRecord.breakEnd ? (
                    <Form {...breakForm}>
                      <form onSubmit={breakForm.handleSubmit(onEndBreak)}>
                        <Button type="submit" variant="outline" className="w-full" size="sm">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          End Break
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <Button variant="outline" disabled className="w-full" size="sm">
                      <Coffee className="h-4 w-4 mr-2" />
                      Break Completed
                    </Button>
                  )}
                </div>

                {/* Clock Out */}
                <Form {...clockOutForm}>
                  <form onSubmit={clockOutForm.handleSubmit(onClockOut)} className="space-y-4">
                    <FormField
                      control={clockOutForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End of Shift Notes (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Summary of work completed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" variant="destructive" className="w-full" size="lg">
                      <LogOut className="h-4 w-4 mr-2" />
                      Clock Out
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Today's Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Time Records
            </CardTitle>
            <CardDescription>
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No time records for today</p>
                <p className="text-sm">Clock in to start tracking time</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayRecords.map((record: any) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">
                          {staff.find((s: any) => s.id === record.staffId)?.firstName} {staff.find((s: any) => s.id === record.staffId)?.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {staff.find((s: any) => s.id === record.staffId)?.role}
                        </p>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Clock In:</span>
                        <span>{format(new Date(record.clockIn), "h:mm a")}</span>
                      </div>
                      
                      {record.clockOut && (
                        <div className="flex justify-between">
                          <span>Clock Out:</span>
                          <span>{format(new Date(record.clockOut), "h:mm a")}</span>
                        </div>
                      )}
                      
                      {record.breakStart && (
                        <div className="flex justify-between">
                          <span>Break:</span>
                          <span>
                            {format(new Date(record.breakStart), "h:mm a")}
                            {record.breakEnd && ` - ${format(new Date(record.breakEnd), "h:mm a")}`}
                          </span>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div className="flex justify-between font-medium">
                        <span>Total Hours:</span>
                        <span>
                          {record.totalHours ? `${record.totalHours}h` : `${calculateHours(record.clockIn, record.clockOut)}h`}
                        </span>
                      </div>
                      
                      {record.notes && (
                        <>
                          <Separator />
                          <div className="text-muted-foreground">
                            <span className="font-medium">Notes:</span> {record.notes}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}