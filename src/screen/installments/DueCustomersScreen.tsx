import React from 'react';
import { AlertCircle, Calendar, MessageSquare, Phone, BellRing, Search, Filter } from 'lucide-react';
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
  const [dueCustomers, setDueCustomers] = React.useState<any[]>([]);
  const [overdueStats, setOverdueStats] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isNotifyingAll, setIsNotifyingAll] = React.useState(false);
  const [notifyingUserId, setNotifyingUserId] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [schemeFilter, setSchemeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  
  const theme = useThemeStore(state => state.theme);
  const isLight = theme === 'light';
  
  const axisColor = isLight ? '#334155' : '#94a3b8'; // Bolder dark slate text in Light Mode
  const gridColor = isLight ? 'rgba(15, 23, 42, 0.12)' : '#334155'; // More distinct grid lines

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { installmentService } = await import('../../store/services');
        const [duesRes, statsRes] = await Promise.all([
          installmentService.getDueInstallments(),
          installmentService.getOverdueStats(),
        ]);
        
        const mappedDues = duesRes.data.map((inst: any) => {
          const dueDate = new Date(inst.dueDate);
          const today = new Date();
          const diffTime = today.getTime() - dueDate.getTime();
          const diffDays = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
          
          return {
            id: inst.id, // Using installment id as unique key
            userId: inst.customerScheme?.customer?.id,
            name: inst.customerScheme?.customer?.fullName || 'Unknown',
            phone: inst.customerScheme?.customer?.mobileNumber || '+91 0000000000',
            amount: Number(inst.amount),
            dueDate: inst.dueDate.split('T')[0],
            daysOverdue: diffDays,
            status: diffDays > 0 ? 'overdue' : 'due-soon',
            schemeName: inst.customerScheme?.scheme?.name || 'Unknown Scheme',
          };
        });
        
        setDueCustomers(mappedDues);
        setOverdueStats(statsRes.data);
      } catch (error) {
        toast.error('Failed to fetch ledger dues');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNotifyAll = async () => {
    try {
      setIsNotifyingAll(true);
      const { notificationService } = await import('../../store/services');
      await notificationService.remindOverdue({
        title: "Overdue Installment Reminder",
        description: "Dear Customer, you have pending gold saving installments. Please pay at your earliest convenience."
      });
      toast.success('Successfully sent payment notifications to all overdue members!');
    } catch (error) {
      toast.error('Failed to send notifications to all overdue members');
    } finally {
      setIsNotifyingAll(false);
    }
  };

  const handleNotifySingle = async (userId: number, name: string) => {
    if (!userId) {
      toast.error('User ID not found');
      return;
    }
    try {
      setNotifyingUserId(userId);
      const { notificationService } = await import('../../store/services');
      await notificationService.remindSingle(userId, {
        title: "Installment Due Reminder",
        description: `Dear ${name}, your gold saving installment is currently pending. Please ensure payment to continue your scheme.`
      });
      toast.success(`Sent reminder notification to ${name}`);
    } catch (error) {
      toast.error(`Failed to send reminder notification to ${name}`);
    } finally {
      setNotifyingUserId(null);
    }
  };

  const filteredCustomers = React.useMemo(() => {
    return dueCustomers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            customer.phone.includes(searchQuery);
      const matchesScheme = schemeFilter === 'all' || customer.schemeName === schemeFilter;
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      return matchesSearch && matchesScheme && matchesStatus;
    });
  }, [dueCustomers, searchQuery, schemeFilter, statusFilter]);

  const uniqueSchemes = React.useMemo(() => Array.from(new Set(dueCustomers.map(c => c.schemeName))), [dueCustomers]);

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
          disabled={dueCustomers.length === 0 || isNotifyingAll}
        >
          <BellRing size={20} className={isNotifyingAll ? "animate-pulse" : ""} />
          <span>{isNotifyingAll ? "Notifying..." : "Notify All Overdue"}</span>
        </Button>
      </div>

      {/* Premium Visual Overdue Statistics Chart */}
      <Card title="Overdue Statistics" subtitle="Monthly trend of pending collections vs successful collections">
        <div className="h-72 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overdueStats.length > 0 ? overdueStats : mockOverdueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                tickFormatter={(value) => `₹${value / 1000}k`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="overdue" 
                name="Overdue" 
                stroke="#ef4444" 
                strokeWidth={4}
                dot={{ r: 6, fill: '#ef4444', strokeWidth: 2, stroke: isLight ? '#ffffff' : '#0f172a' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
              <Line 
                type="monotone" 
                dataKey="collected" 
                name="Collected" 
                stroke="#10b981" 
                strokeWidth={4}
                dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: isLight ? '#ffffff' : '#0f172a' }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filter Section */}
      <Card className="p-4 bg-card/50 backdrop-blur-md border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/50">
              <div className="pl-3 pr-2 text-slate-500">
                <Filter size={16} />
              </div>
              <select
                value={schemeFilter}
                onChange={(e) => setSchemeFilter(e.target.value)}
                className="bg-transparent py-2.5 pr-4 text-sm text-text-light focus:outline-none w-40 cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Schemes</option>
                {uniqueSchemes.map(scheme => (
                  <option key={scheme as string} value={scheme as string} className="bg-slate-800">{scheme as string}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/50">
              <div className="pl-3 pr-2 text-slate-500">
                <AlertCircle size={16} />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent py-2.5 pr-4 text-sm text-text-light focus:outline-none w-32 cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="overdue" className="bg-slate-800">Overdue</option>
                <option value="due-soon" className="bg-slate-800">Due Soon</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {filteredCustomers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-slate-500">
          <p className="text-lg font-semibold text-slate-350">No customers found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters.</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <th className="p-5 whitespace-nowrap">Customer</th>
                  <th className="p-5 whitespace-nowrap">Scheme</th>
                  <th className="p-5 whitespace-nowrap">Due Date</th>
                  <th className="p-5 whitespace-nowrap">Amount</th>
                  <th className="p-5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${customer.status === 'overdue' ? 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]'}`} />
                        <div>
                          <p className="font-bold text-text-light">{customer.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{customer.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-sm font-semibold text-slate-300">{customer.schemeName}</span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-light flex items-center">
                          <Calendar size={13} className="mr-2 text-slate-500" />
                          {customer.dueDate}
                        </span>
                        {customer.daysOverdue > 0 && (
                          <span className="text-[10px] text-danger font-bold mt-1 tracking-wider uppercase">
                            {customer.daysOverdue} DAYS OVERDUE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`text-base font-black tracking-wide ${customer.status === 'overdue' ? 'text-danger' : 'text-accent'}`}>
                        {formatCurrency(customer.amount)}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-end space-x-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="secondary" 
                          className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10"
                          onClick={() => window.open(`tel:${customer.phone}`)}
                          title="Call Customer"
                        >
                          <Phone size={16} />
                        </Button>
                        <Button 
                          variant="secondary" 
                          className="p-2.5 rounded-xl border border-white/10 text-success hover:bg-success/20 hover:border-success/30"
                          onClick={() => window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(customer.name)},%20this%20is%20a%20gentle%20reminder%20to%20pay%20your%20monthly%20gold%20saving%20installment%20of%20${customer.amount}.`)}
                          title="Message on WhatsApp"
                        >
                          <MessageSquare size={16} />
                        </Button>
                        <Button 
                          className="py-2 px-4 text-sm font-semibold rounded-xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20"
                          onClick={() => handleNotifySingle(customer.userId, customer.name)}
                          disabled={notifyingUserId === customer.userId}
                        >
                          {notifyingUserId === customer.userId ? "..." : "Remind"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
