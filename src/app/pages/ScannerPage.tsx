import { useState } from 'react';
import { ChevronLeft, Camera, CheckCircle2, XCircle } from 'lucide-react';
import { WalletState, TxState, truncateKey } from '../../types';
import { Button } from '../components/ui/Button';
import { TxOverlay } from '../components/ui/TxOverlay';

interface ScannerPageProps {
  onBack: () => void;
  onMarkUsed: (ticketId: string) => void;
  txState: TxState;
  walletState: WalletState;
}

type ScanResult =
  | { verdict: 'valid'; ticketId: string; eventName: string; walletAddress: string }
  | { verdict: 'invalid_signature' }
  | { verdict: 'expired' }
  | { verdict: 'already_used' };

export const ScannerPage = ({ onBack, onMarkUsed, txState, walletState }: ScannerPageProps) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleDemoScan = (type: 'valid' | 'expired' | 'used') => {
    switch (type) {
      case 'valid':
        setScanResult({
          verdict: 'valid',
          ticketId: 'tkt-demo-001',
          eventName: 'Summer Music Festival 2026',
          walletAddress: 'GABC12345DEF67890GHIJ',
        });
        break;
      case 'expired':
        setScanResult({ verdict: 'expired' });
        break;
      case 'used':
        setScanResult({ verdict: 'already_used' });
        break;
    }
  };

  const handleAcceptValid = () => {
    if (scanResult && scanResult.verdict === 'valid') {
      onMarkUsed(scanResult.ticketId);
      setScanResult(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-16 z-30 bg-card border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={onBack}
            className="hover:bg-muted p-2 rounded-lg transition-colors -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="flex-1 font-semibold">Scanner</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-sm">
        {/* Camera Viewport */}
        <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden mb-4">
          {/* Camera Placeholder */}
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">Camera appears here</p>
          </div>

          {/* Corner Brackets Overlay */}
          {/* Top Left */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white" />
          {/* Top Right */}
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-white" />
          {/* Bottom Left */}
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-white" />
          {/* Bottom Right */}
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white" />
        </div>

        {/* Start Scanning Button */}
        <Button variant="primary" size="lg" className="w-full mb-4">
          Start Scanning
        </Button>

        {/* Demo Buttons */}
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" onClick={() => handleDemoScan('valid')}>
            ✓ Valid
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoScan('expired')}>
            ⏱ Expired
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleDemoScan('used')}>
            ✗ Used
          </Button>
        </div>
      </div>

      {/* Scan Result Overlay */}
      {scanResult !== null && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8">
          {scanResult.verdict === 'valid' ? (
            <div className="bg-success w-full h-full flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="h-24 w-24 text-white mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Entry Granted</h2>
              <p className="text-white/80 font-mono text-sm mb-1">
                {truncateKey(scanResult.walletAddress)}
              </p>
              <p className="text-white/80 text-lg mb-8">{scanResult.eventName}</p>
              <Button
                variant="outline"
                size="lg"
                onClick={handleAcceptValid}
                className="bg-white/20 border-white text-white hover:bg-white/30"
              >
                Scan Next
              </Button>
            </div>
          ) : (
            <div className="bg-destructive/95 w-full h-full flex flex-col items-center justify-center text-center">
              <XCircle className="h-24 w-24 text-white mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                {scanResult.verdict === 'invalid_signature'
                  ? 'Invalid Ticket'
                  : scanResult.verdict === 'expired'
                  ? 'QR Code Expired'
                  : 'Already Used'}
              </h2>
              <p className="text-white/80 mb-8">
                {scanResult.verdict === 'invalid_signature'
                  ? 'Signature verification failed'
                  : scanResult.verdict === 'expired'
                  ? 'Code has expired, ask attendee to refresh'
                  : 'This ticket was already scanned'}
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setScanResult(null)}
                className="bg-white/20 border-white text-white hover:bg-white/30"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}

      <TxOverlay txState={txState} />
    </div>
  );
};
