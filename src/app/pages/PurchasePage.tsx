import { useState } from 'react';
import { ChevronLeft, Minus, Plus, Wallet } from 'lucide-react';
import { Event, WalletState, TxState, formatEventDate, stroopsToXlm, truncateKey } from '../../types';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { TxOverlay } from '../components/ui/TxOverlay';

interface PurchasePageProps {
  event: Event;
  onBack: () => void;
  onConfirm: (qty: number) => void;
  txState: TxState;
  walletState: WalletState;
}

export const PurchasePage = ({ event, onBack, onConfirm, txState, walletState }: PurchasePageProps) => {
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [quantity, setQuantity] = useState(1);

  const available = event.capacity - event.currentSupply;
  const pricePerTicket = event.pricePerTicket / 10_000_000;
  const total = pricePerTicket * quantity;

  const handleIncrement = () => {
    if (quantity < available) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
          <h1 className="flex-1 font-semibold">Buy Tickets</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-lg">
        {/* Event Summary */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
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
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold line-clamp-2">{event.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatEventDate(event.dateUnix)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {step === 'select' ? (
          <>
            {/* Quantity Selector */}
            <div className="flex flex-col items-center py-8">
              <p className="text-sm text-muted-foreground mb-6">Select quantity</p>
              <div className="flex items-center gap-6">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:hover:border-border transition-colors flex items-center justify-center"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="text-5xl font-bold w-20 text-center">
                  {quantity}
                </div>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= available}
                  className="w-12 h-12 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:hover:border-border transition-colors flex items-center justify-center"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <p className="text-muted-foreground text-sm text-center mt-4">
                {available} tickets available
              </p>
            </div>

            {/* Order Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {quantity} × Ticket{quantity > 1 ? 's' : ''}
                    </span>
                    <span>{pricePerTicket.toFixed(2)} XLM</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} XLM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setStep('confirm')}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            {/* Order Summary (Read-only) */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {quantity} × Ticket{quantity > 1 ? 's' : ''}
                    </span>
                    <span>{pricePerTicket.toFixed(2)} XLM</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{total.toFixed(2)} XLM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-4">
                  <Wallet className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">XLM from your Stellar wallet</div>
                    <div className="text-sm text-muted-foreground font-mono mt-1">
                      {walletState.publicKey ? truncateKey(walletState.publicKey) : ''}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs mt-4">
                  Held in escrow until after event. Refundable if cancelled.
                </p>
              </CardContent>
            </Card>

            <Button
              variant="primary"
              size="lg"
              className="w-full mb-3"
              onClick={() => onConfirm(quantity)}
            >
              Confirm & Pay {total.toFixed(2)} XLM
            </Button>

            <button
              onClick={() => setStep('select')}
              className="w-full text-center text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Go Back
            </button>
          </>
        )}
      </div>

      <TxOverlay txState={txState} />
    </div>
  );
};
