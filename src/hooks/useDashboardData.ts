import { useState, useEffect } from 'react';
import { dashboardService, paymentService } from '../store/services';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [stats, setStats] = useState<any>(null);
  const [goldRate, setGoldRate] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [statsRes, goldRateRes, paymentsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTodayGoldRate(),
        paymentService.getPayments()
      ]);
      setStats(statsRes.data);
      setGoldRate(goldRateRes.data);
      
      // Sort payments by date descending and take top 5
      const sortedPayments = (paymentsRes.data || [])
        .sort((a: any, b: any) => new Date(b.paymentDate || b.date || 0).getTime() - new Date(a.paymentDate || a.date || 0).getTime())
        .slice(0, 5);
      
      setRecentTransactions(sortedPayments);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, goldRate, recentTransactions, isLoading, refetch: fetchStats };
};
