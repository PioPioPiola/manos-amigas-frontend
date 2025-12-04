import { useState, useEffect, useRef } from 'react';
import {
  Moon,
  User as UserIcon,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { User } from '../types/User';
import { adminService } from '../services/adminService';

interface AdminUserAccountsProps {
  user: User;
  onBackToHome: () => void;
  onLogout: () => void;
  onGoToLogin: () => void;
  onGoToDashboard: () => void;
  onGoToServiceSearch: () => void;
}

type AccountStatusFilter = 'all' | 'U' | 'V' | 'S';

export default function AdminUserAccounts({
  user,
  onBackToHome,
  onLogout,
  onGoToLogin,
  onGoToDashboard,
  onGoToServiceSearch
}: AdminUserAccountsProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AccountStatusFilter>('all');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const result = await adminService.fetchUsers(
        statusFilter === 'all' ? null : statusFilter
      );

      if (result.success && result.users) {
        setUsers(result.users);
        setCurrentPage(1);
      } else {
        showNotification(result.error || 'Error al cargar usuarios', 'error');
      }
    } catch (error) {
      showNotification('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (personId: string) => {
    try {
      const result = await adminService.updateAccountStatus(personId, 'V');

      if (result.success) {
        showNotification('Cuenta aprobada exitosamente', 'success');
        fetchUsers();
      } else {
        showNotification(result.error || 'Error al aprobar cuenta', 'error');
      }
    } catch (error) {
      showNotification('Error al aprobar cuenta', 'error');
    }
  };

  const handleSuspend = async (personId: string) => {
    if (window.confirm('¿Está seguro de que desea suspender esta cuenta?')) {
      try {
        const result = await adminService.updateAccountStatus(personId, 'S');

        if (result.success) {
          showNotification('Cuenta suspendida exitosamente', 'success');
          fetchUsers();
        } else {
          showNotification(result.error || 'Error al suspender cuenta', 'error');
        }
      } catch (error) {
        showNotification('Error al suspender cuenta', 'error');
      }
    }
  };

  const getRoleName = (rol: string) => {
    switch (rol) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'U':
        return {
          text: 'Pendiente',
          icon: Clock,
          bgColor: '#FEF3C7',
          textColor: '#92400E',
          iconColor: '#F59E0B'
        };
      case 'V':
        return {
          text: 'Verificado',
          icon: CheckCircle,
          bgColor: '#D1FAE5',
          textColor: '#065F46',
          iconColor: '#10B981'
        };
      case 'S':
        return {
          text: 'Suspendido',
          icon: XCircle,
          bgColor: '#FEE2E2',
          textColor: '#991B1B',
          iconColor: '#EF4444'
        };
      default:
        return {
          text: 'Desconocido',
          icon: AlertCircle,
          bgColor: '#F3F4F6',
          textColor: '#374151',
          iconColor: '#6B7280'
        };
    }
  };

  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const filterButtons: { label: string; value: AccountStatusFilter; count: number }[] = [
    { label: 'Todos', value: 'all', count: users.length },
    { label: 'Pendientes', value: 'U', count: users.filter(u => u.estado_cuenta === 'U').length },
    { label: 'Verificados', value: 'V', count: users.filter(u => u.estado_cuenta === 'V').length },
    { label: 'Suspendidos', value: 'S', count: users.filter(u => u.estado_cuenta === 'S').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className="px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]"
            style={{
              backgroundColor: notification.type === 'success' ? '#10B981' : '#EF4444',
              color: 'white'
            }}
          >
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img onClick={onBackToHome} src="/LogoColor.png" alt="ManosAmigas" className="h-10 w-10 cursor-pointer" />
                <span onClick={onBackToHome} className="text-xl font-semibold cursor-pointer" style={{ color: '#7ECBF2' }}>
                  ManosAmigas
                </span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <button onClick={onGoToServiceSearch} className="text-gray-600 hover:text-sky-400 transition-colors text-sm">
                  Buscar Servicios
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2" aria-label="Theme icon">
                <Moon className="w-5 h-5 text-gray-600" />
              </button>

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
                    <p className="text-sm font-semibold text-gray-700">{user.nombres}</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.nombres}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <span className="inline-block mt-2 px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#E8F4F8', color: '#5B9FC8' }}>
                        Administrador
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
            Volver al inicio
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8" style={{ color: '#7ECBF2' }} />
                Gestión de Cuentas de Usuario
              </h1>
              <p className="text-gray-600">
                Administra y modera las cuentas de usuario de la plataforma
              </p>
            </div>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Filtrar por estado</h2>
              </div>
              <span className="text-sm text-gray-600">
                {users.length} {users.length === 1 ? 'usuario encontrado' : 'usuarios encontrados'}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {filterButtons.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: statusFilter === filter.value ? '#E8F4F8' : 'transparent',
                    color: statusFilter === filter.value ? '#5B9FC8' : '#6B7280',
                    border: `1px solid ${statusFilter === filter.value ? '#7ECBF2' : '#E5E7EB'}`
                  }}
                >
                  {filter.label}
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: statusFilter === filter.value ? '#7ECBF2' : '#E5E7EB',
                      color: statusFilter === filter.value ? 'white' : '#6B7280'
                    }}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#7ECBF2' }}></div>
                <p className="mt-4 text-gray-600">Cargando usuarios...</p>
              </div>
            ) : paginatedUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">No se encontraron usuarios</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usuario</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Teléfono</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rol</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((userItem) => {
                        const statusBadge = getStatusBadge(userItem.estado_cuenta);
                        const StatusIcon = statusBadge.icon;

                        return (
                          <tr key={userItem.persona_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                                  style={{ backgroundColor: '#7ECBF2' }}
                                >
                                  {userItem.nombres.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {userItem.nombres} {userItem.apellidos}
                                  </p>
                                  <p className="text-xs text-gray-500">{userItem.numero_identificacion}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-gray-700">{userItem.email}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-gray-700">{userItem.telefono || 'N/A'}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{ backgroundColor: '#E8F4F8', color: '#5B9FC8' }}
                              >
                                {getRoleName(userItem.rol)}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"
                                style={{
                                  backgroundColor: statusBadge.bgColor,
                                  color: statusBadge.textColor
                                }}
                              >
                                <StatusIcon className="w-3 h-3" style={{ color: statusBadge.iconColor }} />
                                {statusBadge.text}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {userItem.estado_cuenta === 'U' ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApprove(userItem.persona_id)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-1"
                                    style={{ backgroundColor: '#10B981' }}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() => handleSuspend(userItem.persona_id)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-1"
                                    style={{ backgroundColor: '#EF4444' }}
                                  >
                                    <XCircle className="w-3 h-3" />
                                    Suspender
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Sin acciones disponibles</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
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

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Usuarios</p>
              <UserIcon className="w-5 h-5" style={{ color: '#7ECBF2' }} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pendientes</p>
              <Clock className="w-5 h-5" style={{ color: '#F59E0B' }} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.estado_cuenta === 'U').length}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Verificados</p>
              <CheckCircle className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.estado_cuenta === 'V').length}
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
