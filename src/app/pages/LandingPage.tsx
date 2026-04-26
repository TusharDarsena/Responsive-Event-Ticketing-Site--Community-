import { Ticket, Users, LayoutDashboard, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onSelectAttendee: () => void;
  onSelectOrganizer: () => void;
}

export const LandingPage = ({ onSelectAttendee, onSelectOrganizer }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Logo & Title */}
      <Ticket className="h-12 w-12 text-primary" />
      <h1 className="text-4xl font-bold text-center mt-4">StellarTickets</h1>
      <p className="text-muted-foreground text-center mt-2">
        NFT event tickets on the Stellar blockchain
      </p>

      {/* Selection Cards */}
      <div className="mt-12 w-full max-w-sm flex flex-col gap-4">
        {/* Attendee Card */}
        <div
          onClick={onSelectAttendee}
          className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-all active:scale-95 flex items-center gap-4"
        >
          <Users className="h-10 w-10 text-primary flex-shrink-0" />
          <div className="flex-1">
            <h2 className="font-semibold text-lg">I'm an Attendee</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Browse events, buy tickets with XLM
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Organizer Card */}
        <div
          onClick={onSelectOrganizer}
          className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:border-primary/50 transition-all active:scale-95 flex items-center gap-4"
        >
          <LayoutDashboard className="h-10 w-10 text-primary flex-shrink-0" />
          <div className="flex-1">
            <h2 className="font-semibold text-lg">I'm an Organizer</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Create events, manage sales, release funds
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-muted-foreground/40 text-xs text-center">
        Powered by Stellar · Soroban smart contracts
      </div>
    </div>
  );
};
