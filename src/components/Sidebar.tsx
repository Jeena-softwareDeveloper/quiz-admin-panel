import React from 'react';
import {
  LayoutDashboard,
  HelpCircle,
  Trophy,
  Users,
  Wallet,
  LogOut,
  Layers,
  Image,
} from 'lucide-react';

export type TabType = 'overview' | 'questions' | 'rooms' | 'users' | 'ledger' | 'banners';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
}

/**
 * Sidebar Navigation Component in Light Theme
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const navItems = [
    { id: 'overview' as TabType, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'banners' as TabType, label: 'Hero Banners', icon: Image },
    { id: 'questions' as TabType, label: 'Question Bank', icon: HelpCircle },
    { id: 'rooms' as TabType, label: 'Room Scheduler', icon: Layers },
    { id: 'users' as TabType, label: 'User Profiling', icon: Users },
    { id: 'ledger' as TabType, label: 'Wallet & Ledgers', icon: Wallet },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-auto md:min-h-screen">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 leading-tight tracking-tight">Quiz Arena</h1>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Master Admin</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition duration-150 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout Admin
        </button>
      </div>
    </aside>
  );
};

