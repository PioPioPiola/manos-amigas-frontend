import { useState, useEffect, useRef } from 'react';
import { User } from '../types/User';
import { Service, PrestadorStats } from '../types/Service';
import {
  Moon,
  Shield,
  DollarSign,
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

interface PrestadorDashboardProps {
  user: User;
  onGoToLogin: () => void;
  onLogout: () => void;
  onGoToServiceSearch: () => void;
  onGoToDashboard: () => void;
  onBackToHome: () => void;
}

export default function PrestadorDashboard({ user, onLogout, onBackToHome, onGoToServiceSearch, onGoToDashboard, onGoToLogin }: PrestadorDashboardProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<PrestadorStats>({
    servicios_completados: 45,
    calificacion_promedio: 4.8,
    ingresos_mes: 1250000,
    servicios_pendientes: 3,
    servicios_en_curso: 2
  });

  const [pendingServices, setPendingServices] = useState<Service[]>([]);
  const [activeServices, setActiveServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'pendientes' | 'activos' | 'calendario'>('pendientes');

  useEffect(() => {
    fetchServices();
  }, []);

  const getRoleName = () => {
    if (!user) return '';
    return user.rol === '0' ? 'Solicitante' : 'Prestador';
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const mockPendingServices: Service[] = [
        {
          service_id: '1',
          titulo: 'Limpieza profunda de apartamento',
          descripcion: 'Apartamento de 3 habitaciones que necesita limpieza completa',
          categoria: 'hogar',
          fecha_solicitada: '2025-12-05',
          hora_solicitada: '08:00',
          direccion: 'Calle 10 #45-23, Poblado, Medellín',
          precio_estimado: 120000,
          estado: 'pendiente',
          solicitante_id: 's1',
          solicitante_nombre: 'Ana María López',
          solicitante_telefono: '+57 300 123 4567',
          fecha_creacion: '2025-12-03'
        },
        {
          service_id: '2',
          titulo: 'Reparación de tubería',
          descripcion: 'Fuga en tubería de cocina, urgente',
          categoria: 'reparaciones',
          fecha_solicitada: '2025-12-04',
          hora_solicitada: '14:00',
          direccion: 'Carrera 43A #12-56, Laureles, Medellín',
          precio_estimado: 80000,
          estado: 'pendiente',
          solicitante_id: 's2',
          solicitante_nombre: 'Pedro Gómez',
          solicitante_telefono: '+57 310 987 6543',
          fecha_creacion: '2025-12-03'
        },
        {
          service_id: '3',
          titulo: 'Acompañamiento a cita bancaria',
          descripcion: 'Necesito ayuda para abrir cuenta de ahorros',
          categoria: 'tramites',
          fecha_solicitada: '2025-12-06',
          hora_solicitada: '10:00',
          direccion: 'Banco Popular, Centro, Medellín',
          precio_estimado: 35000,
          estado: 'pendiente',
          solicitante_id: 's3',
          solicitante_nombre: 'Rosa Martínez',
          solicitante_telefono: '+57 320 456 7890',
          fecha_creacion: '2025-12-03'
        }
      ];

      const mockActiveServices: Service[] = [
        {
          service_id: '4',
          titulo: 'Compra de mercado semanal',
          descripcion: 'Lista de mercado en Éxito del Centro',
          categoria: 'compras',
          fecha_solicitada: '2025-12-03',
          hora_solicitada: '15:00',
          direccion: 'Centro Comercial El Tesoro, Medellín',
          precio_estimado: 30000,
          estado: 'en_progreso',
          solicitante_id: 's4',
          solicitante_nombre: 'Luis Hernández',
          solicitante_telefono: '+57 315 234 5678',
          prestador_id: user.persona_id,
          fecha_creacion: '2025-12-03'
        },
        {
          service_id: '5',
          titulo: 'Instalación de cortinas',
          descripcion: '4 cortinas en sala y habitaciones',
          categoria: 'reparaciones',
          fecha_solicitada: '2025-12-03',
          hora_solicitada: '11:00',
          direccion: 'Calle 30 #70-15, Belén, Medellín',
          precio_estimado: 65000,
          estado: 'en_progreso',
          solicitante_id: 's5',
          solicitante_nombre: 'Carmen Silva',
          solicitante_telefono: '+57 318 765 4321',
          prestador_id: user.persona_id,
          fecha_creacion: '2025-12-02'
        }
      ];

      setPendingServices(mockPendingServices);
      setActiveServices(mockActiveServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptService = (serviceId: string) => {
    console.log('Accepting service:', serviceId);
  };

  const handleRejectService = (serviceId: string) => {
    console.log('Rejecting service:', serviceId);
  };

  const handleCompleteService = (serviceId: string) => {
    console.log('Completing service:', serviceId);
  };

  const monthlyEarnings = [
    { mes: 'Jun', ingresos: 950000 },
    { mes: 'Jul', ingresos: 1100000 },
    { mes: 'Ago', ingresos: 1050000 },
    { mes: 'Sep', ingresos: 1200000 },
    { mes: 'Oct', ingresos: 1180000 },
    { mes: 'Nov', ingresos: 1250000 },
  ];

  const maxEarnings = Math.max(...monthlyEarnings.map(m => m.ingresos));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <img onClick={onBackToHome} src="/LogoColor.png" alt="ManosAmigas" className="h-10 w-10" style={{ cursor: 'pointer' }}/>
                  <span onClick={onBackToHome} className="text-xl font-semibold" style={{ color: '#7ECBF2' , cursor: 'pointer'}}>ManosAmigas</span>
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
            ¡Bienvenido, {user.nombres}!
          </h1>
          <p className="text-gray-600">
            Panel de control de prestador de servicios
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Servicios Completados</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.servicios_completados}</p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12% vs mes anterior
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Calificación</p>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.calificacion_promedio}</p>
            <p className="text-xs text-gray-500">De 127 calificaciones</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Ingresos del Mes</p>
              <DollarSign className="w-5 h-5" style={{ color: '#7ECBF2' }} />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${(stats.ingresos_mes / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8% vs mes anterior
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pendientes</p>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.servicios_pendientes}</p>
            <p className="text-xs text-gray-500">{stats.servicios_en_curso} en curso</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedView('pendientes')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: selectedView === 'pendientes' ? '#E8F4F8' : 'transparent',
                      color: selectedView === 'pendientes' ? '#5B9FC8' : '#6B7280'
                    }}
                  >
                    Pendientes ({pendingServices.length})
                  </button>
                  <button
                    onClick={() => setSelectedView('activos')}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: selectedView === 'activos' ? '#E8F4F8' : 'transparent',
                      color: selectedView === 'activos' ? '#5B9FC8' : '#6B7280'
                    }}
                  >
                    En Curso ({activeServices.length})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#7ECBF2' }}></div>
                    <p className="mt-4 text-gray-600">Cargando servicios...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedView === 'pendientes' && pendingServices.length === 0 && (
                      <div className="text-center py-12">
                        <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-600">No hay solicitudes pendientes</p>
                      </div>
                    )}

                    {selectedView === 'pendientes' && pendingServices.map((service) => (
                      <div
                        key={service.service_id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{service.titulo}</h3>
                            <p className="text-sm text-gray-600 mb-3">{service.descripcion}</p>
                          </div>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: '#7ECBF2' + '20', color: '#7ECBF2' }}
                          >
                            ${(service.precio_estimado! / 1000).toFixed(0)}K
                          </span>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <p className="text-xs font-semibold mb-2" style={{ color: '#5B9FC8' }}>Información del cliente</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                style={{ backgroundColor: '#7ECBF2' }}
                              >
                                {service.solicitante_nombre?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{service.solicitante_nombre}</p>
                                <p className="text-xs text-gray-500">{service.solicitante_telefono}</p>
                              </div>
                            </div>
                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                              <Phone className="w-4 h-4" style={{ color: '#7ECBF2' }} />
                            </button>
                          </div>
                        </div>

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

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptService(service.service_id)}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#10B981' }}
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => handleRejectService(service.service_id)}
                            className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                            style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
                          >
                            Rechazar
                          </button>
                          <button className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                            Ver más
                          </button>
                        </div>
                      </div>
                    ))}

                    {selectedView === 'activos' && activeServices.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-600">No tienes servicios en curso</p>
                      </div>
                    )}

                    {selectedView === 'activos' && activeServices.map((service) => (
                      <div
                        key={service.service_id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{service.titulo}</h3>
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                En curso
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{service.descripcion}</p>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4" style={{ color: '#7ECBF2' }} />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{service.solicitante_nombre}</p>
                                <p className="text-xs text-gray-500">{service.solicitante_telefono}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                <Phone className="w-4 h-4" style={{ color: '#7ECBF2' }} />
                              </button>
                              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                <MessageCircle className="w-4 h-4" style={{ color: '#7ECBF2' }} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{service.direccion}</span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCompleteService(service.service_id)}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#7ECBF2' }}
                          >
                            Marcar como completado
                          </button>
                          <button className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Ingresos Mensuales</h3>
                <button className="text-sm font-semibold" style={{ color: '#7ECBF2' }}>
                  Ver más
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {monthlyEarnings.slice(-3).map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{item.mes}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${(item.ingresos / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.ingresos / maxEarnings) * 100}%`,
                          backgroundColor: '#7ECBF2'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total acumulado</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${(monthlyEarnings.reduce((acc, m) => acc + m.ingresos, 0) / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Disponibilidad</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Lunes - Viernes</span>
                  <span className="text-sm font-semibold text-gray-900">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Sábados</span>
                  <span className="text-sm font-semibold text-gray-900">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">Domingos</span>
                  <span className="text-sm font-semibold text-red-600">No disponible</span>
                </div>
              </div>

              <button className="w-full py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#E8F4F8', color: '#5B9FC8' }}>
                Editar disponibilidad
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
              <Star className="w-10 h-10 text-yellow-400 fill-yellow-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">¡Excelente trabajo!</h3>
              <p className="text-sm text-gray-600 mb-4">
                Has completado 45 servicios con una calificación promedio de 4.8. ¡Sigue así!
              </p>
              <button className="w-full py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#7ECBF2' }}>
                Ver estadísticas completas
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
