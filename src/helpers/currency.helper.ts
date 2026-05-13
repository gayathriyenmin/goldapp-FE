import { APP_CONFIG } from '../constants';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: APP_CONFIG.CURRENCY,
  }).format(amount);
};
