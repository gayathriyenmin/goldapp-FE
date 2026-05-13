import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Coins, 
  CreditCard, 
  CalendarClock, 
  Image as ImageIcon, 
  LogOut,
  X
} from 'lucide-react';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
  { icon: Users, label: 'Customers', path: ROUTES.CUSTOMERS },
  { icon: Coins, label: 'Schemes', path: ROUTES.SCHEMES },
  { icon: CreditCard, label: 'Payments', path: ROUTES.PAYMENTS },
  { icon: CalendarClock, label: 'Installments', path: ROUTES.INSTALLMENTS },
  { icon: ImageIcon, label: 'Banners', path: ROUTES.BANNERS },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const logout = useAuthStore(state => state.logout);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-card border-r border-white/10 z-50 transition-transform duration-300
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center">
                <Coins className="text-background" size={24} />
              </div>
              <span className="text-xl font-bold text-primary tracking-tight">GoldSave</span>
            </div>
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={() => logout()}
              className="flex items-center space-x-3 w-full px-4 py-3 text-slate-400 hover:bg-danger/10 hover:text-danger rounded-xl transition-all duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
