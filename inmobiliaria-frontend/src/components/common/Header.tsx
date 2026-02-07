// src/components/common/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SafeImage from "./SafeImage";
import LanguageSelector from './LanguageSelector';
import TranslatedText from './TranslatedText'; // TRADUCCIÓN: Import añadido

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLanguageChange = (newLang: string) => {
    console.log('Idioma cambiado a:', newLang);
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
              <div className="bg-white p-2 rounded-lg">
                <SafeImage
                  src="/images/logo.jpg"
                  alt="Logo Apturist"
                  className="h-12 w-12 object-contain"
                  fallback={
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xl">A</span>
                    </div>
                  }
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Apturist Inmobiliaria</h1>
                <p className="text-blue-200">
                  <TranslatedText text="Tu hogar ideal a un clic de distancia" /> {/* TRADUCCIÓN */}
                </p>
              </div>
            </Link>
          </div>

          {/* Menú Desktop */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Navegación principal">
            <Link to="/" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">
              <TranslatedText text="Inicio" /> {/* TRADUCCIÓN */}
            </Link>
            <Link to="/visitar-propiedad" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">
              <TranslatedText text="Visitar Propiedad" /> {/* TRADUCCIÓN */}
            </Link>
            <Link to="/servicios" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">
              <TranslatedText text="Servicios" /> {/* TRADUCCIÓN */}
            </Link>
            <Link to="/contacto" className="hover:text-blue-200 transition-colors font-medium px-2 py-1">
              <TranslatedText text="Contacto" /> {/* TRADUCCIÓN */}
            </Link>

            <LanguageSelector 
              onLanguageChange={handleLanguageChange}
              className="ml-2"
            />

            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <TranslatedText text="Acceso Agentes" /> {/* TRADUCCIÓN */}
            </Link>
          </nav>

          {/* Botón hamburguesa móvil */}
          <button
            type="button"
            className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            title={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"} // TRADUCCIÓN: Para accesibilidad
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-600 pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="hover:text-blue-200 transition-colors font-medium py-2 px-3 rounded hover:bg-blue-800" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TranslatedText text="Inicio" /> {/* TRADUCCIÓN */}
              </Link>
              <Link 
                to="/visitar-propiedad" 
                className="hover:text-blue-200 transition-colors font-medium py-2 px-3 rounded hover:bg-blue-800" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TranslatedText text="Visitar Propiedad" /> {/* TRADUCCIÓN */}
              </Link>
              <Link 
                to="/servicios" 
                className="hover:text-blue-200 transition-colors font-medium py-2 px-3 rounded hover:bg-blue-800" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TranslatedText text="Servicios" /> {/* TRADUCCIÓN */}
              </Link>
              <Link 
                to="/contacto" 
                className="hover:text-blue-200 transition-colors font-medium py-2 px-3 rounded hover:bg-blue-800" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TranslatedText text="Contacto" /> {/* TRADUCCIÓN */}
              </Link>

              <div className="pt-2">
                <LanguageSelector 
                  onLanguageChange={handleLanguageChange}
                  className="w-full"
                />
              </div>

              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all text-center shadow-md mt-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TranslatedText text="Acceso Agentes" /> {/* TRADUCCIÓN */}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;