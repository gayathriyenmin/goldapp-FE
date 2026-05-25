import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, TrendingUp, Calendar, ShieldCheck, Filter, Search, MessageSquare } from 'lucide-react';
import { Card, Button, Modal, Input, Toggle, ConfirmModal } from '../../components/common';
import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';
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
  const { schemes, isLoading, refetch, filters, updateFilters, updateSchemeLocal } = useSchemes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [schemeToDelete, setSchemeToDelete] = useState<string | number | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [schemeToToggle, setSchemeToToggle] = useState<{id: string | number, currentStatus: boolean} | null>(null);
  const [statusReason, setStatusReason] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<SchemeFormValues>({
    resolver: zodResolver(schemeSchema),
  });

  const handleOpenModal = (scheme?: Scheme) => {
    if (scheme) {
      setEditingScheme(scheme);
      setValue('name', scheme.name);
      setValue('description', scheme.description || '');
      setValue('monthlyAmount', scheme.monthlyAmount);
      setValue('durationMonths', scheme.durationMonths);
      setValue('bonusAmount', scheme.bonusAmount || 0);
      setValue('maturityAmount', scheme.maturityAmount || 0);
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

  const handleToggleStatusClick = (id: string | number, currentStatus: boolean) => {
    setSchemeToToggle({ id, currentStatus });
    setStatusReason('');
    setIsStatusModalOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!schemeToToggle) return;
    const { id, currentStatus } = schemeToToggle;
    setIsSubmitting(true);
    try {
      const trimmedReason = statusReason.trim();
      // Optimistic update: change status in UI immediately
      updateSchemeLocal(id, { isActive: !currentStatus, statusReason: trimmedReason });
      
      await schemeService.updateStatus(id, !currentStatus, trimmedReason);
      toast.success(`Scheme ${!currentStatus ? 'activated' : 'deactivated'}`);
      setIsStatusModalOpen(false);
      setSchemeToToggle(null);
      // We don't refetch here to prevent the backend's "Active-only" default 
      // from removing the card we just made inactive.
    } catch (error: any) {
      // Revert on error
      updateSchemeLocal(id, { isActive: currentStatus });
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string | number) => {
    setSchemeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!schemeToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await schemeService.delete(schemeToDelete);
      toast.success(response.message || 'Scheme deleted');
      setIsDeleteModalOpen(false);
      setSchemeToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete scheme');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PremiumPageLoader isLoading={true} text="Synchronizing Schemes" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Scheme Management</h1>
          <p className="text-slate-400 mt-1">Configure and manage gold saving schemes</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            className="flex items-center space-x-2"
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} />
            <span>Create New Scheme</span>
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <Card className="p-4 bg-card/50 backdrop-blur-md border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search schemes by name..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/5 rounded-lg text-slate-400">
              <Filter size={18} />
            </div>
            <div className="flex bg-white/5 rounded-xl p-1">
              {[
                { label: 'All', value: undefined },
                { label: 'Active', value: '1' },
                { label: 'Inactive', value: '0' }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => updateFilters({ isActive: option.value })}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.isActive === option.value
                      ? 'bg-primary text-background shadow-lg'
                      : 'text-slate-400 hover:text-text-light'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:scale-150 ${
              Boolean(scheme.isActive) ? 'bg-success' : 'bg-slate-500'
            }`} />
            
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <TrendingUp size={24} />
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Toggle 
                  enabled={Boolean(scheme.isActive)} 
                  onChange={() => handleToggleStatusClick(scheme.id, Boolean(scheme.isActive))} 
                />
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                  Boolean(scheme.isActive) ? 'bg-success/10 text-success' : 'bg-slate-500/10 text-slate-500'
                }`}>
                  {Boolean(scheme.isActive) ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  <span>{Boolean(scheme.isActive) ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-text-light mb-2">{scheme.name}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{scheme.description}</p>

            {scheme.statusReason && (
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border-l-4 border-primary shadow-sm">
                <div className="flex items-start space-x-3">
                  <MessageSquare size={18} className="text-primary mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">
                      {scheme.isActive ? 'Activation Note' : 'Deactivation Reason'}
                    </span>
                    <p className="text-sm text-text-light font-medium italic">"{scheme.statusReason}"</p>
                  </div>
                </div>
              </div>
            )}

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
                onClick={() => handleDeleteClick(scheme.id)}
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Scheme"
        message="Are you sure you want to permanently delete this scheme? This action cannot be undone."
        confirmText="Delete Permanently"
        isLoading={isSubmitting}
      />

      <ConfirmModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleConfirmToggleStatus}
        title={schemeToToggle?.currentStatus ? "Deactivate Scheme" : "Activate Scheme"}
        message={`Are you sure you want to ${schemeToToggle?.currentStatus ? 'deactivate' : 'activate'} this scheme?`}
        confirmText={schemeToToggle?.currentStatus ? "Yes, Deactivate" : "Yes, Activate"}
        isLoading={isSubmitting}
      >
        <textarea
          placeholder={schemeToToggle?.currentStatus ? "Reason for deactivation (optional)..." : "Note for activation (optional)..."}
          value={statusReason}
          onChange={(e) => setStatusReason(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50"
          rows={3}
        />
      </ConfirmModal>
    </div>
  );
};
