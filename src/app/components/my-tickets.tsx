import { Calendar, MapPin, Download, Share2, QrCode } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface Ticket {
  orderNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  tickets: Array<{
    zoneId: string;
    zoneName: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  qrCode: string;
  purchaseDate: string;
  status: 'active' | 'used' | 'cancelled';
}

interface MyTicketsProps {
  tickets: Ticket[];
}

export function MyTickets({ tickets }: MyTicketsProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'used':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'used':
        return 'Usado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const addToCalendar = (ticket: Ticket) => {
    const startDate = new Date(`${ticket.eventDate}T${ticket.eventTime}`);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 3 hours duration
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const event = {
      title: `${ticket.eventTitle} - ${ticket.tickets.map(t => t.zoneName).join(', ')}`,
      start: formatDateForCalendar(startDate),
      end: formatDateForCalendar(endDate),
      location: ticket.venue,
      description: `Orden: ${ticket.orderNumber}\\nBoletos: ${ticket.tickets.map(t => `${t.quantity}x ${t.zoneName}`).join(', ')}`
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventosMX//EventosMX//ES
BEGIN:VEVENT
UID:${ticket.orderNumber}@eventosmx.com
DTSTAMP:${formatDateForCalendar(new Date())}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
LOCATION:${event.location}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ticket.eventTitle}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Mis boletos</h1>
          
          <Card>
            <CardContent className="p-8 text-center">
              <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">No tienes boletos</h2>
              <p className="text-muted-foreground mb-6">
                Cuando compres boletos, aparecerán aquí para que puedas acceder a ellos en cualquier momento.
              </p>
              <Button>Explorar eventos</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Mis boletos</h1>
        
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <Card key={ticket.orderNumber} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{ticket.eventTitle}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Orden #{ticket.orderNumber}
                      </p>
                    </div>
                    
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(ticket.status)} border`}
                    >
                      {getStatusLabel(ticket.status)}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(ticket.eventDate)} • {ticket.eventTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{ticket.venue}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {ticket.tickets.map((t, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{t.quantity}x {t.zoneName}</span>
                        <span>${(t.price * t.quantity).toLocaleString('es-MX')}</span>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Total pagado</span>
                      <span>${ticket.total.toLocaleString('es-MX')}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={ticket.status !== 'active'}>
                          <QrCode className="h-4 w-4 mr-2" />
                          Ver QR
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Código QR</DialogTitle>
                          <DialogDescription>
                            Presenta este código en la entrada del evento para acceder.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                            <div className="w-40 h-40 bg-black/10 rounded flex items-center justify-center">
                              <QrCode className="h-20 w-20 text-black/50" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            Código: {ticket.qrCode}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addToCalendar(ticket)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Calendario
                    </Button>

                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}