import { Calendar, MapPin, DollarSign, Building } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface FiltersProps {
  filters: {
    dateRange: [string, string];
    timeSlot: string;
    city: string;
    priceRange: [number, number];
    venue: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

const timeSlots = [
  { value: "all", label: "Cualquier hora" },
  { value: "morning", label: "Mañana (6:00 - 12:00)" },
  { value: "afternoon", label: "Tarde (12:00 - 18:00)" },
  { value: "evening", label: "Noche (18:00 - 24:00)" },
  { value: "late", label: "Madrugada (24:00 - 6:00)" },
];

const cities = [
  "Todas las ciudades",
  "Ciudad de México",
  "Guadalajara", 
  "Monterrey",
  "Puebla",
  "Tijuana",
  "León",
  "Mérida",
  "Cancún"
];

const venues = [
  "Todos los venues",
  "Foro Sol",
  "Auditorio Nacional",
  "Arena Ciudad de México", 
  "Teatro Metropolitan",
  "Lunario del Auditorio",
  "Plaza de la República",
  "Estadio Azteca",
  "Arena Monterrey",
  "Teatro Diana"
];

export function FiltersPanel({ filters, onFiltersChange, onClearFilters, activeFiltersCount }: FiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtros</h3>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} filtros
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Limpiar
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* Date Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label>Fechas</Label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Desde</Label>
            <Input
              type="date"
              value={filters.dateRange[0]}
              onChange={(e) => updateFilter('dateRange', [e.target.value, filters.dateRange[1]])}
              className="text-sm"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Hasta</Label>
            <Input
              type="date"
              value={filters.dateRange[1]}
              onChange={(e) => updateFilter('dateRange', [filters.dateRange[0], e.target.value])}
              className="text-sm"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Time Slot */}
      <div className="space-y-3">
        <Label>Hora del evento</Label>
        <Select value={filters.timeSlot} onValueChange={(value) => updateFilter('timeSlot', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* City */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label>Ciudad</Label>
        </div>
        <Select value={filters.city} onValueChange={(value) => updateFilter('city', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <Label>Rango de precio</Label>
        </div>
        <div className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatPrice(filters.priceRange[0])}</span>
            <span>{formatPrice(filters.priceRange[1])}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Venue */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <Label>Venue</Label>
        </div>
        <Select value={filters.venue} onValueChange={(value) => updateFilter('venue', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem key={venue} value={venue}>
                {venue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}