// ServicesPage.tsx - Versión Optimizada y Corregida
// ============================================
// Página: "Nuestros Servicios"
// Ruta: '/servicios' (definida en App.tsx)
// Propósito: Mostrar todos los servicios que ofrece la inmobiliaria de forma clara y sin elementos superfluos.
// ============================================

import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Link } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  const services = [
    {
      title: 'Venta de Propiedades',
      description: 'Gestión completa del proceso de venta, desde la valoración hasta la firma de escrituras.',
      features: ['Valoración profesional', 'Marketing digital', 'Gestión de visitas', 'Asesoramiento legal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: 'Alquiler Residencial y Comercial',
      description: 'Servicio integral de alquiler con gestión de contratos y mantenimiento.',
      features: ['Búsqueda de inquilinos', 'Contratación', 'Gestión de incidencias', 'Cobro de rentas'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: 'Tasaciones Profesionales',
      description: 'Valoración precisa de inmuebles con informes detallados y certificados.',
      features: ['Informe técnico', 'Comparativa de mercado', 'Certificación oficial', 'Asesoramiento fiscal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Asesoramiento Legal',
      description: 'Acompañamiento legal en todas las etapas de la transacción inmobiliaria.',
      features: ['Revisión de contratos', 'Tramitación notarial', 'Gestión hipotecaria', 'Asesoría fiscal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      title: 'Gestión de Inversiones',
      description: 'Asesoramiento para inversores en el sector inmobiliario.',
      features: ['Análisis de rentabilidad', 'Búsqueda de oportunidades', 'Gestión de cartera', 'Optimización fiscal'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Consultoría Inmobiliaria',
      description: 'Soluciones personalizadas para proyectos y desarrollos inmobiliarios.',
      features: ['Estudios de mercado', 'Planificación estratégica', 'Desarrollo de proyectos', 'Gestión de obras'],
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Cabecera Elegante */}
        <div className="text-center mb-16">
          <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Soluciones especializadas y personalizadas para cada paso de tu proceso inmobiliario.
          </p>
        </div>

        {/* Grid de Servicios - SIN BOTONES INTERNOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                </div>

                <p className="text-gray-600 mb-6">{service.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Incluye:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Se ha eliminado el div que contenía el botón repetitivo "Solicitar Información" */}
            </div>
          ))}
        </div>

        {/* Sección de Cierre - CON UN ÚNICO BOTÓN FUNCIONAL */}
        <div className="text-center border-t border-gray-200 pt-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">¿Cómo podemos ayudarte?</h2>
            <p className="text-gray-600 text-lg mb-10">
              Cuéntanos qué necesitas y uno de nuestros expertos te guiará con la mejor solución, sin compromiso.
            </p>
            <Link
              to="/contacto"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Hablar con un asesor
            </Link>
            <p className="text-sm text-gray-400 mt-4">
              Te contactaremos en menos de 24 horas.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;