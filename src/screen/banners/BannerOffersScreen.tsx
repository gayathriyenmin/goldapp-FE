import React from 'react';
import { Upload, Plus, Image as ImageIcon, Trash2, Edit, ExternalLink } from 'lucide-react';
import { Card, Button } from '../../components/common';

const banners = [
  { id: '1', title: 'Diwali Special Offer', image: 'https://images.unsplash.com/photo-1581447100595-3a813831483f?auto=format&fit=crop&q=80&w=600', status: 'active', expiry: '2023-11-15' },
  { id: '2', title: 'New Year Bonus', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=600', status: 'scheduled', expiry: '2024-01-05' },
];

export const BannerOffersScreen: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light">Banners & Promotions</h1>
          <p className="text-slate-400 mt-1">Manage marketing banners and customer offers</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Upload size={20} />
          <span>Upload New Banner</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="p-0 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  banner.status === 'active' ? 'bg-success text-white' : 'bg-accent text-background'
                }`}>
                  {banner.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-text-light">{banner.title}</h3>
                <span className="text-xs text-slate-500">Expires: {banner.expiry}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="flex-1 text-sm py-2">
                  <Edit size={16} className="mr-2" />
                  Edit Details
                </Button>
                <Button variant="outline" className="flex-1 text-sm py-2 border-white/10">
                  <ExternalLink size={16} className="mr-2" />
                  Preview
                </Button>
                <Button variant="secondary" className="p-2 text-danger hover:bg-danger/10">
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all duration-300 group cursor-pointer bg-white/5">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
            <ImageIcon size={40} />
          </div>
          <h4 className="text-lg font-bold text-text-light mb-2">Create New Promotion</h4>
          <p className="text-center text-sm max-w-xs mb-6">
            Upload images for app banners, social media posts, or customer notifications.
          </p>
          <Button variant="outline" className="space-x-2">
            <Plus size={18} />
            <span>Select Image</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
