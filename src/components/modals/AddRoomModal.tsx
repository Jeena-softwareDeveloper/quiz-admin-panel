import React, { useState } from 'react';
import { Calendar, Bot, Trophy, Users, ShieldAlert } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  educationLevels: { label: string; value: string }[];
  onSubmit: (data: any) => Promise<void>;
}

/**
 * Modal dialog for scheduling a new quiz tournament room
 * Allows setting scheduled start date/time, bot count, and winner priority strategy
 */
export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  categories,
  educationLevels,
  onSubmit,
}) => {
  // 15 minutes and 30 minutes from now formatted for datetime-local input
  const defaultStartTime = new Date(Date.now() + 15 * 60 * 1000 - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const defaultEndTime = new Date(Date.now() + 30 * 60 * 1000 - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [formData, setFormData] = useState({
    title: '',
    category: categories[0] || 'TNPSC',
    targetEducation: 'ALL',
    entryFee: 10,
    prizePool: 80,
    maxPlayers: 20,
    totalQuestions: 5,
    scheduledStartTime: defaultStartTime,
    scheduledEndTime: defaultEndTime,
    joinWindowMinutes: 10,
    botCount: 4,
    targetWinnerType: 'HUMAN',
    winnerStrategy: 'HUMAN_PRIORITY',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        scheduledStartTime: new Date(formData.scheduledStartTime).toISOString(),
        scheduledEndTime: formData.scheduledEndTime ? new Date(formData.scheduledEndTime).toISOString() : undefined,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Tournament & Configure Matchmaking"
      subtitle="Define start time, registration window, simulated bots, and winner outcome strategy"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tournament Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. TNPSC Mega Group 2 Tournament"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories}
          />

          <Select
            label="Target Education Level"
            value={formData.targetEducation}
            onChange={(e) => setFormData({ ...formData, targetEducation: e.target.value })}
            options={[
              { label: 'ALL Levels', value: 'ALL' },
              ...educationLevels,
            ]}
          />
        </div>

        {/* Scheduled Start Time & Join Window */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Tournament Timing & Pre-Registration Schedule
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Battle Start Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledStartTime}
                onChange={(e) => setFormData({ ...formData, scheduledStartTime: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">When questions & live battle begin</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Battle Closing Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={formData.scheduledEndTime}
                onChange={(e) => setFormData({ ...formData, scheduledEndTime: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
              <p className="text-[10px] text-slate-500 mt-1">When battle concludes (~15 mins)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Join Window (Minutes Prior)"
              type="number"
              min="2"
              max="60"
              value={formData.joinWindowMinutes}
              onChange={(e) => setFormData({ ...formData, joinWindowMinutes: parseInt(e.target.value, 10) })}
              helper="When arena doors unlock for registered players"
            />
          </div>
        </div>

        {/* Bot & Winner Strategy Section */}
        <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wide">
            <Bot className="w-4 h-4 text-emerald-700" />
            AI Bot Simulation & Winner Control Strategy
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Simulated Bots Count"
              type="number"
              min="0"
              max="20"
              value={formData.botCount}
              onChange={(e) => setFormData({ ...formData, botCount: parseInt(e.target.value, 10) })}
              helper="Realistic Tamil/Indian player profiles"
            />

            <Select
              label="Tournament Winner Priority"
              value={formData.targetWinnerType}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({
                  ...formData,
                  targetWinnerType: val,
                  winnerStrategy: val === 'BOT' ? 'BOT_PRIORITY' : 'HUMAN_PRIORITY',
                });
              }}
              options={[
                { label: 'Human Wins (Human Priority)', value: 'HUMAN' },
                { label: 'Bot Wins (Bot Priority)', value: 'BOT' },
              ]}
            />
          </div>
          <p className="text-[11px] text-emerald-800">
            * Note: All tournament results stay in "Waiting for Results" state until you officially review & click Release in the Admin Dashboard.
          </p>
        </div>

        {/* Fees and Players */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Entry Fee (₹)"
            type="number"
            min="0"
            value={formData.entryFee}
            onChange={(e) => setFormData({ ...formData, entryFee: parseFloat(e.target.value) })}
          />

          <Input
            label="Prize Pool (₹)"
            type="number"
            min="0"
            value={formData.prizePool}
            onChange={(e) => setFormData({ ...formData, prizePool: parseFloat(e.target.value) })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Total Questions"
            type="number"
            min="3"
            max="20"
            value={formData.totalQuestions}
            onChange={(e) => setFormData({ ...formData, totalQuestions: parseInt(e.target.value, 10) })}
          />

          <Input
            label="Max Players"
            type="number"
            min="2"
            max="100"
            value={formData.maxPlayers}
            onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value, 10) })}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Schedule Tournament Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
