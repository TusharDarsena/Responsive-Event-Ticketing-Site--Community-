import { useState } from 'react';
import { ChevronLeft, Music, MapPin, Calendar } from 'lucide-react';
import { WalletState, TxState } from '../../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { TxOverlay } from '../../components/ui/TxOverlay';

interface CreateEventPageProps {
  onBack: () => void;
  onSubmit: (data: any) => void;
  txState: TxState;
  walletState: WalletState;
}

export const CreateEventPage = ({ onBack, onSubmit, txState, walletState }: CreateEventPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    capacity: 0,
    priceXlm: 0,
    imageUrl: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' || name === 'priceXlm' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert priceXlm to stroops: × 10_000_000
    const submitData = {
      ...formData,
      pricePerTicket: Math.floor(formData.priceXlm * 10_000_000),
    };
    onSubmit(submitData);
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
          <h1 className="flex-1 font-semibold">Create Event</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Event Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Summer Music Festival 2026"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Date</label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Time</label>
              <Input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Venue</label>
            <Input
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Sunset Park Amphitheater"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">City</label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Los Angeles, CA"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Capacity</label>
              <Input
                type="number"
                name="capacity"
                value={formData.capacity || ''}
                onChange={handleChange}
                min={1}
                placeholder="1000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Price per Ticket (XLM)
              </label>
              <Input
                type="number"
                name="priceXlm"
                value={formData.priceXlm || ''}
                onChange={handleChange}
                min={0.01}
                step={0.01}
                placeholder="1.50"
                required
              />
              {/* × 10_000_000 = stroops on submit */}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Cover Image URL</label>
            <Input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="flex w-full bg-input border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={4}
              placeholder="Tell attendees about your event..."
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={txState.status !== 'idle'}
          >
            Create Event on Stellar
          </Button>

          <p className="text-muted-foreground text-xs text-center">
            Requires Freighter signature.
          </p>
        </form>

        {/* Live Preview */}
        <div>
          <h2 className="font-semibold mb-3">Preview</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Image Preview */}
            <div className="aspect-video relative overflow-hidden bg-secondary">
              {formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Music className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content Preview */}
            <div className="p-4">
              <h3 className="font-semibold text-base line-clamp-1">
                {formData.name || 'Event Name'}
              </h3>

              {(formData.venue || formData.city) && (
                <div className="text-muted-foreground text-sm mt-1 line-clamp-1">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {formData.venue && formData.city
                    ? `${formData.venue}, ${formData.city}`
                    : formData.venue || formData.city}
                </div>
              )}

              {formData.date && (
                <div className="text-muted-foreground text-sm mt-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {new Date(formData.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="font-bold text-primary text-lg">
                  {formData.priceXlm > 0 ? formData.priceXlm.toFixed(2) : '0.00'} XLM
                </div>
                <Button variant="primary" size="sm" disabled>
                  Get Tickets
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TxOverlay txState={txState} />
    </div>
  );
};
