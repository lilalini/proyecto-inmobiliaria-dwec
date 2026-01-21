// inmobiliaria-frontend/src/pages/VisitarPropiedadPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const VisitarPropiedadPage: React.FC = () => {
  // Lista de ejemplo de propiedades "destacadas" o "recientes"
  const propiedadesEjemplo = [
    { id: 1, title: 'Ático con vistas al mar', address: 'Zona Puerto', price: '450.000 €' },
    { id: 2, title: 'Chalet familiar con piscina', address: 'Urbanización Monteverde', price: '675.000 €' },
    { id: 3, title: 'Apartamento en centro histórico', address: 'Casco Antiguo', price: '290.000 €' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Título y descripción */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">¿Cómo visitar una propiedad?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Te guiamos en el proceso para que puedas conocer la propiedad que te interesa de forma fácil y segura.
          </p>
        </div>

        {/* Pasos del proceso */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-blue-600 text-3xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold mb-3">Encuentra tu propiedad ideal</h3>
            <p className="text-gray-700 mb-6">Navega por nuestro catálogo y usa los filtros para encontrar lo que buscas.</p>
            <Link to="/" className="inline-block text-blue-600 font-semibold hover:text-blue-800">
              Ver propiedades disponibles →
            </Link>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-blue-600 text-3xl font-bold mb-4">2</div>
            <h3 className="text-xl font-semibold mb-3">Revisa los detalles</h3>
            <p className="text-gray-700 mb-6">Haz clic en cualquier propiedad para ver fotos, descripción completa, ubicación y características.</p>
            <p className="text-sm text-gray-500">Allí encontrarás el formulario para solicitar la visita.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="text-blue-600 text-3xl font-bold mb-4">3</div>
            <h3 className="text-xl font-semibold mb-3">Solicita la visita</h3>
            <p className="text-gray-700 mb-6">Completa el formulario en la página de la propiedad. Un agente se pondrá en contacto contigo para coordinar.</p>
          </div>
        </div>

        {/* Propiedades de ejemplo para visitar (enlazan a sus páginas) */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Propiedades populares para visitar</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {propiedadesEjemplo.map(prop => (
              <Link 
                key={prop.id} 
                to={`/propiedad/${prop.id}`}
                className="block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{prop.title}</h3>
                  <p className="text-gray-600 mb-3">{prop.address}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{prop.price}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      Ver detalles
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg px-10 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
          >
            Explorar todas las propiedades
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VisitarPropiedadPage;