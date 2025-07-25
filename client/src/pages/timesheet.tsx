import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  LogIn,
  LogOut,
  Coffee,
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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/staff"],
  });

  // Mock time records data since API endpoints don't exist yet
  const timeRecords = [
    {
      id: 1,
      staffId: "1",
      staffName: "Maria Santos",
      date: new Date().toISOString().split('T')[0],
      clockIn: "08:00",
      clockOut: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      totalHours: 8,
      status: "completed"
    },
    {
      id: 2,
      staffId: "2", 
      staffName: "Juan Dela Cruz",
      date: new Date().toISOString().split('T')[0],
      clockIn: "09:00",
      clockOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: 0,
      status: "active"
    }
  ];

  const activeTimeRecord = timeRecords.find(record => 
    record.staffId === selectedStaff && record.status === "active"
  );

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
      // Mock API call - in real implementation would call actual endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Clocked In Successfully",
        description: "Time tracking started",
      });
      clockInForm.reset();
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async (data: z.infer<typeof clockOutSchema>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Clocked Out Successfully",
        description: "Time tracking stopped",
      });
      clockOutForm.reset();
      setSelectedStaff("");
    },
  });

  const breakMutation = useMutation({
    mutationFn: async (data: z.infer<typeof breakSchema> & { action: 'start' | 'end' }) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.action === 'start' ? "Break Started" : "Break Ended",
        description: variables.action === 'start' ? "Enjoy your break!" : "Welcome back!",
      });
      breakForm.reset();
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
    breakMutation.mutate({ ...data, action: 'start' });
  };

  const onEndBreak = (data: z.infer<typeof breakSchema>) => {
    breakMutation.mutate({ ...data, action: 'end' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Staff Timesheet</h1>
        <p className="text-slate-600 mt-2">
          Track staff working hours and break times
        </p>
      </div>

      {/* Current Time Display */}
      <Card className="spa-card-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-8 w-8 text-pink-500 mr-3" />
                <div>
                  <div className="text-3xl font-bold text-slate-800">
                    {format(currentTime, "HH:mm:ss")}
                  </div>
                  <div className="text-sm text-slate-500">
                    {format(currentTime, "EEEE, MMMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clock In/Out Controls */}
        <div className="space-y-6">
          {/* Clock In */}
          {!activeTimeRecord && (
            <Card className="spa-card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Clock In
                </CardTitle>
                <CardDescription>
                  Start your work day
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
                              {(staff as any[]).map((member: any) => (
                                <SelectItem key={member.id} value={member.id.toString()}>
                                  {member.name}
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
                            <Input placeholder="Any notes for today..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={clockInMutation.isPending}
                    >
                      {clockInMutation.isPending ? "Clocking In..." : "Clock In"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Clock Out & Break Controls */}
          {activeTimeRecord && (
            <Card className="spa-card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Currently Working
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium text-green-800">
                        {activeTimeRecord.staffName}
                      </div>
                      <div className="text-sm text-green-600">
                        Started at {activeTimeRecord.clockIn}
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => onStartBreak({})}
                      disabled={breakMutation.isPending}
                    >
                      <Coffee className="h-4 w-4" />
                      Start Break
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      className="flex items-center gap-2"
                      onClick={() => onClockOut({})}
                      disabled={clockOutMutation.isPending}
                    >
                      <LogOut className="h-4 w-4" />
                      Clock Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Today's Records */}
        <Card className="spa-card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Time Records
            </CardTitle>
            <CardDescription>
              {format(new Date(), "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {timeRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Timer className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No time records for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {timeRecords.map((record: any) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{record.staffName}</div>
                      <Badge variant={record.status === 'active' ? 'default' : 'secondary'}>
                        {record.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Clock In:</span> {record.clockIn}
                      </div>
                      <div>
                        <span className="font-medium">Clock Out:</span> {record.clockOut || "---"}
                      </div>
                      <div>
                        <span className="font-medium">Break:</span> {record.breakStart || "---"}
                      </div>
                      <div>
                        <span className="font-medium">Total Hours:</span> {record.totalHours}h
                      </div>
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