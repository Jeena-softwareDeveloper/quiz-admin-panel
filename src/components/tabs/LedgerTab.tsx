import React from 'react';
import { Badge } from '../ui/Badge';
import { LedgerItem } from '../../types';

interface LedgerTabProps {
  ledgers: LedgerItem[];
}

/**
 * Double-Entry Financial Ledger Audit Tab
 */
export const LedgerTab: React.FC<LedgerTabProps> = ({ ledgers }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Double-Entry Financial Ledger</h3>
        <p className="text-xs text-slate-500">
          Permanent audit log of every wallet recharge, entry fee deduction, prize payout, and withdrawal
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Category</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Balance After</th>
              <th className="p-4">Audit Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {ledgers.map((l) => {
              const isCredit = l.type === 'CREDIT';
              return (
                <tr key={l.id} className="hover:bg-slate-50/60 transition duration-150">
                  <td className="p-4 font-mono text-xs text-slate-500">
                    {new Date(l.createdAt).toLocaleDateString()} {new Date(l.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="p-4 font-bold text-slate-900">
                    {l.user?.name || l.userId.substring(0, 8)}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {l.category}
                    </span>
                  </td>

                  <td className="p-4">
                    <Badge variant={isCredit ? 'amber' : 'rose'}>{l.type}</Badge>
                  </td>

                  <td className={`p-4 font-black ${isCredit ? 'text-amber-600' : 'text-rose-600'}`}>
                    {isCredit ? '+' : '-'}₹{l.amount.toFixed(2)}
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-900">₹{l.balanceAfter.toFixed(2)}</td>

                  <td className="p-4 text-xs text-slate-500 max-w-xs truncate">{l.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

