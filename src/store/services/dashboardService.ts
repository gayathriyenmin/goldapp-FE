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
  getGoldRateHistory: async () => {
    const response = await axiosInstance.get<any>(ENDPOINTS.GOLD_RATES.HISTORY);
    return response;
  },
  getRevenueVsCollection: async (timeframe: string = 'monthly') => {
    const response = await axiosInstance.get<any>(`${ENDPOINTS.DASHBOARD.REVENUE_VS_COLLECTION}?timeframe=${timeframe}`);
    return response;
  },
  getCustomerAcquisition: async (timeframe: string = 'monthly') => {
    const response = await axiosInstance.get<any>(`${ENDPOINTS.DASHBOARD.CUSTOMER_ACQUISITION}?timeframe=${timeframe}`);
    return response;
  },
};
