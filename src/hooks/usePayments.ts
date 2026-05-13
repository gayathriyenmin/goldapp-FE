import { useState, useEffect } from 'react';
import { paymentService } from '../store/services';
import toast from 'react-hot-toast';

export const usePayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await paymentService.getPayments();
      setPayments(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return { payments, isLoading, refetch: fetchPayments };
};
