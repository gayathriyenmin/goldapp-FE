import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const schemeService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.SCHEMES.LIST, { params });
    return response;
  },

  getById: async (id: string | number) => {
    const response = await axiosInstance.get<ApiResponse<any>>(ENDPOINTS.SCHEMES.DETAIL(id));
    return response;
  },

  create: async (data: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.SCHEMES.CREATE, data);
    return response;
  },

  update: async (id: string | number, data: any) => {
    const response = await axiosInstance.patch<ApiResponse<any>>(ENDPOINTS.SCHEMES.UPDATE(id), data);
    return response;
  },

  updateStatus: async (id: string | number, isActive: boolean, statusReason?: string) => {
    const response = await axiosInstance.patch<ApiResponse<any>>(ENDPOINTS.SCHEMES.UPDATE_STATUS(id), { isActive, statusReason });
    return response;
  },

  delete: async (id: string | number) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(ENDPOINTS.SCHEMES.DELETE(id));
    return response;
  },
};
