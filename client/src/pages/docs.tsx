import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Book, 
  Play, 
  Heart, 
  Scissors, 
  Sparkles, 
  Shield, 
  Clock, 
  Users, 
  ShoppingCart, 
  Settings,
  Download,
  Video,
  FileText,
  Search,
  HelpCircle
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import logoPath from "@assets/Hiblalogo_1753513948082.png?url";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("hair-care");

  const navigationSections = [
    {
      title: "Hair Care & Maintenance",
      icon: Heart,
      items: [
        { title: "Daily Care Routine", href: "#daily-care" },
        { title: "Washing Guidelines", href: "#washing" },
        { title: "Storage Tips", href: "#storage" },
        { title: "Troubleshooting", href: "#troubleshooting" }
      ]
    },
    {
      title: "Installation & Styling",
      icon: Scissors,
      items: [
        { title: "Installation Guide", href: "#installation" },
        { title: "Styling Techniques", href: "#styling" },
        { title: "Color Matching", href: "#color-matching" },
        { title: "Tools & Equipment", href: "#tools" }
      ]
    },
    {
      title: "Platform Guide",
      icon: Settings,
      items: [
        { title: "Getting Started", href: "#getting-started" },
        { title: "Account Management", href: "#account" },
        { title: "Order Process", href: "#orders" },
        { title: "POS System", href: "#pos" }
      ]
    }
  ];

  const guides = {
    "hair-care": [
      {
        title: "Daily Care Routine for Hair Extensions",
        content: [
          "Start your day by gently detangling your hair extensions using a wide-tooth comb or specialized extension brush.",
          "Always brush from the ends upward, working your way to the roots to prevent pulling and damage.",
          "For human hair extensions, apply a light leave-in conditioner to keep them moisturized throughout the day.",
          "Avoid excessive heat styling and always use heat protectant products when styling.",
          "Before bedtime, braid your hair loosely or tie it in a low ponytail to prevent tangling while sleeping."
        ]
      },
      {
        title: "Proper Washing Techniques",
        content: [
          "Wash your hair extensions only 2-3 times per week to maintain their longevity.",
          "Use sulfate-free shampoo and lukewarm water to cleanse gently without stripping natural oils.",
          "Apply conditioner from mid-length to ends, avoiding the attachment points to prevent slippage.",
          "Rinse thoroughly with cool water to seal the hair cuticles and add shine.",
          "Gently squeeze out excess water with a microfiber towel - never rub or twist the extensions."
        ]
      },
      {
        title: "Storage and Maintenance",
        content: [
          "When not wearing clip-in extensions, store them on a hanger or extension holder to maintain their shape.",
          "Keep extensions in a cool, dry place away from direct sunlight to prevent color fading.",
          "For tape-in or sewn-in extensions, sleep on a silk pillowcase to reduce friction and tangling.",
          "Deep condition your extensions monthly using a protein-free treatment to maintain softness.",
          "Regular professional maintenance every 6-8 weeks will ensure optimal appearance and longevity."
        ]
      }
    ],
    "styling": [
      {
        title: "Installation Guide for Beginners",
        content: [
          "Start with clean, dry hair that has been combed smooth and free of tangles.",
          "Section your hair horizontally, beginning at the nape of your neck and working upward.",
          "For clip-in extensions: Open clips, position the weft against your scalp, and snap clips closed securely.",
          "For tape-in extensions: Remove protective backing and press firmly for 10-15 seconds for proper adhesion.",
          "Blend extensions with your natural hair using gentle brushing and styling techniques."
        ]
      },
      {
        title: "Professional Styling Techniques",
        content: [
          "Use a round brush when blow-drying to create volume and smooth the hair cuticles.",
          "For curling: Use a barrel size that matches your desired curl pattern - larger barrels for loose waves, smaller for tight curls.",
          "Always curl both your natural hair and extensions in the same direction for a seamless blend.",
          "When straightening, use a heat protectant and work in small sections for even results.",
          "Finish with a light-hold hairspray to maintain your style without weighing down the extensions."
        ]
      },
      {
        title: "Color Matching and Blending",
        content: [
          "Compare extension colors in natural daylight for the most accurate match to your hair.",
          "Consider highlights or lowlights in your natural hair if the extension match isn't perfect.",
          "For ombre or balayage looks, choose extensions that match your base color and add highlights yourself.",
          "Professional color consultation is recommended for complex color matching needs.",
          "Test a small section first when applying any color treatments to extensions."
        ]
      }
    ],
    "platform": [
      {
        title: "Getting Started with Hibla Filipino Hair",
        content: [
          "Create your account by providing basic information and preferences for personalized recommendations.",
          "Browse our extensive catalog of synthetic and human hair extensions with detailed product descriptions.",
          "Use our search and filter tools to find extensions by length, texture, color, and price range.",
          "Add items to your wishlist for easy access to your favorite products.",
          "Contact our customer support team for personalized assistance with product selection."
        ]
      },
      {
        title: "Demo Credentials for Testing",
        content: [
          "Staff Login - Admin Access: admin@hibla.com / admin123 (full management permissions)",
          "Staff Login - Manager Access: manager@hibla.com / manager123 (inventory and sales management)",
          "Staff Login - Cashier Access: cashier@hibla.com / cashier123 (POS operations only)",
          "Staff Login - Sales Staff: sales@hibla.com / sales123 (basic POS access)",
          "Customer Accounts: Use any email from our 15 sample customers with password 'password123'"
        ]
      },
      {
        title: "Sample Customer Data for Testing",
        content: [
          "Philippine customer profiles include: maria.santos@gmail.com, jasmine.cruz@hotmail.com, angel.reyes@icloud.com",
          "Customer data covers major cities: Manila, Cebu, Davao, Baguio, Iloilo, Cagayan de Oro, and more",
          "Spending history ranges from ₱3,900 to ₱18,900 with order counts from 2 to 15 orders",
          "All customer accounts use 'password123' for easy testing and demonstration purposes",
          "Customer lookup and order processing can be tested with these realistic Philippine profiles"
        ]
      },
      {
        title: "Order Management and Tracking",
        content: [
          "Review your cart carefully before checkout, ensuring correct quantities and specifications.",
          "Choose from multiple payment options including cash on delivery, GCash, and bank transfer.",
          "Track your order status through your account dashboard with real-time updates.",
          "Receive SMS and email notifications for order confirmation, shipping, and delivery updates.",
          "Our customer service team is available to assist with any order-related questions."
        ]
      },
      {
        title: "POS System for Staff Members",
        content: [
          "Staff members can access the POS system through the dedicated login portal.",
          "Search products by name, SKU, or scan barcodes for quick item lookup.",
          "Process in-store sales with multiple payment methods including cash, GCash, and bank transfer.",
          "Apply discounts and promotional codes during the checkout process.",
          "Generate daily sales reports and track inventory levels in real-time."
        ]
      }
    ]
  };

  const faqs = [
    {
      question: "How long do hair extensions typically last?",
      answer: "With proper care, human hair extensions can last 6-12 months, while high-quality synthetic extensions typically last 3-6 months. The lifespan depends on usage frequency, care routine, and styling practices."
    },
    {
      question: "Can I color or dye hair extensions?",
      answer: "Human hair extensions can be colored, but we recommend professional coloring to avoid damage. Synthetic extensions cannot be dyed. Always test a small section first and use ammonia-free products when possible."
    },
    {
      question: "What's the difference between clip-in and tape-in extensions?",
      answer: "Clip-in extensions are temporary and can be applied and removed daily, making them perfect for occasional use. Tape-in extensions are semi-permanent, lasting 6-8 weeks, and provide a more natural, seamless look for daily wear."
    },
    {
      question: "How do I choose the right length and volume?",
      answer: "Consider your lifestyle, hair goals, and natural hair length. For subtle enhancement, choose extensions 2-4 inches longer than your hair. For dramatic transformation, go 6+ inches longer. Volume depends on your natural hair density."
    },
    {
      question: "Do you offer installation services?",
      answer: "We provide detailed installation guides and video tutorials. For professional installation, we can recommend certified stylists in your area who specialize in hair extensions."
    },
    {
      question: "What's your return and exchange policy?",
      answer: "We offer a 30-day return policy for unopened, unused extensions in original packaging. Custom-colored or cut extensions cannot be returned. Contact customer service for exchanges due to color matching issues."
    },
    {
      question: "How can I test the platform features?",
      answer: "Use our demo credentials to explore all platform features. Staff accounts (admin@hibla.com/admin123 for full access) let you test POS, inventory, and management features. Customer accounts use any sample email with password 'password123' to test the shopping experience."
    },
    {
      question: "What sample data is available for testing?",
      answer: "The platform includes 15 realistic Philippine customer profiles, 25+ hair extension products, and 4 staff accounts with different permission levels. All data includes authentic Philippine addresses, phone numbers, and realistic spending patterns for comprehensive testing."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden glass-card neon-glow-light flex items-center justify-center">
              <img src={logoPath} alt="Hibla Filipino Hair" className="h-16 w-16 object-contain" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 neon-text-purple">Documentation & Guides</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about hair extensions, platform features, and getting the most out of your Hibla Filipino Hair experience.
          </p>
        </section>

        {/* Quick Navigation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground neon-text-cyan">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {navigationSections.map((section, index) => (
              <Card key={index} className="glass-card border-white/20 neon-purple group hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <section.icon className="h-6 w-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <a
                        key={itemIndex}
                        href={item.href}
                        className="block text-sm text-muted-foreground hover:text-foreground hover:neon-text-cyan transition-all py-1"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="mb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3 glass-card">
                <TabsTrigger value="hair-care" className="data-[state=active]:neon-text-purple">
                  <Heart className="h-4 w-4 mr-2" />
                  Hair Care
                </TabsTrigger>
                <TabsTrigger value="styling" className="data-[state=active]:neon-text-cyan">
                  <Scissors className="h-4 w-4 mr-2" />
                  Styling
                </TabsTrigger>
                <TabsTrigger value="platform" className="data-[state=active]:neon-text-pink">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform
                </TabsTrigger>
              </TabsList>
            </div>

            {Object.entries(guides).map(([key, guideList]) => (
              <TabsContent key={key} value={key}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {guideList.map((guide, index) => (
                    <Card key={index} className="glass-card border-white/20 neon-cyan">
                      <CardHeader>
                        <CardTitle className="text-xl text-foreground flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-cyan-400" />
                          {guide.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {guide.content.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start space-x-3">
                              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30 min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs">
                                {stepIndex + 1}
                              </Badge>
                              <p className="text-muted-foreground leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Video Tutorials Section */}
        <section className="mb-16">
          <Card className="glass-card border-white/20 neon-green">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4 neon-text-green">Video Tutorials</h2>
                <p className="text-lg text-muted-foreground">
                  Watch our step-by-step video guides for visual learning
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Basic Installation Guide", duration: "5:30", level: "Beginner" },
                  { title: "Advanced Styling Techniques", duration: "8:45", level: "Intermediate" },
                  { title: "Professional Maintenance", duration: "6:20", level: "Advanced" },
                  { title: "Color Matching Tips", duration: "4:15", level: "Beginner" },
                  { title: "Troubleshooting Common Issues", duration: "7:10", level: "Intermediate" },
                  { title: "Platform Navigation", duration: "3:45", level: "Beginner" }
                ].map((video, index) => (
                  <Card key={index} className="glass-card border-white/20 group hover:scale-105 transition-transform">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <div className="aspect-video bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center group-hover:from-green-500/30 group-hover:to-cyan-500/30 transition-all">
                          <Play className="h-12 w-12 text-green-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <Badge className="absolute top-2 right-2 bg-black/60 text-white">
                          {video.duration}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{video.title}</h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="border-green-400/30 text-green-400">
                          {video.level}
                        </Badge>
                        <Button size="sm" variant="outline" className="border-green-400 text-green-400 hover:bg-green-400/20">
                          <Play className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground neon-text-pink">Frequently Asked Questions</h2>
          <Card className="glass-card border-white/20 neon-pink">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
                    <AccordionTrigger className="text-left hover:text-foreground hover:neon-text-pink transition-all">
                      <div className="flex items-center space-x-3">
                        <HelpCircle className="h-5 w-5 text-pink-400 flex-shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Download Resources */}
        <section className="mb-16">
          <Card className="glass-card border-white/20 neon-purple">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4 neon-text-purple">Download Resources</h2>
                <p className="text-lg text-muted-foreground">
                  Handy guides and checklists you can save for offline reference
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Care Guide PDF", description: "Complete hair care routine", size: "2.4 MB" },
                  { title: "Demo Credentials", description: "Staff and customer login details", size: "0.1 MB" },
                  { title: "Styling Checklist", description: "Step-by-step styling guide", size: "1.8 MB" },
                  { title: "Color Chart", description: "Hair color matching reference", size: "5.2 MB" },
                  { title: "Maintenance Schedule", description: "Monthly care calendar", size: "1.2 MB" }
                ].map((resource, index) => (
                  <Card key={index} className="glass-card border-white/20 group hover:scale-105 transition-transform">
                    <CardContent className="p-4 text-center">
                      <Download className="h-8 w-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                      <Badge variant="outline" className="border-purple-400/30 text-purple-400 mb-3">
                        {resource.size}
                      </Badge>
                      <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Support */}
        <section className="text-center">
          <Card className="glass-card border-white/20 neon-cyan">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-4 neon-text-cyan">Need More Help?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our expert team is here to assist you with any questions about hair extensions or platform usage.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white shadow-lg hover:shadow-cyan-500/50 transition-all">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Link href="/about">
                  <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:neon-text-cyan transition-all">
                    Learn About Us
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="border-purple-400 text-purple-400 hover:bg-purple-400/20 hover:neon-text-purple transition-all">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}