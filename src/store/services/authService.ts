import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const authService = {
  login: async (credentials: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  register: async (data: any) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.AUTH.REGISTER, data);
    return response;
  },

  logout: async () => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.AUTH.LOGOUT);
    return response;
  },
};
