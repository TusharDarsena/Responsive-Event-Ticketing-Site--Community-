import { ArrowLeft, Heart, Share2, MapPin, Calendar, Clock, Users, CreditCard, Smartphone, Banknote } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { AspectRatio } from "./ui/aspect-ratio";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface Event {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  category: string;
  image: string;
  priceFrom: number;
  isFavorite: boolean;
  description: string;
  address: string;
  capacity: number;
  policies: string[];
  zones: Array<{
    id: string;
    name: string;
    price: number;
    available: number;
    total: number;
  }>;
}

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onFavoriteToggle: (id: string) => void;
  onBuyTickets: (event: Event) => void;
}

export function EventDetail({ event, onBack, onFavoriteToggle, onBuyTickets }: EventDetailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      musica: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      festivales: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      deportes: "bg-green-500/10 text-green-400 border-green-500/20",
      teatro: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      comedia: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const paymentMethods = [
    { name: "Tarjeta", icon: CreditCard },
    { name: "SPEI", icon: Smartphone },
    { name: "PayPal", icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onFavoriteToggle(event.id)}
            >
              <Heart 
                className={`h-5 w-5 ${
                  event.isFavorite 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-foreground'
                }`} 
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 md:pb-8">
        {/* Hero Image */}
        <div className="mb-6">
          <AspectRatio ratio={16 / 9} className="relative overflow-hidden rounded-lg">
            <ImageWithFallback
              src={event.image}
              alt={event.title}
              className={`object-cover w-full h-full transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
            )}
            
            <div className="absolute top-4 left-4">
              <Badge 
                variant="secondary" 
                className={`${getCategoryColor(event.category)} border backdrop-blur-sm`}
              >
                {event.category}
              </Badge>
            </div>
          </AspectRatio>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{event.artist}</p>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            {/* Date, Time, Location */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{formatDate(event.date)}</p>
                    <p className="text-sm text-muted-foreground">Fecha del evento</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{event.time}</p>
                    <p className="text-sm text-muted-foreground">Hora de inicio</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{event.venue}</p>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                    <p className="text-sm text-muted-foreground">{event.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Capacidad: {event.capacity.toLocaleString()} personas</p>
                    <p className="text-sm text-muted-foreground">Aforo total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Ubicación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                  <p className="text-muted-foreground">Mapa del venue</p>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle>Políticas del evento</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.policies.map((policy, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {policy}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Boletos disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {zone.available} de {zone.total} disponibles
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ${zone.price.toLocaleString('es-MX')}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                {/* Payment Methods */}
                <div>
                  <p className="text-sm font-medium mb-2">Métodos de pago</p>
                  <div className="flex gap-2">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <div key={method.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon className="h-3 w-3" />
                          <span>{method.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => onBuyTickets(event)}
                >
                  Comprar boletos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}