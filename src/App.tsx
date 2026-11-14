import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { api, getAdminToken, saveAdminToken, clearAdminToken } from './api';
import { AdminStats, LedgerItem, BannerItem, OnboardingSlideItem } from './types';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/tabs/OverviewTab';
import { TradingTab } from './components/tabs/TradingTab';
import { LedgerTab } from './components/tabs/LedgerTab';
import { BannersTab } from './components/tabs/BannersTab';
import { OnboardingTab } from './components/tabs/OnboardingTab';
import { AddBannerModal } from './components/modals/AddBannerModal';
import { AddOnboardingSlideModal } from './components/modals/AddOnboardingSlideModal';
import { EditOnboardingSlideModal } from './components/modals/EditOnboardingSlideModal';
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

  // System Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [ledgers, setLedgers] = useState<LedgerItem[]>([]);
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [slides, setSlides] = useState<OnboardingSlideItem[]>([]);

  // Modals
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [showAddSlide, setShowAddSlide] = useState(false);
  const [editingSlide, setEditingSlide] = useState<OnboardingSlideItem | null>(null);

  // Check token on mount
  useEffect(() => {
    const saved = getAdminToken();
    if (saved) {
      setToken(saved);
      fetchData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await api.login(phone, password);
      if (res.token) {
        saveAdminToken(res.token);
        setToken(res.token);
        fetchData();
      }
    } catch (err: any) {
      setLoginError(err.response?.data?.error || 'Login failed. Check phone and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setToken(null);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ledgersRes, bannersRes, slidesRes] = await Promise.allSettled([
        api.getStats(),
        api.getLedger(),
        api.getBanners(),
        api.getOnboardingSlides(),
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.stats);
      if (ledgersRes.status === 'fulfilled') setLedgers(ledgersRes.value.ledgers || []);
      if (bannersRes.status === 'fulfilled') setBanners(bannersRes.value.banners || []);
      if (slidesRes.status === 'fulfilled') setSlides(slidesRes.value.slides || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hero Banners Handlers
  const handleCreateBanner = async (bannerData: any) => {
    await api.createBanner(bannerData);
    setShowAddBanner(false);
    fetchData();
  };

  const handleToggleBannerActive = async (id: string, currentStatus: boolean) => {
    await api.toggleBanner(id, !currentStatus);
    fetchData();
  };

  const handleDeleteBanner = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotional banner?')) {
      await api.deleteBanner(id);
      fetchData();
    }
  };

  // Onboarding Slides Handlers
  const handleCreateSlide = async (slideData: any) => {
    await api.createOnboardingSlide(slideData);
    setShowAddSlide(false);
    fetchData();
  };

  const handleUpdateSlide = async (id: string, slideData: any) => {
    await api.updateOnboardingSlide(id, slideData);
    setEditingSlide(null);
    fetchData();
  };

  const handleToggleSlideActive = async (id: string, currentStatus: boolean) => {
    await api.toggleOnboardingSlide(id, !currentStatus);
    fetchData();
  };

  const handleDeleteSlide = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this onboarding slide?')) {
      await api.deleteOnboardingSlide(id);
      fetchData();
    }
  };

  // Login Screen if unauthenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30">
              <Trophy className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Set Quick Trade</h1>
            <p className="text-sm text-slate-500">Master Control & Trading Admin Portal</p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter 10-digit phone"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
            <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In as Master Admin'}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400">
            Secure admin portal &bull; Authorized personnel only
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row font-sans">
      {/* Component 1: Sidebar Navigation */}
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
              onGoToTrading={() => setActiveTab('trading')}
            />
          )}

          {activeTab === 'trading' && <TradingTab token={token} />}

          {activeTab === 'banners' && (
            <BannersTab
              banners={banners}
              onAddBanner={() => setShowAddBanner(true)}
              onToggleActive={handleToggleBannerActive}
              onDeleteBanner={handleDeleteBanner}
            />
          )}

          {activeTab === 'onboarding' && (
            <OnboardingTab
              slides={slides}
              onAddSlide={() => setShowAddSlide(true)}
              onEditSlide={(slide) => setEditingSlide(slide)}
              onToggleActive={handleToggleSlideActive}
              onDeleteSlide={handleDeleteSlide}
            />
          )}

          {activeTab === 'ledger' && <LedgerTab ledgers={ledgers} />}
        </div>
      </main>

      {/* Component 4: Add Hero Banner Modal */}
      <AddBannerModal
        isOpen={showAddBanner}
        onClose={() => setShowAddBanner(false)}
        categories={['Crypto', 'Commodity', 'Forex']}
        onSubmit={handleCreateBanner}
      />

      {/* Component 5: Add Auth Onboarding Slide Modal */}
      <AddOnboardingSlideModal
        isOpen={showAddSlide}
        onClose={() => setShowAddSlide(false)}
        onSubmit={handleCreateSlide}
      />

      {/* Component 6: Edit Auth Onboarding Slide Modal */}
      <EditOnboardingSlideModal
        isOpen={Boolean(editingSlide)}
        slide={editingSlide}
        onClose={() => setEditingSlide(null)}
        onSubmit={handleUpdateSlide}
      />
    </div>
  );
}
