import { useState, useEffect } from 'react';
import { customerService } from '../store/services';
import type { Customer } from '../interfaces';
import toast from 'react-hot-toast';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await customerService.getAll();
      // Ensure we map the backend user object to the Customer interface if needed
      // The backend returns users, so we might need to map them
      const mappedCustomers = response.data.map((user: any) => ({
        id: user.id.toString(),
        name: user.fullName,
        email: user.email,
        phone: user.mobileNumber,
        address: '', // Backend user doesn't have address yet in common fields
        joinDate: user.createdAt || new Date().toISOString(),
        status: 'active',
        totalPaid: 0,
        dueAmount: 0,
        schemes: [],
      }));
      setCustomers(mappedCustomers);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, isLoading, refetch: fetchCustomers };
};
