import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '../components/common/Header';
import PropertyCard from '../components/properties/PropertyCard';
import { propertyAPI } from '../services/api';
import type { Property, ApiResponse } from '../services/api';
import Footer from '../components/common/Footer';

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    searchText: '',
    propertyType: '',
    city: '',
    minPrice: '',
    maxPrice: ''
  });
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar propiedades del backend REAL
  const loadProperties = useCallback(async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      // LLAMADA AL BACKEND NUEVO
      const response: ApiResponse<Property[]> = await propertyAPI.getAll();
      
      if (response.success && Array.isArray(response.data)) {
        let result = response.data;
        
        // Filtrar por texto (en frontend por ahora)
        if (currentFilters.searchText) {
          const searchLower = currentFilters.searchText.toLowerCase();
          
          const typeTranslations: Record<string, string> = {
            apartment: 'apartamento',
            house: 'casa', 
            chalet: 'chalet',
            penthouse: 'ático',
            commercial: 'local comercial',
            office: 'oficina',
            land: 'terreno'
          };
          
          result = result.filter(property => {
            const spanishType = typeTranslations[property.type] || property.type;
            return (
              property.title.toLowerCase().includes(searchLower) ||
              property.description.toLowerCase().includes(searchLower) ||
              property.address.toLowerCase().includes(searchLower) ||
              spanishType.includes(searchLower)
            );
          });
        }
        
        // Filtrar por ciudad
        if (currentFilters.city) {
          result = result.filter(property => 
            property.city.toLowerCase() === currentFilters.city.toLowerCase()
          );
        }
        
        // Filtrar por tipo
        if (currentFilters.propertyType) {
          result = result.filter(property => 
            property.type === currentFilters.propertyType
          );
        }
        
        // Filtrar por precio
        if (currentFilters.minPrice) {
          const minPrice = parseFloat(currentFilters.minPrice);
          result = result.filter(property => property.price >= minPrice);
        }
        
        if (currentFilters.maxPrice) {
          const maxPrice = parseFloat(currentFilters.maxPrice);
          result = result.filter(property => property.price <= maxPrice);
        }
        
        setProperties(result);
      } else {
        setError(response.error || 'Error al cargar propiedades');
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Efecto con debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      loadProperties(filters);
    }, 500);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters, loadProperties]);

  // Manejar cambios en filtros
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      searchText: '',
      propertyType: '',
      city: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  if (loading && properties.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">Error</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de conexión</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => loadProperties(filters)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header />
      
{/* Barra de búsqueda + Botón destacado */}
<div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white pt-4 pb-8">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Barra de búsqueda (izquierda - 2/3) */}
      <div className="lg:w-2/3">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              type="text" 
              placeholder="¿Qué buscas? Ej: ático, piscina, centro..." 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              aria-label="Buscar propiedades"
            />
            
            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.propertyType}
              onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              aria-label="Tipo de propiedad"
            >
              <option value="">Todos los tipos</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
              <option value="chalet">Chalet</option>
              <option value="penthouse">Ático</option>
              <option value="commercial">Local Comercial</option>
              <option value="office">Oficina</option>
              <option value="land">Terreno</option>
            </select>
            
            <select 
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              aria-label="Ciudad"
            >
              <option value="">Todas las ciudades</option>
              <option value="Madrid">Madrid</option>
              <option value="Barcelona">Barcelona</option>
              <option value="Valencia">Valencia</option>
              <option value="Sevilla">Sevilla</option>
            </select>
            
            <button 
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              onClick={clearFilters}
            >
              Limpiar
            </button>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Precio mínimo (€)</label>
              <input 
                type="number"
                placeholder="Ej: 100000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                aria-label="Precio mínimo"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Precio máximo (€)</label>
              <input 
                type="number"
                placeholder="Ej: 500000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                aria-label="Precio máximo"
              />
            </div>
            
            <div className="flex items-end">
              <button 
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => loadProperties(filters)}
              >
                Buscar Propiedades
              </button>
            </div>
          </div>
          
          {(filters.searchText || filters.propertyType || filters.city || filters.minPrice || filters.maxPrice) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-700">
                  Filtros activos: 
                  {filters.searchText && ` "${filters.searchText}"`}
                  {filters.propertyType && ` · ${filters.propertyType}`}
                  {filters.city && ` · ${filters.city}`}
                  {filters.minPrice && ` · Desde ${filters.minPrice}€`}
                  {filters.maxPrice && ` · Hasta ${filters.maxPrice}€`}
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {properties.length} {properties.length === 1 ? 'resultado' : 'resultados'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón destacado - ALINEADO */}
      <div className="lg:w-1/3 flex items-end">
        <div className="w-full bg-white rounded-xl p-5 shadow-lg flex flex-col h-full">
          <div className="text-center mb-6 flex-shrink-0">
            <div className="text-gray-800 font-bold text-lg mb-2">¿Vendes tu propiedad?</div>
            <div className="text-gray-600 text-base">Valoración gratuita y sin compromiso</div>
          </div>
          <div className="flex-grow"></div>
          <div className="flex-shrink-0 text-center">
            <button className="w-4/6 inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Valorar propiedad
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
      
      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Propiedades destacadas
              </h2>
              <p className="text-gray-600">Encuentra la propiedad perfecta para ti</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap">
                {properties.length} {properties.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}
              </div>
              
              <div className="w-64">
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                  defaultValue="newest"
                  aria-label="Ordenar propiedades"
                  onChange={(e) => {
                    const order = e.target.value;
                    const sorted = [...properties].sort((a, b) => {
                      if (order === 'price_desc') return b.price - a.price;
                      if (order === 'price_asc') return a.price - b.price;
                      if (order === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                      if (order === 'bedrooms_desc') return b.bedrooms - a.bedrooms;
                      if (order === 'bedrooms_asc') return a.bedrooms - b.bedrooms;
                      return 0;
                    });
                    setProperties(sorted);
                  }}
                >
                  <option value="newest">Más recientes primero</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="bedrooms_desc">Más dormitorios primero</option>
                  <option value="bedrooms_asc">Menos dormitorios primero</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Grid de propiedades */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.serial} property={property} />
            ))}
          </div>
          
          {properties.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-6">🏠</div>
              <h3 className="text-2xl font-medium text-gray-700 mb-3">No se encontraron propiedades</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {filters.searchText || filters.propertyType || filters.city || filters.minPrice || filters.maxPrice 
                  ? "No hay propiedades que coincidan con tus filtros de búsqueda. Prueba con otros criterios."
                  : "No hay propiedades disponibles en este momento. Por favor, intenta más tarde."
                }
              </p>
              {(filters.searchText || filters.propertyType || filters.city || filters.minPrice || filters.maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Información del sistema */}
        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-blue-100">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Sistema conectado correctamente</h3>
              <p className="text-gray-600">
                Backend PostgreSQL en: <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">http://localhost:5000/api</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;