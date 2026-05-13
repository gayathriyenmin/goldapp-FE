import { useAuthStore } from './slices/authSlice';

// Combine or export all stores from here if needed
export const useStore = () => ({
  auth: useAuthStore(),
});
