import { ArrowUpFromLine } from 'lucide-react';
import { Event, stroopsToXlm, formatEventDate } from '../../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface OrganizerEventRowProps {
  event: Event;
  onReleaseFunds: () => void;
}

export const OrganizerEventRow = ({ event, onReleaseFunds }: OrganizerEventRowProps) => {
  const soldPercentage = (event.currentSupply / event.capacity) * 100;
  const escrowAmount = stroopsToXlm(event.currentSupply * event.pricePerTicket);
  const currentTimestamp = Date.now() / 1000;
  const canReleaseFunds = currentTimestamp >= event.dateUnix && event.status === 'Active';

  const badgeVariant = {
    Active: 'success' as const,
    Cancelled: 'destructive' as const,
    Completed: 'default' as const,
  }[event.status];

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Left Block */}
        <div className="flex-1">
          <h3 className="font-semibold">{event.name}</h3>
          <div className="text-muted-foreground text-sm mt-0.5">
            {formatEventDate(event.dateUnix)}
          </div>
          {event.venue && (
            <div className="text-muted-foreground text-sm">
              {event.venue}
            </div>
          )}
        </div>

        {/* Center Block */}
        <div className="flex flex-col gap-1">
          <div className="text-sm">
            {event.currentSupply} / {event.capacity} sold
          </div>
          <div className="bg-secondary rounded-full h-1 w-32 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
          <Badge variant={badgeVariant} className="mt-1">
            {event.status}
          </Badge>
        </div>

        {/* Right Block */}
        <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
          <div className="text-right">
            <div className="font-bold text-primary text-sm">{escrowAmount} XLM</div>
            <div className="text-muted-foreground text-xs">in escrow</div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onReleaseFunds}
            disabled={!canReleaseFunds}
            className={
              canReleaseFunds
                ? 'bg-warning text-black hover:bg-warning/90'
                : 'cursor-not-allowed opacity-50'
            }
            title={
              !canReleaseFunds
                ? currentTimestamp < event.dateUnix
                  ? 'Available after event date'
                  : 'Event must be Active'
                : ''
            }
          >
            <ArrowUpFromLine className="h-4 w-4 mr-1" />
            Release Funds
          </Button>
        </div>
      </div>
    </div>
  );
};
