export interface Scheme {
  id: string | number;
  name: string;
  description: string;
  monthlyAmount: number;
  durationMonths: number;
  bonusAmount?: number;
  maturityAmount?: number;
  isActive: boolean;
  createdAt: string;
}
