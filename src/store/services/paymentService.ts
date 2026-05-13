import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const paymentService = {
  getPayments: async (params?: any) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.PAYMENTS.LIST, { params });
    return response;
  },

  createPayment: async (data: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.PAYMENTS.CREATE, data);
    return response;
  },

  getInstallments: async (params?: any) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.INSTALLMENTS.LIST, { params });
    return response;
  },

  getDueInstallments: async (params?: any) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.INSTALLMENTS.DUE, { params });
    return response;
  },
};
