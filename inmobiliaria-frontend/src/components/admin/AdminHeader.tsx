import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md">
      <div className="max-w-full pl-64 pr-6 py-4"> 
        <div className="flex justify-end">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-white hover:text-blue-300 hover:bg-white/5 rounded-lg transition-all duration-200 border border-white/20 hover:border-blue-400/30"
            title="Cerrar sesión"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;