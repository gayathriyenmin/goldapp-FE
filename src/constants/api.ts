export const API_BASE_URL = 'http://localhost:3000';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
    REGISTER: '/admin/register',
    LOGOUT: '/logout',
  },
  DASHBOARD: {
    STATS: '/admin/dashboard',
  },
  CUSTOMERS: {
    LIST: '/admin/customers',
    PROFILE: '/customer-profiles',
  },
  SCHEMES: {
    LIST: '/schemes',
    CREATE: '/admin/create-scheme',
    UPDATE: (id: string | number) => `/admin/edit-scheme/${id}`,
    UPDATE_STATUS: (id: string | number) => `/admin/update-scheme-status/${id}`,
    DELETE: (id: string | number) => `/admin/delete-scheme/${id}`,
    DETAIL: (id: string | number) => `/schemes/${id}`,
  },
  PAYMENTS: {
    LIST: '/admin/payment-history',
    CREATE: '/payments',
  },
  INSTALLMENTS: {
    LIST: '/installments',
    DUE: '/installments/due',
  },
  PROMOTIONS: {
    LIST: '/admin/promotions',
    CREATE: '/admin/promotions',
    UPDATE: (id: string | number) => `/admin/promotions/${id}`,
    UPDATE_STATUS: (id: string | number) => `/admin/promotions-status/${id}`,
    DELETE: (id: string | number) => `/admin/promotions/${id}`,
  },
  GOLD_RATES: {
    TODAY: '/gold-rates/today',
    HISTORY: '/gold-rates/history',
  },
};
