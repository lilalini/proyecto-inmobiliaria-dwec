import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '../../utils/types';
import { useAuth } from '../../utils/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[]; // Permite especificar qué roles de usuario pueden acceder a esta ruta
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default PrivateRoute;

