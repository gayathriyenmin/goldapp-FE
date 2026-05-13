import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard, History } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { formatCurrency, formatDate } from '../../helpers';

export const CustomerDetailsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Mock data for the specific customer
  const customer = {
    id: id || '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 9876543210',
    address: '123, Marine Drive, Mumbai, Maharashtra 400001',
    joinDate: '2023-01-15',
    status: 'active',
    totalPaid: 50000,
    dueAmount: 5000,
    schemes: [
      { id: '1', name: 'Gold Monthly Saver', startDate: '2023-01-15', maturityDate: '2024-01-15', progress: 75 },
    ],
    payments: [
      { id: 'TXN001', amount: 5000, date: '2023-10-15', status: 'success' },
      { id: 'TXN002', amount: 5000, date: '2023-09-15', status: 'success' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="secondary" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold text-text-light">Customer Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center pb-6 border-b border-white/5">
            <div className="w-24 h-24 rounded-3xl gold-gradient flex items-center justify-center text-background text-3xl font-bold mb-4 shadow-xl">
              {customer.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-text-light">{customer.name}</h2>
            <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold uppercase rounded-full mt-2">
              {customer.status}
            </span>
          </div>

          <div className="py-6 space-y-4">
            <div className="flex items-center space-x-3 text-slate-400">
              <Mail size={18} className="text-primary" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Phone size={18} className="text-primary" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <MapPin size={18} className="text-primary" />
              <span className="text-sm text-left">{customer.address}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <Calendar size={18} className="text-primary" />
              <span className="text-sm">Joined {formatDate(customer.joinDate)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase font-bold">Total Paid</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(customer.totalPaid)}</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-xs text-slate-500 uppercase font-bold">Outstanding</p>
              <p className="text-lg font-bold text-danger">{formatCurrency(customer.dueAmount)}</p>
            </div>
          </div>
        </Card>

        {/* Schemes and Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Enrolled Schemes">
            <div className="space-y-4">
              {customer.schemes.map((scheme) => (
                <div key={scheme.id} className="p-4 bg-background border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="text-primary" size={20} />
                      <span className="font-semibold text-text-light">{scheme.name}</span>
                    </div>
                    <span className="text-sm text-slate-400">Ends: {formatDate(scheme.maturityDate)}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${scheme.progress}%` }} />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold">
                    <span>PROGRESS</span>
                    <span>{scheme.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Payment History" headerAction={<History size={20} className="text-slate-500" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase font-bold border-b border-white/5">
                    <th className="pb-3 px-2">Transaction</th>
                    <th className="pb-3 px-2">Amount</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {customer.payments.map((payment) => (
                    <tr key={payment.id} className="text-sm">
                      <td className="py-4 px-2 text-text-light font-mono">{payment.id}</td>
                      <td className="py-4 px-2 text-primary font-bold">{formatCurrency(payment.amount)}</td>
                      <td className="py-4 px-2 text-slate-400">{formatDate(payment.date)}</td>
                      <td className="py-4 px-2">
                        <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded-full">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
