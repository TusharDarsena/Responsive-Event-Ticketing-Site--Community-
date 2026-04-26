import { useState } from 'react';
import { Frown } from 'lucide-react';
import { Event, WalletState } from '../../types';
import { EventCard } from '../components/events/EventCard';
import { Button } from '../components/ui/Button';
import { cn } from '../../lib/utils';

interface BrowsePageProps {
  events: Event[];
  onEventClick: (id: string) => void;
  walletState: WalletState;
}

const categories = ['All', 'Music', 'Sports', 'Theater', 'Comedy', 'Festivals'];

export const BrowsePage = ({ events, onEventClick, walletState }: BrowsePageProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredEvents = events.filter((event) => {
    if (activeCategory === 'All') return true;
    // For now, show all events for any category since we don't have category field
    return true;
  });

  return (
    <div>
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        {/* Category Filter */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                onClick={() => onEventClick(event.eventId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Frown className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters
            </p>
            <Button
              variant="outline"
              onClick={() => setActiveCategory('All')}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
