import { useState } from 'react';
import { Home } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (email: string, password: string) => Promise<void>;
  onGoToRegister: () => void;
  onBackToHome: () => void;
  isLoading?: boolean;
}

export default function Login({ onLoginSuccess, onGoToRegister, onBackToHome, isLoading = false }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberSession, setRememberSession] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email, password);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img
              src="/LogoColor.png"
              alt="ManosAmigas"
              className="h-24 w-24"
            />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar sesión</h1>
            <p className="text-gray-600">Accede a tu cuenta de ManosAmigas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-sky-400 focus:bg-white transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Recordar sesión</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm hover:underline"
                style={{ color: '#7ECBF2' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#0A2540' }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onGoToRegister}
                className="font-semibold hover:underline"
                style={{ color: '#7ECBF2' }}
              >
                Crear cuenta
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-semibold mb-2" style={{ color: '#2E4A73' }}>
              Información de prueba:
            </p>
            <p className="text-xs text-gray-600">
              Para probar la aplicación, primero crea una cuenta usando el formulario de registro.
            </p>
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4" style={{ color: '#2E4A73' }}>
              Recuperar contraseña
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Para recuperar tu contraseña, contacta con nuestro equipo de soporte a través de:
            </p>
            <div className="space-y-2 mb-6">
              <p className="text-sm">
                <span className="font-semibold">Email:</span> soporte@manosamigas.com
              </p>
              <p className="text-sm">
                <span className="font-semibold">Teléfono:</span> +1 (555) 123-4567
              </p>
            </div>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full py-3 rounded-lg font-semibold text-white"
              style={{ backgroundColor: '#0A2540' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <footer className="py-8 text-center text-xs text-gray-400 border-t">
        <p>&copy; 2024 ManosAmigas. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 mt-2">
          <a href="#" className="hover:text-gray-600">Términos</a>
          <a href="#" className="hover:text-gray-600">Privacidad</a>
          <a href="#" className="hover:text-gray-600">Cookies</a>
        </div>
      </footer>
    </div>
  );
}
