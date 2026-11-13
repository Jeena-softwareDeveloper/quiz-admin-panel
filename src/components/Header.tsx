import React from 'react';
import { RefreshCw } from 'lucide-react';
import { TabType } from './Sidebar';

interface HeaderProps {
  activeTab: TabType;
  loading: boolean;
  onRefresh: () => void;
}

/**
 * Top Application Header Component
 */
export const Header: React.FC<HeaderProps> = ({
  activeTab,
  loading,
  onRefresh,
}) => {
  const titles: Record<TabType, { title: string; subtitle: string }> = {
    overview: {
      title: 'System Overview',
      subtitle: 'Real-time metrics, active players, and category distribution',
    },
    questions: {
      title: 'Question Bank Management',
      subtitle: 'Bilingual questions (Tamil & English) categorized by target education',
    },
    rooms: {
      title: 'Quiz Rooms & Live Matches',
      subtitle: 'Schedule and manage multi-tier skill tournaments',
    },
    users: {
      title: 'User Demographics & Educational Profiling',
      subtitle: 'Audience segmented by qualification, skill rating, and interests',
    },
    ledger: {
      title: 'Double-Entry Financial Ledger',
      subtitle: 'Real-time audit log of deposits, entry fees, and prize payouts',
    },
    banners: {
      title: 'Mobile Hero Banners',
      subtitle: 'Upload, prioritize, and toggle promotional banners on the mobile home screen',
    },
  };

  const current = titles[activeTab] || {
    title: 'Quiz Arena Admin',
    subtitle: 'Skill Quiz Master Dashboard',
  };

  return (
    <header className="px-8 py-5 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{current.title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{current.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Server Online (Port 5000)
        </div>
      </div>
    </header>
  );
};

