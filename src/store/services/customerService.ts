import { api } from '../../utils';
import { API_ENDPOINTS } from '../../constants';
import type { Customer } from '../../interfaces';

export const customerService = {
  getAll: async () => {
    const response = await api.get<Customer[]>(API_ENDPOINTS.CUSTOMERS);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<Customer>(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Customer>) => {
    const response = await api.post<Customer>(API_ENDPOINTS.CUSTOMERS, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Customer>) => {
    const response = await api.put<Customer>(`${API_ENDPOINTS.CUSTOMERS}/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    await api.delete(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
  },
};
