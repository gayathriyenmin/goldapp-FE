import { useState, useEffect } from 'react';
import { bannerOfferService } from '../store/services';
import toast from 'react-hot-toast';

export const useBannersOffers = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [bannersRes, offersRes] = await Promise.all([
        bannerOfferService.getBanners(),
        bannerOfferService.getOffers()
      ]);
      setBanners(bannersRes.data);
      setOffers(offersRes.data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch banners/offers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { banners, offers, isLoading, refetch: fetchData };
};
