import { useState, useEffect } from 'react';
import { dashboardService } from '../store/services';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [stats, setStats] = useState<any>(null);
  const [goldRate, setGoldRate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [statsRes, goldRateRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTodayGoldRate()
      ]);
      setStats(statsRes.data);
      setGoldRate(goldRateRes.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, goldRate, isLoading, refetch: fetchStats };
};
