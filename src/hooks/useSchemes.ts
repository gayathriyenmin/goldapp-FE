import { useState, useEffect } from 'react';
import { schemeService } from '../store/services';
import type { Scheme } from '../interfaces';
import toast from 'react-hot-toast';

export const useSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  const fetchSchemes = async (currentFilters = filters) => {
    setIsLoading(true);
    try {
      const response = await schemeService.getAll(currentFilters);
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

  const updateFilters = (newFilters: any) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchSchemes(updated);
  };

  const updateSchemeLocal = (id: string | number, updates: Partial<Scheme>) => {
    setSchemes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return { 
    schemes, 
    isLoading, 
    refetch: fetchSchemes, 
    filters, 
    updateFilters,
    updateSchemeLocal 
  };
};
