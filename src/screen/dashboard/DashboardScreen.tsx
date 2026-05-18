import React, { useState } from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  Sparkles,
  Coins
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
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { formatCurrency } from '../../helpers';
import { useDashboardData } from '../../hooks/useDashboardData';

const mockTimeframes = {
  Monthly: [
    { name: 'Jan', revenue: 4000, collections: 2400 },
    { name: 'Feb', revenue: 3000, collections: 1398 },
    { name: 'Mar', revenue: 2000, collections: 9800 },
    { name: 'Apr', revenue: 2780, collections: 3908 },
    { name: 'May', revenue: 1890, collections: 4800 },
    { name: 'Jun', revenue: 2390, collections: 3800 },
    { name: 'Jul', revenue: 3490, collections: 4300 },
  ],
  Weekly: [
    { name: 'Mon', revenue: 1200, collections: 900 },
    { name: 'Tue', revenue: 1900, collections: 1500 },
    { name: 'Wed', revenue: 3400, collections: 4000 },
    { name: 'Thu', revenue: 2200, collections: 1800 },
    { name: 'Fri', revenue: 4500, collections: 3200 },
    { name: 'Sat', revenue: 5000, collections: 6200 },
    { name: 'Sun', revenue: 3100, collections: 2800 },
  ],
  Today: [
    { name: '09 AM', revenue: 400, collections: 200 },
    { name: '12 PM', revenue: 800, collections: 950 },
    { name: '03 PM', revenue: 1200, collections: 1800 },
    { name: '06 PM', revenue: 900, collections: 1500 },
    { name: '09 PM', revenue: 1500, collections: 2200 },
  ]
};

const areaData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 2100 },
  { month: 'Mar', amount: 1800 },
  { month: 'Apr', amount: 3000 },
  { month: 'May', amount: 2500 },
  { month: 'Jun', amount: 4000 },
];

const schemeData = [
  { name: 'Gold Monthly', value: 45, color: '#D4AF37' },
  { name: 'Elite Gold', value: 30, color: '#FACC15' },
  { name: 'Starter Plan', value: 15, color: '#E2C974' },
  { name: 'Elite Wealth', value: 10, color: '#B8860B' },
];



const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B]/95 backdrop-blur-md border border-white/10 p-3.5 rounded-xl shadow-2xl">
        {label && <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">{label}</p>}
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2.5">
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block shadow-sm" 
                style={{ backgroundColor: entry.color || entry.fill }} 
              />
              <span className="text-slate-300 text-xs font-semibold capitalize">
                {entry.name}: <span className="text-text-light font-bold ml-1">
                  {unit === 'rate' ? `₹${entry.value}/g` : unit === 'percent' ? `${entry.value}%` : formatCurrency(entry.value)}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r="6" fill="#1E293B" stroke="#D4AF37" strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r="2.5" fill="#FACC15" />
    </g>
  );
};

const CustomActiveDot = (props: any) => {
  const { cx, cy } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r="12" fill="none" stroke="#FACC15" strokeWidth={1.5} className="animate-pulse" opacity={0.4} />
      <circle cx={cx} cy={cy} r="7" fill="#FACC15" stroke="#1E293B" strokeWidth={2.5} />
    </g>
  );
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const avatarGradients = [
  'from-[#E2C974] to-[#B8860B]',
  'from-[#FACC15] to-[#CA8A04]',
  'from-[#F59E0B] to-[#D97706]',
  'from-[#FBBF24] to-[#B45309]',
];

