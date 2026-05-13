import { useState, useEffect } from 'react';
import { schemeService } from '../store/services';
import type { Scheme } from '../interfaces';
import toast from 'react-hot-toast';

export const useSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchemes = async () => {
    setIsLoading(true);
    try {
      const response = await schemeService.getAll();
      setSchemes(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch schemes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);

  return { schemes, isLoading, refetch: fetchSchemes };
};
