import { useState } from 'react';
import { Ticket as TicketIcon, Clock } from 'lucide-react';
import { Ticket, Event, WalletState, TxState } from '../../types';
import { TicketCard } from '../components/tickets/TicketCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { TxOverlay } from '../components/ui/TxOverlay';
import { cn } from '../../lib/utils';

interface MyTicketsPageProps {
  tickets: Ticket[];
  events: Event[];
  onShowQR: (ticketId: string) => void;
  onRefund: (ticketId: string) => void;
  onBrowseEvents: () => void;
  txState: TxState;
  walletState: WalletState;
}

export const MyTicketsPage = ({
  tickets,
  events,
  onShowQR,
  onRefund,
  onBrowseEvents,
  txState,
  walletState,
}: MyTicketsPageProps) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeTickets = tickets.filter((t) => t.status === 'Active');
  const historyTickets = tickets.filter((t) => t.status === 'Used' || t.status === 'Refunded');

  const displayTickets = activeTab === 'active' ? activeTickets : historyTickets;

  return (
    <div>
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-2xl font-bold">My Tickets</h1>
          <Badge variant="primary">{tickets.length}</Badge>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 border-b border-border mb-5">
          <button
            onClick={() => setActiveTab('active')}
            className={cn(
              'px-4 py-2 font-medium transition-colors relative',
              activeTab === 'active'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Active
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-4 py-2 font-medium transition-colors relative',
              activeTab === 'history'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            History
            {activeTab === 'history' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* Tickets List */}
        {displayTickets.length > 0 ? (
          <div className="flex flex-col gap-3">
            {displayTickets.map((ticket) => {
              const event = events.find((e) => e.eventId === ticket.eventId);
              return (
                <TicketCard
                  key={ticket.ticketId}
                  ticket={ticket}
                  event={event}
                  onShowQR={() => onShowQR(ticket.ticketId)}
                  onRefund={() => onRefund(ticket.ticketId)}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {activeTab === 'active' ? (
              <>
                <TicketIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No active tickets</h3>
                <p className="text-muted-foreground mb-4">
                  Browse events to buy tickets
                </p>
                <Button variant="primary" onClick={onBrowseEvents}>
                  Browse Events
                </Button>
              </>
            ) : (
              <>
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No ticket history</h3>
              </>
            )}
          </div>
        )}
      </div>

      <TxOverlay txState={txState} />
    </div>
  );
};
