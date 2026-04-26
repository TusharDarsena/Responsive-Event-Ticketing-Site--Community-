import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { TxState } from '../../../types';
import { Card, CardContent } from './Card';
import { Button } from './Button';

interface TxOverlayProps {
  txState: TxState;
  onDismiss?: () => void;
}

export const TxOverlay = ({ txState, onDismiss }: TxOverlayProps) => {
  if (txState.status === 'idle') return null;

  const isProcessing = ['building', 'signing', 'submitting'].includes(txState.status);
  const isSuccess = txState.status === 'success';
  const isError = txState.status === 'error';

  const statusMessages = {
    building: 'Building transaction...',
    signing: 'Waiting for signature...',
    submitting: 'Submitting to Stellar...',
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            {isProcessing && (
              <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {statusMessages[txState.status as keyof typeof statusMessages]}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Do not close this page
                  </p>
                </div>
              </>
            )}

            {isSuccess && (
              <>
                <CheckCircle2 className="h-12 w-12 text-success" />
                <div>
                  <h3 className="text-lg font-semibold text-success">Confirmed</h3>
                  {txState.hash && (
                    <p className="text-xs font-mono text-muted-foreground mt-2 break-all">
                      {txState.hash}
                    </p>
                  )}
                </div>
              </>
            )}

            {isError && (
              <>
                <XCircle className="h-12 w-12 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold text-destructive">Transaction Failed</h3>
                  {txState.errorMessage && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {txState.errorMessage}
                    </p>
                  )}
                </div>
                {onDismiss && (
                  <Button onClick={onDismiss} variant="outline" className="mt-4">
                    Dismiss
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
