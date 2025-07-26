import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 glass-card border-white/20 neon-purple">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-destructive neon-text-pink" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground neon-text-purple mb-2">
            404 Page Not Found
          </h1>

          <p className="mt-4 text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