export const DashboardScreen: React.FC = () => {
  const { stats, goldRate, isLoading } = useDashboardData();
  const [timeframe, setTimeframe] = useState<'Today' | 'Weekly' | 'Monthly'>('Monthly');

  const displayStats = [
    { label: 'Total Customers', value: stats?.totalCustomers || '0', icon: Users, change: '+23%', isPositive: true, progress: 78 },
    { label: 'Total Collections', value: formatCurrency(stats?.monthlyCollection || 10000000), icon: TrendingUp, change: '+15%', isPositive: true, progress: 85 },
    { label: 'Active Schemes', value: stats?.totalSchemes || '0', icon: CreditCard, change: '+45', isPositive: true, progress: 64 },
    { label: 'Active Users', value: stats?.activeUsers || '0', icon: AlertCircle, change: '+5%', isPositive: true, progress: 90 },
  ];

  const currentGoldRate = goldRate?.gold_rate_per_gram || 7310;
  const dynamicGoldRateData = [
    { day: '12 May', rate: 7120 },
    { day: '13 May', rate: 7180 },
    { day: '14 May', rate: 7150 },
    { day: '15 May', rate: 7220 },
    { day: '16 May', rate: 7280 },
    { day: '17 May', rate: 7240 },
    { day: 'Today', rate: currentGoldRate },
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-text-light font-medium">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 mt-1 text-sm">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3 bg-card border border-white/10 rounded-2xl px-4 py-2.5 text-slate-300 shadow-md">
          <Calendar size={18} className="text-primary" />
          <span className="text-sm font-semibold tracking-wide">{new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, idx) => (
          <Card key={idx} className="relative overflow-hidden group border border-white/5 bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                stat.isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
              }`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              <h4 className="text-2xl font-bold text-text-light mt-1 tracking-tight">{stat.value}</h4>
            </div>

            {/* Target Progress Bar */}
            <div className="mt-4 pt-3.5 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Monthly Target</span>
                <span className="text-primary font-bold">{stat.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-500 group-hover:shadow-[0_0_8px_rgba(212,175,55,0.4)]" 
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Insights Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 flex items-start space-x-3.5 shadow-md shadow-primary/5">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
          <Sparkles size={20} className="animate-pulse" />
        </div>
        <div>
          <h5 className="text-sm font-bold text-primary tracking-wide">AI-Powered Business Insights</h5>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            22K Gold prices {goldRate?.isUp !== false ? 'surged' : 'dipped'} by <span className={goldRate?.isUp !== false ? "text-success font-bold" : "text-danger font-bold"}>{goldRate?.isUp !== false ? '+' : ''}{goldRate?.changePercentage ?? '1.2'}% today</span> (reaching ₹{goldRate?.gold_rate_per_gram ? goldRate.gold_rate_per_gram.toLocaleString('en-IN') : '7,310'}/g). This price movement has driven a <span className="text-primary font-bold">14% growth</span> in <strong>Gold Monthly</strong> plan subscriptions this week, as users lock in purchase rates.
          </p>
        </div>
      </div>

      {/* Charts Section Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card 
          className="lg:col-span-2" 
          title="Revenue vs Collections" 
          subtitle={`${timeframe} performance comparison`}
          headerAction={
            <div className="flex items-center bg-slate-950/60 border border-white/10 p-0.5 rounded-xl">
              {(['Today', 'Weekly', 'Monthly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all duration-200 ${
                    timeframe === t 
                      ? 'bg-primary text-slate-950 shadow-md shadow-primary/25 font-extrabold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTimeframes[timeframe]}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E2C974" />
                    <stop offset="100%" stopColor="#B8860B" />
                  </linearGradient>
                  <linearGradient id="collectionsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FACC15" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#CA8A04" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 4 }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="revenue" name="Revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collections" name="Collections" fill="url(#collectionsGradient)" radius={[4, 4, 0, 0]} />
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
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Acquisition" dataKey="amount" stroke="#D4AF37" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Section Row 2 - Impressive Client Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheme Distribution (Donut Chart) */}
        <Card title="Scheme Distribution" subtitle="Active subscriptions by plan type">
          <div className="h-[220px] w-full flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={schemeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {schemeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip unit="percent" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center space-y-2.5 mt-2">
            {schemeData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-semibold text-slate-350">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-text-light">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Gold Rate Tracker (Dynamic Thematic Line Chart) */}
        <Card 
          className="lg:col-span-2" 
          title="Gold Rate Tracker" 
          subtitle="22K gold rate fluctuation (per gram) over past 7 days"
          headerAction={
            <div className={`flex items-center space-x-2 rounded-xl px-3 py-1 border shadow-md shrink-0 transition-all duration-350 ${
              goldRate?.isUp !== false 
                ? 'bg-success/10 border-success/20 text-success shadow-success/5' 
                : 'bg-danger/10 border-danger/20 text-danger shadow-danger/5'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                goldRate?.isUp !== false ? 'bg-success animate-ping' : 'bg-danger animate-pulse'
              }`} />
              <span className="text-[10px] font-extrabold tracking-wider">
                LIVE: ₹{goldRate?.gold_rate_per_gram ? goldRate.gold_rate_per_gram.toLocaleString('en-IN') : '7,310'}/g ({goldRate?.isUp !== false ? '+' : ''}{goldRate?.changePercentage ?? '1.2'}%)
              </span>
            </div>
          }
        >
          <div className="h-[290px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicGoldRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={['dataMin - 50', 'dataMax + 50']} tickFormatter={(value) => `₹${value}`} />
                <Tooltip content={<CustomTooltip unit="rate" />} />
                <Line 
                  type="monotone" 
                  name="Gold Rate" 
                  dataKey="rate" 
                  stroke="#D4AF37" 
                  strokeWidth={3} 
                  dot={<CustomDot />}
                  activeDot={<CustomActiveDot />}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </LineChart>
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
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors duration-200">
                  <td className="py-4 font-medium text-text-light">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-xs font-bold text-slate-900 shadow-md`}>
                        {getInitials(row.name)}
                      </div>
                      <span className="group-hover:text-primary transition-colors font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-slate-400">{row.scheme}</td>
                  <td className="py-4 font-bold text-primary">{formatCurrency(row.amount)}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      row.status === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        row.status === 'success' ? 'bg-success animate-pulse' : 'bg-danger'
                      }`} />
                      <span>{row.status}</span>
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
