import { Ticket, Event } from '../../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatEventDate } from '../../../types';
import { cn } from '../../../lib/utils';

interface TicketCardProps {
  ticket: Ticket;
  event: Event | undefined;
  onShowQR: () => void;
  onRefund: () => void;
}

export const TicketCard = ({ ticket, event, onShowQR, onRefund }: TicketCardProps) => {
  const accentColor = {
    Active: 'bg-primary',
    Used: 'bg-muted-foreground',
    Refunded: 'bg-destructive',
  }[ticket.status];

  const badgeVariant = {
    Active: 'success' as const,
    Used: 'default' as const,
    Refunded: 'destructive' as const,
  }[ticket.status];

  const showActions = ticket.status === 'Active';
  const showRefund = ticket.status === 'Active' && event?.status === 'Cancelled';

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col md:flex-row">
      {/* Accent Bar */}
      <div className={cn('w-1.5 flex-shrink-0 md:w-1.5 h-full', accentColor)} />

      {/* Content */}
      <div className="p-4 flex-1">
        <h3 className="font-semibold">{event?.name || 'Unknown Event'}</h3>

        {event && (
          <div className="text-muted-foreground text-sm mt-0.5">
            {formatEventDate(event.dateUnix)}
            {event.venue && ` • ${event.venue}`}
          </div>
        )}

        <div className="font-mono text-xs text-muted-foreground/60 mt-1">
          {ticket.ticketId}
        </div>

        {/* Status Badge */}
        <div className="mt-2">
          <Badge variant={badgeVariant}>{ticket.status}</Badge>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="mt-3 flex flex-col md:flex-row gap-2">
            <Button variant="primary" size="sm" onClick={onShowQR} className="w-full md:w-auto">
              Show QR
            </Button>
            {showRefund && (
              <Button variant="outline" size="sm" onClick={onRefund} className="w-full md:w-auto">
                Request Refund
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
