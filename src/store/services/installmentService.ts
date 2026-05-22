import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const installmentService = {
  getDueInstallments: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(ENDPOINTS.INSTALLMENTS.DUE);
    return response;
  },
  getOverdueStats: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(ENDPOINTS.INSTALLMENTS.OVERDUE_STATS);
    return response;
  },
};
