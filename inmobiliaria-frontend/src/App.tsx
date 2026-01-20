import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ContactPage from './pages/ContactPage';
import CalendarPage from './pages/CalendarPage';
import PropertyDetail from './pages/PropertyDetail';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';

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
      </Routes>
    </Router>
  );
}

export default App;