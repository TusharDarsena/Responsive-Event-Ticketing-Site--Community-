import { ArrowLeft, Minus, Plus, CreditCard, Smartphone, Banknote, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  zones: Array<{
    id: string;
    name: string;
    price: number;
    available: number;
    total: number;
  }>;
}

interface TicketPurchaseProps {
  event: Event;
  onBack: () => void;
  onPurchaseComplete: (purchaseData: any) => void;
}

interface TicketSelection {
  zoneId: string;
  zoneName: string;
  price: number;
  quantity: number;
}

export function TicketPurchase({ event, onBack, onPurchaseComplete }: TicketPurchaseProps) {
  const [step, setStep] = useState<'selection' | 'checkout' | 'confirmation'>('selection');
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [couponCode, setCouponCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const updateTicketQuantity = (zoneId: string, quantity: number) => {
    setSelectedTickets(prev => {
      const existing = prev.find(t => t.zoneId === zoneId);
      const zone = event.zones.find(z => z.id === zoneId);
      
      if (!zone) return prev;
      
      if (quantity === 0) {
        return prev.filter(t => t.zoneId !== zoneId);
      }
      
      if (existing) {
        return prev.map(t => 
          t.zoneId === zoneId 
            ? { ...t, quantity: Math.min(quantity, zone.available) }
            : t
        );
      } else {
        return [...prev, {
          zoneId,
          zoneName: zone.name,
          price: zone.price,
          quantity: Math.min(quantity, zone.available)
        }];
      }
    });
  };

  const getTicketQuantity = (zoneId: string) => {
    return selectedTickets.find(t => t.zoneId === zoneId)?.quantity || 0;
  };

  const subtotal = selectedTickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
  const serviceFee = Math.round(subtotal * 0.15);
  const taxes = Math.round(subtotal * 0.16);
  const total = subtotal + serviceFee + taxes;

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const purchaseData = {
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      venue: event.venue,
      tickets: selectedTickets,
      paymentMethod,
      total,
      orderNumber: Math.random().toString(36).substr(2, 8).toUpperCase(),
      qrCode: Math.random().toString(36).substr(2, 16),
      purchaseDate: new Date().toISOString()
    };
    
    setStep('confirmation');
    setIsProcessing(false);
    onPurchaseComplete(purchaseData);
  };

  const totalTickets = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">¡Compra exitosa!</h2>
            <p className="text-muted-foreground mb-6">
              Tus boletos han sido enviados a tu correo electrónico
            </p>
            <Button onClick={onBack} className="w-full">
              Ver mis boletos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">
            {step === 'selection' ? 'Seleccionar boletos' : 'Checkout'}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 md:pb-8">
        {/* Event Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="font-semibold">{event.title}</h2>
            <p className="text-sm text-muted-foreground">{event.artist}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(event.date).toLocaleDateString('es-MX')} • {event.time} • {event.venue}
            </p>
          </CardContent>
        </Card>

        {step === 'selection' && (
          <div className="space-y-6">
            {/* Zone Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Selecciona tus boletos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.zones.map((zone) => {
                  const quantity = getTicketQuantity(zone.id);
                  const isAvailable = zone.available > 0;
                  
                  return (
                    <div key={zone.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{zone.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${zone.price.toLocaleString('es-MX')} • {zone.available} disponibles
                        </p>
                      </div>
                      
                      {isAvailable ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateTicketQuantity(zone.id, Math.max(0, quantity - 1))}
                            disabled={quantity === 0}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="w-8 text-center">{quantity}</span>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateTicketQuantity(zone.id, quantity + 1)}
                            disabled={quantity >= zone.available}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary">Agotado</Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {selectedTickets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de compra</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedTickets.map((ticket) => (
                    <div key={ticket.zoneId} className="flex justify-between">
                      <span>{ticket.zoneName} x{ticket.quantity}</span>
                      <span>${(ticket.price * ticket.quantity).toLocaleString('es-MX')}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString('es-MX')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Comisión de servicio</span>
                    <span>${serviceFee.toLocaleString('es-MX')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Impuestos</span>
                    <span>${taxes.toLocaleString('es-MX')}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-MX')}</span>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => setStep('checkout')}
                    disabled={totalTickets === 0}
                  >
                    Continuar al pago ({totalTickets} boleto{totalTickets !== 1 ? 's' : ''})
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 'checkout' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Método de pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="h-4 w-4" />
                      <Label htmlFor="card">Tarjeta de crédito/débito</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="spei" id="spei" />
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="spei">SPEI</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Banknote className="h-4 w-4" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {paymentMethod === 'card' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información de la tarjeta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Vencimiento</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                      <Input id="cardName" placeholder="Juan Pérez" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+52 55 1234 5678" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTickets.map((ticket) => (
                    <div key={ticket.zoneId} className="flex justify-between">
                      <span className="text-sm">{ticket.zoneName} x{ticket.quantity}</span>
                      <span className="text-sm">${(ticket.price * ticket.quantity).toLocaleString('es-MX')}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString('es-MX')}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Comisión</span>
                      <span>${serviceFee.toLocaleString('es-MX')}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Impuestos</span>
                      <span>${taxes.toLocaleString('es-MX')}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toLocaleString('es-MX')}</span>
                  </div>

                  <div className="flex gap-2">
                    <Input 
                      placeholder="Código de cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      Aplicar
                    </Button>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handlePurchase}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Procesando...' : `Pagar $${total.toLocaleString('es-MX')}`}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Al completar tu compra aceptas nuestros términos y condiciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}