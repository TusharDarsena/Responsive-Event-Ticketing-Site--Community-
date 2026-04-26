import { useState } from 'react';
import {
  AppView,
  WalletState,
  WalletType,
  TxState,
  Event,
  Ticket,
} from '../types';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { TxOverlay } from './components/ui/TxOverlay';
import { LandingPage } from './pages/LandingPage';
import { BrowsePage } from './pages/BrowsePage';
import { EventDetailPage } from './pages/EventDetailPage';
import { PurchasePage } from './pages/PurchasePage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { QRDisplayPage } from './pages/QRDisplayPage';
import { DashboardPage } from './pages/organizer/DashboardPage';
import { CreateEventPage } from './pages/organizer/CreateEventPage';
import { ScannerPage } from './pages/ScannerPage';

// Mock Wallet States
const mockWalletConnected: WalletState = {
  isConnected: true,
  publicKey: 'GCEZDNQO6LFX5LFNMXJ7V2YPKD7DEMO',
  walletType: 'web3auth',
  xlmBalance: '5.25',
  displayName: 'Demo User',
  email: 'demo@example.com',
  avatarUrl: undefined,
};

const mockOrganizerWallet: WalletState = {
  isConnected: true,
  publicKey: 'GORG98765XYZ54321ABCD',
  walletType: 'freighter',
  xlmBalance: '5.25',
  displayName: undefined,
  email: undefined,
  avatarUrl: undefined,
};

// Mock Events
const mockEvents: Event[] = [
  {
    eventId: 'evt-001',
    organizer: 'GORG98765XYZ54321ABCD',
    name: 'Summer Music Festival 2026',
    dateUnix: Math.floor(new Date('2026-07-15').getTime() / 1000),
    capacity: 5000,
    pricePerTicket: 15000000, // 1.5 XLM
    currentSupply: 3420,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1759893025842-2b897398dfa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Join us for the biggest summer music festival featuring top artists from around the world.',
    venue: 'Sunset Park Amphitheater',
    city: 'Los Angeles, CA',
  },
  {
    eventId: 'evt-002',
    organizer: 'GORG98765XYZ54321ABCD',
    name: 'Electronic Beats Night',
    dateUnix: Math.floor(new Date('2026-05-20').getTime() / 1000),
    capacity: 2000,
    pricePerTicket: 8000000, // 0.8 XLM
    currentSupply: 1850,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1760965880280-0283c360759f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Experience the best electronic music with world-renowned DJs and producers.',
    venue: 'The Underground Club',
    city: 'Miami, FL',
  },
  {
    eventId: 'evt-003',
    organizer: 'GCYZ...M4NP',
    name: 'Indie Rock Showcase',
    dateUnix: Math.floor(new Date('2026-06-10').getTime() / 1000),
    capacity: 1500,
    pricePerTicket: 12000000, // 1.2 XLM
    currentSupply: 890,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1772582728668-619b2ad2c916?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Discover emerging indie rock bands in an intimate venue setting.',
    venue: 'Brooklyn Steel',
    city: 'Brooklyn, NY',
  },
  {
    eventId: 'evt-004',
    organizer: 'GDAB...R5ST',
    name: 'Jazz Under The Stars',
    dateUnix: Math.floor(new Date('2026-08-05').getTime() / 1000),
    capacity: 800,
    pricePerTicket: 20000000, // 2.0 XLM
    currentSupply: 520,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1720096322069-8d84365ef60a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'An elegant evening of smooth jazz under the stars with acclaimed performers.',
    venue: 'Rooftop Garden',
    city: 'San Francisco, CA',
  },
  {
    eventId: 'evt-005',
    organizer: 'GEBC...T6UV',
    name: 'Hip Hop Block Party',
    dateUnix: Math.floor(new Date('2026-09-12').getTime() / 1000),
    capacity: 3000,
    pricePerTicket: 10000000, // 1.0 XLM
    currentSupply: 2100,
    status: 'Active',
    imageUrl: 'https://images.unsplash.com/photo-1761959172946-d5a39aed82cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Classic hip hop vibes with legendary MCs and live graffiti art.',
    venue: 'Downtown Streets',
    city: 'Atlanta, GA',
  },
];

