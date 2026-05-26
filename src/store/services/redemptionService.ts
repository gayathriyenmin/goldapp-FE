import axiosInstance from '../../utils/axios';
import type { ApiResponse } from '../../interfaces';

export const redemptionService = {
  scanRequest: async (requestId: string) => {
    return await axiosInstance.post<ApiResponse<any>>('/admin/redemption/scan', { requestId });
  },

  triggerOtp: async (requestId: string) => {
    return await axiosInstance.post<ApiResponse<any>>('/admin/redemption/trigger-otp', { requestId });
  },

  verifyOtp: async (requestId: string, otp: string) => {
    return await axiosInstance.post<ApiResponse<any>>('/admin/redemption/verify', { requestId, otp });
  },
};
