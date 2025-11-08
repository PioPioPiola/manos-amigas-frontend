// ServicesCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Wrench, Home, Users, ShoppingCart, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

interface Service {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  description: string;
  features: string[];
}

interface ServicesCarouselProps {
  onGoToLogin: () => void;
}

const ServicesCarousel: React.FC<ServicesCarouselProps> = ({ onGoToLogin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services: Service[] = [
    {
      icon: Wrench,
      iconBg: '#2E4A73',
      title: 'Asistencia y Reparaciones en el hogar',
      description: 'Soluciones técnicas rápidas y seguras',
      features: [
        'Tarifas transparentes',
        'Profesionales verificados',
        'Máxima disponibilidad'
      ]
    },
    {
      icon: Home,
      iconBg: '#7ECBF2',
      title: 'Tareas del hogar y Apoyo a domicilio',
      description: 'Simplifica tu día a día con ayuda confiable',
      features: [
        'Cuidado personal y de mascotas',
        'Personas confiables con disposición de ayudar'
      ]
    },
    {
      icon: Users,
      iconBg: '#A8D8EA',
      title: 'Acompañamiento en trámites',
      description: 'Hacer vueltas en compañía, será más fácil y sencillo',
      features: [
        'Guía para realizar procesos',
        'Realización de trámites por terceros',
        'Acompañamiento presencial en procesos'
      ]
    },
    {
      icon: ShoppingCart,
      iconBg: '#5B9FC8',
      title: 'Compras y Diligencias',
      description: 'Hacemos tus compras y mandados por ti',
      features: [
        'Compras en supermercados',
        'Recogida y entrega de paquetes',
        'Pago de servicios y facturas'
      ]
    },
    {
      icon: Briefcase,
      iconBg: '#3A6B8F',
      title: 'Apoyo Administrativo',
      description: 'Ayuda con tareas administrativas del día a día',
      features: [
        'Organización de documentos',
        'Gestión de citas y agendas',
        'Soporte en tareas digitales'
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [services.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const getVisibleServices = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % services.length;
      visible.push(services[index]);
    }
    return visible;
  };

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros <span style={{ color: '#7ECBF2' }}>Servicios</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluciones puntuales para tus tareas diarias. Si es importante para ti, es importante para nosotros.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            style={{ color: '#5B9FC8' }}
            aria-label="Servicio anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            {getVisibleServices().map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={`${currentIndex}-${idx}`}
                  className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1 group animate-fadeIn flex flex-col"
                >
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: service.iconBg }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8 text-sm text-gray-600 flex-grow">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start">
                        <span className="mr-2" style={{ color: '#7ECBF2' }}>•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={onGoToLogin}
                    className="w-full py-3 rounded-lg font-semibold hover:opacity-90 transition-colors text-sm mt-auto"
                    style={{ backgroundColor: '#E8F4F8', color: '#5B9FC8' }}
                  >
                    Solicitar ahora
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            style={{ color: '#5B9FC8' }}
            aria-label="Siguiente servicio"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {services.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8' : 'w-2'
              }`}
              style={{
                backgroundColor: idx === currentIndex ? '#7ECBF2' : '#E5E7EB'
              }}
              aria-label={`Ir al servicio ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ServicesCarousel;