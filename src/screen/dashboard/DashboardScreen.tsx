import React from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users
} from 'lucide-react';
import { Card } from '../../components/common';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { formatCurrency } from '../../helpers';

const stats = [
  { label: 'Total Customers', value: '2,845', icon: Users, change: '+12%', isPositive: true },
  { label: 'Total Collections', value: '₹12,45,000', icon: TrendingUp, change: '+8.5%', isPositive: true },
  { label: 'Pending Dues', value: '₹4,20,500', icon: AlertCircle, change: '+2.4%', isPositive: false },
  { label: 'Active Schemes', value: '18', icon: CreditCard, change: '+2', isPositive: true },
];

const chartData = [
  { name: 'Jan', revenue: 4000, collections: 2400 },
  { name: 'Feb', revenue: 3000, collections: 1398 },
  { name: 'Mar', revenue: 2000, collections: 9800 },
  { name: 'Apr', revenue: 2780, collections: 3908 },
  { name: 'May', revenue: 1890, collections: 4800 },
  { name: 'Jun', revenue: 2390, collections: 3800 },
  { name: 'Jul', revenue: 3490, collections: 4300 },
];

const areaData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 2100 },
  { month: 'Mar', amount: 1800 },
  { month: 'Apr', amount: 3000 },
  { month: 'May', amount: 2500 },
  { month: 'Jun', amount: 4000 },
];

export const DashboardScreen: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3 bg-card border border-white/10 rounded-xl px-4 py-2 text-slate-300">
          <Calendar size={18} className="text-primary" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-xs font-medium ${stat.isPositive ? 'text-success' : 'text-danger'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span className="ml-1">{stat.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <h4 className="text-2xl font-bold text-text-light mt-1">{stat.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Revenue vs Collections" subtitle="Monthly performance comparison">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collections" fill="#FACC15" radius={[4, 4, 0, 0]} opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Growth Analytics" subtitle="Customer acquisition rate">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#D4AF37" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Transactions Table Mock */}
      <Card title="Recent Transactions" headerAction={<button className="text-primary text-sm font-semibold hover:underline">View All</button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 text-slate-400 font-medium text-sm">Customer</th>
                <th className="pb-4 text-slate-400 font-medium text-sm">Scheme</th>
                <th className="pb-4 text-slate-400 font-medium text-sm">Amount</th>
                <th className="pb-4 text-slate-400 font-medium text-sm">Status</th>
                <th className="pb-4 text-slate-400 font-medium text-sm">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Rajesh Kumar', scheme: 'Gold Monthly', amount: 5000, status: 'success', date: 'Oct 24, 2023' },
                { name: 'Sneha Patil', scheme: 'Elite Gold', amount: 15000, status: 'success', date: 'Oct 23, 2023' },
                { name: 'Amit Sharma', scheme: 'Starter Plan', amount: 2000, status: 'failed', date: 'Oct 23, 2023' },
                { name: 'Priya Singh', scheme: 'Gold Monthly', amount: 5000, status: 'success', date: 'Oct 22, 2023' },
              ].map((row, i) => (
                <tr key={i} className="group">
                  <td className="py-4 font-medium text-text-light">{row.name}</td>
                  <td className="py-4 text-slate-400">{row.scheme}</td>
                  <td className="py-4 font-semibold text-primary">{formatCurrency(row.amount)}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      row.status === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 text-slate-500 text-sm">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
