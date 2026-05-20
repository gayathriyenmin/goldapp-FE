import React, { useState } from 'react';
import { Send, Image as ImageIcon, Trash2, Bell } from 'lucide-react';
import { Card, Button, Input } from '../../components/common';
import toast from 'react-hot-toast';
import { notificationService } from '../../store/services';

export const NotificationScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in both title and description');
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.send({
        title,
        description,
        imageUrl: imagePreview || undefined,
      });
      toast.success('Notification sent successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setImagePreview(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-light flex items-center gap-3">
            <Bell className="text-primary" size={32} />
            Push Notifications
          </h1>
          <p className="text-slate-400 mt-1">Send beautiful rich notifications to your customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="p-6 bg-card/50 backdrop-blur-md border-white/5">
          <form onSubmit={handleSendNotification} className="space-y-6">
            <Input
              label="Notification Title"
              placeholder="e.g. Special Offer Today!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Enter the notification message..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-text-light focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Notification Image (Optional)</label>
              <div className="relative group">
                <div className="w-full h-48 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden bg-white/5 hover:border-primary/50 transition-all duration-300">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                        <ImageIcon className="text-slate-500 group-hover:text-primary transition-colors" size={24} />
                      </div>
                      <span className="text-sm font-medium text-slate-400">Click to upload image</span>
                      <span className="text-xs text-slate-500 mt-1">Supported formats: JPG, PNG, GIF</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {imagePreview && (
                  <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="p-2 bg-danger/90 text-white rounded-lg shadow-lg hover:bg-danger transition-colors backdrop-blur-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
              isLoading={isSubmitting}
            >
              <Send size={20} />
              Send Notification
            </Button>
          </form>
        </Card>

        {/* Preview Section */}
        <div className="flex justify-center items-start lg:pt-8">
          <div className="w-full max-w-[320px] rounded-[2.5rem] border-[8px] border-slate-800 bg-background overflow-hidden relative shadow-2xl h-[600px] flex flex-col">
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl mx-auto w-40 z-10"></div>
            
            <div className="flex-1 bg-slate-900/50 p-4 pt-12 overflow-y-auto">
              <div className="text-center mb-8">
                <p className="text-slate-500 text-xs font-medium">12:00 PM</p>
              </div>

              {/* Mock Notification */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/5 transform transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md gold-gradient flex items-center justify-center">
                    <span className="text-background text-[10px] font-bold">GS</span>
                  </div>
                  <span className="text-xs font-medium text-slate-300">GoldSave</span>
                  <span className="text-[10px] text-slate-500 ml-auto">now</span>
                </div>
                
                <h4 className="text-sm font-bold text-white mb-1">
                  {title || 'Notification Title'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-3">
                  {description || 'Your notification description will appear here. Start typing to see the preview.'}
                </p>
                
                {imagePreview ? (
                  <div className="w-full h-32 rounded-xl overflow-hidden mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-32 rounded-xl bg-slate-800/50 flex items-center justify-center mt-2 border border-dashed border-white/10">
                    <ImageIcon className="text-slate-600" size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
