import { useState, useEffect } from 'react';
import { dashboardService, paymentService } from '../store/services';
import toast from 'react-hot-toast';

export const useDashboardData = () => {
  const [stats, setStats] = useState<any>(null);
  const [goldRate, setGoldRate] = useState<any>(null);
  const [goldRateHistory, setGoldRateHistory] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const [statsRes, goldRateRes, paymentsRes, historyRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTodayGoldRate(),
        paymentService.getPayments(),
        dashboardService.getGoldRateHistory()
      ]);
      setStats(statsRes.data || statsRes);
      setGoldRate(goldRateRes.data || goldRateRes);
      
      const historyData = historyRes.data?.data || historyRes.data || historyRes;
      console.log('HISTORY RES:', historyRes, 'EXTRACTED:', historyData);
      setGoldRateHistory(Array.isArray(historyData) ? historyData : []);
      
      // Sort payments by date descending and take top 5
      const paymentsData = paymentsRes.data?.data || paymentsRes.data || paymentsRes || [];
      const sortedPayments = (Array.isArray(paymentsData) ? paymentsData : [])
        .sort((a: any, b: any) => new Date(b.paymentDate || b.date || 0).getTime() - new Date(a.paymentDate || a.date || 0).getTime())
        .slice(0, 5);
      
      setRecentTransactions(sortedPayments);
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      toast.error(error.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, goldRate, goldRateHistory, recentTransactions, isLoading, refetch: fetchStats };
};
