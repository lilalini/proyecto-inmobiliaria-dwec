// src/utils/translate.ts - VERSIÓN FINAL HOME PAGE

// Traducciones OFFLINE para TODOS los textos IMPORTANTES
const CRITICAL_TRANSLATIONS: Record<string, Record<string, string>> = {
  'en': {
    // === HEADER ===
    'Tu hogar ideal a un clic de distancia': 'Your ideal home one click away',
    
    // === HOME PAGE - FILTROS Y BÚSQUEDA ===
    '¿Qué buscas? Ej: ático, piscina, centro...': 'What are you looking for? Eg: penthouse, pool, center...',
    'Todos los tipos': 'All types',
    'Apartamento': 'Apartment',
    'Casa': 'House',
    'Chalet': 'Chalet',
    'Ático': 'Penthouse',
    'Local Comercial': 'Commercial Property',
    'Oficina': 'Office',
    'Terreno': 'Land',
    'Todas las ciudades': 'All cities',
    'Benidorm': 'Benidorm',
    'Marbella': 'Marbella',
    'Sotogrande': 'Sotogrande',
    'Madrid': 'Madrid',
    'Barcelona': 'Barcelona',
    'Valencia': 'Valencia',
    'Sevilla': 'Sevilla',
    'Limpiar': 'Clear',
    'Precio mínimo (€)': 'Minimum price (€)',
    'Ej: 100000': 'Eg: 100000',
    'Precio máximo (€)': 'Maximum price (€)',
    'Ej: 500000': 'Eg: 500000',
    'Buscar Propiedades': 'Search Properties',
    'Filtros activos:': 'Active filters:',
    'Desde': 'From',
    'Hasta': 'To',
    'resultado': 'result',
    'resultados': 'results',
    
    // === HOME PAGE - BOTÓN VALORACIÓN ===
    '¿Vendes tu propiedad?': 'Are you selling your property?',
    'Valoración gratuita y sin compromiso': 'Free valuation with no commitment',
    'Valorar propiedad': 'Get Property Valuation',
    
    // === HOME PAGE - LISTADO PROPIEDADES ===
    'Propiedades destacadas': 'Featured Properties',
    'Encuentra la propiedad perfecta para ti': 'Find the perfect property for you',
    'propiedad disponible': 'property available',
    'propiedades disponibles': 'properties available',
    'Más recientes primero': 'Most recent first',
    'Precio: mayor a menor': 'Price: high to low',
    'Precio: menor a mayor': 'Price: low to high',
    'Más dormitorios primero': 'More bedrooms first',
    'Menos dormitorios primero': 'Fewer bedrooms first',
    
    // === HOME PAGE - ESTADO VACÍO ===
    'Sin resultados': 'No results',
    'No encontramos propiedades que coincidan con los filtros aplicados.': 'We didn\'t find properties matching the applied filters.',
    'No hay propiedades disponibles en este momento.': 'There are no properties available at the moment.',
    'Restablecer búsqueda': 'Reset search',
    
    // === HOME PAGE - INFO SISTEMA ===
    'Sistema conectado correctamente': 'System connected successfully',
    'Backend PostgreSQL en:': 'PostgreSQL backend at:',
    
    // === MENÚS (compartido) ===
    'Inicio': 'Home',
    'Contacto': 'Contact',
    'Servicios': 'Services',
    'Visitar Propiedad': 'Visit Property',
    'Acceso Agentes': 'Agent Access',
    
    // === ESTADOS BÁSICOS ===
    'Disponible': 'Available',
    'Vendido': 'Sold',
    'Alquilado': 'Rented',
    'En mantenimiento': 'Under maintenance',
    'DISPONIBLE': 'AVAILABLE',
    'VENDIDO': 'SOLD', 
    'ALQUILADO': 'RENTED',
    'UBICACIÓN': 'LOCATION',
    'Precio total': 'Total price',
    'Dormitorios': 'Bedrooms',
    'Baños': 'Bathrooms',
    'm²': 'm²',
    'IMAGEN NO DISPONIBLE': 'IMAGE NOT AVAILABLE',
    'Propiedad': 'Property',
    'Ver detalles': 'View details'
  },
  'fr': {
    // === HEADER ===
    'Tu hogar ideal a un clic de distancia': 'Votre maison idéale à un clic',
    
    // === HOME PAGE - FILTROS Y BÚSQUEDA ===
    '¿Qué buscas? Ej: ático, piscina, centro...': 'Que cherchez-vous ? Ex: penthouse, piscine, centre...',
    'Todos los tipos': 'Tous les types',
    'Apartamento': 'Appartement',
    'Casa': 'Maison',
    'Chalet': 'Chalet',
    'Ático': 'Penthouse',
    'Local Comercial': 'Local Commercial',
    'Oficina': 'Bureau',
    'Terreno': 'Terrain',
    'Todas las ciudades': 'Toutes les villes',
    'Benidorm': 'Benidorm',
    'Marbella': 'Marbella',
    'Sotogrande': 'Sotogrande',
    'Madrid': 'Madrid',
    'Barcelona': 'Barcelone',
    'Valencia': 'Valence',
    'Sevilla': 'Séville',
    'Limpiar': 'Effacer',
    'Precio mínimo (€)': 'Prix minimum (€)',
    'Ej: 100000': 'Ex: 100000',
    'Precio máximo (€)': 'Prix maximum (€)',
    'Ej: 500000': 'Ex: 500000',
    'Buscar Propiedades': 'Rechercher Propriétés',
    'Filtros activos:': 'Filtres actifs:',
    'Desde': 'De',
    'Hasta': 'À',
    'resultado': 'résultat',
    'resultados': 'résultats',
    
    // === HOME PAGE - BOTÓN VALORACIÓN ===
    '¿Vendes tu propiedad?': 'Vendez-vous votre propriété ?',
    'Valoración gratuita y sin compromiso': 'Évaluation gratuite et sans engagement',
    'Valorar propiedad': 'Évaluer propriété',
    
    // === HOME PAGE - LISTADO PROPIEDADES ===
    'Propiedades destacadas': 'Propriétés en Vedette',
    'Encuentra la propiedad perfecta para ti': 'Trouvez la propriété parfaite pour vous',
    'propiedad disponible': 'propriété disponible',
    'propiedades disponibles': 'propriétés disponibles',
    'Más recientes primero': 'Plus récents d\'abord',
    'Precio: mayor a menor': 'Prix: élevé à bas',
    'Precio: menor a mayor': 'Prix: bas à élevé',
    'Más dormitorios primero': 'Plus de chambres d\'abord',
    'Menos dormitorios primero': 'Moins de chambres d\'abord',
    
    // === HOME PAGE - ESTADO VACÍO ===
    'Sin resultados': 'Aucun résultat',
    'No encontramos propiedades que coincidan con los filtros aplicados.': 'Nous n\'avons pas trouvé de propriétés correspondant aux filtres appliqués.',
    'No hay propiedades disponibles en este momento.': 'Il n\'y a pas de propriétés disponibles pour le moment.',
    'Restablecer búsqueda': 'Réinitialiser recherche',
    
    // === HOME PAGE - INFO SISTEMA ===
    'Sistema conectado correctamente': 'Système connecté avec succès',
    'Backend PostgreSQL en:': 'Backend PostgreSQL à:',
    
    // === MENÚS (compartido) ===
    'Inicio': 'Accueil',
    'Contacto': 'Contact',
    'Servicios': 'Services',
    'Visitar Propiedad': 'Visiter la Propriété',
    'Acceso Agentes': 'Accès Agents',
    
    // === ESTADOS BÁSICOS ===
    'Disponible': 'Disponible',
    'Vendido': 'Vendu',
    'Alquilado': 'Loué',
    'En mantenimiento': 'En maintenance',
    'DISPONIBLE': 'DISPONIBLE',
    'VENDIDO': 'VENDU', 
    'ALQUILADO': 'LOUÉ',
    'UBICACIÓN': 'EMPLACEMENT',
    'Precio total': 'Prix total',
    'Dormitorios': 'Chambres',
    'Baños': 'Salles de bain',
    'm²': 'm²',
    'IMAGEN NO DISPONIBLE': 'IMAGE NON DISPONIBLE',
    'Propiedad': 'Propriété',
    'Ver detalles': 'Voir détails',
  }
};

