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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/propiedad/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/visitar-propiedad" element={<VisitarPropiedadPage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/admin/propiedad/editar/:id" element={<EditPropertyPage />} />
      </Routes>
    </Router>
  );
}

export default App;