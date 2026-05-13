import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const user = useAuthStore(state => state.user);

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden md:flex items-center bg-card border border-white/10 rounded-xl px-4 py-2 w-96">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none focus:ring-0 text-sm text-text-light placeholder:text-slate-600 ml-2 w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 lg:space-x-6">
          <button className="relative p-2 text-slate-400 hover:text-white transition-colors bg-card border border-white/10 rounded-xl">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-card" />
          </button>
          
          <div className="flex items-center space-x-3 bg-card border border-white/10 rounded-xl px-3 py-1.5 cursor-pointer hover:bg-slate-700 transition-colors">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center text-background font-bold text-xs">
              {user?.name.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-text-light leading-none">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 mt-1 capitalize">{user?.role || 'Administrator'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
