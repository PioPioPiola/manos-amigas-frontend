import { Mail, Clock, Home } from 'lucide-react';

interface PendingProps {
  onBackToHome: () => void;
}

export default function Pending({ onBackToHome }: PendingProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Tu cuenta está en
              <span className="block mt-1" style={{ color: '#7ECBF2' }}>estado pendiente</span>
            </h1>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Tu documento de identidad se encuentra en proceso de verificación. Este paso es importante para garantizar la seguridad de nuestra plataforma.
            </p>

            <div className="rounded-xl p-6 mb-8 shadow-sm" style={{ background: 'linear-gradient(to bottom right, #E8F4F8, #F0F9FC)', border: '1px solid #7ECBF2' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8F4F8' }}>
                  <Mail className="w-6 h-6" style={{ color: '#7ECBF2' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">¿Qué sucede ahora?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Estamos verificando tu documento de identidad. Una vez que la verificación esté completa,
                    recibirás un <span className="font-semibold text-gray-900">correo electrónico de confirmación</span> y
                    podrás acceder a todas las funcionalidades de la plataforma.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8 text-sm text-gray-600">
              <Clock className="w-5 h-5" style={{ color: '#7ECBF2' }} />
              <span>Este proceso suele tomar entre 24 y 48 horas</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onBackToHome}
                className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md text-sm"
                style={{ backgroundColor: '#0A2540' }}
              >
                Volver al inicio
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              ¿Tienes dudas?{' '}
              <a href="mailto:soporte@manosamigas.com" className="hover:underline font-semibold" style={{ color: '#7ECBF2' }}>
                Contacta con soporte
              </a>
            </p>
          </div>

          <div className="hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-square flex items-center justify-center p-8" style={{ background: 'linear-gradient(to bottom right, #7ECBF2, #A8D8EA)' }}>
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg
                    className="w-16 h-16 animate-pulse"
                    fill="none"
                    stroke="#7ECBF2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <p className="text-white font-semibold text-xl mb-2">Verificación en proceso</p>
                <p className="text-white opacity-90 text-base">Tu seguridad es nuestra prioridad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
