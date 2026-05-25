import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const bannerOfferService = {
  getAll: async (params?: any) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.PROMOTIONS.LIST, { params });
    return response;
  },

  create: async (data: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.PROMOTIONS.CREATE, data);
    return response;
  },

  update: async (id: string | number, data: any) => {
    const response = await axiosInstance.put<ApiResponse<any>>(ENDPOINTS.PROMOTIONS.UPDATE(id), data);
    return response;
  },

  updateStatus: async (id: string | number, isActive: boolean, statusReason?: string) => {
    const response = await axiosInstance.put<ApiResponse<any>>(ENDPOINTS.PROMOTIONS.UPDATE_STATUS(id), { isActive, statusReason });
    return response;
  },

  delete: async (id: string | number) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(ENDPOINTS.PROMOTIONS.DELETE(id));
    return response;
  },
};
