export interface SearchFilters {
  query: string;
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  city: string;
  department: string;
  availableDate: string;
  minRating: number;
  distance: number;
  sortBy: SortOption;
}

export type SortOption =
  | 'recent'
  | 'price-asc'
  | 'price-desc'
  | 'rating'
  | 'distance';

export interface ServiceSearchResult {
  service_id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagen_url?: string;
  ubicacion: string;
  ciudad: string;
  departamento: string;
  precio_min?: number;
  precio_max?: number;
  calificacion_promedio?: number;
  total_calificaciones?: number;
  prestador_id: string;
  prestador_nombre: string;
  prestador_avatar?: string;
  distancia?: number;
  fecha_creacion: string;
}

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  categories: [],
  priceRange: {
    min: 0,
    max: 500000
  },
  city: '',
  department: '',
  availableDate: '',
  minRating: 0,
  distance: 50,
  sortBy: 'recent'
};

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'distance', label: 'Más cercanos' }
] as const;
