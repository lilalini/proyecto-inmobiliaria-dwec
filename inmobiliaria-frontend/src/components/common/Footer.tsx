import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Apturist</h3>
            <p className="text-gray-300 text-sm">Más de 5 años ayudándote a encontrar el hogar perfecto.</p>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">Enlaces</h4>
            <div className="space-y-1">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors block text-sm">Inicio</Link>
              <Link to="/calendario" className="text-gray-300 hover:text-white transition-colors block text-sm">Calendario</Link>
              <Link to="/servicios" className="text-gray-300 hover:text-white transition-colors block text-sm">Servicios</Link>
              <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors block text-sm">Contacto</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">Contacto</h4>
            <div className="space-y-1.5 text-gray-300 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span>+34 642 212 431</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span>info@apturist.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-base font-semibold mb-2">Horario</h4>
            <div className="text-gray-300 text-sm">
              <div>L-V: 10:00-19:00</div>
              <div>Sáb: 10:00-14:00</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-4 pt-3 text-center text-gray-400 text-sm">
          <p>© 2026 Apturist Inmobiliaria. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;