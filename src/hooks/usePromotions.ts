import { useState, useEffect } from 'react';
import { bannerOfferService } from '../store/services';
import toast from 'react-hot-toast';
import { PromotionType } from '../interfaces/promotion.interface';
import type { Promotion } from '../interfaces/promotion.interface';

export const usePromotions = (type?: PromotionType) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<any>(type ? { type } : {});

  const fetchPromotions = async (currentFilters = filters) => {
    setIsLoading(true);
    try {
      const response = await bannerOfferService.getAll(currentFilters);
      setPromotions(response.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch promotions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [type]);

  const updateFilters = (newFilters: any) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchPromotions(updated);
  };

  const updateLocal = (id: string | number, updates: any) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeLocal = (id: string | number) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  return { 
    promotions, 
    isLoading, 
    refetch: fetchPromotions, 
    filters, 
    updateFilters,
    updateLocal,
    removeLocal
  };
};
