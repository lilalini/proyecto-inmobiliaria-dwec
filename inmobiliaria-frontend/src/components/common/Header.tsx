import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
              <div className="bg-white p-2 rounded-lg">
                <img 
                  src="/images/logo.jpg" 
                  alt="Logo Apturist" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Apturist Inmobiliaria</h1>
                <p className="text-blue-200">Tu hogar ideal a un clic de distancia</p>
              </div>
            </Link>
          </div>
          
          {/* Navegación principal */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">Inicio</Link>
            <Link to="/visitar-propiedad" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">Visitar Propiedad</Link>
            <Link to="/servicios" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">Servicios</Link>
            <Link to="/contacto" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">Contacto</Link>
            
            {/* Botón de acceso para agentes/admin */}
            <Link 
              to="/login"  // Cambia la ruta
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all whitespace-nowrap shadow-md hover:shadow-lg"
            >
              Acceso Agentes
            </Link>
          </nav>

          {/* Menú hamburguesa para móvil */}
          <button className="md:hidden p-2" aria-label="Menú">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;