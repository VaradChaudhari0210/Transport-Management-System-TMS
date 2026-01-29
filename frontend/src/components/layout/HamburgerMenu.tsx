import { useState } from 'react';
import { Menu, X, Package, BarChart3, Users, Settings, Truck, ChevronDown, ChevronRight, FileText, MapPin, CreditCard } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubMenuItem {
  to: string;
  label: string;
}

interface MenuItem {
  to: string;
  icon: React.ElementType;
  label: string;
  subItems?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  { 
    to: '/', 
    icon: Package, 
    label: 'Shipments',
    subItems: [
      { to: '/', label: 'All Shipments' },
      { to: '/shipments/active', label: 'Active' },
      { to: '/shipments/completed', label: 'Completed' },
    ]
  },
  { 
    to: '/analytics', 
    icon: BarChart3, 
    label: 'Analytics',
    subItems: [
      { to: '/analytics', label: 'Dashboard' },
      { to: '/analytics/reports', label: 'Reports' },
    ]
  },
  { 
    to: '/carriers', 
    icon: Truck, 
    label: 'Carriers',
    subItems: [
      { to: '/carriers', label: 'All Carriers' },
      { to: '/carriers/rates', label: 'Rate Cards' },
    ]
  },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/billing', icon: CreditCard, label: 'Billing' },
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden border-2 h-8 w-8"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out menu */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-60 sm:w-72 bg-background border-r-4 border-border z-50 transform transition-transform duration-300 ease-out md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b-4 border-border">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary flex items-center justify-center">
                <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-base sm:text-lg tracking-tight">FreightFlow</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="border-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-2 sm:p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.label}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className="w-full flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium border-2 border-transparent hover:border-border hover:bg-accent transition-all"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>{item.label}</span>
                        </div>
                        {expandedItems.includes(item.label) ? (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </button>
                      {expandedItems.includes(item.label) && (
                        <ul className="ml-4 sm:ml-6 mt-1 space-y-1 border-l-2 border-border">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.to}>
                              <NavLink
                                to={subItem.to}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-1.5 text-xs sm:text-sm hover:bg-accent transition-colors"
                                activeClassName="bg-secondary font-medium"
                              >
                                {subItem.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium border-2 border-transparent hover:border-border hover:bg-accent transition-all"
                      activeClassName="border-primary bg-secondary"
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-2 sm:p-4 border-t-4 border-border">
            <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
              FreightFlow TMS v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
