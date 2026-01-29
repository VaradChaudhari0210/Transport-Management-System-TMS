import { HamburgerMenu } from './HamburgerMenu';
import { HorizontalNav } from './HorizontalNav';
import { Button } from '@/components/ui/button';
import { Truck, Bell, User, Plus } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onAddShipment?: () => void;
}

export function Header({ onAddShipment }: HeaderProps) {
  const user = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b-4 border-border bg-background">
      <div className="container flex h-12 sm:h-16 items-center justify-between gap-2 sm:gap-4 px-2 sm:px-0">
        {/* Logo & Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-4">
          <HamburgerMenu />
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary flex items-center justify-center shadow-sm">
              <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-base sm:text-xl tracking-tight hidden sm:inline">FreightFlow</span>
          </div>
        </div>

        {/* Horizontal Navigation - Desktop */}
        <HorizontalNav />

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            onClick={onAddShipment}
            size="icon"
            className="sm:hidden shadow-xs hover:shadow-sm transition-shadow h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button 
            onClick={onAddShipment}
            className="hidden sm:flex items-center gap-2 shadow-xs hover:shadow-sm transition-shadow h-10"
          >
            <Plus className="h-4 w-4" />
            <span>New Shipment</span>
          </Button>
          <Button variant="outline" size="icon" className="border-2 relative h-8 w-8 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-destructive rounded-full" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="border-2 hidden sm:flex h-10 w-10">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {user && (
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground mr-1 sm:mr-2">
              {user.name} <span className="uppercase text-primary">({user.role})</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
