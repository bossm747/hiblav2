import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { HiblaLogo } from '@/components/HiblaLogo';
import { Menu, Bell, User, ArrowLeft } from 'lucide-react';

interface MobileHeaderProps {
  showBackButton?: boolean;
  backButtonHref?: string;
  title?: string;
  showMenu?: boolean;
  children?: React.ReactNode;
}

export function MobileHeader({ 
  showBackButton = false, 
  backButtonHref = '/',
  title,
  showMenu = false,
  children
}: MobileHeaderProps) {
  return (
    <header className="h-16 border-b bg-card px-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        {showBackButton && (
          <Link href={backButtonHref}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
        )}
        {showMenu && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[50vw] p-0 h-full max-w-md min-w-72">
              {children}
            </SheetContent>
          </Sheet>
        )}

        <div className="ml-2 flex items-center">
          {!title ? (
            <HiblaLogo size="sm" showText />
          ) : (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="hidden md:flex">
          Production Ready
        </Badge>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-4 w-4" />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}