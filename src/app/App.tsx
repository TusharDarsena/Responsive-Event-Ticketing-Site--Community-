import { useState, useEffect } from "react";
import { Header } from "./components/header";
import { EventCard } from "./components/event-card";
import { FiltersPanel } from "./components/filters-panel";
import { MobileNav } from "./components/mobile-nav";
import { EventDetail } from "./components/event-detail";
import { TicketPurchase } from "./components/ticket-purchase";
import { MyTickets } from "./components/my-tickets";
import { Favorites } from "./components/favorites";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import { Filter, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner@2.0.3";

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "Bad Bunny World Tour 2024",
    artist: "Bad Bunny",
    date: "2024-03-15",
    time: "21:00",
    venue: "Foro Sol",
    city: "Ciudad de México",
    category: "musica",
    image: "https://images.unsplash.com/photo-1681149341674-45fd772fd463?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHMlMjBtdXNpY3xlbnwxfHx8fDE3NTg4MjY0MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    priceFrom: 850,
    isFavorite: false,
    description: "El conejo malo llega a México con su espectacular tour mundial. Una noche inolvidable con los mejores éxitos del reggaetón.",
    address: "Av. Viaducto Río Becerra S/N, Granjas México",
    capacity: 65000,
    policies: [
      "Prohibido el ingreso de bebidas y alimentos",
      "Menores de edad deben ir acompañados de un adulto",
      "No se permiten cámaras profesionales",
      "Boletos no reembolsables"
    ],
    zones: [
      { id: "vip", name: "VIP", price: 2500, available: 50, total: 100 },
      { id: "campo", name: "Campo General", price: 850, available: 200, total: 500 },
      { id: "gradas", name: "Gradas", price: 650, available: 150, total: 300 }
    ]
  },
  {
    id: "2",
    title: "Corona Capital 2024",
    artist: "Varios artistas",
    date: "2024-11-16",
    time: "15:00",
    venue: "Autódromo Hermanos Rodríguez",
    city: "Ciudad de México",
    category: "festivales",
    image: "https://images.unsplash.com/photo-1737516671466-cf180633a3ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMGNyb3dkJTIwbWV4aWNvfGVufDF8fHx8MTc1ODg5ODAwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    priceFrom: 1200,
    isFavorite: true,
    description: "El festival de música más importante de México regresa con un line-up espectacular de artistas nacionales e internacionales.",
    address: "Av. del Conscripto 311, Lomas de Sotelo",
    capacity: 85000,
    policies: [
      "Festival de 2 días",
      "Re-entry permitido con sello",
      "Área de camping disponible",
      "Prohibido vidrio y latas"
    ],
    zones: [
      { id: "ga", name: "General", price: 1200, available: 1000, total: 2000 },
      { id: "vip", name: "VIP", price: 2800, available: 100, total: 200 }
    ]
  },
  {
    id: "3",
    title: "América vs Chivas",
    artist: "Liga MX",
    date: "2024-04-07",
    time: "19:00",
    venue: "Estadio Azteca",
    city: "Ciudad de México",
    category: "deportes",
    image: "https://images.unsplash.com/photo-1707798178440-84403072d249?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBtZXhpY298ZW58MXx8fHwxNTg4OTgwMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    priceFrom: 350,
    isFavorite: false,
    description: "El Clásico Nacional más esperado del año. América recibe a Chivas en el Coloso de Santa Úrsula.",
    address: "Calz. de Tlalpan 3465, Santa Úrsula Coapa",
    capacity: 87000,
    policies: [
      "Prohibido objetos punzocortantes",
      "No se permite el ingreso con playeras del equipo visitante en ciertas zonas",
      "Registro de seguridad obligatorio",
      "Venta de alcohol hasta el minuto 75"
    ],
    zones: [
      { id: "palco", name: "Palco", price: 1500, available: 20, total: 50 },
      { id: "preferente", name: "Preferente", price: 800, available: 100, total: 200 },
      { id: "general", name: "General", price: 350, available: 500, total: 1000 }
    ]
  },
  {
    id: "4",
    title: "Hamilton",
    artist: "Compañía de Broadway",
    date: "2024-05-20",
    time: "20:00",
    venue: "Teatro Telcel",
    city: "Ciudad de México",
    category: "teatro",
    image: "https://images.unsplash.com/photo-1539964604210-db87088e0c2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2UlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NTg4MTkxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    priceFrom: 900,
    isFavorite: true,
    description: "El musical que revolucionó Broadway llega a México. Una experiencia teatral única que no te puedes perder.",
    address: "Av. Chapultepec 18, Doctores",
    capacity: 1800,
    policies: [
      "Puntualidad estricta",
      "Prohibido el uso de celulares durante la función",
      "Dress code: casual elegante",
      "No hay intermedio"
    ],
    zones: [
      { id: "orchestra", name: "Orchestra", price: 2200, available: 15, total: 30 },
      { id: "mezzanine", name: "Mezzanine", price: 1500, available: 25, total: 50 },
      { id: "balcony", name: "Balcony", price: 900, available: 40, total: 80 }
    ]
  },
  {
    id: "5",
    title: "Franco Escamilla",
    artist: "Franco Escamilla",
    date: "2024-06-12",
    time: "21:30",
    venue: "Auditorio Nacional",
    city: "Ciudad de México",
    category: "comedia",
    image: "https://images.unsplash.com/photo-1618861297248-3438b3d9aae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzdGFuZCUyMHVwJTIwbWljcm9waG9uZXxlbnwxfHx8fDE3NTg4OTgwMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    priceFrom: 450,
    isFavorite: false,
    description: "El comediante mexicano más querido presenta su nuevo show. Prepárate para reír sin parar toda la noche.",
    address: "Av. Paseo de la Reforma 50, Bosque de Chapultepec",
    capacity: 10000,
    policies: [
      "Contenido para mayores de 18 años",
      "Prohibido grabar o tomar fotos",
      "Llega con tiempo, no hay tolerancia",
      "Show en español"
    ],
    zones: [
      { id: "luneta", name: "Luneta", price: 950, available: 80, total: 150 },
      { id: "primer-nivel", name: "Primer Nivel", price: 650, available: 120, total: 200 },
      { id: "segundo-nivel", name: "Segundo Nivel", price: 450, available: 200, total: 300 }
    ]
  }
];

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

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'favorites' | 'tickets' | 'event-detail' | 'purchase'>('home');
  const [selectedCity, setSelectedCity] = useState("Ciudad de México");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState({
    dateRange: ["", ""] as [string, string],
    timeSlot: "all",
    city: "Todas las ciudades",
    priceRange: [0, 5000] as [number, number],
    venue: "Todos los venues"
  });

  // Load favorites and tickets from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    const savedTickets = localStorage.getItem('myTickets');
    
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setEvents(prev => prev.map(event => ({
        ...event,
        isFavorite: favoriteIds.includes(event.id)
      })));
    }
    
    if (savedTickets) {
      setMyTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Save to localStorage when favorites change
  useEffect(() => {
    const favoriteIds = events.filter(event => event.isFavorite).map(event => event.id);
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  }, [events]);

  // Save to localStorage when tickets change
  useEffect(() => {
    localStorage.setItem('myTickets', JSON.stringify(myTickets));
  }, [myTickets]);

  const handleFavoriteToggle = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, isFavorite: !event.isFavorite }
        : event
    ));
    
    const event = events.find(e => e.id === eventId);
    if (event) {
      toast(event.isFavorite ? "Quitado de favoritos" : "Agregado a favoritos");
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
  };

  const handleBuyTickets = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('purchase');
  };

  const handlePurchaseComplete = (purchaseData: any) => {
    setMyTickets(prev => [...prev, { ...purchaseData, status: 'active' }]);
    toast("¡Compra realizada con éxito!");
    setCurrentView('tickets');
  };

  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!event.title.toLowerCase().includes(query) && 
          !event.artist.toLowerCase().includes(query) &&
          !event.venue.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== "all" && event.category !== selectedCategory) {
      return false;
    }

    // City filter
    if (selectedCity !== "Ciudad de México" && event.city !== selectedCity) {
      return false;
    }

    // Filters panel
    if (filters.city !== "Todas las ciudades" && event.city !== filters.city) {
      return false;
    }

    if (filters.venue !== "Todos los venues" && event.venue !== filters.venue) {
      return false;
    }

    if (filters.dateRange[0] && event.date < filters.dateRange[0]) {
      return false;
    }

    if (filters.dateRange[1] && event.date > filters.dateRange[1]) {
      return false;
    }

    if (event.priceFrom < filters.priceRange[0] || event.priceFrom > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  const favoriteEvents = events.filter(event => event.isFavorite);
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) {
      return value[0] !== "" || value[1] !== "" || (value[0] !== 0 || value[1] !== 5000);
    }
    return value !== "all" && value !== "Todas las ciudades" && value !== "Todos los venues";
  }).length;

  const clearFilters = () => {
    setFilters({
      dateRange: ["", ""],
      timeSlot: "all",
      city: "Todas las ciudades",
      priceRange: [0, 5000],
      venue: "Todos los venues"
    });
  };

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'event-detail':
        return selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onBack={() => setCurrentView('home')}
            onFavoriteToggle={handleFavoriteToggle}
            onBuyTickets={handleBuyTickets}
          />
        );
      
      case 'purchase':
        return selectedEvent && (
          <TicketPurchase
            event={selectedEvent}
            onBack={() => setCurrentView('event-detail')}
            onPurchaseComplete={handlePurchaseComplete}
          />
        );
      
      case 'favorites':
        return (
          <Favorites
            favorites={favoriteEvents}
            onRemoveFavorite={handleFavoriteToggle}
            onEventClick={handleEventClick}
          />
        );
      
      case 'tickets':
        return <MyTickets tickets={myTickets} />;
      
      default:
        return (
          <div className="min-h-screen bg-background">
            <Header
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            <main className="container mx-auto px-4 pb-20 md:pb-8">
              <div className="flex gap-6">
                {/* Desktop Filters Sidebar */}
                <div className="hidden lg:block w-80 shrink-0">
                  <div className="sticky top-24 bg-card rounded-lg border p-6">
                    <FiltersPanel
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClearFilters={clearFilters}
                      activeFiltersCount={activeFiltersCount}
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  {/* Mobile Filters */}
                  <div className="lg:hidden mb-6">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="w-full relative">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Filtros
                          {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {activeFiltersCount}
                            </span>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <SheetHeader>
                          <SheetTitle>Filtros</SheetTitle>
                          <SheetDescription>
                            Filtra eventos por fecha, ubicación, precio y más opciones.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          <FiltersPanel
                            filters={filters}
                            onFiltersChange={setFilters}
                            onClearFilters={clearFilters}
                            activeFiltersCount={activeFiltersCount}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Results */}
                  <div className="mb-4">
                    <p className="text-muted-foreground">
                      {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
                      {selectedCategory !== "all" && ` en ${selectedCategory}`}
                      {selectedCity !== "Ciudad de México" && ` en ${selectedCity}`}
                    </p>
                  </div>

                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-16">
                      <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No encontramos eventos con estos filtros</h3>
                      <p className="text-muted-foreground mb-6">
                        Intenta ajustar los filtros o buscar algo diferente
                      </p>
                      <Button onClick={clearFilters} variant="outline">
                        Borrar filtros
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          onFavoriteToggle={handleFavoriteToggle}
                          onClick={handleEventClick}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {renderContent()}
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNav
          currentView={currentView}
          onViewChange={setCurrentView}
          favoritesCount={favoriteEvents.length}
          ticketsCount={myTickets.length}
        />
      </div>
    </div>
  );
}