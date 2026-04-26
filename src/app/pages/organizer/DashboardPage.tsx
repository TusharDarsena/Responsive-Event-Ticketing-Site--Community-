import { Plus, CalendarX } from 'lucide-react';
import { Event, WalletState, TxState, stroopsToXlm } from '../../../types';
import { Button } from '../../components/ui/Button';
import { TxOverlay } from '../../components/ui/TxOverlay';
import { OrganizerEventRow } from '../../components/organizer/OrganizerEventRow';

interface DashboardPageProps {
  events: Event[];
  organizerPublicKey: string;
  onCreateEvent: () => void;
  onBack: () => void;
  onReleaseFunds: (eventId: string) => void;
  txState: TxState;
  walletState: WalletState;
}

export const DashboardPage = ({
  events,
  organizerPublicKey,
  onCreateEvent,
  onBack,
  onReleaseFunds,
  txState,
  walletState,
}: DashboardPageProps) => {
  const organizerEvents = events.filter((e) => e.organizer === organizerPublicKey);

  const totalEvents = organizerEvents.length;
  const totalTicketsSold = organizerEvents.reduce((sum, e) => sum + e.currentSupply, 0);
  const totalEscrowXlm = organizerEvents.reduce((sum, e) => {
    return sum + parseFloat(stroopsToXlm(e.currentSupply * e.pricePerTicket));
  }, 0);

  return (
    <div>
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="primary" size="sm" onClick={onCreateEvent}>
            <Plus className="h-4 w-4 mr-1" />
            Create Event
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{totalEvents}</div>
            <div className="text-muted-foreground text-xs">Events</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{totalTicketsSold}</div>
            <div className="text-muted-foreground text-xs">Tickets Sold</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{totalEscrowXlm.toFixed(2)}</div>
            <div className="text-muted-foreground text-xs">In Escrow XLM</div>
          </div>
        </div>

        {/* Events List */}
        {organizerEvents.length > 0 ? (
          <div className="flex flex-col gap-3">
            {organizerEvents.map((event) => (
              <OrganizerEventRow
                key={event.eventId}
                event={event}
                onReleaseFunds={() => onReleaseFunds(event.eventId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first event to get started
            </p>
            <Button variant="primary" onClick={onCreateEvent}>
              Create Your First Event
            </Button>
          </div>
        )}
      </div>

      <TxOverlay txState={txState} />
    </div>
  );
};
