import axiosInstance from '../../utils/axios';
import { ENDPOINTS } from '../../constants/api';
import type { ApiResponse } from '../../interfaces';

export const notificationService = {
  send: async (data: { title: string; description: string; imageUrl?: string }) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.NOTIFICATIONS.SEND, data);
    return response.data;
  },
  remindSingle: async (userId: string | number, data: { title: string; description: string }) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.NOTIFICATIONS.REMIND_SINGLE(userId), data);
    return response.data;
  },
  remindOverdue: async (data: { title: string; description: string }) => {
    const response = await axiosInstance.post<ApiResponse<any>>(ENDPOINTS.NOTIFICATIONS.REMIND_OVERDUE, data);
    return response.data;
  },
};
