import React from 'react';
import { AlertCircle, Calendar, MessageSquare, Phone, BellRing } from 'lucide-react';
import { Card, Button } from '../../components/common';
import { formatCurrency } from '../../helpers';

const dueCustomers = [
  { id: '1', name: 'Amit Sharma', amount: 10000, dueDate: '2023-10-15', daysOverdue: 10, status: 'overdue' },
  { id: '2', name: 'Rajesh Kumar', amount: 5000, dueDate: '2023-10-25', daysOverdue: 0, status: 'due-soon' },
  { id: '3', name: 'Vikram Mehta', amount: 3000, dueDate: '2023-10-10', daysOverdue: 15, status: 'overdue' },
  { id: '4', name: 'Sunita Gupta', amount: 8000, dueDate: '2023-10-20', daysOverdue: 5, status: 'overdue' },
];

export const DueCustomersScreen: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Due Tracking</h1>
          <p className="text-slate-400 mt-1">Monitor pending installments and send reminders</p>
        </div>
        <Button variant="danger" className="flex items-center space-x-2">
          <BellRing size={20} />
          <span>Notify All Overdue</span>
        </Button>
      </div>

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
              <Button variant="secondary" className="flex-1 space-x-2 border border-white/5">
                <Phone size={16} />
                <span>Call</span>
              </Button>
              <Button variant="secondary" className="flex-1 space-x-2 border border-white/5">
                <MessageSquare size={16} />
                <span>WhatsApp</span>
              </Button>
              <Button className="flex-1">
                <span>Collect Payment</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Overdue Statistics" subtitle="Monthly trend of pending collections">
        <div className="h-64 flex items-center justify-center text-slate-600 border-2 border-dashed border-white/5 rounded-2xl">
          <p>Overdue Analytics Chart Integration Ready</p>
        </div>
      </Card>
    </div>
  );
};
