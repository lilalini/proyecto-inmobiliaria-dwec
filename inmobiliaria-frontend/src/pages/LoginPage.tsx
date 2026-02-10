import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('appLanguage') || 'es');
  const navigate = useNavigate();

  // Función de traducción offline
  const t = (text: string): string => {
    const lang = localStorage.getItem('appLanguage') || 'es';
    
    const translations: Record<string, Record<string, string>> = {
      'en': {
        'Acceso Agentes': 'Agent Access',
        'Ingresa tus credenciales para acceder al panel': 'Enter your credentials to access the panel',
        'Correo electrónico': 'Email',
        'tu@email.com': 'your@email.com',
        'Contraseña': 'Password',
        '••••••••': '••••••••',
        'Iniciando sesión...': 'Logging in...',
        'Iniciar sesión': 'Login',
        'Credenciales incorrectas': 'Invalid credentials',
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.': 'Could not connect to server. Verify that the backend is running.'
      },
      'fr': {
        'Acceso Agentes': 'Accès Agents',
        'Ingresa tus credenciales para acceder al panel': 'Entrez vos identifiants pour accéder au panneau',
        'Correo electrónico': 'Email',
        'tu@email.com': 'votre@email.com',
        'Contraseña': 'Mot de passe',
        '••••••••': '••••••••',
        'Iniciando sesión...': 'Connexion en cours...',
        'Iniciar sesión': 'Se connecter',
        'Credenciales incorrectas': 'Identifiants incorrects',
        'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.': 'Impossible de se connecter au serveur. Vérifiez que le backend fonctionne.'
      }
    };
    
    return translations[lang]?.[text] || text;
  };

  // Escuchar cambios de idioma
  useEffect(() => {
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem('appLanguage') || 'es';
      if (newLang !== currentLang) {
        setCurrentLang(newLang);
      }
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, [currentLang]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password: password 
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);
        navigate('/admin');
      } else {
        setError(t(data.error) || t('Credenciales incorrectas'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{t('Acceso Agentes')}</h2>
              <p className="text-gray-600 mt-2">
                {t('Ingresa tus credenciales para acceder al panel')}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Correo electrónico')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('tu@email.com')}
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Contraseña')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('••••••••')}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('Iniciando sesión...') : t('Iniciar sesión')}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;