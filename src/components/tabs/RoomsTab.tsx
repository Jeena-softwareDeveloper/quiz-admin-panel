import React, { useState, useEffect } from 'react';
import { Plus, Users, Clock, Trophy, Calendar, Bot, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { QuizRoomItem } from '../../types';

interface RoomsTabProps {
  rooms: QuizRoomItem[];
  onAddRoom: () => void;
  onReviewResults: (roomId: string) => void;
}

/**
 * Rooms Management & Scheduling Tab
 * Includes Real-Time Live Ticking Countdown Timers, AI Bot counts, and Result Release Review Actions
 */
export const RoomsTab: React.FC<RoomsTabProps> = ({ rooms, onAddRoom, onReviewResults }) => {
  const [now, setNow] = useState(Date.now());

  // Real-time ticking interval every second (1000ms)
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return null;
    const date = new Date(timeStr);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getClosingTime = (startTimeStr?: string, endTimeStr?: string) => {
    if (endTimeStr) return formatTime(endTimeStr);
    if (!startTimeStr) return null;
    const end = new Date(new Date(startTimeStr).getTime() + 15 * 60 * 1000);
    return formatTime(end.toISOString());
  };

  const getRemainingTime = (timeStr?: string) => {
    if (!timeStr) return null;
    const diffSec = Math.max(0, Math.floor((new Date(timeStr).getTime() - now) / 1000));
    if (diffSec <= 0) return 'LIVE NOW';
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    if (mins < 60) return `${mins}m ${secs.toString().padStart(2, '0')}s`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Live & Scheduled Tournaments</h3>
          <p className="text-xs text-slate-500">
            Control tournament schedules, simulated bots, and officially approve/release final results
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={onAddRoom}>
          Schedule Tournament Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => {
          const isLive = room.status === 'LIVE';
          const isWaitingResults = room.status === 'WAITING_RESULTS';
          const isScheduled = room.status === 'SCHEDULED';
          const isFinished = room.status === 'FINISHED';

          return (
            <div
              key={room.id}
              className={`bg-white border rounded-2xl p-6 shadow-sm transition duration-150 flex flex-col justify-between ${
                isWaitingResults
                  ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/10'
                  : 'border-slate-200/80 hover:border-emerald-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="emerald">{room.category}</Badge>
                  <Badge
                    variant={isLive ? 'rose' : isWaitingResults ? 'amber' : isScheduled ? 'sky' : 'slate'}
                    pulse={isLive || isWaitingResults}
                  >
                    {isWaitingResults ? 'WAITING FOR RESULTS' : room.status}
                  </Badge>
                </div>

                <h4 className="font-extrabold text-slate-900 text-base mt-3.5 leading-snug">
                  {room.title}
                </h4>

                {/* Scheduled Start & Closing Time Pill */}
                {room.scheduledStartTime && (
                  <div className="mt-2.5 bg-slate-50 border border-slate-200/90 p-2.5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-slate-500 font-medium">Starts:</span>
                        <strong className="text-slate-800 font-semibold">{formatTime(room.scheduledStartTime)}</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="text-slate-500 font-medium">Closes:</span>
                        <strong className="text-amber-700 font-semibold">{getClosingTime(room.scheduledStartTime, room.scheduledEndTime)}</strong>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-400">Match Window: 15 Mins</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {getRemainingTime(room.scheduledStartTime)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span>Target: <strong className="text-slate-700">{room.targetEducation}</strong></span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Bot className="w-3 h-3 text-slate-400" /> {room.botCount || 0} Bots
                  </span>
                  <span>•</span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {room.targetWinnerType === 'BOT' ? '🤖 Bot Win' : '👤 Human Win'}
                  </span>
                </div>

                {/* Metrics Box */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Entry Fee</span>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">₹{room.entryFee}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Prize Pool</span>
                    <div className="text-sm font-extrabold text-amber-600 mt-0.5">₹{room.prizePool}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">Players</span>
                    <div className="text-sm font-bold text-emerald-600 mt-0.5">
                      {room.participantCount}/{room.maxPlayers}
                    </div>
                  </div>
                </div>

                {/* Waiting Results Action Banner */}
                {isWaitingResults && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Tournament Completed — Pending Release
                    </div>
                    <p className="text-[11px] text-amber-700 leading-tight">
                      Participants are waiting on the results screen. Review scores and release results now.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-1"
                      onClick={() => onReviewResults(room.id)}
                    >
                      Review & Release Results
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {room.totalQuestions} Questions (10s)
                </span>
                {isFinished && room.resultsReleased ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Released
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-slate-400">ID: {room.id.substring(0, 8)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
