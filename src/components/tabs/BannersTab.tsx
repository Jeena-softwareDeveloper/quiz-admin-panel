import React from 'react';
import { BannerItem } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Sliders,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BannersTabProps {
  banners: BannerItem[];
  onAddBanner: () => void;
  onToggleActive: (id: string, currentStatus: boolean) => Promise<void>;
  onDeleteBanner: (id: string) => Promise<void>;
}

export const BannersTab: React.FC<BannersTabProps> = ({
  banners,
  onAddBanner,
  onToggleActive,
  onDeleteBanner,
}) => {
  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Mobile Hero Banners</h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload and control dynamic promotional banners displayed on the mobile app home screen.
          </p>
        </div>

        <Button variant="primary" onClick={onAddBanner} className="gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Upload New Banner
        </Button>
      </div>

      {/* Banners List */}
      {banners.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Hero Banners Uploaded</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create your first hero banner with custom image artwork, bilingual title, and category links.
          </p>
          <Button variant="primary" onClick={onAddBanner} className="mt-4 gap-2">
            <Plus className="w-4 h-4" />
            Upload First Banner
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden border border-slate-200/80 hover:shadow-lg transition">
              {/* Image Artwork Container */}
              <div className="relative h-44 bg-slate-950 overflow-hidden group">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20">
                    Order #{banner.order}
                  </span>
                  {banner.isActive ? (
                    <span className="bg-emerald-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active on Mobile
                    </span>
                  ) : (
                    <span className="bg-slate-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>

                {/* Banner Content Preview on Image */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h4 className="font-extrabold text-white text-lg leading-tight tracking-tight drop-shadow">
                    {banner.title}
                  </h4>
                  {banner.subtitle && (
                    <p className="text-xs text-amber-300 font-medium mt-0.5 drop-shadow line-clamp-1">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Details & Controls */}
              <div className="p-4 space-y-3">
                {/* Tamil Translation Preview */}
                {(banner.titleTamil || banner.subtitleTamil) && (
                  <div className="bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700 border border-slate-100">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                      Tamil Localization
                    </span>
                    <p className="font-bold">{banner.titleTamil || banner.title}</p>
                    {banner.subtitleTamil && (
                      <p className="text-slate-500 text-[11px] mt-0.5">{banner.subtitleTamil}</p>
                    )}
                  </div>
                )}

                {/* Meta info */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Target Category:</span>
                    <Badge variant="success">{banner.actionTarget || 'ALL'}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                    Button: <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">{banner.actionText}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onToggleActive(banner.id, banner.isActive)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                      banner.isActive
                        ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {banner.isActive ? 'Hide from Mobile' : 'Show on Mobile'}
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete banner "${banner.title}"?`)) {
                        onDeleteBanner(banner.id);
                      }
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-xl transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

