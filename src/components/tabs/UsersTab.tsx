import React from 'react';
import { Badge } from '../ui/Badge';
import { UserProfile } from '../../types';

interface UsersTabProps {
  users: UserProfile[];
}

/**
 * User Profiling & Demographics Inspector Tab
 */
export const UsersTab: React.FC<UsersTabProps> = ({ users }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">User Profiling & Demographics</h3>
        <p className="text-xs text-slate-500">
          Matchmaking segments players based on educational qualifications and topic interests
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase text-slate-500 tracking-wider">
            <tr>
              <th className="p-4">User Name</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Education Level</th>
              <th className="p-4">Exam Interests</th>
              <th className="p-4">Skill ELO</th>
              <th className="p-4">Wallet Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition duration-150">
                <td className="p-4 font-bold text-slate-900">
                  {u.name}
                  {u.role === 'ADMIN' && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200">
                      ADMIN
                    </span>
                  )}
                </td>

                <td className="p-4 font-mono text-xs text-slate-500">{u.phone}</td>

                <td className="p-4">
                  <Badge variant="blue">{u.educationLevel}</Badge>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {u.examInterests.split(',').map((interest, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="p-4 font-bold text-emerald-600">{u.skillRating}</td>

                <td className="p-4 font-black text-slate-900">₹{u.walletBalance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

