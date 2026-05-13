export interface Scheme {
  id: string;
  name: string;
  duration: number; // months
  minAmount: number;
  maxAmount: number;
  interestRate?: number;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
