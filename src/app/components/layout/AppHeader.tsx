import { useState } from 'react';
import { Ticket, Search, ChevronDown, Copy, LogOut } from 'lucide-react';
import { WalletState, WalletType, AppView, truncateKey } from '../../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { cn } from '../../../lib/utils';

interface AppHeaderProps {
  walletState: WalletState;
  onConnect: (type: WalletType) => void;
  onDisconnect: () => void;
  onNavigate: (view: AppView) => void;
}

export const AppHeader = ({ walletState, onConnect, onDisconnect, onNavigate }: AppHeaderProps) => {
  const [showConnectMenu, setShowConnectMenu] = useState(false);
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  const handleCopyAddress = () => {
    if (walletState.publicKey) {
      navigator.clipboard.writeText(walletState.publicKey);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border h-16">
      <div className="container mx-auto h-full flex items-center justify-between px-4 gap-4">
        {/* Left: Logo */}
        <button
          onClick={() => onNavigate('browse')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Ticket className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">StellarTickets</span>
        </button>

        {/* Center: Search (desktop only) */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right: Wallet */}
        <div className="relative">
          {!walletState.isConnected ? (
            <div>
              <Button onClick={() => setShowConnectMenu(!showConnectMenu)}>
                Connect Wallet
              </Button>
              {showConnectMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      onConnect('web3auth');
                      setShowConnectMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors"
                  >
                    <div className="font-medium">Attendee (Web3Auth)</div>
                    <div className="text-xs text-muted-foreground">Social login</div>
                  </button>
                  <button
                    onClick={() => {
                      onConnect('freighter');
                      setShowConnectMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors border-t border-border"
                  >
                    <div className="font-medium">Organizer (Freighter)</div>
                    <div className="text-xs text-muted-foreground">Browser extension</div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 bg-secondary rounded-full px-3 py-2 hover:bg-secondary/80 transition-colors"
              >
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm font-medium">
                  {truncateKey(walletState.publicKey!)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {walletState.xlmBalance} XLM
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showWalletMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      handleCopyAddress();
                      setShowWalletMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Address
                  </button>
                  <button
                    onClick={() => {
                      onDisconnect();
                      setShowWalletMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 border-t border-border text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
