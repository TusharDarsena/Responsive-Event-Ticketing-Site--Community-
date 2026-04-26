import { Heart, Calendar, MapPin, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
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
}

interface FavoritesProps {
  favorites: Event[];
  onRemoveFavorite: (id: string) => void;
  onEventClick: (event: Event) => void;
}

export function Favorites({ favorites, onRemoveFavorite, onEventClick }: FavoritesProps) {
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
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

  const handleImageLoad = (eventId: string) => {
    setImageLoadStates(prev => ({ ...prev, [eventId]: true }));
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold mb-8">Mis favoritos</h1>
          
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">No tienes favoritos</h2>
              <p className="text-muted-foreground mb-6">
                Guarda eventos que te interesen para encontrarlos fácilmente más tarde.
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
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Mis favoritos</h1>
          <Badge variant="secondary">
            {favorites.length} evento{favorites.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all duration-200 cursor-pointer group">
              <CardContent className="p-0">
                <div onClick={() => onEventClick(event)}>
                  <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className={`object-cover w-full h-full transition-all duration-300 group-hover:scale-105 ${
                        imageLoadStates[event.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => handleImageLoad(event.id)}
                    />
                    {!imageLoadStates[event.id] && (
                      <div className="absolute inset-0 bg-muted animate-pulse" />
                    )}
                    
                    <div className="absolute top-3 left-3">
                      <Badge 
                        variant="secondary" 
                        className={`${getCategoryColor(event.category)} border backdrop-blur-sm`}
                      >
                        {event.category}
                      </Badge>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(event.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-white hover:text-red-500" />
                    </Button>
                  </AspectRatio>
                </div>

                <div className="p-4 space-y-3" onClick={() => onEventClick(event)}>
                  <div>
                    <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{event.artist}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.date)} • {event.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.venue} • {event.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Desde</p>
                      <p className="font-semibold text-primary">
                        ${event.priceFrom.toLocaleString('es-MX')}
                      </p>
                    </div>
                    
                    <Button size="sm" className="min-w-[120px]">
                      Comprar boletos
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