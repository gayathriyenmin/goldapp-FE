import { create } from 'zustand';
import type { AuthState, User } from '../../interfaces';
import { setStorage, removeStorage, getStorage } from '../../utils/localStorage';

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
}

const initialState: AuthState = {
  user: getStorage('user'),
  token: getStorage('token'),
  isAuthenticated: !!getStorage('token'),
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,
  login: (user, token) => {
    setStorage('user', user);
    setStorage('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    removeStorage('user');
    removeStorage('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
