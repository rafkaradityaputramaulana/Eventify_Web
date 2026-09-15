import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Receipt,
  ShieldAlert,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      badge: 'Utama',
    },
    {
      label: 'Kelola Event',
      path: '/admin/events',
      icon: <Calendar size={20} />,
    },
    {
      label: 'Kelola User & Role',
      path: '/admin/users',
      icon: <Users size={20} />,
    },
    {
      label: 'Monitoring Order',
      path: '/admin/orders',
      icon: <Receipt size={20} />,
    },
    {
      label: 'Pengaturan Sistem',
      path: '/admin/maintenance',
      icon: <ShieldAlert size={20} />,
      badge: 'Mode Darurat',
      badgeColor: 'pink' as const,
    },
  ];

  const handleLogout = () => {
    try {
      // 1. Jalankan fungsi reset state di AuthContext
      logout();
    } catch (e) {
      console.error('Error saat logout:', e);
    } finally {
      // 2. Bersihkan seluruh penyimpanan lokal secara langsung
      localStorage.clear();
      sessionStorage.clear();

      // 3. Pindah langsung ke halaman login dengan hard navigation
      window.location.href = '/login';
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neo-dark/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-0 left-0 z-40 w-72 h-screen bg-neo-bg border-r-3 border-neo-dark transition-transform duration-300 flex flex-col justify-between p-4 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header with Transparent Eventify Logo */}
          <div className="p-3 mb-6 bg-neo-yellow rounded-2xl border-3 border-neo-dark shadow-neo flex items-center justify-between">
            <img
              src="/eventify-logo.png"
              alt="Eventify Admin"
              className="h-10 object-contain drop-shadow-[1.5px_1.5px_0px_#2B2630]"
            />
            <span className="font-space font-extrabold text-[10px] bg-neo-dark text-neo-yellow px-2 py-0.5 rounded uppercase border border-neo-dark tracking-wider">
              ADMIN
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl border-2.5 border-neo-dark font-space font-extrabold text-sm transition-all ${
                    isActive
                      ? 'bg-neo-mint shadow-neo text-neo-dark translate-x-1'
                      : 'bg-white hover:bg-neo-toska/60 text-neo-dark hover:shadow-neo-sm'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant={item.badgeColor || 'yellow'}>
                    {item.badge}
                  </Badge>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Info & Logout Button */}
        <div className="space-y-3">
          <div className="p-4 bg-white rounded-2xl border-3 border-neo-dark shadow-neo flex items-center gap-3">
            <div className="p-2 bg-neo-pink rounded-xl border-2 border-neo-dark shrink-0">
              <Sparkles size={20} className="text-neo-dark" />
            </div>
            <div className="overflow-hidden">
              <p className="font-space font-extrabold text-xs text-neo-dark uppercase truncate">
                Eventify Web Portal
              </p>
              <p className="font-jakarta text-[11px] font-semibold text-emerald-800 truncate">
                Role: Administrator
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neo-pink hover:bg-red-400 text-neo-dark rounded-xl border-2.5 border-neo-dark font-space font-extrabold text-sm shadow-neo transition-all active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};