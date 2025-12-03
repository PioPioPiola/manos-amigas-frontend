import { Moon, Clock, Shield, MapPin, User as UserIcon } from 'lucide-react';
import { User } from '../types/User';
import ServicesCarousel from './ServicesCarousel';

interface HomepageProps {
  user: User | null;
  onGoToLogin: () => void;
  onLogout: () => void;
  onGoToServiceSearch: () => void;
}

export default function Homepage({ user, onGoToLogin, onLogout, onGoToServiceSearch }: HomepageProps) {

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <img src="/LogoColor.png" alt="ManosAmigas" className="h-10 w-10" />
                  <span className="text-xl font-semibold" style={{ color: '#7ECBF2' }}>ManosAmigas</span>
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                        style={{
                          background: 'linear-gradient(to bottom right, #7ECBF2, #5B9FC8)'
                        }}
                      >
                        {user.nombres.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700 hidden md:block">
                        Hola, {user.nombres}
                      </span>
                    </div>
                    <button
                      onClick={onLogout}
                      className="text-sm text-gray-600 hover:text-sky-400 transition-colors"
                    >
                      Cerrar sesión
                    </button>
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

      <main>
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #E8F4F8, white)' }}>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Tu oportunidad de ayudar{' '}
                  <span style={{ color: '#7ECBF2' }}>comienza aquí</span>
                </h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Este es el medio para brindar tus servicios a quienes lo necesiten y apoyar a prestadores, mientras recibes esa ayuda que tanto estabas esperando...
                  </p>

                <div className="flex flex-wrap gap-6 mb-8 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2" style={{ color: '#7ECBF2' }} />
                    Puntualidad en los servicios
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Shield className="w-5 h-5 mr-2" style={{ color: '#7ECBF2' }} />
                    100% Seguro
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2" style={{ color: '#7ECBF2' }} />
                    Cobertura total
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button onClick={onGoToServiceSearch} className="text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all text-sm" style={{ backgroundColor: '#7ECBF2' } }>
                    Buscar servicios ahora →
                  </button>
                  <button onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 rounded-lg font-semibold hover:bg-sky-50 transition-colors text-sm" style={{ border: '1px solid #7ECBF2', color: '#7ECBF2' }}>
                    Ver categorías
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-200">
                  <div>
                    <div className="text-3xl font-bold" style={{ color: '#7ECBF2' }}>2M+</div>
                    <div className="text-sm text-gray-600 mt-1">Servicios realizados</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: '#7ECBF2' }}>50K+</div>
                    <div className="text-sm text-gray-600 mt-1">Prestadores</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" style={{ color: '#7ECBF2' }}>4.9★</div>
                    <div className="text-sm text-gray-600 mt-1">Calificación</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/5673488/pexels-photo-5673488.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Service professionals"
                    className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServicesCarousel onGoToServiceSearch={onGoToServiceSearch} />

        <section className="py-20" style={{ backgroundColor: '#E8F4F8' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Comprometidos con facilitar tu vida y brindarte servicios de calidad
                </p>
              </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="w-10 h-10" style={{ color: '#7ECBF2' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Puntualidad en los servicios
                </h3>
                <p className="text-gray-600">
                  Tiempos de espera mínimos
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-10 h-10" style={{ color: '#7ECBF2' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Seguridad
                </h3>
                <p className="text-gray-600">
                  Conductores y servicios verificados
                </p>
              </div>

              <div className="text-center">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <MapPin className="w-10 h-10" style={{ color: '#7ECBF2' }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Cobertura
                </h3>
                <p className="text-gray-600">
                  Amplia disponibilidad
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16" style={{ backgroundColor: '#5B9FC8' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Mantente actualizado
            </h2>
            <p className="text-white opacity-90 mb-8 max-w-xl mx-auto">
              Recibe las últimas noticias y ofertas especiales directamente en tu correo
            </p>
            <div className="flex max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-5 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <button className="bg-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm" style={{ color: '#2E4A73' }}>
                Suscribirme
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-white py-16" style={{ backgroundColor: '#5B9FC8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/imagen (1).png" alt="ManosAmigas" className="h-10 w-10" />
                <span className="text-xl font-semibold">ManosAmigas</span>
              </div>
              <p className="text-white opacity-90 text-sm leading-relaxed mb-4">
                  "Pedir una mano simplifica tu vida, brindar la tuya transforma la del otro."
                </p>
              </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">Servicios</h3>
              <ul className="space-y-3 text-sm text-white opacity-90">
                  <li><a href="#" className="hover:text-white transition-colors">Categorías</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Certificaciones</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Empresas</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Conductores</a></li>
                </ul>
              </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">Soporte</h3>
              <ul className="space-y-3 text-sm text-white opacity-90">
                  <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Términos de uso</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                </ul>
              </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">Contacto</h3>
              <ul className="space-y-3 text-sm text-white opacity-90">
                  <li>+1 (555) 123-4567</li>
                  <li>soporte@manosamiga.com</li>
                  <li>Medellín, Colombia</li>
                </ul>
              </div>
            </div>

          <div className="border-t border-white border-opacity-30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white opacity-90">
            <p>&copy; 2024 ManosAmigas. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:opacity-100 transition-opacity">Términos</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Privacidad</a>
              <a href="#" className="hover:opacity-100 transition-opacity">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}