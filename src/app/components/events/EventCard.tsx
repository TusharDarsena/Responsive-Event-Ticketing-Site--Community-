import { Music, MapPin, Calendar } from 'lucide-react';
import { Event, stroopsToXlm, formatEventDate } from '../../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../../lib/utils';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
  const ticketsLeft = event.capacity - event.currentSupply;

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all group w-full"
    >
      {/* Image Area */}
      <div className="aspect-video relative overflow-hidden bg-secondary">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Music className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Overlays */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
          {ticketsLeft} left
        </div>

        {event.status !== 'Active' && (
          <div className="absolute top-3 left-3">
            <Badge variant={event.status === 'Cancelled' ? 'destructive' : 'default'}>
              {event.status}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-1">{event.name}</h3>

        {(event.venue || event.city) && (
          <div className="text-muted-foreground text-sm mt-1 line-clamp-1">
            <MapPin className="h-3 w-3 inline mr-1" />
            {event.venue && event.city ? `${event.venue}, ${event.city}` : event.venue || event.city}
          </div>
        )}

        <div className="text-muted-foreground text-sm mt-1">
          <Calendar className="h-3 w-3 inline mr-1" />
          {formatEventDate(event.dateUnix)}
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-4">
          <div className="font-bold text-primary text-lg">
            {stroopsToXlm(event.pricePerTicket)} XLM
          </div>
          <Button variant="primary" size="sm" onClick={(e) => e.stopPropagation()}>
            Get Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};
