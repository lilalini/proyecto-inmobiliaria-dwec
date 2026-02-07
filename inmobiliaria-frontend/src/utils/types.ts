export type UserRole = 'admin' | 'manager' | 'agent' | 'client';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}
