import { useState, useEffect } from 'react';
import { ChevronLeft, XCircle, Ban, Lock, RefreshCw } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Ticket, Event, WalletState, formatEventDate } from '../../types';
import { Button } from '../components/ui/Button';

interface QRDisplayPageProps {
  ticket: Ticket;
  event: Event | undefined;
  walletState: WalletState;
  onBack: () => void;
}

export const QRDisplayPage = ({ ticket, event, walletState, onBack }: QRDisplayPageProps) => {
  const [countdown, setCountdown] = useState(30);
  const [qrKey, setQrKey] = useState(0);

  useEffect(() => {
    if (ticket.status !== 'Active') return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setQrKey((k) => k + 1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket.status]);

  // Used ticket state
  if (ticket.status === 'Used') {
    return (
      <div className="fixed inset-0 bg-red-950 z-40 flex flex-col items-center justify-center px-6">
        <XCircle className="h-24 w-24 text-destructive" />
        <h1 className="text-2xl font-bold text-white mt-4">Ticket Already Used</h1>
        <p className="text-white/60 text-sm mt-2 text-center">
          This ticket was scanned at the venue
        </p>
        <Button variant="outline" className="mt-6" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );
  }

  // Refunded ticket state
  if (ticket.status === 'Refunded') {
    return (
      <div className="fixed inset-0 bg-neutral-900 z-40 flex flex-col items-center justify-center px-6">
        <Ban className="h-24 w-24 text-destructive" />
        <h1 className="text-2xl font-bold text-white mt-4">Ticket Refunded</h1>
        <p className="text-white/60 text-sm mt-2 text-center">
          Your XLM was returned when the event was cancelled.
        </p>
        <Button variant="outline" className="mt-6" onClick={onBack}>
          Go Back
        </Button>
      </div>
    );
  }

  // Active ticket - QR display
  // TODO: replace value with signed payload from lib/qr.ts
  const qrValue = `${walletState.publicKey}:${ticket.ticketId}:${Math.floor(Date.now() / 1000)}`;

  return (
    <div className="fixed inset-0 bg-black z-40 flex flex-col">
      {/* Top Zone */}
      <div className="px-6 pt-10 pb-4 flex items-center relative">
        <ChevronLeft
          className="h-6 w-6 text-white cursor-pointer absolute left-6"
          onClick={onBack}
        />
        <div className="w-full text-center">
          <div className="text-white font-semibold">
            {event?.name || 'Unknown Event'}
          </div>
          {event && (
            <div className="text-white/60 text-sm mt-1">
              {formatEventDate(event.dateUnix)}
            </div>
          )}
        </div>
      </div>

      {/* Middle Zone - QR Code */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-64 h-64 bg-white rounded-2xl p-4 flex items-center justify-center shadow-2xl shadow-primary/20">
          <QRCodeCanvas
            key={qrKey}
            value={qrValue}
            size={220}
            bgColor="#ffffff"
            fgColor="#0E1113"
          />
        </div>

        {/* Countdown Pill */}
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5 text-white/50 animate-spin" />
          <span className="text-white/70 font-mono text-sm">
            Refreshes in {countdown}s
          </span>
        </div>
      </div>

      {/* Bottom Zone */}
      <div className="px-6 pb-12 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5 text-white/30 text-xs">
          <Lock className="h-3.5 w-3.5" />
          Signed with your wallet key
        </div>
        <div className="font-mono text-white/25 text-xs">
          {walletState.publicKey
            ? `${walletState.publicKey.slice(0, 4)}...${walletState.publicKey.slice(-4)}`
            : ''}
        </div>
      </div>
    </div>
  );
};
