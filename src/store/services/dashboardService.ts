import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const dashboardService = {
  getStats: async () => {
    const response = await axiosInstance.get<ApiResponse<any>>(ENDPOINTS.DASHBOARD.STATS);
    return response;
  },
  getTodayGoldRate: async () => {
    const response = await axiosInstance.get<any>(ENDPOINTS.GOLD_RATES.TODAY);
    return response;
  },
};
