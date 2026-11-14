import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Scale,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';

interface AssetControl {
  id: string;
  name: string;
  symbol: string;
  category: string;
  price: number;
  change: string;
  isPositive: boolean;
  payoutRate: number;
}

interface ActiveBet {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  assetId: string;
  amount: number;
  direction: 'UP' | 'DOWN';
  entryPrice: number;
  payoutRate: number;
  potentialWin: number;
  placedAt: number;
  expiresAt: number;
  status: 'ACTIVE' | 'WON' | 'LOST';
}

interface TradingTabProps {
  token: string | null;
}

export const TradingTab: React.FC<TradingTabProps> = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [forceMode, setForceMode] = useState<'AUTO' | 'FORCE_GREEN' | 'FORCE_RED' | 'HOUSE_ADVANTAGE'>('AUTO');
  const [roundDuration, setRoundDuration] = useState<number>(30);
  const [assets, setAssets] = useState<AssetControl[]>([]);
  const [activeBets, setActiveBets] = useState<ActiveBet[]>([]);
  const [recentHistory, setRecentHistory] = useState<ActiveBet[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Editing state per asset
  const [editPrices, setEditPrices] = useState<{ [key: string]: string }>({});
  const [editPayouts, setEditPayouts] = useState<{ [key: string]: string }>({});

  const fetchOverview = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/trading/admin/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setForceMode(json.data.forceMode);
        setRoundDuration(json.data.roundDurationSec);
        setAssets(json.data.assets || []);
        setActiveBets(json.data.activeBets || []);
        setRecentHistory(json.data.recentHistory || []);

        const prices: { [key: string]: string } = {};
        const payouts: { [key: string]: string } = {};
        json.data.assets?.forEach((a: AssetControl) => {
          prices[a.id] = String(a.price);
          payouts[a.id] = String(a.payoutRate);
        });
        setEditPrices(prices);
        setEditPayouts(payouts);
      }
    } catch (err) {
      console.error('Failed to fetch trading overview:', err);
    }
  };

  useEffect(() => {
    fetchOverview();
    const interval = setInterval(fetchOverview, 2500);
    return () => clearInterval(interval);
  }, [token]);

  const handleSetForceMode = async (mode: 'AUTO' | 'FORCE_GREEN' | 'FORCE_RED' | 'HOUSE_ADVANTAGE') => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/trading/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ forceMode: mode }),
      });
      const json = await res.json();
      if (json.success) {
        setForceMode(mode);
        showNotification(`Outcome mode set to ${mode}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAsset = async (assetId: string) => {
    const price = parseFloat(editPrices[assetId]);
    const payout = parseFloat(editPayouts[assetId]);
    try {
      const res = await fetch('http://localhost:5000/api/trading/admin/asset-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetId,
          price: isNaN(price) ? undefined : price,
          payoutRate: isNaN(payout) ? undefined : payout,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Updated ${assetId.toUpperCase()} settings!`);
        fetchOverview();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleForceBet = async (betId: string, outcome: 'FORCE_WIN' | 'FORCE_LOSS') => {
    try {
      const res = await fetch('http://localhost:5000/api/trading/admin/force-bet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ betId, outcome }),
      });
      const json = await res.json();
      if (json.success) {
        showNotification(`Bet override applied: ${outcome}`);
        fetchOverview();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* 1. OUTCOME MANIPULATION & ALGORITHM CONTROL */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              ⚡ Prediction Outcome Override (Admin Control)
            </h3>
            <p className="text-xs text-slate-500">
              Override next price moves or set smart algorithmic edge for live trade rounds.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg">
            Active Mode: <span className="underline">{forceMode}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Force Green */}
          <button
            onClick={() => handleSetForceMode('FORCE_GREEN')}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              forceMode === 'FORCE_GREEN'
                ? 'bg-emerald-50 border-emerald-500 shadow-md shadow-emerald-500/10'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <TrendingUp className="w-5 h-5" />
              </span>
              {forceMode === 'FORCE_GREEN' && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Force Next GREEN (UP)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Forces market candles upward. All users who bet GREEN win.
              </p>
            </div>
          </button>

          {/* Force Red */}
          <button
            onClick={() => handleSetForceMode('FORCE_RED')}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              forceMode === 'FORCE_RED'
                ? 'bg-rose-50 border-rose-500 shadow-md shadow-rose-500/10'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <TrendingDown className="w-5 h-5" />
              </span>
              {forceMode === 'FORCE_RED' && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Force Next RED (DOWN)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Forces market candles downward. All users who bet RED win.
              </p>
            </div>
          </button>

          {/* Smart House Advantage */}
          <button
            onClick={() => handleSetForceMode('HOUSE_ADVANTAGE')}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              forceMode === 'HOUSE_ADVANTAGE'
                ? 'bg-amber-50 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Shield className="w-5 h-5" />
              </span>
              {forceMode === 'HOUSE_ADVANTAGE' && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">House Always Wins</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Auto-analyzes total pool and trends price against the majority bet.
              </p>
            </div>
          </button>

          {/* Fair Auto Market */}
          <button
            onClick={() => handleSetForceMode('AUTO')}
            className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
              forceMode === 'AUTO'
                ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-500/10'
                : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Scale className="w-5 h-5" />
              </span>
              {forceMode === 'AUTO' && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Fair Market (Organic)</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard realistic Brownian motion random walk with natural volatility.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. ASSET PRICING & PAYOUT CONTROL TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 mb-1">
          📊 Live Asset Prices & Payout Percentage Controls
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Directly modify base market price and profit payout % shown to users in the mobile app.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Asset</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Current Live Price (₹)</th>
                <th className="py-3 px-3">Payout Return (%)</th>
                <th className="py-3 px-3">24h Trend</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-black text-xs text-slate-700">
                      {asset.symbol.slice(0, 3)}
                    </span>
                    <div>
                      <div className="font-extrabold text-slate-900">{asset.name}</div>
                      <div className="text-[10px] text-slate-400">{asset.symbol}</div>
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                      {asset.category}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        step="0.01"
                        value={editPrices[asset.id] ?? asset.price}
                        onChange={(e) =>
                          setEditPrices({ ...editPrices, [asset.id]: e.target.value })
                        }
                        className="w-28 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={editPayouts[asset.id] ?? asset.payoutRate}
                        onChange={(e) =>
                          setEditPayouts({ ...editPayouts, [asset.id]: e.target.value })
                        }
                        className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-emerald-700 bg-white focus:outline-none focus:border-emerald-500"
                      />
                      <span className="text-slate-500 font-extrabold">%</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-black inline-flex items-center gap-1 ${
                        asset.isPositive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {asset.isPositive ? '↗' : '↘'} {asset.change}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleUpdateAsset(asset.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition shadow-sm shadow-amber-600/20"
                    >
                      Save Changes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. LIVE ACTIVE BETS MONITOR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              🔴 Live User Bids & Instant Win/Loss Overrides
            </h3>
            <p className="text-xs text-slate-500">
              Monitor active trade predictions placed by mobile app users with 1-click Force Win or Force Loss actions.
            </p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 bg-slate-100 text-slate-700 rounded-lg">
            Active Bids: {activeBets.length}
          </span>
        </div>

        {activeBets.length === 0 ? (
          <div className="p-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No active trades in the current round</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              When users tap GREEN or RED in the mobile app, their live bets will show here instantly.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Bet ID</th>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Asset</th>
                  <th className="py-3 px-3">Prediction</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Potential Win</th>
                  <th className="py-3 px-3">Time Left</th>
                  <th className="py-3 px-3 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeBets.map((bet) => {
                  const timeLeftSec = Math.max(0, Math.round((bet.expiresAt - Date.now()) / 1000));
                  return (
                    <tr key={bet.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-600 text-[11px]">
                        {bet.id}
                      </td>

                      <td className="py-3 px-3 font-bold text-slate-900">
                        <div>{bet.userName}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{bet.userPhone}</div>
                      </td>

                      <td className="py-3 px-3 font-extrabold text-slate-800">
                        {bet.assetId.toUpperCase()}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black uppercase inline-flex items-center gap-1 ${
                            bet.direction === 'UP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {bet.direction === 'UP' ? '⬆ GREEN (UP)' : '⬇ RED (DOWN)'}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-extrabold text-slate-900">
                        ₹{bet.amount}
                      </td>

                      <td className="py-3 px-3 font-extrabold text-emerald-700">
                        ₹{bet.potentialWin} (+{bet.payoutRate}%)
                      </td>

                      <td className="py-3 px-3 font-bold text-amber-600">
                        {timeLeftSec}s
                      </td>

                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleForceBet(bet.id, 'FORCE_WIN')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition"
                        >
                          Force Win
                        </button>
                        <button
                          onClick={() => handleForceBet(bet.id, 'FORCE_LOSS')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition"
                        >
                          Force Lose
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
