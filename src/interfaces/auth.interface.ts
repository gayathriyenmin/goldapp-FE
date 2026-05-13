export interface User {
  id: string | number;
  fullName: string;
  name?: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
