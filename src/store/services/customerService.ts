import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse, Customer } from '../../interfaces';

export const customerService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get<ApiResponse<Customer[]>>(ENDPOINTS.CUSTOMERS.LIST, { params });
    return response;
  },
  
  getById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Customer>>(`${ENDPOINTS.CUSTOMERS.PROFILE}/${id}`);
    return response;
  },
  
  create: async (data: Partial<Customer>) => {
    const response = await axiosInstance.post<ApiResponse<Customer>>(ENDPOINTS.CUSTOMERS.PROFILE, data);
    return response;
  },
  
  update: async (id: string, data: Partial<Customer>) => {
    const response = await axiosInstance.put<ApiResponse<Customer>>(`${ENDPOINTS.CUSTOMERS.PROFILE}/${id}`, data);
    return response;
  },
  
  delete: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(`${ENDPOINTS.CUSTOMERS.PROFILE}/${id}`);
    return response;
  },

  verifyRedemption: async (id: string | number, otp: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.CUSTOMERS.VERIFY_REDEMPTION(id), { otp });
    return response;
  },
};
