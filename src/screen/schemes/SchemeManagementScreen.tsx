import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, TrendingUp, Calendar, ShieldCheck, Filter, Search, MessageSquare, ChevronDown } from 'lucide-react';
import { Card, Button, Modal, Input, Toggle, ConfirmModal } from '../../components/common';
import { PremiumPageLoader } from '../../components/common/PremiumPageLoader';
import { SchemeType, type Scheme } from '../../interfaces';
import { formatCurrency } from '../../helpers';
import { useSchemes } from '../../hooks/useSchemes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { schemeService } from '../../store/services';
import toast from 'react-hot-toast';

const schemeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  nameTa: z.string().optional(),
  schemeType: z.nativeEnum(SchemeType),
  description: z.string().optional(),
  descriptionTa: z.string().optional(),
  
  // Amounts
  monthlyAmount: z.coerce.number().optional(),
  oneTimeAmount: z.coerce.number().optional(),
  minAmount: z.coerce.number().optional(),
  
  // Duration
  durationMonths: z.coerce.number().optional(),
  lockPeriodMonths: z.coerce.number().optional(),
  payableInstallments: z.coerce.number().optional(),
  bonusInstallments: z.coerce.number().optional(),

  // Features
  autoGoldAllocation: z.boolean().optional(),
  bonusEnabled: z.boolean().optional(),
  bonusValue: z.coerce.number().optional(),
  bonusTiers: z.string().optional(),
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
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  
  const schemeTypeOptions = [
    { value: 'gold_rate_monthly', label: 'Gold Rate Based Monthly Savings' },
    { value: 'gold_lock', label: 'One-Time Gold Lock Scheme' },
    { value: '11_plus_1_bonus', label: '11+1 Monthly Bonus Scheme' },
  ];
  
  const [bonusTiers, setBonusTiers] = useState<{months: number, bonus: number}[]>([
    { months: 6, bonus: 500 },
    { months: 8, bonus: 750 },
    { months: 10, bonus: 1000 },
    { months: 12, bonus: 1500 },
  ]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<SchemeFormValues>({
    resolver: zodResolver(schemeSchema) as any,
  });

  const selectedSchemeType = watch('schemeType') || SchemeType.GOLD_RATE_MONTHLY;

  const handleOpenModal = (scheme?: Scheme) => {
    if (scheme) {
      setEditingScheme(scheme);
      setValue('name', scheme.name);
      setValue('nameTa', scheme.nameTa || '');
      setValue('schemeType', scheme.schemeType || SchemeType.GOLD_RATE_MONTHLY);
      setValue('description', scheme.description || '');
      setValue('descriptionTa', scheme.descriptionTa || '');
      setValue('monthlyAmount', scheme.monthlyAmount || 0);
      setValue('oneTimeAmount', scheme.oneTimeAmount || 0);
      setValue('minAmount', scheme.minAmount || 0);
      setValue('durationMonths', scheme.durationMonths || 12);
      setValue('lockPeriodMonths', scheme.lockPeriodMonths || 6);
      setValue('payableInstallments', scheme.payableInstallments || 11);
      setValue('bonusInstallments', scheme.bonusInstallments || 1);
      setValue('autoGoldAllocation', scheme.autoGoldAllocation || false);
      setValue('bonusEnabled', scheme.bonusEnabled || false);
      setValue('bonusValue', scheme.bonusValue || 0);

      let loadedTiers = [
        { months: 6, bonus: 500 },
        { months: 8, bonus: 750 },
        { months: 10, bonus: 1000 },
        { months: 12, bonus: 1500 },
      ];
      if (scheme.bonusTiers) {
        try {
           loadedTiers = JSON.parse(scheme.bonusTiers);
        } catch(e) {}
      }
      setBonusTiers(loadedTiers);
    } else {
      setEditingScheme(null);
      reset({
        name: '',
        nameTa: '',
        schemeType: SchemeType.GOLD_RATE_MONTHLY,
        description: '',
        descriptionTa: '',
        monthlyAmount: 1000,
        oneTimeAmount: 50000,
        minAmount: 500,
        durationMonths: 12,
        lockPeriodMonths: 6,
        payableInstallments: 11,
        bonusInstallments: 1,
        autoGoldAllocation: true,
        bonusEnabled: false,
        bonusValue: 500,
      });
      setBonusTiers([
        { months: 6, bonus: 500 },
        { months: 8, bonus: 750 },
        { months: 10, bonus: 1000 },
        { months: 12, bonus: 1500 },
      ]);
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: SchemeFormValues) => {
    setIsSubmitting(true);
    const payload = { ...data, bonusTiers: JSON.stringify(bonusTiers) };
    try {
      if (editingScheme) {
        const response = await schemeService.update(editingScheme.id, payload);
        toast.success(response.message || 'Scheme updated successfully');
      } else {
        const response = await schemeService.create(payload);
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
    const trimmedReason = statusReason.trim();
    if (!trimmedReason) {
      toast.error('Please provide a reason for the status change.');
      return;
    }
    const { id, currentStatus } = schemeToToggle;
    setIsSubmitting(true);
    try {
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
          <Card key={scheme.id} className="relative overflow-hidden group h-full flex flex-col">
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

            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-text-light">{scheme.name}</h3>
              <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-md font-bold uppercase tracking-wider">
                {scheme.schemeType === 'gold_rate_monthly' ? 'Gold Rate Monthly' : 
                 scheme.schemeType === 'gold_lock' ? 'One-Time Lock' : 
                 scheme.schemeType === '11_plus_1_bonus' ? '11+1 Bonus' : 'Unknown Type'}
              </span>
            </div>
            {scheme.nameTa && (
              <h4 className="text-sm font-semibold text-slate-400 -mt-1 mb-2">{scheme.nameTa}</h4>
            )}
            <p className="text-slate-400 text-sm mb-2 line-clamp-2">{scheme.description}</p>
            {scheme.descriptionTa && (
              <p className="text-slate-500 text-xs mb-6 line-clamp-2 italic">{scheme.descriptionTa}</p>
            )}

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

            <div className="mt-auto">
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
                    <span>{scheme.schemeType === 'gold_lock' ? 'One-Time Investment' : 'Monthly Investment'}</span>
                  </div>
                  <span className="text-text-light font-semibold">
                    {formatCurrency(scheme.schemeType === 'gold_lock' ? (scheme.oneTimeAmount ?? 0) : (scheme.monthlyAmount ?? 0))}
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
        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Scheme Name (English)"
                placeholder="e.g. Gold Monthly Saver"
                {...register('name')}
                error={errors.name?.message as string}
              />
            </div>
            <div>
              <Input
                label="Scheme Name (Tamil)"
                placeholder="எ.கா. தங்க மாதாந்திர சேமிப்பு"
                {...register('nameTa')}
                error={errors.nameTa?.message as string}
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-400 mb-1">Scheme Type</label>
              
              <div 
                className="w-full bg-background border border-white/10 rounded-xl py-2.5 px-4 text-text-light cursor-pointer flex justify-between items-center hover:border-primary/50 transition-colors"
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
              >
                <span className="text-sm">{schemeTypeOptions.find(o => o.value === selectedSchemeType)?.label}</span>
                <ChevronDown size={18} className="text-slate-400" />
              </div>
              
              {isTypeDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsTypeDropdownOpen(false)} 
                  />
                  <div className="absolute z-50 mt-2 w-full bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden py-1">
                    {schemeTypeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`px-4 py-2.5 cursor-pointer transition-colors text-sm
                          ${selectedSchemeType === option.value 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'text-text-light hover:bg-white/5'
                          }`}
                        onClick={() => {
                          setValue('schemeType', option.value as SchemeType);
                          setIsTypeDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {errors.schemeType && (
                <p className="mt-1 text-xs text-danger">{errors.schemeType.message as string}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Description (English)"
                placeholder="Brief details about the scheme in English"
                {...register('description')}
                error={errors.description?.message}
              />
            </div>
            <div>
              <Input
                label="Description (Tamil)"
                placeholder="திட்டத்தைப் பற்றிய சுருக்கமான விவரங்கள்"
                {...register('descriptionTa')}
                error={errors.descriptionTa?.message}
              />
            </div>
          </div>
          {/* DYNAMIC FIELDS BASED ON SCHEME TYPE */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Scheme Configuration</h4>
            
            {selectedSchemeType === 'gold_rate_monthly' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monthly Amount (₹)"
                  type="number"
                  {...register('monthlyAmount')}
                  error={errors.monthlyAmount?.message}
                />
                <Input
                  label="Duration (Months)"
                  type="number"
                  {...register('durationMonths')}
                  error={errors.durationMonths?.message}
                />
              </div>
            )}

            {selectedSchemeType === 'gold_lock' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="One-Time Amount (₹)"
                  type="number"
                  {...register('oneTimeAmount')}
                  error={errors.oneTimeAmount?.message}
                />
                <Input
                  label="Lock Period (Months)"
                  type="number"
                  {...register('lockPeriodMonths')}
                  error={errors.lockPeriodMonths?.message}
                />
                <div className="col-span-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" {...register('bonusEnabled')} className="form-checkbox text-primary bg-card border-white/20 rounded" />
                    <span className="text-sm font-medium text-slate-300">Enable Maturity Bonus Tiers</span>
                  </label>
                  {watch('bonusEnabled') && (
                    <div className="mt-4 p-4 border border-white/10 rounded-xl bg-white/5 space-y-3">
                      <h5 className="text-sm font-semibold text-slate-300 mb-2">Define Bonus by Lock Period</h5>
                      {bonusTiers.map((tier, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">Lock Period</label>
                            <div className="relative">
                              <input 
                                type="number" 
                                value={tier.months}
                                onChange={(e) => {
                                  const newTiers = [...bonusTiers];
                                  newTiers[index].months = Number(e.target.value);
                                  setBonusTiers(newTiers);
                                }}
                                className="w-full bg-background border border-white/10 rounded-lg py-1.5 px-3 text-text-light focus:outline-none focus:ring-1 focus:ring-primary/50"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Months</span>
                            </div>
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-400 mb-1">Bonus Amount (₹)</label>
                            <input 
                              type="number" 
                              value={tier.bonus}
                              onChange={(e) => {
                                const newTiers = [...bonusTiers];
                                newTiers[index].bonus = Number(e.target.value);
                                setBonusTiers(newTiers);
                              }}
                              className="w-full bg-background border border-white/10 rounded-lg py-1.5 px-3 text-text-light focus:outline-none focus:ring-1 focus:ring-primary/50"
                            />
                          </div>
                          <div className="pt-5">
                            <button 
                              type="button" 
                              onClick={() => {
                                const newTiers = bonusTiers.filter((_, i) => i !== index);
                                setBonusTiers(newTiers);
                              }}
                              className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="w-full mt-2 border border-white/5 border-dashed text-xs py-1.5"
                        onClick={() => setBonusTiers([...bonusTiers, { months: 12, bonus: 0 }])}
                      >
                        <Plus size={14} className="mr-1" /> Add Tier
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedSchemeType === '11_plus_1_bonus' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monthly Amount (₹)"
                  type="number"
                  {...register('monthlyAmount')}
                  error={errors.monthlyAmount?.message}
                />
                <Input
                  label="Total Duration (Months)"
                  type="number"
                  {...register('durationMonths')}
                  error={errors.durationMonths?.message}
                />
                <Input
                  label="Payable Installments"
                  type="number"
                  {...register('payableInstallments')}
                  error={errors.payableInstallments?.message}
                />
                <Input
                  label="Bonus Installments"
                  type="number"
                  {...register('bonusInstallments')}
                  error={errors.bonusInstallments?.message}
                />
              </div>
            )}
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
        isConfirmDisabled={!statusReason.trim()}
      >
        <textarea
          placeholder={schemeToToggle?.currentStatus ? "Reason for deactivation (required)..." : "Note for activation (required)..."}
          value={statusReason}
          onChange={(e) => setStatusReason(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50"
          rows={3}
        />
      </ConfirmModal>
    </div>
  );
};
