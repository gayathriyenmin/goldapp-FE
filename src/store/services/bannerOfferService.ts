import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const bannerOfferService = {
  getBanners: async () => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.BANNERS.LIST);
    return response;
  },

  createBanner: async (data: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.BANNERS.CREATE, data);
    return response;
  },

  getOffers: async () => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(ENDPOINTS.OFFERS.LIST);
    return response;
  },

  createOffer: async (data: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.OFFERS.CREATE, data);
    return response;
  },
};
