import { useState, useEffect } from 'react';
import { customerService } from '../store/services';
import type { Customer } from '../interfaces';
import toast from 'react-hot-toast';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const response = await customerService.getAll();
      const mappedCustomers = response.data.map((user: any) => ({
        id: user.id.toString(),
        name: user.fullName,
        email: user.email,
        phone: user.mobileNumber,
        address: '', 
        joinDate: user.createdAt || new Date().toISOString(),
        status: 'active',
        totalPaid: 0,
        dueAmount: 0,
        schemes: [],
        customerSchemes: user.customerSchemes || [],
      }));
      setCustomers(mappedCustomers);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch customers');
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, isLoading, refetch: fetchCustomers };
};
