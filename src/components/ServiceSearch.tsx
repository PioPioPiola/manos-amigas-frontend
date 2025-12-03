import { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Filter
} from 'lucide-react';
import { SearchFilters, DEFAULT_FILTERS, SORT_OPTIONS, SortOption } from '../types/SearchFilters';
import { SERVICE_CATEGORIES } from '../types/Service';

interface ServiceSearchProps {
  onSearch: (filters: SearchFilters) => void;
  resultCount?: number;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

const colombianCities = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué'];
const colombianDepartments = ['Todos', 'Antioquia', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Cundinamarca', 'Magdalena', 'Santander', 'Valle del Cauca'];

export default function ServiceSearch({
  onSearch,
  resultCount = 0,
  showFilters = false,
  onToggleFilters
}: ServiceSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularSearches = [
    'Plomería',
    'Limpieza del hogar',
    'Reparación de electrodomésticos',
    'Compra de mercado',
    'Acompañamiento médico',
    'Instalación eléctrica',
    'Pintura',
    'Carpintería'
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = popularSearches.filter(search =>
        search.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setFilters({ ...filters, query: value });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setFilters({ ...filters, query: suggestion });
    setShowSuggestions(false);
    onSearch({ ...filters, query: suggestion });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    const newFilters = {
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    };
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    onSearch(DEFAULT_FILTERS);
  };

  const handleApplyFilters = () => {
    onSearch(filters);
    setShowMobileFilters(false);
  };

  const activeFiltersCount =
    filters.categories.length +
    (filters.city && filters.city !== 'Todas' ? 1 : 0) +
    (filters.department && filters.department !== 'Todos' ? 1 : 0) +
    (filters.availableDate ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Categorías</h3>
          {filters.categories.length > 0 && (
            <button
              onClick={() => setFilters({ ...filters, categories: [] })}
              className="text-xs font-medium"
              style={{ color: '#7ECBF2' }}
            >
              Limpiar
            </button>
          )}
        </div>
        <div className="space-y-2">
          {SERVICE_CATEGORIES.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#7ECBF2' }}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {category.nombre}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Rango de Precio
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Mínimo: ${filters.priceRange.min.toLocaleString('es-CO')}
            </label>
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: '#7ECBF2' }}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Máximo: ${filters.priceRange.max.toLocaleString('es-CO')}
            </label>
            <input
              type="range"
              min="0"
              max="500000"
              step="10000"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: '#7ECBF2' }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
            <span>${filters.priceRange.min.toLocaleString('es-CO')}</span>
            <span>-</span>
            <span>${filters.priceRange.max.toLocaleString('es-CO')}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Ubicación
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Ciudad</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            >
              {colombianCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Departamento</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
            >
              {colombianDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Fecha Disponible
        </h3>
        <input
          type="date"
          value={filters.availableDate}
          onChange={(e) => setFilters({ ...filters, availableDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Calificación Mínima
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1, 0].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === rating}
                onChange={() => setFilters({ ...filters, minRating: rating })}
                className="w-4 h-4"
                style={{ accentColor: '#7ECBF2' }}
              />
              <div className="flex items-center gap-1">
                {rating > 0 ? (
                  <>
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-700 ml-1">y más</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-700">Todas</span>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Distancia Máxima
        </h3>
        <div>
          <label className="block text-xs text-gray-600 mb-2">
            {filters.distance} km
          </label>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={filters.distance}
            onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
            className="w-full"
            style={{ accentColor: '#7ECBF2' }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1 km</span>
            <span>100 km</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery.length > 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Buscar servicios: plomería, limpieza, reparaciones..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 text-sm"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                >
                  <Search className="inline w-4 h-4 mr-2 text-gray-400" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onToggleFilters?.()}
          className="lg:hidden px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          {activeFiltersCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: '#7ECBF2' }}
            >
              {activeFiltersCount}
            </span>
          )}
        </button>

        <button
          onClick={handleApplyFilters}
          className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm"
          style={{ backgroundColor: '#7ECBF2' }}
        >
          Buscar
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {resultCount} {resultCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: '#7ECBF2' }}
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Ordenar por:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => {
              const newFilters = { ...filters, sortBy: e.target.value as SortOption };
              setFilters(newFilters);
              onSearch(newFilters);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="hidden lg:block">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </h2>
              {activeFiltersCount > 0 && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: '#7ECBF2' }}
                >
                  {activeFiltersCount} activos
                </span>
              )}
            </div>
            <FiltersContent />
          </div>
        </div>
      )}

      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: '#7ECBF2' }}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <FiltersContent />
              </div>

              <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleApplyFilters}
                  className="w-full py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#7ECBF2' }}
                >
                  Aplicar filtros
                </button>
                <button
                  onClick={handleClearFilters}
                  className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Limpiar todo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
