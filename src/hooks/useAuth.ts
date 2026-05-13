import { useAuthStore } from '../store';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin: user?.role === 'admin',
  };
};
