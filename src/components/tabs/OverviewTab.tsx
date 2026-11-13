import React from 'react';
import { Users, Layers, HelpCircle, Wallet, Sparkles, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AdminStats } from '../../types';

interface OverviewTabProps {
  stats: AdminStats | null;
  onAddQuestion: () => void;
  onAddRoom: () => void;
}

/**
 * System Overview Dashboard Tab (Light Theme, 100% API Driven)
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  onAddQuestion,
  onAddRoom,
}) => {
  return (
    <div className="space-y-8">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-emerald-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{stats?.totalUsers || 0}</div>
          <p className="text-xs text-emerald-700 font-medium mt-1">100% Profiled by Education</p>
        </Card>

        <Card className="hover:border-emerald-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Active Rooms</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{stats?.activeRooms || 0}</div>
          <p className="text-xs text-slate-600 mt-1">Total Scheduled: {stats?.totalRooms || 0}</p>
        </Card>

        <Card className="hover:border-emerald-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Questions Bank</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{stats?.totalQuestions || 0}</div>
          <p className="text-xs text-slate-600 mt-1">Bilingual (Tamil & English)</p>
        </Card>

        <Card className="hover:border-emerald-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Total Wallet Pool</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-700 mt-2">
            ₹{stats?.totalWalletPool?.toLocaleString('en-IN') || 0}
          </div>
          <p className="text-xs text-slate-600 mt-1">{stats?.totalTransactions || 0} Total Transactions</p>
        </Card>
      </div>

      {/* Dynamic Category Distribution from API */}
      <Card
        title="Active Category Distribution"
        subtitle="Question inventory dynamically loaded from database"
        action={
          <Badge variant="emerald" pulse>
            Live Sync
          </Badge>
        }
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          {stats?.categoryBreakdown?.map((cat) => (
            <div
              key={cat.category}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition"
            >
              <span className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
                {cat.category}
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{cat._count.id} Questions</div>
              <p className="text-xs text-slate-500 mt-0.5">Available for matchmaking</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Launch Actions */}
      <div className="flex flex-wrap gap-4 pt-2">
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={onAddQuestion}>
          Create New Question
        </Button>
        <Button variant="outline" icon={<Layers className="w-4 h-4" />} onClick={onAddRoom}>
          Schedule New Quiz Room
        </Button>
      </div>
    </div>
  );
};

