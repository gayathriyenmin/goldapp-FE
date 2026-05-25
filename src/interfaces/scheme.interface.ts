export interface Scheme {
  id: string | number;
  name: string;
  description: string;
  monthlyAmount: number;
  durationMonths: number;
  bonusAmount?: number;
  maturityAmount?: number;
  isActive: boolean;
  statusReason?: string;
  createdAt: string;
}
