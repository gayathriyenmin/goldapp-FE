import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const schemeService = {
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.SCHEMES.LIST);
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
};
