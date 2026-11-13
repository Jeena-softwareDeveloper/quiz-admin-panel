import React, { useState, useEffect } from 'react';
import { Trophy, Award, Bot, User, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { api } from '../../api';

interface ReviewResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onSuccess: () => void;
}

export const ReviewResultsModal: React.FC<ReviewResultsModalProps> = ({
  isOpen,
  onClose,
  roomId,
  onSuccess,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string>('');

  useEffect(() => {
    if (isOpen && roomId) {
      loadReviewData();
    }
  }, [isOpen, roomId]);

  const loadReviewData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/rooms/${roomId}/review`);
      setData(res.data);
      if (res.data.participants?.length > 0) {
        setSelectedWinnerId(res.data.participants[0].userId);
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to load tournament review data');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseResults = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/admin/rooms/${roomId}/release-results`, {
        designatedWinnerId: selectedWinnerId || undefined,
      });
      alert(res.data.message || 'Results officially released and cash prizes credited!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to release results');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tournament Results Review & Prize Distribution"
      subtitle="Verify participant scores (Human vs Bot), select or approve the winner, and distribute prizes"
      maxWidth="max-w-2xl"
    >
      {loading || !data ? (
        <div className="py-12 text-center text-slate-500 text-xs">Loading tournament scores...</div>
      ) : (
        <div className="space-y-5">
          {/* Tournament Overview Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="emerald">{data.room.category}</Badge>
                <Badge variant="amber">{data.room.status}</Badge>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-1">{data.room.title}</h4>
              <p className="text-xs text-slate-500">
                Strategy Config: <span className="font-semibold text-slate-700">{data.room.targetWinnerType} Priority</span> ({data.room.winnerStrategy})
              </p>
            </div>
            <div className="text-right bg-white p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Prize Pool</span>
              <div className="text-lg font-black text-amber-700">₹{data.room.prizePool}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              Review the leaderboard below. Once you click <strong>Approve & Release Results</strong>, cash prizes will immediately credit to human winners' wallets and the victory podium will unlock in the mobile app.
            </span>
          </div>

          {/* Participant Scores Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Final Standings ({data.participants.length} Players)
              </h5>
              <span className="text-[11px] text-slate-500">Choose rank 1 winner if you wish to override</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
              {data.participants.map((p: any, idx: number) => {
                const isSelected = selectedWinnerId === p.userId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedWinnerId(p.userId)}
                    className={`p-3 flex items-center justify-between cursor-pointer transition ${
                      isSelected ? 'bg-emerald-50/70 border-l-4 border-l-emerald-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{p.name}</span>
                          {p.isBot ? (
                            <Badge variant="slate">
                              <span className="flex items-center gap-0.5 text-[9px]">
                                <Bot className="w-3 h-3" /> Bot
                              </span>
                            </Badge>
                          ) : (
                            <Badge variant="emerald">
                              <span className="flex items-center gap-0.5 text-[9px]">
                                <User className="w-3 h-3" /> Human
                              </span>
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {p.correctAnswers} correct answers • {(p.totalAnswerTimeMs / 1000).toFixed(1)}s answer time
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-emerald-800">{p.score} pts</div>
                      {isSelected && (
                        <div className="text-[10px] font-bold text-emerald-700 mt-0.5 flex items-center gap-1 justify-end">
                          <Award className="w-3 h-3" /> Rank 1 Winner
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleReleaseResults}
              loading={submitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Approve & Release Results Now
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

