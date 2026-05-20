import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const notificationService = {
  send: async (data: { title: string; description: string; imageUrl?: string }) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.NOTIFICATIONS.SEND, data);
    return response.data;
  },
};
