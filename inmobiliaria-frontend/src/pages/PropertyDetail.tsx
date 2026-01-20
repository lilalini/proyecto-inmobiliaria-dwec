import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PropertyGallery from '../components/properties/PropertyGallery';
import NewVisitForm from '../components/forms/NewVisitForm';
import type { Property } from '../services/api';


const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showVisitForm, setShowVisitForm] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Simulación: reemplaza esto con tu llamada real a apiService
        const mockProperty: Property = {
          id: parseInt(id),
          title: 'Casa moderna en zona residencial exclusiva',
          description: 'Impresionante villa contemporánea de 320m² construidos en parcela de 900m². La propiedad, reformada integralmente en 2023, cuenta con acabados de lujo, certificación energética A, domótica integral, piscina climatizada y jardín diseñado por paisajista. Distribuida en dos plantas luminosas con amplios ventanales y terraza solárium con vistas panorámicas.',
          address: 'Calle Alborán, 24',
          city: 'Madrid',
          price: 895000,
          type: 'house',
          operation: 'venta',           // ← NUEVO
          bedrooms: 5,
          bathrooms: 4,
          area: 320,
          status: 'available',
          featured: true,               // ← NUEVO
          agent_id: 1,                  // ← NUEVO
          created_at: '2024-02-10T09:15:00Z',
          updated_at: '2024-02-10T09:15:00Z', // ← NUEVO
          images: [
            {
              id: 1,
              property_id: parseInt(id),
              image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200',
              alt_text: 'Fachada principal de la vivienda',
              is_primary: true
            },
            {
              id: 2,
              property_id: parseInt(id),
              image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w-800',
              alt_text: 'Salón principal con chimenea',
              is_primary: false
            },
            {
              id: 3,
              property_id: parseInt(id),
              image_url: 'https://images.unsplash.com/photo-1567496898669-ee935f003f30?w=800',
              alt_text: 'Cocina moderna totalmente equipada',
              is_primary: false
            },
            {
              id: 4,
              property_id: parseInt(id),
              image_url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
              alt_text: 'Dormitorio principal con vestidor',
              is_primary: false
            },
            {
              id: 5,
              property_id: parseInt(id),
              image_url: 'https://images.unsplash.com/photo-1571080636137-8c4c6bdfda0d?w=800',
              alt_text: 'Piscina y zona exterior',
              is_primary: false
            }
          ]
        };
        
        // Descomenta cuando tengas tu API real:
        // const response = await apiService.getPropertyWithImages(parseInt(id));
        // if (response.success) {
        //   setProperty(response.data);
        // } else {
        //   setError(response.error || 'Error al cargar la propiedad');
        // }
        
        setProperty(mockProperty); // Elimina esta línea cuando uses la API real
      } catch {
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-20 px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-6 text-gray-700 font-medium">Cargando información de la propiedad...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto py-16 px-4 text-center">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-red-500 text-5xl mb-6">⚠</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">No se pudo cargar la propiedad</h1>
            <p className="text-gray-600 mb-8">{error || 'La propiedad solicitada no existe o no está disponible.'}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Volver atrás
              </button>
              <Link 
                to="/" 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Ir al catálogo
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Navegación y acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <nav className="flex items-center text-sm text-gray-600">
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">Inicio</Link>
              <span className="mx-3">/</span>
              <span className="text-gray-500">Propiedad #{property.id}</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{property.title}</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              property.status === 'available' 
                ? 'bg-green-100 text-green-800' 
                : property.status === 'sold'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {property.status === 'available' ? 'DISPONIBLE' : 
               property.status === 'sold' ? 'VENDIDA' : 'ALQUILADA'}
            </span>
            <button
              onClick={() => setShowVisitForm(!showVisitForm)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showVisitForm ? 'Cancelar solicitud' : 'Solicitar visita'}
            </button>
          </div>
        </div>

        {/* Formulario de visita (condicional) */}
        {showVisitForm && (
          <div className="mb-10">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Solicitar visita para esta propiedad</h2>
        <NewVisitForm 
            propertyId={property.id} 
            propertyTitle={property.title}
            onClose={() => setShowVisitForm(false)}
            onSuccess={() => {
              alert('Visita solicitada correctamente');
              setShowVisitForm(false);
            }}
/>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Columna izquierda: Galería y descripción */}
          <div className="space-y-8">
            <div>
              <PropertyGallery 
                images={property.images || []} 
                propertyTitle={property.title}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-7">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p>{property.description}</p>
              </div>
            </div>
          </div>

          {/* Columna derecha: Información detallada */}
          <div className="space-y-8">
            {/* Precio y características */}
            <div className="bg-white rounded-xl shadow-sm p-7">
              <div className="mb-8">
                <div className="text-4xl font-bold text-gray-900">{formatPrice(property.price)}</div>
                <p className="text-gray-600 mt-2">Precio de venta</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div className="text-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms || 'N/A'}</div>
                  <div className="text-gray-600 text-sm mt-1">Dormitorios</div>
                </div>
                <div className="text-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms || 'N/A'}</div>
                  <div className="text-gray-600 text-sm mt-1">Baños</div>
                </div>
                <div className="text-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{property.area} m²</div>
                  <div className="text-gray-600 text-sm mt-1">Superficie</div>
                </div>
                <div className="text-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.type === 'house' ? 'Casa' : 
                     property.type === 'apartment' ? 'Apto.' :
                     property.type === 'land' ? 'Terreno' : 'Comercial'}
                  </div>
                  <div className="text-gray-600 text-sm mt-1">Tipo</div>
                </div>
                <div className="text-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">A</div>
                  <div className="text-gray-600 text-sm mt-1">Certif. energética</div>
                </div>
                <div className="text-center p-4 border border-gray-100 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-gray-600 text-sm mt-1">Plazas garaje</div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-xl shadow-sm p-7">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3"></span> Ubicación
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Dirección completa</div>
                  <div className="text-gray-900 font-medium">{property.address}, {property.city}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Zona/Barrio</div>
                  <div className="text-gray-900 font-medium">Zona Residencial Norte</div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="text-3xl mb-2">🗺️</div>
                      <p className="text-sm">Mapa interactivo</p>
                      <p className="text-xs mt-1">(Integrar Google Maps aquí)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm p-7">
              <h3 className="text-xl font-bold text-gray-900 mb-6">¿Interesado en esta propiedad?</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">i</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Agente asignado</div>
                    <div className="text-gray-700">María González</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">✉</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Contacto directo</div>
                    <div className="text-gray-700">mgonzalez@inmobiliaria.com</div>
                  </div>
                </div>
                <button className="w-full mt-4 px-6 py-3.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Contactar al agente
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;