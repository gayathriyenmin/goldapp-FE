import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';
import { Card, Button, Modal, Input } from '../../components/common';
import type { Scheme } from '../../interfaces';
import { formatCurrency } from '../../helpers';
import { useSchemes } from '../../hooks/useSchemes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { schemeService } from '../../store/services';
import toast from 'react-hot-toast';

const schemeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  monthlyAmount: z.coerce.number().min(1, 'Monthly amount must be at least 1'),
  durationMonths: z.coerce.number().min(1, 'Duration must be at least 1 month'),
  bonusAmount: z.coerce.number().optional(),
  maturityAmount: z.coerce.number().optional(),
});

type SchemeFormValues = z.infer<typeof schemeSchema>;

export const SchemeManagementScreen: React.FC = () => {
  const { schemes, isLoading, refetch } = useSchemes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SchemeFormValues>({
    resolver: zodResolver(schemeSchema),
  });

  const handleOpenModal = (scheme?: Scheme) => {
    if (scheme) {
      setEditingScheme(scheme);
      setValue('name', scheme.name);
      setValue('description', scheme.description);
      setValue('monthlyAmount', scheme.monthlyAmount);
      setValue('durationMonths', scheme.durationMonths);
      setValue('bonusAmount', scheme.bonusAmount);
      setValue('maturityAmount', scheme.maturityAmount);
    } else {
      setEditingScheme(null);
      reset({
        name: '',
        description: '',
        monthlyAmount: 0,
        durationMonths: 12,
        bonusAmount: 0,
        maturityAmount: 0,
      });
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: SchemeFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingScheme) {
        const response = await schemeService.update(editingScheme.id, data);
        toast.success(response.message || 'Scheme updated successfully');
      } else {
        const response = await schemeService.create(data);
        toast.success(response.message || 'Scheme created successfully');
      }
      setIsModalOpen(false);
      setEditingScheme(null);
      reset();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string | number, currentStatus: boolean) => {
    try {
      const response = await schemeService.updateStatus(id, !currentStatus);
      toast.success(response.message || `Scheme ${!currentStatus ? 'activated' : 'deactivated'}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to permanently delete this scheme?')) {
      try {
        const response = await schemeService.delete(id);
        toast.success(response.message || 'Scheme deleted');
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete scheme');
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-text-light">Loading Schemes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Scheme Management</h1>
          <p className="text-slate-400 mt-1">Configure and manage gold saving schemes</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => handleOpenModal()}
        >
          <Plus size={20} />
          <span>Create New Scheme</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:scale-150 ${
              scheme.isActive ? 'bg-success' : 'bg-slate-500'
            }`} />
            
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <TrendingUp size={24} />
              </div>
              <button 
                onClick={() => handleToggleStatus(scheme.id, scheme.isActive)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-all hover:scale-105 ${
                  scheme.isActive ? 'bg-success/10 text-success' : 'bg-slate-500/10 text-slate-500'
                }`}
              >
                {scheme.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <span>{scheme.isActive ? 'Active' : 'Inactive'}</span>
              </button>
            </div>

            <h3 className="text-xl font-bold text-text-light mb-2">{scheme.name}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{scheme.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500">
                  <Calendar size={16} className="mr-2" />
                  <span>Duration</span>
                </div>
                <span className="text-text-light font-semibold">{scheme.durationMonths} Months</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-500">
                  <ShieldCheck size={16} className="mr-2" />
                  <span>Monthly Investment</span>
                </div>
                <span className="text-text-light font-semibold">
                  {formatCurrency(scheme.monthlyAmount)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="flex-1 py-2 text-sm"
                onClick={() => handleOpenModal(scheme)}
              >
                <Edit2 size={16} className="mr-2" />
                Edit
              </Button>
              <Button 
                variant="secondary" 
                className="p-2 hover:text-danger hover:bg-danger/10"
                onClick={() => handleDelete(scheme.id)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </Card>
        ))}

        <button 
          onClick={() => handleOpenModal()}
          className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all duration-300 group min-h-[350px]"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-semibold">Add New Scheme</span>
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingScheme ? "Edit Gold Scheme" : "Create New Gold Scheme"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Scheme Name"
            placeholder="e.g. Gold Monthly Saver"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Description"
            placeholder="Brief details about the scheme"
            {...register('description')}
            error={errors.description?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Amount (₹)"
              type="number"
              placeholder="5000"
              {...register('monthlyAmount')}
              error={errors.monthlyAmount?.message}
            />
            <Input
              label="Duration (Months)"
              type="number"
              placeholder="12"
              {...register('durationMonths')}
              error={errors.durationMonths?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Bonus Amount (Optional)"
              type="number"
              placeholder="1000"
              {...register('bonusAmount')}
              error={errors.bonusAmount?.message}
            />
            <Input
              label="Maturity Amount (Optional)"
              type="number"
              placeholder="61000"
              {...register('maturityAmount')}
              error={errors.maturityAmount?.message}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting}
            >
              {editingScheme ? 'Update Scheme' : 'Create Scheme'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
