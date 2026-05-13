export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: 'active' | 'inactive';
  totalPaid: number;
  dueAmount: number;
  schemes: string[]; // IDs of schemes
}
