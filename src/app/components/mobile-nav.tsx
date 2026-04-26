import { Home, Search, Heart, Ticket } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface MobileNavProps {
  currentView: string;
  onViewChange: (view: string) => void;
  favoritesCount: number;
  ticketsCount: number;
}

export function MobileNav({ currentView, onViewChange, favoritesCount, ticketsCount }: MobileNavProps) {
  const navItems = [
    {
      id: "home",
      label: "Inicio",
      icon: Home,
      count: 0
    },
    {
      id: "search",
      label: "Buscar",
      icon: Search,
      count: 0
    },
    {
      id: "favorites",
      label: "Favoritos",
      icon: Heart,
      count: favoritesCount
    },
    {
      id: "tickets",
      label: "Boletos",
      icon: Ticket,
      count: ticketsCount
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onViewChange(item.id)}
              className={`h-full rounded-none flex flex-col gap-1 relative ${
                isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] min-w-4"
                  >
                    {item.count > 99 ? '99+' : item.count}
                  </Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}