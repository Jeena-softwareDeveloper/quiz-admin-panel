import React, { useState } from 'react';
import { OnboardingSlideItem } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Smartphone,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from 'lucide-react';

interface OnboardingTabProps {
  slides: OnboardingSlideItem[];
  onAddSlide: () => void;
  onEditSlide: (slide: OnboardingSlideItem) => void;
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onDeleteSlide: (id: string) => Promise<void>;
}

export const OnboardingTab: React.FC<OnboardingTabProps> = ({
  slides,
  onAddSlide,
  onEditSlide,
  onToggleActive,
  onDeleteSlide,
}) => {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const activeSlides = slides.filter((s) => s.isActive);
  const currentPreviewSlide = activeSlides[previewIndex] || slides[0];


  const handleNextPreview = () => {
    if (activeSlides.length > 0) {
      setPreviewIndex((prev) => (prev + 1) % activeSlides.length);
    }
  };

  const handlePrevPreview = () => {
    if (activeSlides.length > 0) {
      setPreviewIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Mobile Auth Onboarding Slides
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload images, enter headings and paragraph text. Changes reflect dynamically in real-time on the mobile login screen carousel.
          </p>
        </div>

        <Button variant="primary" onClick={onAddSlide} className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add New Slide
        </Button>
      </div>

      {/* Main Grid: Slides List on Left, Live Mobile Preview on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Slides List (Left) */}
        <div className="xl:col-span-8 space-y-4">
          {slides.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                <Smartphone className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Onboarding Slides</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create dynamic slides with custom images, headings and paragraph text to display on the mobile app.
              </p>
              <Button variant="primary" onClick={onAddSlide} className="mt-4 gap-2">
                <Plus className="w-4 h-4" />
                Create First Slide
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {slides.map((slide, idx) => (
                <Card
                  key={slide.id}
                  className="p-4 border border-slate-200/80 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Thumbnail & Content */}
                  <div className="flex items-start gap-4">
                    {/* Thumbnail Image */}
                    <div className="w-24 h-20 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-200 relative group flex items-center justify-center">
                      {imageErrors[slide.id] || !slide.imageUrl ? (
                        <div className="flex flex-col items-center justify-center text-amber-500">
                          <Sparkles className="w-6 h-6" />
                          <span className="text-[8px] font-bold mt-1 text-slate-400">QuickTrade</span>
                        </div>
                      ) : (
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          onError={() => handleImageError(slide.id)}
                          className="w-full h-full object-contain object-center"
                        />
                      )}
                      <span className="absolute top-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        #{slide.order}
                      </span>
                    </div>


                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-extrabold text-slate-900 text-base">
                          {slide.title}
                        </span>
                        {slide.isActive ? (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Live on Mobile
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-slate-400" /> Hidden
                          </span>
                        )}
                      </div>

                      {slide.subtitle ? (
                        <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">
                          {slide.subtitle}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No paragraph description</p>
                      )}

                      <div className="text-[11px] text-slate-400 mt-2">
                        Slide Sequence: <span className="font-bold text-slate-700">Order #{slide.order}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                    <button
                      onClick={() => onEditSlide(slide)}
                      className="text-xs font-bold text-slate-700 hover:text-amber-700 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      title="Edit Image, Heading and Paragraph"
                    >
                      <Pencil className="w-3.5 h-3.5 text-amber-600" />
                      Edit
                    </button>

                    <button
                      onClick={() => onToggleActive(slide.id, slide.isActive)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                        slide.isActive
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {slide.isActive ? 'Hide from App' : 'Show in App'}
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete slide "${slide.title}"?`)) {
                          onDeleteSlide(slide.id);
                        }
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl transition flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>

                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Live Smartphone Simulator (Right) */}
        <div className="xl:col-span-4 sticky top-24">
          <Card className="p-5 border border-slate-200/80 bg-slate-50/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-800">Live Mobile Preview</h3>
              </div>
              {activeSlides.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevPreview}
                    className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-500 px-1">
                    {previewIndex + 1}/{activeSlides.length}
                  </span>
                  <button
                    onClick={handleNextPreview}
                    className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Device Frame */}
            <div className="w-full max-w-[300px] mx-auto bg-[#030705] rounded-[36px] p-5 border-[7px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
              {/* Phone Notch */}
              <div className="w-28 h-4 bg-slate-900 rounded-b-xl mx-auto mb-4" />

              {/* QuickTrade App Logo */}
              <div className="text-center mb-3">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Quick<span className="text-[#00e676]">Trade</span>
                </span>
                <p className="text-[8px] text-slate-400 font-semibold tracking-widest uppercase">
                  Trade • Predict • Earn
                </p>
              </div>

              {/* Slide Graphic & Text */}
              {currentPreviewSlide ? (
                <div className="flex-1 flex flex-col items-center justify-center my-3">
                  {/* Image Graphic */}
                  <div className="w-48 h-36 rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-3 relative">
                    {imageErrors[currentPreviewSlide.id] || !currentPreviewSlide.imageUrl ? (
                      <div className="flex flex-col items-center justify-center text-emerald-400 p-2 text-center">
                        <Sparkles className="w-10 h-10 mb-1" />
                        <span className="text-[10px] font-bold text-slate-300">QuickTrade Slide #{currentPreviewSlide.order}</span>
                      </div>
                    ) : (
                      <img
                        src={currentPreviewSlide.imageUrl}
                        alt={currentPreviewSlide.title}
                        onError={() => handleImageError(currentPreviewSlide.id)}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>


                  {/* Title */}
                  <h4 className="font-black text-white text-base text-center leading-snug px-2">
                    {currentPreviewSlide.title}
                  </h4>

                  {/* Paragraph / Subtitle */}
                  {currentPreviewSlide.subtitle && (
                    <p className="text-[11px] text-slate-400 text-center mt-1.5 leading-relaxed px-3">
                      {currentPreviewSlide.subtitle}
                    </p>
                  )}

                  {/* Pagination Dots */}
                  <div className="flex items-center gap-1.5 mt-4">
                    {activeSlides.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === previewIndex
                            ? 'w-4 bg-white shadow-sm shadow-white'
                            : 'w-1.5 bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4">
                  No active slides to display.
                </div>
              )}

              {/* Mock Action Buttons */}
              <div className="space-y-2 mt-auto pt-2">
                <div className="w-full h-9 rounded-full bg-[#00c853] flex items-center justify-center text-xs font-bold text-white shadow-md shadow-emerald-500/20">
                  Login
                </div>
                <div className="w-full h-9 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-xs font-bold text-white">
                  Register (Get ₹50)
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

