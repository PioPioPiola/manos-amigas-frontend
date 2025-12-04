import { useState, useEffect, useRef } from 'react';
import { Home, Grid, List, Star, MapPin, DollarSign, User as UserIcon, ArrowLeft, ChevronLeft, ChevronRight, LogOut, Settings, LayoutDashboard, ChevronDown, Moon } from 'lucide-react';
import { User } from '../types/User';
import ServiceSearch from '../components/ServiceSearch';
import { SearchFilters, ServiceSearchResult, DEFAULT_FILTERS } from '../types/SearchFilters';
import { SERVICE_CATEGORIES, PrestadorStats } from '../types/Service';

interface ServiceResultsProps {
  user: User;
  onBackToHome: () => void;
  onLogout: () => void;
  onGoToServiceSearch: () => void;
  onGoToDashboard: () => void;
  onGoToLogin: () => void;
  isLoggedIn: boolean;
}

export default function ServiceResults({ user, onBackToHome, onGoToLogin, isLoggedIn, onLogout, onGoToServiceSearch, onGoToDashboard }: ServiceResultsProps) {
  const [results, setResults] = useState<ServiceSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const resultsPerPage = 12;

  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<PrestadorStats>({
    servicios_completados: 45,
    calificacion_promedio: 4.8,
    ingresos_mes: 1250000,
    servicios_pendientes: 3,
    servicios_en_curso: 2
  });

  useEffect(() => {
    fetchResults(DEFAULT_FILTERS);
  }, []);

  const getRoleName = () => {
    if (!user) return '';
    return user.rol === '0' ? 'Solicitante' : 'Prestador';
  };

  const fetchResults = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResults: ServiceSearchResult[] = [
        {
          service_id: '1',
          titulo: 'Reparación de Plomería Profesional',
          descripcion: 'Servicio completo de plomería: reparación de fugas, instalación de tuberías, mantenimiento de baños y cocinas.',
          categoria: 'reparaciones',
          imagen_url: 'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Poblado, Medellín',
          ciudad: 'Medellín',
          departamento: 'Antioquia',
          precio_min: 50000,
          precio_max: 150000,
          calificacion_promedio: 4.8,
          total_calificaciones: 127,
          prestador_id: 'p1',
          prestador_nombre: 'Carlos Ramírez',
          distancia: 2.3,
          fecha_creacion: '2025-12-01'
        },
        {
          service_id: '2',
          titulo: 'Limpieza Profunda del Hogar',
          descripcion: 'Servicio de limpieza completa: pisos, baños, cocina, ventanas y organización general.',
          categoria: 'hogar',
          imagen_url: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Laureles, Medellín',
          ciudad: 'Medellín',
          departamento: 'Antioquia',
          precio_min: 80000,
          precio_max: 200000,
          calificacion_promedio: 5.0,
          total_calificaciones: 89,
          prestador_id: 'p2',
          prestador_nombre: 'María González',
          distancia: 3.5,
          fecha_creacion: '2025-12-02'
        },
        {
          service_id: '3',
          titulo: 'Acompañamiento a Citas Médicas',
          descripcion: 'Servicio de acompañamiento personalizado para citas médicas, trámites de salud y soporte durante procedimientos.',
          categoria: 'tramites',
          imagen_url: 'https://images.pexels.com/photos/5473184/pexels-photo-5473184.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Centro, Medellín',
          ciudad: 'Medellín',
          departamento: 'Antioquia',
          precio_min: 35000,
          precio_max: 80000,
          calificacion_promedio: 4.9,
          total_calificaciones: 156,
          prestador_id: 'p3',
          prestador_nombre: 'Ana López',
          distancia: 1.8,
          fecha_creacion: '2025-11-28'
        },
        {
          service_id: '4',
          titulo: 'Compra de Mercado y Mandados',
          descripcion: 'Realizo tus compras de mercado, medicamentos y cualquier diligencia que necesites.',
          categoria: 'compras',
          imagen_url: 'https://images.pexels.com/photos/5650026/pexels-photo-5650026.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Envigado, Antioquia',
          ciudad: 'Envigado',
          departamento: 'Antioquia',
          precio_min: 25000,
          precio_max: 60000,
          calificacion_promedio: 4.7,
          total_calificaciones: 234,
          prestador_id: 'p4',
          prestador_nombre: 'Pedro Martínez',
          distancia: 4.2,
          fecha_creacion: '2025-11-30'
        },
        {
          service_id: '5',
          titulo: 'Reparación de Electrodomésticos',
          descripcion: 'Especialista en reparación de lavadoras, neveras, estufas y otros electrodomésticos.',
          categoria: 'reparaciones',
          imagen_url: 'https://images.pexels.com/photos/4792285/pexels-photo-4792285.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Bello, Antioquia',
          ciudad: 'Bello',
          departamento: 'Antioquia',
          precio_min: 60000,
          precio_max: 180000,
          calificacion_promedio: 4.6,
          total_calificaciones: 98,
          prestador_id: 'p5',
          prestador_nombre: 'Jorge Silva',
          distancia: 5.7,
          fecha_creacion: '2025-11-25'
        },
        {
          service_id: '6',
          titulo: 'Apoyo Administrativo y Digital',
          descripcion: 'Ayuda con trámites digitales, organización de documentos, gestión de correos y tareas administrativas.',
          categoria: 'administrativo',
          imagen_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Sabaneta, Antioquia',
          ciudad: 'Sabaneta',
          departamento: 'Antioquia',
          precio_min: 40000,
          precio_max: 100000,
          calificacion_promedio: 4.8,
          total_calificaciones: 67,
          prestador_id: 'p6',
          prestador_nombre: 'Laura Hernández',
          distancia: 6.1,
          fecha_creacion: '2025-11-29'
        },
        {
          service_id: '7',
          titulo: 'Instalación Eléctrica y Mantenimiento',
          descripcion: 'Servicios eléctricos certificados: instalaciones, reparaciones, mantenimiento preventivo.',
          categoria: 'reparaciones',
          imagen_url: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Itagüí, Antioquia',
          ciudad: 'Itagüí',
          departamento: 'Antioquia',
          precio_min: 70000,
          precio_max: 200000,
          calificacion_promedio: 4.9,
          total_calificaciones: 143,
          prestador_id: 'p7',
          prestador_nombre: 'Roberto Díaz',
          distancia: 7.3,
          fecha_creacion: '2025-11-27'
        },
        {
          service_id: '8',
          titulo: 'Cuidado de Mascotas',
          descripcion: 'Paseos, alimentación, cuidado general y compañía para tus mascotas.',
          categoria: 'hogar',
          imagen_url: 'https://images.pexels.com/photos/4588435/pexels-photo-4588435.jpeg?auto=compress&cs=tinysrgb&w=400',
          ubicacion: 'Poblado, Medellín',
          ciudad: 'Medellín',
          departamento: 'Antioquia',
          precio_min: 30000,
          precio_max: 70000,
          calificacion_promedio: 5.0,
          total_calificaciones: 201,
          prestador_id: 'p8',
          prestador_nombre: 'Sandra Ruiz',
          distancia: 2.9,
          fecha_creacion: '2025-12-01'
        }
      ];

      let filteredResults = [...mockResults];

      if (filters.query) {
        filteredResults = filteredResults.filter(result =>
          result.titulo.toLowerCase().includes(filters.query.toLowerCase()) ||
          result.descripcion.toLowerCase().includes(filters.query.toLowerCase())
        );
      }

      if (filters.categories.length > 0) {
        filteredResults = filteredResults.filter(result =>
          filters.categories.includes(result.categoria)
        );
      }

      if (filters.city && filters.city !== 'Todas') {
        filteredResults = filteredResults.filter(result =>
          result.ciudad === filters.city
        );
      }

      if (filters.minRating > 0) {
        filteredResults = filteredResults.filter(result =>
          (result.calificacion_promedio || 0) >= filters.minRating
        );
      }

      filteredResults = filteredResults.filter(result =>
        (result.precio_min || 0) >= filters.priceRange.min &&
        (result.precio_max || 0) <= filters.priceRange.max
      );

      switch (filters.sortBy) {
        case 'price-asc':
          filteredResults.sort((a, b) => (a.precio_min || 0) - (b.precio_min || 0));
          break;
        case 'price-desc':
          filteredResults.sort((a, b) => (b.precio_max || 0) - (a.precio_max || 0));
          break;
        case 'rating':
          filteredResults.sort((a, b) => (b.calificacion_promedio || 0) - (a.calificacion_promedio || 0));
          break;
        case 'distance':
          filteredResults.sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
          break;
        case 'recent':
        default:
          filteredResults.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
      }

      setResults(filteredResults);
      setTotalPages(Math.ceil(filteredResults.length / resultsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    fetchResults(filters);
  };

  const getCategoryInfo = (categoryId: string) => {
    return SERVICE_CATEGORIES.find(cat => cat.id === categoryId) || SERVICE_CATEGORIES[0];
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const ServiceCard = ({ service, mode }: { service: ServiceSearchResult; mode: 'grid' | 'list' }) => {
    const category = getCategoryInfo(service.categoria);

    if (mode === 'list') {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all">
          <div className="flex gap-4">
            <div className="w-48 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {service.imagen_url ? (
                <img
                  src={service.imagen_url}
                  alt={service.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                  <span className="text-4xl">{category.icono === 'wrench' && '🔧'}</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{service.titulo}</h3>
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: category.color + '20', color: category.color }}
                  >
                    {category.nombre}
                  </span>
                </div>
                {service.calificacion_promedio && (
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {service.calificacion_promedio.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">({service.total_calificaciones})</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.descripcion}</p>

              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <UserIcon className="w-4 h-4" />
                  <span>{service.prestador_nombre}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{service.ubicacion}</span>
                </div>
                {service.distancia && (
                  <span className="text-xs">{service.distancia} km</span>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-5 h-5" style={{ color: '#7ECBF2' }} />
                  <span className="text-lg font-bold text-gray-900">
                    ${(service.precio_min || 0).toLocaleString('es-CO')}
                  </span>
                  {service.precio_max && service.precio_max !== service.precio_min && (
                    <span className="text-sm text-gray-500">
                      - ${service.precio_max.toLocaleString('es-CO')}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => isLoggedIn ? console.log('Ver detalles') : onGoToLogin()}
                  className="px-6 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity text-sm"
                  style={{ backgroundColor: '#7ECBF2' }}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
        <div className="relative h-48 bg-gray-100">
          {service.imagen_url ? (
            <img
              src={service.imagen_url}
              alt={service.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
              <span className="text-6xl">{category.icono === 'wrench' && '🔧'}</span>
            </div>
          )}
          {service.calificacion_promedio && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white px-2 py-1 rounded shadow">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-900">
                {service.calificacion_promedio.toFixed(1)}
              </span>
            </div>
          )}
          <span
            className="absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium"
            style={{ backgroundColor: category.color + '20', color: category.color }}
          >
            {category.nombre}
          </span>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{service.titulo}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.descripcion}</p>

          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              <span className="truncate">{service.prestador_nombre}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{service.ubicacion}</span>
              {service.distancia && (
                <span className="text-xs ml-auto">{service.distancia} km</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <DollarSign className="w-5 h-5" style={{ color: '#7ECBF2' }} />
              <span className="text-lg font-bold text-gray-900">
                ${(service.precio_min || 0).toLocaleString('es-CO')}
              </span>
              {service.precio_max && service.precio_max !== service.precio_min && (
                <span className="text-xs text-gray-500">+</span>
              )}
            </div>
            <button
              onClick={() => isLoggedIn ? console.log('Ver detalles') : onGoToLogin()}
              className="px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity text-sm"
              style={{ backgroundColor: '#7ECBF2' }}
            >
              Ver detalles
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <img onClick={onBackToHome} src="/LogoColor.png" alt="ManosAmigas" className="h-10 w-10" style={{ cursor: 'pointer' }}/>
                  <span onClick={onBackToHome} className="text-xl font-semibold" style={{ color: '#7ECBF2', cursor: 'pointer'}} >ManosAmigas</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <button onClick={onGoToServiceSearch} className="text-gray-600 hover:text-sky-400 transition-colors text-sm">
                    Buscar Servicios
                  </button>
                  <a href="#servicios" className="text-gray-600 hover:text-sky-400 transition-colors text-sm">
                    Categorías
                  </a>
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="p-2"
                  aria-label="Theme icon"
                >
                  <Moon className="w-5 h-5 text-gray-600" />
                </button>

                {user ? (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          background: 'linear-gradient(to bottom right, #7ECBF2, #5B9FC8)'
                        }}
                      >
                        {user.nombres.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-700">
                          {user.nombres}
                        </p>
                        <p className="text-xs text-gray-500">{getRoleName()}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-900">{user.nombres}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E8F4F8', color: '#5B9FC8' }}>
                            {getRoleName()}
                          </span>
                        </div>

                        <div className="py-2">
                          <button
                            onClick={() => {
                              onGoToDashboard();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" style={{ color: '#7ECBF2' }} />
                            Mi Dashboard
                          </button>

                          <button
                            onClick={() => setShowUserMenu(false)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings className="w-4 h-4" style={{ color: '#7ECBF2' }} />
                            Configuración
                          </button>
                        </div>

                        <div className="border-t border-gray-200 pt-2">
                          <button
                            onClick={() => {
                              onLogout();
                              setShowUserMenu(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <UserIcon className="w-5 h-5 text-gray-600" />
                    <button
                      onClick={onGoToLogin}
                      className="text-sm text-gray-700 hover:text-sky-400 transition-colors"
                    >
                      Iniciar sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buscar <span style={{ color: '#7ECBF2' }}>Servicios</span>
          </h1>
          <p className="text-gray-600">
            Encuentra el servicio que necesitas de forma rápida y segura
          </p>
        </div>

        <div className={`grid ${showFilters ? 'lg:grid-cols-4' : 'lg:grid-cols-1'} gap-8`}>
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ServiceSearch
                  onSearch={handleSearch}
                  resultCount={results.length}
                  showFilters={showFilters}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                />
              </div>
            </div>
          )}

          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-1'}>
            {!showFilters && (
              <div className="mb-6">
                <ServiceSearch
                  onSearch={handleSearch}
                  resultCount={results.length}
                  showFilters={showFilters}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                />
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  style={{ color: viewMode === 'grid' ? '#7ECBF2' : '#6B7280' }}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  style={{ color: viewMode === 'list' ? '#7ECBF2' : '#6B7280' }}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: '#7ECBF2' }}></div>
                <p className="text-gray-600">Buscando servicios...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F4F8' }}>
                  <MapPin className="w-12 h-12" style={{ color: '#7ECBF2' }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No se encontraron resultados</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Intenta ajustar tus filtros o realiza una nueva búsqueda
                </p>
                <button
                  onClick={() => handleSearch(DEFAULT_FILTERS)}
                  className="px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#7ECBF2' }}
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                  {paginatedResults.map((service) => (
                    <ServiceCard key={service.service_id} service={service} mode={viewMode} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                          currentPage === i + 1
                            ? 'text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        style={{
                          backgroundColor: currentPage === i + 1 ? '#7ECBF2' : 'transparent'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
