
import { NavLink } from '@/components/NavLink';
import { Package, BarChart3, Users, Settings, Truck } from 'lucide-react';
import { useUser } from '@/hooks/use-user';


export function HorizontalNav() {
  const user = useUser();
  const navItems = [
    { to: '/', icon: Package, label: 'Shipments' },
    ...(user && user.role === 'ADMIN' ? [
      { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    ] : []),
    { to: '/carriers', icon: Truck, label: 'Carriers' },
    { to: '/team', icon: Users, label: 'Team' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium border-2 border-transparent hover:border-border hover:bg-accent transition-all"
          activeClassName="border-primary bg-secondary"
        >
          <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
