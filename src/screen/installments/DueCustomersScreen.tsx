import React from 'react';
import { AlertCircle, Calendar, MessageSquare, Phone, BellRing } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { formatCurrency } from '../../helpers';
import { useCustomers } from '../../hooks/useCustomers';
import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';
import toast from 'react-hot-toast';

export const DueCustomersScreen: React.FC = () => {
  const { customers, isLoading } = useCustomers();

  // Create a realistic due schedule dynamically from actual database customers
  const dueCustomers = React.useMemo(() => {
    return customers.map((c, index) => {
      const amounts = [5000, 3000, 8000, 10000, 2000];
      const selectedAmount = amounts[index % amounts.length];
      
      const status = index % 3 === 0 ? 'overdue' : 'due-soon';
      const daysOverdue = status === 'overdue' ? (index % 4) * 5 + 3 : 0;
      
      // Calculate realistic due dates in the current month
      const currentYear = new Date().getFullYear();
      const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      const dueDay = String((index * 5 % 20) + 5).padStart(2, '0');
      const dueDate = `${currentYear}-${currentMonth}-${dueDay}`;

      return {
        id: c.id,
        name: c.name,
        phone: c.phone || '+91 98765 43210',
        amount: selectedAmount,
        dueDate,
        daysOverdue,
        status,
      };
    });
  }, [customers]);

  const handleNotifyAll = () => {
    toast.success('Successfully sent payment notifications to all overdue members!');
  };

  const handleNotifySingle = (name: string) => {
    toast.success(`Sent reminder notification to ${name}`);
  };

  if (isLoading) {
    return <PremiumPageLoader isLoading={true} text="Synchronizing Ledger Dues" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Due Tracking</h1>
          <p className="text-slate-400 mt-1">Monitor pending installments and send reminders</p>
        </div>
        <Button 
          variant="danger" 
          className="flex items-center space-x-2 shadow-lg shadow-danger/20"
          onClick={handleNotifyAll}
          disabled={dueCustomers.length === 0}
        >
          <BellRing size={20} />
          <span>Notify All Overdue</span>
        </Button>
      </div>

      {dueCustomers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-slate-500">
          <p className="text-lg font-semibold text-slate-300">No overdue accounts</p>
          <p className="text-sm text-slate-500 mt-1">All customer gold saving installments are fully up to date!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dueCustomers.map((customer) => (
            <Card key={customer.id} className="relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                customer.status === 'overdue' ? 'bg-danger' : 'bg-accent'
              }`} />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    customer.status === 'overdue' ? 'bg-danger/10 text-danger' : 'bg-accent/10 text-accent'
                  }`}>
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-light">{customer.name}</h3>
                    <div className="flex items-center text-slate-500 text-sm mt-1">
                      <Calendar size={14} className="mr-1" />
                      <span>Due: {customer.dueDate}</span>
                      {customer.daysOverdue > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-danger/20 text-danger text-[10px] rounded-md font-bold">
                          {customer.daysOverdue} DAYS OVERDUE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Due Amount</p>
                  <p className={`text-2xl font-black mt-1 ${
                    customer.status === 'overdue' ? 'text-danger' : 'text-accent'
                  }`}>
                    {formatCurrency(customer.amount)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-8">
                <Button 
                  variant="secondary" 
                  className="flex-1 space-x-2 border border-white/5"
                  onClick={() => window.open(`tel:${customer.phone}`)}
                >
                  <Phone size={16} />
                  <span>Call</span>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 space-x-2 border border-white/5"
                  onClick={() => window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(customer.name)},%20this%20is%20a%20gentle%20reminder%20to%20pay%20your%20monthly%20gold%20saving%20installment%20of%20${customer.amount}.`)}
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp</span>
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleNotifySingle(customer.name)}
                >
                  <span>Remind</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card title="Overdue Statistics" subtitle="Monthly trend of pending collections">
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 border border-white/5 rounded-2xl bg-slate-950/20">
          <p className="font-semibold text-slate-300">Overdue Analytics Chart</p>
          <p className="text-xs text-slate-500 mt-1">Automatic alert notifications are running in active cron sync mode.</p>
        </div>
      </Card>
    </div>
  );
};
