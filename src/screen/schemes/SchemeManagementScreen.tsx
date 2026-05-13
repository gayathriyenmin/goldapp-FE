import React from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';
import { Card, Button } from '../../components/common';
import type { Scheme } from '../../interfaces';
import { formatCurrency } from '../../helpers';

const mockSchemes: Scheme[] = [
  { id: '1', name: 'Gold Monthly Saver', duration: 12, minAmount: 1000, maxAmount: 50000, description: 'Save monthly and get gold coins at maturity', status: 'active', createdAt: '2023-01-01' },
  { id: '2', name: 'Elite Bullion Plan', duration: 24, minAmount: 50000, maxAmount: 500000, description: 'Premium plan for serious gold investors', status: 'active', createdAt: '2023-02-15' },
  { id: '3', name: 'Starter Gold', duration: 6, minAmount: 500, maxAmount: 5000, description: 'Entry level plan for beginners', status: 'inactive', createdAt: '2023-03-20' },
];

export const SchemeManagementScreen: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Scheme Management</h1>
          <p className="text-slate-400 mt-1">Configure and manage gold saving schemes</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Create New Scheme</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSchemes.map((scheme) => (
          <Card key={scheme.id} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:scale-150 ${
              scheme.status === 'active' ? 'bg-success' : 'bg-slate-500'
            }`} />
            
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <TrendingUp size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                scheme.status === 'active' ? 'bg-success/10 text-success' : 'bg-slate-500/10 text-slate-500'
              }`}>
                {scheme.status === 'active' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <span>{scheme.status}</span>
              </span>
            </div>

            <h3 className="text-xl font-bold text-text-light mb-2">{scheme.name}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{scheme.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500">
                  <Calendar size={16} className="mr-2" />
                  <span>Duration</span>
                </div>
                <span className="text-text-light font-semibold">{scheme.duration} Months</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500">
                  <ShieldCheck size={16} className="mr-2" />
                  <span>Investment</span>
                </div>
                <span className="text-text-light font-semibold">
                  {formatCurrency(scheme.minAmount)} - {formatCurrency(scheme.maxAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex-1 py-2 text-sm">
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
              <Button variant="secondary" className="p-2 hover:text-danger">
                <Trash2 size={18} />
              </Button>
            </div>
          </Card>
        ))}

        <button className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all duration-300 group">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-semibold">Add New Scheme</span>
        </button>
      </div>
    </div>
  );
};
