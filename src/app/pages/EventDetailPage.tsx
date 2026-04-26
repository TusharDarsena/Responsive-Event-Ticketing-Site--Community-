import { ChevronLeft, Share2, Calendar, Clock, MapPin, Users, Key, Shield, Zap, RefreshCw } from 'lucide-react';
import { Event, WalletState, formatEventDate } from '../../types';
import { Button } from '../components/ui/Button';
import { cn } from '../../lib/utils';

interface EventDetailPageProps {
  event: Event;
  onBack: () => void;
  onBuyTickets: () => void;
  walletState: WalletState;
}

export const EventDetailPage = ({ event, onBack, onBuyTickets, walletState }: EventDetailPageProps) => {
  const soldPercentage = (event.currentSupply / event.capacity) * 100;
  const isSoldOut = event.currentSupply >= event.capacity;
  const isCancelled = event.status === 'Cancelled';

  // Derive time from dateUnix
  const eventDate = new Date(event.dateUnix * 1000);
  const eventTime = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-16 z-30 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            className="hover:bg-muted p-2 rounded-lg transition-colors -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 font-semibold truncate">{event.name}</h1>
          <button className="hover:bg-muted p-2 rounded-lg transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-video bg-secondary">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-secondary" />
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold">{event.name}</h1>

            <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm font-mono">
              <Key className="h-3 w-3" />
              {event.organizer}
            </div>

            {/* Info Grid */}
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{formatEventDate(event.dateUnix)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-medium">{eventTime}</div>
                </div>
              </div>

              {(event.venue || event.city) && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium">
                      {event.venue && event.city
                        ? `${event.venue}, ${event.city}`
                        : event.venue || event.city}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Attendance</div>
                  <div className="font-medium">
                    {event.currentSupply}/{event.capacity} sold
                  </div>
                  <div className="bg-secondary rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${soldPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mt-6">
                <h2 className="font-semibold text-lg mb-2">About this event</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Purchase Card */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-card border border-primary/20 rounded-2xl p-6 lg:sticky lg:top-20">
              <div className="text-4xl font-bold text-primary">
                {(event.pricePerTicket / 10_000_000).toFixed(2)} XLM
              </div>
              <div className="text-muted-foreground text-sm">per ticket</div>

              <div className="text-sm text-muted-foreground mt-4">
                {event.capacity - event.currentSupply} tickets remaining
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full mt-6"
                onClick={onBuyTickets}
                disabled={isSoldOut || isCancelled}
              >
                {isCancelled ? 'Cancelled' : isSoldOut ? 'Sold Out' : 'Buy Ticket'}
              </Button>

              {/* Trust Badges */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Shield className="h-3 w-3" />
                  On-chain
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Zap className="h-3 w-3" />
                  Instant
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                  <RefreshCw className="h-3 w-3" />
                  Refundable
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
