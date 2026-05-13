export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  schemeId: string;
  schemeName: string;
  amount: number;
  date: string;
  status: 'success' | 'failed' | 'pending';
  transactionId: string;
}