// Mock Tickets
const mockTickets: Ticket[] = [
  {
    ticketId: 'tkt-001',
    eventId: 'evt-001',
    owner: 'GABC...XYZ1',
    status: 'Active',
  },
  {
    ticketId: 'tkt-002',
    eventId: 'evt-003',
    owner: 'GABC...XYZ1',
    status: 'Used',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    walletType: null,
    xlmBalance: null,
  });
  const [txState, setTxState] = useState<TxState>({
    status: 'idle',
  });

  const navigate = (view: AppView) => {
    setCurrentView(view);
  };

  const handleConnect = (type: WalletType) => {
    if (type === 'web3auth') {
      setWalletState(mockWalletConnected);
    } else if (type === 'freighter') {
      setWalletState(mockOrganizerWallet);
    }
  };

  const handleDisconnect = () => {
    setWalletState({
      isConnected: false,
      publicKey: null,
      walletType: null,
      xlmBalance: null,
    });
    navigate('landing');
  };

  const handleEventClick = (id: string) => {
    setSelectedEventId(id);
    navigate('event-detail');
  };

  const handleBuyTickets = () => {
    navigate('purchase');
  };

  const handleBack = () => {
    switch (currentView) {
      case 'event-detail':
        navigate('browse');
        break;
      case 'purchase':
        navigate('event-detail');
        break;
      case 'qr-display':
        navigate('my-tickets');
        break;
      case 'organizer-create':
        navigate('organizer-dashboard');
        break;
      case 'organizer-dashboard':
        navigate('landing');
        break;
      case 'scanner':
        navigate('browse');
        break;
      default:
        navigate('landing');
    }
  };

  const handleConfirmPurchase = (qty: number) => {
    setTxState({ status: 'building' });
    setTimeout(() => setTxState({ status: 'signing' }), 1000);
    setTimeout(() => setTxState({ status: 'submitting' }), 2000);
    setTimeout(() => {
      setTxState({
        status: 'success',
        hash: 'purchase-' + Math.random().toString(36).substr(2, 9),
      });
      setTimeout(() => {
        setTxState({ status: 'idle' });
        navigate('my-tickets');
      }, 3000);
    }, 3500);
  };

  const handleReleaseFunds = (eventId: string) => {
    setTxState({ status: 'building' });
    setTimeout(() => setTxState({ status: 'signing' }), 1000);
    setTimeout(() => setTxState({ status: 'submitting' }), 2000);
    setTimeout(() => {
      setTxState({
        status: 'success',
        hash: 'release-funds-' + eventId,
      });
      setTimeout(() => {
        setTxState({ status: 'idle' });
      }, 3000);
    }, 3500);
  };

  const handleMarkUsed = (ticketId: string) => {
    setTxState({ status: 'building' });
    setTimeout(() => setTxState({ status: 'signing' }), 1000);
    setTimeout(() => setTxState({ status: 'submitting' }), 2000);
    setTimeout(() => {
      setTxState({
        status: 'success',
        hash: 'mark-used-' + ticketId,
      });
      setTimeout(() => {
        setTxState({ status: 'idle' });
      }, 3000);
    }, 3500);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onSelectAttendee={() => {
              handleConnect('web3auth');
              navigate('browse');
            }}
            onSelectOrganizer={() => {
              handleConnect('freighter');
              navigate('organizer-dashboard');
            }}
          />
        );

      case 'browse':
        return (
          <BrowsePage
            events={mockEvents}
            onEventClick={handleEventClick}
            walletState={walletState}
          />
        );

      case 'event-detail': {
        const selectedEvent = mockEvents.find((e) => e.eventId === selectedEventId);
        return selectedEvent ? (
          <EventDetailPage
            event={selectedEvent}
            onBack={handleBack}
            onBuyTickets={handleBuyTickets}
            walletState={walletState}
          />
        ) : null;
      }

      case 'purchase': {
        const selectedEvent = mockEvents.find((e) => e.eventId === selectedEventId);
        return selectedEvent ? (
          <PurchasePage
            event={selectedEvent}
            onBack={handleBack}
            onConfirm={handleConfirmPurchase}
            txState={txState}
            walletState={walletState}
          />
        ) : null;
      }

      case 'my-tickets':
        return (
          <MyTicketsPage
            tickets={mockTickets}
            events={mockEvents}
            onShowQR={(id) => {
              setSelectedTicketId(id);
              navigate('qr-display');
            }}
            onRefund={() => {}}
            onBrowseEvents={() => navigate('browse')}
            txState={txState}
            walletState={walletState}
          />
        );

      case 'qr-display': {
        const selectedTicket = mockTickets.find((t) => t.ticketId === selectedTicketId);
        const selectedEvent = selectedTicket
          ? mockEvents.find((e) => e.eventId === selectedTicket.eventId)
          : undefined;
        return selectedTicket ? (
          <QRDisplayPage
            ticket={selectedTicket}
            event={selectedEvent}
            walletState={walletState}
            onBack={handleBack}
          />
        ) : null;
      }

      case 'organizer-dashboard':
        return (
          <DashboardPage
            events={mockEvents}
            organizerPublicKey={walletState.publicKey ?? ''}
            onCreateEvent={() => navigate('organizer-create')}
            onBack={handleBack}
            onReleaseFunds={handleReleaseFunds}
            txState={txState}
            walletState={walletState}
          />
        );

      case 'organizer-create':
        return (
          <CreateEventPage
            onBack={handleBack}
            onSubmit={() => {}}
            txState={txState}
            walletState={walletState}
          />
        );

      case 'scanner':
        return (
          <ScannerPage
            onBack={handleBack}
            onMarkUsed={handleMarkUsed}
            txState={txState}
            walletState={walletState}
          />
        );

      default:
        return null;
    }
  };

  const showHeader = currentView !== 'landing' && currentView !== 'qr-display';
  const showBottomNav = currentView !== 'landing' && currentView !== 'qr-display';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {showHeader && (
        <AppHeader
          walletState={walletState}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onNavigate={navigate}
        />
      )}

      {renderView()}

      {showBottomNav && (
        <BottomNav
          currentView={currentView}
          onNavigate={navigate}
          ticketCount={mockTickets.length}
          walletType={walletState.walletType}
        />
      )}

      <TxOverlay txState={txState} onDismiss={() => setTxState({ status: 'idle' })} />
    </div>
  );
}
