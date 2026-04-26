import { House, Ticket, LayoutDashboard, ScanLine, Heart } from 'lucide-react';
import { AppView, WalletType } from '../../../types';
import { cn } from '../../../lib/utils';
import { Badge } from '../ui/Badge';

interface BottomNavProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  ticketCount: number;
  walletType: WalletType | null;
}

interface NavItem {
  view: AppView;
  icon: React.ElementType;
  label: string;
  badge?: number;
  showFor?: WalletType[];
}

export const BottomNav = ({ currentView, onNavigate, ticketCount, walletType }: BottomNavProps) => {
  const baseItems: NavItem[] = [
    { view: 'browse', icon: House, label: 'Home' },
    { view: 'my-tickets', icon: Ticket, label: 'Tickets', badge: ticketCount },
  ];

  const organizerItems: NavItem[] = [
    { view: 'organizer-dashboard', icon: LayoutDashboard, label: 'Dashboard', showFor: ['freighter'] },
    { view: 'scanner', icon: ScanLine, label: 'Scanner', showFor: ['freighter'] },
  ];

  const attendeeItems: NavItem[] = [
    { view: 'browse', icon: Heart, label: 'Saved', showFor: ['web3auth'] },
  ];

  const allItems = [...baseItems, ...organizerItems, ...attendeeItems];

  const visibleItems = allItems.filter((item) => {
    if (!item.showFor) return true;
    return walletType && item.showFor.includes(walletType);
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-40">
      <div className="flex items-center justify-around h-16">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge
                    variant="primary"
                    className="absolute -top-2 -right-2 h-4 min-w-4 px-1 flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
