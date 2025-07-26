import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Users, Award, Clock, Globe } from "lucide-react";
import logoPath from "@assets/Hiblalogo_1753513948082.png";
import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden glass-card neon-glow-light flex items-center justify-center">
              <img src={logoPath} alt="Hibla Filipino Hair" className="h-20 w-20 object-contain" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 neon-text-purple">About Hibla Filipino Hair</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Bringing you the finest quality Filipino and international hair extensions with authentic beauty and unmatched craftsmanship.
          </p>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <Card className="glass-card border-white/20 neon-cyan">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white mb-4">
                    OUR STORY
                  </Badge>
                  <h2 className="text-3xl font-bold text-foreground mb-6 neon-text-cyan">
                    Celebrating Filipino Beauty Since Day One
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Hibla Filipino Hair was born from a passion to celebrate and share the natural beauty of Filipino hair with the world. 
                    Our journey began with a simple mission: to provide authentic, high-quality hair extensions that enhance natural beauty 
                    while honoring our Filipino heritage.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Today, we've grown into a trusted brand that serves customers across the Philippines and beyond, offering premium 
                    synthetic and human hair extensions that meet the highest standards of quality and authenticity.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="glass-card p-6 neon-glow-light">
                    <div className="flex items-center space-x-4">
                      <Users className="h-8 w-8 text-purple-400" />
                      <div>
                        <div className="text-2xl font-bold text-foreground">10,000+</div>
                        <div className="text-sm text-muted-foreground">Happy Customers</div>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-6 neon-glow-light">
                    <div className="flex items-center space-x-4">
                      <Award className="h-8 w-8 text-cyan-400" />
                      <div>
                        <div className="text-2xl font-bold text-foreground">Premium</div>
                        <div className="text-sm text-muted-foreground">Quality Guaranteed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground neon-text-pink">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card border-white/20 neon-purple group hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-xl text-foreground">Authenticity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in celebrating natural Filipino beauty and providing authentic products that enhance your unique look.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20 neon-cyan group hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Star className="h-8 w-8 text-cyan-400" />
                </div>
                <CardTitle className="text-xl text-foreground">Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every product is carefully selected and tested to meet our high standards for durability, comfort, and natural appearance.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20 neon-pink group hover:scale-105 transition-transform">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-pink-400" />
                </div>
                <CardTitle className="text-xl text-foreground">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're committed to supporting our Filipino community and creating connections through shared beauty experiences.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <Card className="glass-card border-white/20 neon-green">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-12 text-foreground neon-text-green">Why Choose Hibla Filipino Hair?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Premium Quality Materials</h3>
                      <p className="text-muted-foreground">100% human hair and high-grade synthetic options sourced from trusted suppliers.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Expert Craftsmanship</h3>
                      <p className="text-muted-foreground">Each product is carefully crafted with attention to detail and quality control.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Wide Selection</h3>
                      <p className="text-muted-foreground">From straight to curly, synthetic to human hair - we have options for every style preference.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Fast Shipping</h3>
                      <p className="text-muted-foreground">Quick and reliable delivery across the Philippines with tracking available.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Customer Support</h3>
                      <p className="text-muted-foreground">Dedicated team ready to help with product selection and care instructions.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Satisfaction Guarantee</h3>
                      <p className="text-muted-foreground">We stand behind our products with quality guarantees and hassle-free returns.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="glass-card border-white/20 neon-purple">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-foreground mb-4 neon-text-purple">Ready to Transform Your Look?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Discover our complete collection of premium hair extensions and find your perfect match.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/products">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/50 transition-all">
                    Shop All Products
                  </Button>
                </Link>
                <Link href="/products?category=human">
                  <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 hover:neon-text-cyan transition-all">
                    View Human Hair
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