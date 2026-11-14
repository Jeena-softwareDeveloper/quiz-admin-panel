import React from 'react';
import { Users, TrendingUp, Wallet, Zap, Shield, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AdminStats } from '../../types';

interface OverviewTabProps {
  stats: AdminStats | null;
  onGoToTrading: () => void;
}

/**
 * QuickTrade System Overview Dashboard Tab
 */
export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  onGoToTrading,
}) => {
  return (
    <div className="space-y-8">
      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:border-amber-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mt-2">{stats?.totalUsers || 0}</div>
          <p className="text-xs text-amber-700 font-medium mt-1">Active Trading Accounts</p>
        </Card>

        <Card className="hover:border-amber-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Trading Markets</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800 mt-2">5</div>
          <p className="text-xs text-emerald-600 font-bold mt-1">Bitcoin, Gold, ETH, SOL, Silver</p>
        </Card>

        <Card className="hover:border-amber-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Market Engine</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">LIVE</div>
          <p className="text-xs text-slate-500 mt-1">1.5s Real-Time Candle Ticker</p>
        </Card>

        <Card className="hover:border-amber-200 transition duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-slate-600">Total Wallet Pool</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-700 mt-2">
            ₹{stats?.totalWalletPool?.toLocaleString('en-IN') || 0}
          </div>
          <p className="text-xs text-slate-600 mt-1">{stats?.totalTransactions || 0} Total Transactions</p>
        </Card>
      </div>

      {/* QuickTrade Live Status Banner */}
      <Card
        title="QuickTrade Real-Time Prediction Status"
        subtitle="Live automated price feeds and algorithmic trade settlement"
        action={
          <Badge variant="emerald" pulse>
            Engine Active
          </Badge>
        }
      >
        <div className="p-6 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              Live Prediction & Market Control Console
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Override upcoming candle outcomes (Force Green, Force Red, House Edge), adjust market base prices and customize payout returns in real-time.
            </p>
          </div>

          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={onGoToTrading}
          >
            Open Market Controls
          </Button>
        </div>
      </Card>
    </div>
  );
};