export async function translateText(
  text: string,
  from: string = 'es',
  to: string
): Promise<string> {
  // Validaciones básicas
  if (from === to || !text.trim()) {
    return text;
  }

  // 1. PRIMERO: Buscar en traducciones OFFLINE (críticas)
  if (CRITICAL_TRANSLATIONS[to] && CRITICAL_TRANSLATIONS[to][text]) {
    console.log(`[translate] OFFLINE: "${text}" → "${CRITICAL_TRANSLATIONS[to][text]}"`);
    return CRITICAL_TRANSLATIONS[to][text];
  }

  // 2. SEGUNDO: Para textos largos, usar Google Translate vía parámetros
  console.log(`[translate] GOOGLE API: "${text.substring(0, 50)}..." (${from} → ${to})`);
  
  try {
    // Método antiguo de Google Translate (sin API key, solo para desarrollo)
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    console.log('[translate] Google API status:', response.status);
    
    if (!response.ok) {
      // Si Google falla, intentar con un proxy CORS como fallback
      console.log('[translate] Google falló, intentando con proxy CORS...');
      return await translateWithCorsProxy(text, from, to);
    }

    const data = await response.json();
    console.log('[translate] Google API data recibida');
    
    // La estructura de respuesta de Google es: [[["traducción", "original", null, null]]]
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      const translated = data[0][0][0];
      console.log(`[translate] GOOGLE OK: "${text.substring(0, 30)}..." → "${translated.substring(0, 30)}..."`);
      return translated;
    }
    
    console.log('[translate] Google no devolvió traducción válida');
    return text;
    
  } catch (error) {
    console.error('[translate] ERROR en Google API:', error);
    return text;
  }
}

// Función de respaldo con proxy CORS
async function translateWithCorsProxy(text: string, from: string, to: string): Promise<string> {
  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        console.log(`[translate] PROXY OK: traducción recibida via proxy`);
        return data[0][0][0];
      }
    }
    return text;
  } catch (error) {
    console.error('[translate] ERROR en proxy:', error);
    return text;
  }
}