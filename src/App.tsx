import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { api, getAdminToken, saveAdminToken, clearAdminToken } from './api';
import { AdminStats, QuestionItem, QuizRoomItem, UserProfile, LedgerItem, BannerItem } from './types';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/tabs/OverviewTab';
import { QuestionsTab } from './components/tabs/QuestionsTab';
import { RoomsTab } from './components/tabs/RoomsTab';
import { UsersTab } from './components/tabs/UsersTab';
import { LedgerTab } from './components/tabs/LedgerTab';
import { BannersTab } from './components/tabs/BannersTab';
import { AddQuestionModal } from './components/modals/AddQuestionModal';
import { AddRoomModal } from './components/modals/AddRoomModal';
import { BulkUploadModal } from './components/modals/BulkUploadModal';
import { ReviewResultsModal } from './components/modals/ReviewResultsModal';
import { AddBannerModal } from './components/modals/AddBannerModal';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('quiz_admin_token'));
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Login form state
  const [phone, setPhone] = useState('9999999999');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic Metadata from API
  const [categories, setCategories] = useState<string[]>([]);
  const [educationLevels, setEducationLevels] = useState<{ label: string; value: string }[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  // System Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [rooms, setRooms] = useState<QuizRoomItem[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);

  // Modals
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showReviewResults, setShowReviewResults] = useState(false);
  const [selectedReviewRoomId, setSelectedReviewRoomId] = useState<string>('');

  // Fetch dynamic metadata options
  const fetchMetadata = async () => {
    try {
      const res = await api.get('/rooms/meta/options');
      setCategories(res.data.categories || []);
      setEducationLevels(res.data.educationLevels || []);
      setDifficulties(res.data.difficulties || []);
    } catch (err) {
      console.error('Failed to load system metadata options', err);
    }
  };

  // Fetch all live dashboard data
  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [statsRes, qRes, roomsRes, usersRes, ledgerRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/questions'),
        api.get('/admin/rooms'),
        api.get('/admin/users'),
        api.get('/admin/ledgers'),
      ]);
      setStats(statsRes.data);
      setQuestions(qRes.data);
      setRooms(roomsRes.data);
      setUsers(usersRes.data);
      setLedgers(ledgerRes.data);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
    if (token) {
      fetchData();
    }
  }, [token]);

  // Handle Admin Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { phone, password });
      if (res.data.user.role !== 'ADMIN') {
        setLoginError('Access denied: You must be an administrator.');
        return;
      }
      saveAdminToken(res.data.token);
      setToken(res.data.token);
    } catch (err: any) {
      setLoginError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setToken(null);
  };

  const handleCreateQuestion = async (formData: any) => {
    await api.post('/admin/questions', formData);
    fetchData();
  };

  const handleCreateRoom = async (formData: any) => {
    await api.post('/admin/rooms', formData);
    fetchData();
  };

  // If unauthenticated, show Light Theme Admin Login Card
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mb-6 mx-auto border border-emerald-100">
            <Trophy className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-center text-slate-900 tracking-tight">Quiz Arena Admin</h1>
          <p className="text-slate-500 text-xs text-center mt-1">Multi-Category Skill Quiz Master Dashboard</p>

          {loginError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <Input
              label="Phone Number"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Admin Phone"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              required
            />

            <Button type="submit" variant="primary" loading={loading} className="w-full py-3 mt-2">
              Enter Dashboard
            </Button>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-500">
              <span className="font-bold text-slate-700">Default Demo Credentials:</span>
              <br />
              Phone: <code className="text-emerald-700 font-semibold">9999999999</code> | Password:{' '}
              <code className="text-emerald-700 font-semibold">admin123</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900">
      {/* Component 1: Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Component 2: Top Header */}
        <Header activeTab={activeTab} loading={loading} onRefresh={fetchData} />

        {/* Component 3: Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              onAddQuestion={() => setShowAddQuestion(true)}
              onAddRoom={() => setShowAddRoom(true)}
            />
          )}

          {activeTab === 'questions' && (
            <QuestionsTab
              questions={questions}
              categories={categories}
              onAddQuestion={() => setShowAddQuestion(true)}
              onOpenBulkUpload={() => setShowBulkUpload(true)}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomsTab
              rooms={rooms}
              onAddRoom={() => setShowAddRoom(true)}
              onReviewResults={(roomId) => {
                setSelectedReviewRoomId(roomId);
                setShowReviewResults(true);
              }}
            />
          )}

          {activeTab === 'users' && <UsersTab users={users} />}

          {activeTab === 'ledger' && <LedgerTab ledgers={ledgers} />}
        </div>
      </main>

      {/* Component 4: Add Question Modal */}
      <AddQuestionModal
        isOpen={showAddQuestion}
        onClose={() => setShowAddQuestion(false)}
        categories={categories}
        educationLevels={educationLevels}
        difficulties={difficulties}
        onSubmit={handleCreateQuestion}
      />

      {/* Component 5: Bulk Upload Excel / CSV Modal */}
      <BulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onSuccess={fetchData}
      />

      {/* Component 6: Review & Release Tournament Results Modal */}
      <ReviewResultsModal
        isOpen={showReviewResults}
        onClose={() => {
          setShowReviewResults(false);
          setSelectedReviewRoomId('');
        }}
        roomId={selectedReviewRoomId}
        onSuccess={fetchData}
      />

      {/* Component 7: Add Room Modal */}
      <AddRoomModal
        isOpen={showAddRoom}
        onClose={() => setShowAddRoom(false)}
        categories={categories}
        educationLevels={educationLevels}
        onSubmit={handleCreateRoom}
      />
    </div>
  );
}
