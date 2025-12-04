import { useState, useEffect, useRef } from 'react';
import { User } from '../types/User';
import { Service, SERVICE_CATEGORIES, PrestadorStats } from '../types/Service';
import {
  Moon,
  Plus,
  DollarSign,
  XCircle,
  PlayCircle,
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  ChevronRight,
  Menu,
  User as UserIcon,
  LayoutDashboard, Settings, LogOut, ChevronDown
} from 'lucide-react';

interface SolicitanteDashboardProps {
  user: User;
  onLogout: () => void;
  onCreateService: () => void;
  onBackToHome: () => void;
  onGoToServiceSearch: () => void;
  onGoToDashboard: () => void;
  onGoToLogin: () => void;
}

export default function SolicitanteDashboard({ user, onLogout, onBackToHome, onGoToServiceSearch, onGoToDashboard, onGoToLogin, onCreateService}: SolicitanteDashboardProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<PrestadorStats>({
    servicios_completados: 45,
    calificacion_promedio: 4.8,
    ingresos_mes: 1250000,
    servicios_pendientes: 3,
    servicios_en_curso: 2
  });
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'todas' | 'pendiente' | 'en_progreso' | 'completada'>('todas');

  useEffect(() => {
    fetchServices();
  }, []);

  const getRoleName = () => {
    if (!user) return '';
    switch (user.rol) {
      case '0':
        return 'Administrador';
      case '1':
        return 'Solicitante';
      case '2':
        return 'Prestador';
      default:
        return 'Usuario';
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const mockServices: Service[] = [
        {
          service_id: '1',
          titulo: 'Reparación de lavadora',
          descripcion: 'Necesito reparar mi lavadora que no está centrifugando',
          categoria: 'reparaciones',
          fecha_solicitada: '2025-12-05',
          hora_solicitada: '14:00',
          direccion: 'Calle 45 #23-67, Medellín',
          precio_estimado: 80000,
          estado: 'en_progreso',
          solicitante_id: user.persona_id,
          prestador_id: 'p1',
          prestador_nombre: 'Carlos Ramírez',
          prestador_calificacion: 4.8,
          fecha_creacion: '2025-12-03'
        },
        {
          service_id: '2',
          titulo: 'Compra de mercado',
          descripcion: 'Lista de mercado semanal en supermercado cercano',
          categoria: 'compras',
          fecha_solicitada: '2025-12-04',
          hora_solicitada: '10:00',
          direccion: 'Carrera 70 #52-10, Medellín',
          precio_estimado: 25000,
          estado: 'completada',
          solicitante_id: user.persona_id,
          prestador_id: 'p2',
          prestador_nombre: 'María González',
          prestador_calificacion: 5.0,
          fecha_creacion: '2025-12-02'
        },
        {
          service_id: '3',
          titulo: 'Acompañamiento a cita médica',
          descripcion: 'Necesito acompañamiento para ir al médico',
          categoria: 'tramites',
          fecha_solicitada: '2025-12-06',
          hora_solicitada: '09:00',
          direccion: 'Clínica Las Américas, Medellín',
          precio_estimado: 40000,
          estado: 'pendiente',
          solicitante_id: user.persona_id,
          fecha_creacion: '2025-12-03'
        }
      ];

      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'aceptada':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'en_progreso':
        return <PlayCircle className="w-5 h-5 text-purple-500" />;
      case 'completada':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelada':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pendiente: 'Pendiente',
      aceptada: 'Aceptada',
      en_progreso: 'En progreso',
      completada: 'Completada',
      cancelada: 'Cancelada'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return '#F59E0B';
      case 'aceptada':
        return '#3B82F6';
      case 'en_progreso':
        return '#8B5CF6';
      case 'completada':
        return '#10B981';
      case 'cancelada':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return SERVICE_CATEGORIES.find(cat => cat.id === categoryId) || SERVICE_CATEGORIES[0];
  };

  const filteredServices = services.filter(service => {
    if (activeFilter === 'todas') return true;
    return service.estado === activeFilter;
  });

  const recommendedCategories = SERVICE_CATEGORIES.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <img onClick={onBackToHome} src="/LogoColor.png" alt="ManosAmigas" className="h-10 w-10" style={{ cursor: 'pointer' }}/>
                  <span onClick={onBackToHome} className="text-xl font-semibold" style={{ color: '#7ECBF2', cursor: 'pointer' }}>ManosAmigas</span>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user.nombres}!
          </h1>
          <p className="text-gray-600">
            Gestiona tus servicios y solicitudes desde aquí
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Servicios Activos</p>
              <PlayCircle className="w-5 h-5" style={{ color: '#8B5CF6' }} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {services.filter(s => s.estado === 'en_progreso').length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pendientes</p>
              <Clock className="w-5 h-5" style={{ color: '#F59E0B' }} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {services.filter(s => s.estado === 'pendiente').length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Completados</p>
              <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {services.filter(s => s.estado === 'completada').length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Mis Solicitudes</h2>
              <div className="flex gap-2">
                {(['todas', 'pendiente', 'en_progreso', 'completada'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: activeFilter === filter ? '#E8F4F8' : 'transparent',
                      color: activeFilter === filter ? '#5B9FC8' : '#6B7280'
                    }}
                  >
                    {filter === 'todas' ? 'Todas' : getStatusText(filter)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#7ECBF2' }}></div>
                <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600 mb-4">No tienes solicitudes {activeFilter !== 'todas' ? `en estado ${getStatusText(activeFilter)}` : ''}</p>
                <button
                  onClick={onCreateService}
                  className="px-6 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#7ECBF2' }}
                >
                  Crear primera solicitud
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4">
                {filteredServices.map((service) => {
                  const category = getCategoryInfo(service.categoria);
                  return (
                    <div
                      key={service.service_id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{service.titulo}</h3>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                              style={{
                                backgroundColor: getStatusColor(service.estado) + '20',
                                color: getStatusColor(service.estado)
                              }}
                            >
                              {getStatusIcon(service.estado)}
                              {getStatusText(service.estado)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={{ backgroundColor: category.color + '20', color: category.color }}
                            >
                              {category.nombre}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.descripcion}</p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(service.fecha_solicitada).toLocaleDateString('es-CO')}</span>
                        </div>
                        {service.hora_solicitada && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{service.hora_solicitada}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{service.direccion}</span>
                        </div>
                      </div>

                      {service.prestador_nombre && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <p className="text-xs text-gray-500 mb-1">Prestador asignado</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                style={{ backgroundColor: '#7ECBF2' }}
                              >
                                {service.prestador_nombre.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{service.prestador_nombre}</p>
                                {service.prestador_calificacion && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{service.prestador_calificacion}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                              <Phone className="w-4 h-4" style={{ color: '#7ECBF2' }} />
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {service.estado === 'pendiente' && (
                          <>
                            <button className="flex-1 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                              Editar
                            </button>
                            <button className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#EF4444' }}>
                              Cancelar
                            </button>
                          </>
                        )}
                        {service.estado === 'en_progreso' && (
                          <>
                            <button className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ backgroundColor: '#7ECBF2' }}>
                              <MessageCircle className="w-4 h-4" />
                              Chat
                            </button>
                            <button className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                              Ver detalles
                            </button>
                          </>
                        )}
                        {service.estado === 'completada' && (
                          <>
                            <button className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#7ECBF2' }}>
                              Calificar servicio
                            </button>
                            <button className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                              Ver detalles
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Servicios Recomendados</h2>
            <button className="text-sm font-semibold flex items-center gap-1" style={{ color: '#7ECBF2' }}>
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recommendedCategories.map((category) => (
              <div
                key={category.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <div className="w-6 h-6" style={{ color: category.color }}>
                    <span className="text-2xl">
                      {category.icono === 'wrench' && '🔧'}
                      {category.icono === 'home' && '🏠'}
                      {category.icono === 'users' && '👥'}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.nombre}</h3>
                <p className="text-sm text-gray-600 mb-4">{category.descripcion}</p>
                <button
                  onClick={onCreateService}
                  className="w-full py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#E8F4F8', color: '#5B9FC8' }}
                >
                  Solicitar ahora
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <button
        onClick={onCreateService}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
        style={{ backgroundColor: '#7ECBF2' }}
        aria-label="Solicitar nuevo servicio"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
