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
    DETAIL: (id: string | number) => `/schemes/${id}`,
  },
  PAYMENTS: {
    LIST: '/payments',
    CREATE: '/payments',
  },
  INSTALLMENTS: {
    LIST: '/installments',
    DUE: '/installments/due',
  },
  BANNERS: {
    LIST: '/banners',
    CREATE: '/banners',
  },
  OFFERS: {
    LIST: '/offers',
    CREATE: '/offers',
  },
};
