import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h1>
            <p className="text-gray-600 mb-10">
              La página que estás buscando no existe o ha sido movida a otra ubicación.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              to="/" 
              className="block w-full py-4 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
            >
              Volver al inicio
            </Link>
            
            <div className="pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm mb-4">Otras páginas disponibles:</p>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/admin" 
                  className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Panel de Admin
                </Link>
                <Link 
                  to="/calendario" 
                  className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Calendario
                </Link>
                <Link 
                  to="/contacto" 
                  className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Contacto
                </Link>
                <Link 
                  to="/propiedad/1" 
                  className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Ejemplo propiedad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;