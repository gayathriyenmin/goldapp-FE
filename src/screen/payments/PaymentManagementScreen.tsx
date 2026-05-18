import React from 'react';
import { CheckCircle2, XCircle, Clock, Filter, Download } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { formatCurrency, formatDateTime } from '../../helpers';
import { usePayments } from '../../hooks/usePayments';
import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';

export const PaymentManagementScreen: React.FC = () => {
  const { payments, isLoading } = usePayments();

  // Dynamic counts based on actual database data
  const successfulCount = payments.filter((p: any) => 
    p.status?.toLowerCase() === 'success' || p.paymentStatus?.toLowerCase() === 'success' || p.paymentStatus?.toLowerCase() === 'success'
  ).length;

  const failedCount = payments.filter((p: any) => 
    p.status?.toLowerCase() === 'failed' || p.paymentStatus?.toLowerCase() === 'failed'
  ).length;

  const pendingCount = payments.filter((p: any) => 
    p.status?.toLowerCase() === 'pending' || p.paymentStatus?.toLowerCase() === 'pending'
  ).length;

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
            <h4 className="text-2xl font-bold text-text-light">{successfulCount}</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-danger/10 text-danger rounded-2xl">
            <XCircle size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Failed</p>
            <h4 className="text-2xl font-bold text-text-light">{failedCount}</h4>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-accent/10 text-accent rounded-2xl">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-slate-400 text-sm">Pending</p>
            <h4 className="text-2xl font-bold text-text-light">{pendingCount}</h4>
          </div>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
              <p className="text-lg font-semibold text-slate-300">No transactions found</p>
              <p className="text-sm text-slate-500 mt-1">There are currently no gold payments in the system.</p>
            </div>
          ) : (
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
                {payments.map((payment: any) => {
                  const displayStatus = (payment.status || payment.paymentStatus || 'success').toLowerCase();
                  return (
                    <tr key={payment.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-primary">
                        {payment.transactionId || `PAY-${payment.id}`}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-text-light">{payment.customerName || 'N/A'}</div>
                        <div className="text-[10px] text-slate-500">{payment.customer?.email || ''}</div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm">{payment.schemeName || 'N/A'}</td>
                      <td className="py-4 px-4 font-bold text-text-light">{formatCurrency(payment.amount)}</td>
                      <td className="py-4 px-4 text-slate-500 text-sm">
                        {formatDateTime(payment.paymentDate || payment.date)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center w-fit space-x-1 ${
                          displayStatus === 'success' ? 'bg-success/10 text-success' : 
                          displayStatus === 'failed' ? 'bg-danger/10 text-danger' : 
                          'bg-accent/10 text-accent'
                        }`}>
                          {displayStatus === 'success' ? <CheckCircle2 size={12} /> : 
                           displayStatus === 'failed' ? <XCircle size={12} /> : 
                           <Clock size={12} />}
                          <span>{displayStatus}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
