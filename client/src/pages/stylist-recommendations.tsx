import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Star, MapPin, Clock, DollarSign, User } from "lucide-react";

const preferencesSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  hairType: z.string().optional(),
  hairLength: z.string().optional(),
  hairGoals: z.array(z.string()).optional(),
  preferredStyle: z.array(z.string()).optional(),
  budgetRange: z.string().optional(),
  preferredLocation: z.string().optional(),
  preferredLanguage: z.array(z.string()).optional(),
  sessionType: z.string().optional(),
  urgency: z.string().optional(),
  previousExperience: z.string().optional(),
  specialNeeds: z.array(z.string()).optional(),
  communicationStyle: z.string().optional(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

export default function StylistRecommendations() {
  const [step, setStep] = useState<'preferences' | 'recommendations'>('preferences');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      hairGoals: [],
      preferredStyle: [],
      preferredLanguage: ['English', 'Filipino'],
      specialNeeds: [],
    },
  });

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery({
    queryKey: ['/api/customers'],
  });

  // Fetch stylists to show available options
  const { data: stylists = [] } = useQuery({
    queryKey: ['/api/stylists'],
    queryFn: () => fetch('/api/stylists?active=true').then(res => res.json()),
  });

  // Create customer preferences mutation
  const createPreferencesMutation = useMutation({
    mutationFn: async (data: PreferencesFormData) => {
      const response = await fetch('/api/customer-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save preferences: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Preferences Saved",
        description: "Your hair preferences have been saved successfully.",
      });
      generateRecommendations();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate AI recommendations
  const generateRecommendations = async () => {
    try {
      const customerId = selectedCustomerId;
      const response = await fetch('/api/stylist-recommendations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          customerProfile: {
            name: "Demo Customer",
            previousOrders: 2,
            totalSpent: "5500",
            location: "Metro Manila"
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate recommendations');
      }

      const recs = await response.json();
      setRecommendations(recs);
      setStep('recommendations');
      
      toast({
        title: "AI Recommendations Generated",
        description: `Found ${recs.length} stylist matches for your preferences.`,
      });
    } catch (error: any) {
      toast({
        title: "Recommendation Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = (data: PreferencesFormData) => {
    setSelectedCustomerId(data.customerId);
    createPreferencesMutation.mutate(data);
  };

  const resetForm = () => {
    setStep('preferences');
    setRecommendations([]);
    form.reset();
  };

  if (step === 'recommendations') {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">AI Stylist Recommendations</h1>
            <p className="text-muted-foreground">Personalized stylist matches based on your preferences</p>
          </div>
          <Button onClick={resetForm} variant="outline">
            New Search
          </Button>
        </div>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recommendations Found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any stylists matching your preferences. Try adjusting your criteria.
                </p>
                <Button onClick={resetForm}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {recommendations.map((rec, index) => {
              const stylist = stylists.find(s => s.id === rec.stylistId);
              if (!stylist) return null;

              return (
                <Card key={rec.id} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {stylist.name}
                          <Badge variant="secondary">{Math.round(rec.matchScore)}% Match</Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {stylist.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {stylist.rating}/5 ({stylist.totalReviews} reviews)
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {stylist.experience} years exp
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {stylist.priceRange}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{stylist.bio}</p>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Why This Match:</h4>
                      <p className="text-sm text-muted-foreground">{rec.matchReason}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Strengths:</h4>
                        <ul className="text-sm space-y-1">
                          {rec.strengths?.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Recommended Services:</h4>
                        <div className="flex flex-wrap gap-1">
                          {rec.recommendedServices?.map((service, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        {rec.estimatedPrice && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Estimated: ₱{parseFloat(rec.estimatedPrice).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties?.map((specialty, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Contact Stylist
                      </Button>
                      <Button size="sm" variant="outline">
                        View Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          AI Stylist Finder
        </h1>
        <p className="text-muted-foreground">
          Tell us your hair goals and we'll find the perfect stylist for you using AI matching.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Hair Preferences</CardTitle>
          <CardDescription>
            Help us understand your hair type, goals, and preferences for personalized recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hairType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hair Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hair type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="straight">Straight</SelectItem>
                          <SelectItem value="wavy">Wavy</SelectItem>
                          <SelectItem value="curly">Curly</SelectItem>
                          <SelectItem value="coily">Coily</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hairLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Hair Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="budgetRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Range</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="budget">Budget (₱1,000-3,000)</SelectItem>
                          <SelectItem value="mid-range">Mid-range (₱3,000-6,000)</SelectItem>
                          <SelectItem value="premium">Premium (₱6,000+)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Metro Manila, Cebu City" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sessionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="What do you need?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="installation">Hair Extension Installation</SelectItem>
                        <SelectItem value="maintenance">Maintenance & Care</SelectItem>
                        <SelectItem value="styling">Styling Session</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createPreferencesMutation.isPending}
                  className="flex-1"
                >
                  {createPreferencesMutation.isPending ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Finding Your Perfect Match...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Find My Stylist
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {stylists.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Stylists ({stylists.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {stylists.slice(0, 3).map((stylist) => (
                <div key={stylist.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{stylist.name}</h4>
                    <p className="text-sm text-muted-foreground">{stylist.location} • {stylist.experience} years</p>
                  </div>
                  <Badge variant="secondary">{stylist.priceRange}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}