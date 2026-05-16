import React, { useState } from 'react';
import { Upload, Plus, Image as ImageIcon, Trash2, Edit, ExternalLink, Filter, Search, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card, Button, Modal, Input, Toggle, ConfirmModal } from '../../components/common';
import { usePromotions } from '../../hooks/usePromotions';
import { PromotionType } from '../../interfaces/promotion.interface';
import type { Promotion } from '../../interfaces/promotion.interface';
import { bannerOfferService } from '../../store/services';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { formatDate } from '../../helpers';

const promotionSchema = z.object({
  type: z.nativeEnum(PromotionType),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  image: z.string().min(1, 'Image is required'),
  description: z.string().optional(),
  expiryDate: z.string().optional(),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

export const BannerOffersScreen: React.FC = () => {
  const { promotions, isLoading, refetch, filters, updateFilters, updateLocal, removeLocal } = usePromotions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      type: PromotionType.BANNER,
      isActive: true,
    }
  } as any);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue('image', base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setValue('type', promotion.type);
      setValue('title', promotion.title);
      setValue('image', promotion.image);
      setValue('description', promotion.description || '');
      setValue('expiryDate', promotion.expiryDate ? new Date(promotion.expiryDate).toISOString().slice(0, 16) : '');
      setImagePreview(promotion.image);
    } else {
      setEditingPromotion(null);
      reset({
        type: PromotionType.BANNER,
        title: '',
        image: '',
        description: '',
        expiryDate: '',
      });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const onSubmit = async (data: PromotionFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingPromotion) {
        await bannerOfferService.update(editingPromotion.id, data);
        toast.success('Promotion updated successfully');
      } else {
        await bannerOfferService.create(data);
        toast.success('Promotion created successfully');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      updateLocal(id, { isActive: !currentStatus });
      await bannerOfferService.updateStatus(id, !currentStatus);
      toast.success(`Promotion ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      updateLocal(id, { isActive: currentStatus });
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteClick = (id: number) => {
    setPromotionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!promotionToDelete) return;
    setIsSubmitting(true);
    try {
      await bannerOfferService.delete(promotionToDelete);
      toast.success('Promotion deleted');
      setIsDeleteModalOpen(false);
      removeLocal(promotionToDelete);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-text-light">Loading Banners...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Banners & Promotions</h1>
          <p className="text-slate-400 mt-1">Manage marketing banners and customer offers</p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => handleOpenModal()}
        >
          <Plus size={20} />
          <span>Create New Promotion</span>
        </Button>
      </div>

      <Card className="p-4 bg-card/50 backdrop-blur-md border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-white/5 rounded-xl p-1">
            {[
              { label: 'All', value: undefined },
              { label: 'Banners', value: PromotionType.BANNER },
              { label: 'Offers', value: PromotionType.OFFER }
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => updateFilters({ type: option.value })}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.type === option.value
                    ? 'bg-primary text-background shadow-lg'
                    : 'text-slate-400 hover:text-text-light'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex bg-white/5 rounded-xl p-1">
            {[
              { label: 'All Status', value: undefined },
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
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className="p-0 overflow-hidden group">
            <div className="relative h-56 overflow-hidden">
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 right-4 flex flex-col items-end space-y-2">
                <Toggle 
                  enabled={Boolean(promo.isActive)} 
                  onChange={() => handleToggleStatus(promo.id, Boolean(promo.isActive))} 
                />
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                  Boolean(promo.isActive) ? 'bg-success text-white' : 'bg-slate-500 text-white'
                }`}>
                  {Boolean(promo.isActive) ? <CheckCircle size={10} /> : <XCircle size={10} />}
                  <span>{Boolean(promo.isActive) ? 'Active' : 'Inactive'}</span>
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-lg bg-primary/20 backdrop-blur-md text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest">
                  {promo.type}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-text-light mb-1">{promo.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-1">{promo.description}</p>
                </div>
                {promo.expiryDate && (
                  <div className="text-right">
                    <div className="flex items-center text-slate-500 text-xs mb-1">
                      <Calendar size={12} className="mr-1" />
                      <span>Expires</span>
                    </div>
                    <span className="text-xs font-semibold text-text-light">
                      {formatDate(promo.expiryDate)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  className="flex-1 text-sm py-2"
                  onClick={() => handleOpenModal(promo)}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Details
                </Button>
                <Button 
                  variant="secondary" 
                  className="p-2 text-danger hover:bg-danger/10"
                  onClick={() => handleDeleteClick(promo.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <div 
          onClick={() => handleOpenModal()}
          className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all duration-300 group cursor-pointer bg-white/5 min-h-[300px]"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
            <Plus size={40} />
          </div>
          <h4 className="text-lg font-bold text-text-light mb-2">Create New Promotion</h4>
          <p className="text-center text-sm max-w-xs mb-6">
            Upload images for app banners or special customer offers.
          </p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromotion ? "Edit Promotion" : "Create New Promotion"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Promotion Type</label>
              <select 
                {...register('type')}
                className="w-full bg-background border border-white/10 rounded-xl py-2 px-4 text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              >
                <option value={PromotionType.BANNER}>Banner</option>
                <option value={PromotionType.OFFER}>Offer</option>
              </select>
            </div>
            <Input
              label="Expiry Date"
              type="datetime-local"
              {...register('expiryDate')}
              error={errors.expiryDate?.message}
            />
          </div>
          
          <Input
            label="Promotion Title"
            placeholder="e.g. Diwali Mega Sale"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Promotion Image</label>
            <div className="relative group">
              <div className="w-full h-40 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden bg-white/5 hover:border-primary/50 transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="text-slate-500 mb-2" size={32} />
                    <span className="text-xs text-slate-500">Click to upload image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              {imagePreview && (
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setValue('image', '');
                    }}
                    className="p-1.5 bg-danger text-white rounded-lg shadow-lg hover:bg-danger-dark transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-xs text-danger mt-1">{errors.image.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Detailed description of the promotion..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Promotion"
        message="Are you sure you want to delete this promotion? This will remove it from the mobile application."
        confirmText="Yes, Delete"
        isLoading={isSubmitting}
      />
    </div>
  );
};
