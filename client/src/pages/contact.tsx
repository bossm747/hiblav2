import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/navbar";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent Successfully",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Store",
      content: "123 Hair Extension St., Manila, Philippines 1000",
      description: "Come see our products in person"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+63 917 123 4567",
      description: "Mon-Sat, 9AM-7PM PHT"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@hiblafilipinohair.com",
      description: "We respond within 4 hours"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
      description: "Philippine Standard Time"
    }
  ];

  const faqs = [
    {
      question: "How long do hair extensions last?",
      answer: "Our premium human hair extensions can last 6-12 months with proper care."
    },
    {
      question: "Do you offer installation services?",
      answer: "Yes, we have certified stylists available for professional installation."
    },
    {
      question: "What's your return policy?",
      answer: "We offer a 14-day return policy for unopened, unused products."
    },
    {
      question: "Do you ship nationwide?",
      answer: "Yes, we ship to all provinces in the Philippines with same-day Metro Manila delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <section className="py-16 glass-dark border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 neon-text-cyan">
              Get In Touch
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions about our products or need personalized recommendations? 
              We're here to help you find the perfect hair extensions.
            </p>
            <div className="flex justify-center items-center space-x-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                ✓ Expert Consultations
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                ✓ Fast Response
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                ✓ Filipino-Owned
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl neon-text-purple flex items-center">
                <MessageSquare className="h-6 w-6 mr-2" />
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="glass mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="glass mt-1"
                      placeholder="+63 917 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="glass mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="glass mt-1"
                    placeholder="Product inquiry, installation, custom order..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="glass mt-1 min-h-[120px]"
                    placeholder="Tell us about your hair goals, preferred length, texture, or any questions you have..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl neon-text-cyan">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center neon-glow-light">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        <p className="text-foreground font-medium">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Customer Reviews */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl neon-text-yellow flex items-center">
                  <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                  What Our Customers Say
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 glass border border-white/10 rounded-lg">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "Amazing quality! The hair feels so natural and the color match is perfect. 
                      Customer service was exceptional."
                    </p>
                    <p className="text-xs text-foreground font-medium">- Maria Santos, Quezon City</p>
                  </div>
                  
                  <div className="p-4 glass border border-white/10 rounded-lg">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "Fast delivery and beautiful packaging. The hair extensions lasted over 8 months 
                      with proper care. Highly recommended!"
                    </p>
                    <p className="text-xs text-foreground font-medium">- Lisa Rodriguez, Makati</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl neon-text-purple text-center">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 glass border border-white/10 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}