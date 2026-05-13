import { useState, useEffect } from 'react';
import { dashboardService } from '../store/services';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch dashboard stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, refetch: fetchStats };
};
