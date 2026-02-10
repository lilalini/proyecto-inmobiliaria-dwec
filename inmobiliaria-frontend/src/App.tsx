  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import HomePage from './pages/HomePage';
  import AdminPage from './pages/AdminPage';
  import ContactPage from './pages/ContactPage';
  import CalendarPage from './pages/CalendarPage';
  import PropertyDetail from './pages/PropertyDetail';
  import NotFound from './pages/NotFound';
  import LoginPage from './pages/LoginPage';
  import VisitarPropiedadPage from './pages/VisitarPropiedadPage';
  import ServicesPage from './pages/ServicesPage'; 
  import EditPropertyPage from './pages/EditPropertyPage';
  import "react-datepicker/dist/react-datepicker.css";
  import ValuationPage from './pages/ValuationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Rutas del Admin - TODAS pasan por AdminPage */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/properties" element={<AdminPage />} />
        <Route path="/admin/visits" element={<AdminPage />} />
        <Route path="/admin/calendar" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminPage />} />
        <Route path="/admin/clients" element={<AdminPage />} />
        <Route path="/admin/reports" element={<AdminPage />} /> {/* ¡Cambiado! */}
        
        <Route path="/admin/propiedad/editar/:id" element={<EditPropertyPage />} />
        <Route path="/propiedad/:id" element={<PropertyDetail />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/visitar-propiedad" element={<VisitarPropiedadPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/valoracion" element={<ValuationPage />} />
      </Routes>
    </Router>
  );
}
    
  export default App;