import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Upload, Image as ImageIcon, Sparkles, Smartphone, Check } from 'lucide-react';
import { OnboardingSlideItem } from '../../types';

interface EditOnboardingSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: OnboardingSlideItem | null;
  onSubmit: (
    id: string,
    data: {
      title: string;
      subtitle: string;
      imageUrl: string;
      order: number;
      isActive: boolean;
    }
  ) => Promise<void>;
}

export const EditOnboardingSlideModal: React.FC<EditOnboardingSlideModalProps> = ({
  isOpen,
  onClose,
  slide,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

  // Pre-fill form when slide prop changes
  useEffect(() => {
    if (slide) {
      setTitle(slide.title || '');
      setSubtitle(slide.subtitle || '');
      setImageUrl(slide.imageUrl || '');
      setOrder(String(slide.order ?? 1));
      setIsActive(Boolean(slide.isActive));
    }
  }, [slide]);

  // Handle local image file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds 20MB. Please select an image under 20MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slide) return;
    if (!title.trim()) {
      alert('Please enter a slide title / heading.');
      return;
    }
    if (!imageUrl.trim()) {
      alert('Please select or provide an image for the slide.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(slide.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        imageUrl: imageUrl.trim(),
        order: Number(order) || 1,
        isActive,
      });

      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update slide');
    } finally {
      setLoading(false);
    }
  };

  if (!slide) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Onboarding Slide: ${slide.title}`}
      maxWidth="max-w-4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls (Left Column) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          {/* Image Selection Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                Slide Image Artwork (Required)
              </label>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-2.5 py-0.5 rounded-md transition ${
                    uploadMode === 'file' ? 'bg-white shadow text-slate-900' : 'hover:text-slate-900'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-0.5 rounded-md transition ${
                    uploadMode === 'url' ? 'bg-white shadow text-slate-900' : 'hover:text-slate-900'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition group">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Click to replace with a new image from your PC
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Supports PNG, JPG, WebP, SVG (Auto uploads to Cloudinary or Server)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <Input
                label="Direct Image URL"
                placeholder="https://example.com/banner.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            )}
          </div>

          {/* Title / Heading Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Slide Title / Heading
            </label>
            <input
              type="text"
              placeholder="e.g. Predict Green or Red"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold text-slate-900 placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: Words like <span className="text-emerald-600 font-bold">Green</span>,{' '}
              <span className="text-rose-500 font-bold">Red</span>, and{' '}
              <span className="text-amber-600 font-bold">₹50</span> are automatically glowing colored on mobile!
            </p>
          </div>

          {/* Subtitle / Paragraph Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Slide Paragraph / Description Subtitle
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Guess the next price move and earn up to 90% profit"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-slate-900 placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Order & Status */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Display Sequence Order"
              type="number"
              min="1"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              placeholder="1"
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Slide Status
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-full h-[42px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                />
                {isActive ? 'Active (Live on App)' : 'Hidden (Draft)'}
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading} className="gap-2">
              <Sparkles className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save & Update Slide'}
            </Button>
          </div>
        </form>

        {/* Live Smartphone Mockup Preview (Right Column) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            <Smartphone className="w-4 h-4 text-amber-600" />
            Live Mobile App Preview
          </div>

          {/* Simulated Smartphone Frame */}
          <div className="w-full max-w-[280px] bg-[#030705] rounded-[36px] p-4 border-[6px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-3" />

            {/* QuickTrade App Logo */}
            <div className="text-center mb-3">
              <span className="font-extrabold text-white text-sm tracking-tight">
                Quick<span className="text-[#00e676]">Trade</span>
              </span>
              <p className="text-[8px] text-slate-400 font-semibold tracking-widest uppercase">
                Trade • Predict • Earn
              </p>
            </div>

            {/* Slide Graphic Preview */}
            <div className="flex-1 flex flex-col items-center justify-center my-2">
              {imageUrl ? (
                <div className="w-44 h-32 rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <img
                    src={imageUrl}
                    alt="Slide preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-44 h-32 rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 flex flex-col items-center justify-center text-slate-500 p-3 text-center">
                  <ImageIcon className="w-8 h-8 text-slate-600 mb-1" />
                  <span className="text-[10px]">Image will display here</span>
                </div>
              )}

              {/* Title Preview */}
              <div className="text-center mt-3 px-2">
                <h3 className="font-black text-white text-sm leading-snug">
                  {title || 'Slide Title / Heading'}
                </h3>

                {/* Subtitle / Paragraph Preview */}
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  {subtitle || 'Your paragraph description text will appear here on the mobile screen.'}
                </p>
              </div>

              {/* Pagination Dots Mockup */}
              <div className="flex items-center gap-1.5 mt-3">
                <div className="w-3.5 h-1.5 rounded-full bg-white shadow-sm shadow-white" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              </div>
            </div>

            {/* Mock Action Buttons */}
            <div className="space-y-1.5 mt-auto pt-2">
              <div className="w-full h-8 rounded-full bg-[#00e676] flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-emerald-500/30">
                Login
              </div>
              <div className="w-full h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                Register (Get ₹50)
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

