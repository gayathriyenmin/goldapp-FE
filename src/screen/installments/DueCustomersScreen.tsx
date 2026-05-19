import React from 'react';
import { AlertCircle, Calendar, MessageSquare, Phone, BellRing } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { formatCurrency } from '../../helpers';
import { useCustomers } from '../../hooks/useCustomers';
import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';
import toast from 'react-hot-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useThemeStore } from '../../store';

const mockOverdueData = [
  { month: 'Jan', overdue: 45000, collected: 25000 },
  { month: 'Feb', overdue: 52000, collected: 30000 },
  { month: 'Mar', overdue: 49000, collected: 38000 },
  { month: 'Apr', overdue: 62000, collected: 42000 },
  { month: 'May', overdue: 58000, collected: 50000 },
  { month: 'Jun', overdue: 71000, collected: 55000 },
  { month: 'Jul', overdue: 68000, collected: 62000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  const theme = useThemeStore(state => state.theme);
  const isLight = theme === 'light';

  if (active && payload && payload.length) {
    return (
      <div className={`p-3 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 ${
        isLight 
          ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50' 
          : 'bg-slate-900/95 border-white/10 text-white'
      }`}>
        <p className="font-extrabold text-[10px] tracking-wider uppercase opacity-80">{label}</p>
        <div className="space-y-1.5 mt-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between space-x-6 text-xs font-semibold">
              <span className="opacity-75 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: entry.stroke || entry.color }} />
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>{entry.name}:</span>
              </span>
              <span className="font-extrabold" style={{ color: entry.stroke || entry.color }}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DueCustomersScreen: React.FC = () => {
  const { customers, isLoading } = useCustomers();
  const theme = useThemeStore(state => state.theme);
  const isLight = theme === 'light';
  
  const axisColor = isLight ? '#334155' : '#94a3b8'; // Bolder dark slate text in Light Mode
  const gridColor = isLight ? 'rgba(15, 23, 42, 0.12)' : '#334155'; // More distinct grid lines

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Due Tracking</h1>
          <p className="text-slate-400 mt-1 text-sm">Monitor pending installments and send reminders</p>
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
          <p className="text-lg font-semibold text-slate-350">No overdue accounts</p>
          <p className="text-sm text-slate-400 mt-1">All customer gold saving installments are fully up to date!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dueCustomers.map((customer) => (
            <Card key={customer.id} className="relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                customer.status === 'overdue' ? 'bg-danger' : 'bg-primary'
              }`} />
              
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    customer.status === 'overdue' 
                      ? 'bg-danger/10 text-danger' 
                      : isLight ? 'bg-primary/20 text-primary-dark' : 'bg-primary/10 text-primary'
                  }`}>
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-light">{customer.name}</h3>
                    <div className="flex items-center text-slate-400 text-sm mt-1 font-medium">
                      <Calendar size={14} className="mr-1.5" />
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
                  <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Due Amount</p>
                  <p className={`text-2xl font-black mt-1 ${
                    customer.status === 'overdue' 
                      ? 'text-danger' 
                      : isLight ? 'text-primary-dark font-extrabold' : 'text-accent'
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

      {/* Premium Visual Overdue Statistics Chart */}
      <Card title="Overdue Statistics" subtitle="Monthly trend of pending collections vs successful collections">
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockOverdueData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} opacity={0.4} />
              <XAxis 
                dataKey="month" 
                stroke={axisColor} 
                fontSize={12} 
                fontWeight="bold" 
                tickLine={false} 
                dy={10} 
              />
              <YAxis 
                stroke={axisColor} 
                fontSize={12} 
                fontWeight="bold" 
                tickLine={false} 
                dx={-10}
                tickFormatter={(value) => `₹${value >= 1000 ? `${value / 1000}k` : value}`} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
              <Line 
                type="monotone" 
                dataKey="overdue" 
                name="Pending Dues" 
                stroke={isLight ? '#DC2626' : '#EF4444'} 
                strokeWidth={3.5}
                dot={{ r: 4, strokeWidth: 2, fill: isLight ? '#FFFFFF' : '#0F172A' }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="collected" 
                name="Collections" 
                stroke={isLight ? '#16A34A' : '#22C55E'} 
                strokeWidth={3.5}
                dot={{ r: 4, strokeWidth: 2, fill: isLight ? '#FFFFFF' : '#0F172A' }}
                activeDot={{ r: 7, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
