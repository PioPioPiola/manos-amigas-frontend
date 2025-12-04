import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Pending from './pages/Pending';
import SolicitanteDashboard from './pages/SolicitanteDashboard';
import PrestadorDashboard from './pages/PrestadorDashboard';
import ServiceResults from './pages/ServiceResults';
import AdminUserAccounts from './pages/AdminUserAccounts';
import { User, RegisterFormData } from './types/User';
import { authService } from './services/authService';
type ViewType = 'home' | 'login' | 'register' | 'pending' | 'solicitanteDashboard' | 'prestadorDashboard' | 'serviceResults' | 'adminDashboard';
function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [user, setUser] = useState<User | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
        if (result.user.estado_cuenta === 'U') {
          setCurrentView('pending');
          showNotification('Tu cuenta está pendiente de verificación', 'error');
        } else if (result.user.rol === '0') {
          setCurrentView('adminDashboard');
          showNotification(`¡Bienvenido de nuevo, ${result.user.nombres}!`, 'success');
        } else {
          setCurrentView('home');
          showNotification(`¡Bienvenido de nuevo, ${result.user.nombres}!`, 'success');
        }
      } else {
        showNotification(result.error || 'Error al iniciar sesión', 'error');
      }
    } catch (error) {
      showNotification('Error al iniciar sesión', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    if (user) {
      if (user.rol === '0') {
        setCurrentView('adminDashboard');
      } else if (user.rol === '1') {
        setCurrentView('solicitanteDashboard');
      } else if (user.rol === '2') {
        setCurrentView('prestadorDashboard');
      }
    }
  };
  
  const handleRegister = async (userData: RegisterFormData) => {
    setIsLoading(true);
    try {
      const result = await authService.register(userData);
      if (result.success && result.user) {
        setUser(result.user);
        setCurrentView('pending');
        showNotification(`¡Registro exitoso! Tu cuenta está en proceso de verificación`, 'success');
      } else {
        showNotification(result.error || 'Error al registrar usuario', 'error');
      }
    } catch (error) {
      showNotification('Error al registrar usuario', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    showNotification('Sesión cerrada correctamente', 'success');
  };
  const handleCreateService = () => {
    showNotification('Funcionalidad de crear servicio próximamente', 'success');
  };
  const handleGoToLogin = () => {
    setCurrentView('login');
  };
  const handleGoToRegister = () => {
    setCurrentView('register');
  };
  const handleBackToHome = () => {
    setCurrentView('home');
  };
  const handleGoToServiceSearch = () => {
    setCurrentView('serviceResults');
  };
  return (
<div className="relative">
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
  {currentView === 'home' && (
    <Homepage
      user={user}
      onGoToLogin={handleGoToLogin}
      onLogout={handleLogout}
      onGoToServiceSearch={handleGoToServiceSearch}
      onGoToDashboard={handleGoToDashboard}
      onBackToHome={handleBackToHome}
    />
  )}
      {currentView === 'login' && (
<Login
          onLoginSuccess={handleLogin}
          onGoToRegister={handleGoToRegister}
          onBackToHome={handleBackToHome}
          isLoading={isLoading}
        />
      )}
      {currentView === 'register' && (
<Register
          onRegister={handleRegister}
          onBackToLogin={() => setCurrentView('login')}
          isLoading={isLoading}
        />
      )}
      {currentView === 'pending' && (
<Pending onBackToHome={handleBackToHome} />
      )}
      {currentView === 'solicitanteDashboard' && user && (
<SolicitanteDashboard
          user={user}
          onLogout={handleLogout}
          onCreateService={handleCreateService}
          onBackToHome={handleBackToHome}
          onGoToServiceSearch={handleGoToServiceSearch}
          onGoToDashboard={handleGoToDashboard}
          onGoToLogin={handleGoToLogin}
        />
      )}
      {currentView === 'prestadorDashboard' && user && (
<PrestadorDashboard
          user={user}
          onLogout={handleLogout}
          onBackToHome={handleBackToHome}
          onGoToServiceSearch={handleGoToServiceSearch}
          onGoToDashboard={handleGoToDashboard}
          onGoToLogin={handleGoToLogin}
        />
      )}
      {currentView === 'serviceResults' && user && (
<ServiceResults
          user={user}
          onLogout={handleLogout}
          onBackToHome={handleBackToHome}
          onGoToServiceSearch={handleGoToServiceSearch}
          onGoToDashboard={handleGoToDashboard}
          onGoToLogin={handleGoToLogin}
          isLoggedIn={!!user}
        />
      )}
      {currentView === 'adminDashboard' && user && (
<AdminUserAccounts
          user={user}
          onBackToHome={handleBackToHome}
          onLogout={handleLogout}
          onGoToLogin={handleGoToLogin}
          onGoToDashboard={handleGoToDashboard}
          onGoToServiceSearch={handleGoToServiceSearch}
        />
      )}
</div>
  );
}
export default App;