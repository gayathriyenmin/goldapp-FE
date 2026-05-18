import React from 'react';
import { CheckCircle2, XCircle, Clock, Filter, Download } from 'lucide-react';
import { Card, Button } from '../../components/common';
import type { Payment } from '../../interfaces';
import { formatCurrency, formatDateTime } from '../../helpers';

const mockPayments: Payment[] = [
  { id: 'TXN001', customerId: '1', customerName: 'Rajesh Kumar', schemeId: '1', schemeName: 'Gold Monthly Saver', amount: 5000, date: '2023-10-24T10:30:00Z', status: 'success', transactionId: 'PAY-123456789' },
  { id: 'TXN002', customerId: '2', customerName: 'Sneha Patil', schemeId: '2', schemeName: 'Elite Bullion Plan', amount: 15000, date: '2023-10-23T14:45:00Z', status: 'success', transactionId: 'PAY-987654321' },
  { id: 'TXN003', customerId: '3', customerName: 'Amit Sharma', schemeId: '1', schemeName: 'Gold Monthly Saver', amount: 2000, date: '2023-10-23T11:20:00Z', status: 'failed', transactionId: 'PAY-554433221' },
  { id: 'TXN004', customerId: '4', customerName: 'Priya Singh', schemeId: '3', schemeName: 'Starter Gold', amount: 500, date: '2023-10-22T16:10:00Z', status: 'pending', transactionId: 'PAY-112233445' },
  { id: 'TXN005', customerId: '5', customerName: 'Vikram Mehta', schemeId: '1', schemeName: 'Gold Monthly Saver', amount: 3000, date: '2023-10-21T09:00:00Z', status: 'success', transactionId: 'PAY-667788990' },
];

import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';

export const PaymentManagementScreen: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PremiumPageLoader isLoading={true} text="Synchronizing Transactions" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Payment History</h1>
          <p className="text-slate-400 mt-1">Monitor and track all financial transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Filter size={18} />
            <span>Filter</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Download size={18} />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-success/10 text-success rounded-2xl">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Successful</p>
            <h4 className="text-2xl font-bold text-text-light">1,284</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-danger/10 text-danger rounded-2xl">
            <XCircle size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Failed</p>
            <h4 className="text-2xl font-bold text-text-light">42</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-accent/10 text-accent rounded-2xl">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Pending</p>
            <h4 className="text-2xl font-bold text-text-light">18</h4>
          </div>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Transaction ID</th>
                <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Customer</th>
                <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Scheme</th>
                <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Amount</th>
                <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Date & Time</th>
                <th className="pb-4 px-4 text-slate-400 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockPayments.map((payment) => (
                <tr key={payment.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-mono text-sm text-primary">{payment.id}</td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-text-light">{payment.customerName}</div>
                    <div className="text-[10px] text-slate-500">{payment.transactionId}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-sm">{payment.schemeName}</td>
                  <td className="py-4 px-4 font-bold text-text-light">{formatCurrency(payment.amount)}</td>
                  <td className="py-4 px-4 text-slate-500 text-sm">{formatDateTime(payment.date)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center w-fit space-x-1 ${
                      payment.status === 'success' ? 'bg-success/10 text-success' : 
                      payment.status === 'failed' ? 'bg-danger/10 text-danger' : 
                      'bg-accent/10 text-accent'
                    }`}>
                      {payment.status === 'success' ? <CheckCircle2 size={12} /> : 
                       payment.status === 'failed' ? <XCircle size={12} /> : 
                       <Clock size={12} />}
                      <span>{payment.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
