import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSubmit: (data: any) => Promise<void>;
}

export const AddBannerModal: React.FC<AddBannerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [titleTamil, setTitleTamil] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleTamil, setSubtitleTamil] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [actionType, setActionType] = useState('PLAY_NOW');
  const [actionTarget, setActionTarget] = useState(categories[0] || 'TNPSC');
  const [actionText, setActionText] = useState('Play Now');
  const [actionTextTamil, setActionTextTamil] = useState('இப்போதே விளையாடு');
  const [order, setOrder] = useState('1');
  const [loading, setLoading] = useState(false);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File size too large. Please select an image under 15MB.');
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
    if (!title.trim() || !imageUrl.trim()) {
      alert('Please provide a banner title and select/upload an image.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        titleTamil,
        subtitle,
        subtitleTamil,
        imageUrl,
        actionType,
        actionTarget,
        actionText,
        actionTextTamil,
        order: Number(order) || 1,
        isActive: true,
      });
      // Reset form
      setTitle('');
      setTitleTamil('');
      setSubtitle('');
      setSubtitleTamil('');
      setImageUrl('');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to upload banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Mobile Hero Banner" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload Area */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Banner Artwork / Image (Required)
          </label>

          {imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-900 group">
              <img
                src={imageUrl}
                alt="Banner Preview"
                className="w-full h-36 object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <label className="cursor-pointer bg-white text-slate-900 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow hover:bg-slate-100">
                  Change Image
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="bg-rose-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow hover:bg-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition bg-slate-50/50">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Click or drag & drop to upload banner image
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG, WEBP recommended (e.g. 16:9 or 2:1 ratio, max 15MB)
              </p>
              <label className="mt-3 inline-block cursor-pointer bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-emerald-700 transition">
                Browse Image File
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          )}

          {/* Direct URL input fallback */}
          <div className="mt-2.5">
            <Input
              label="Or Image Web URL"
              placeholder="https://example.com/banner.jpg"
              value={imageUrl.startsWith('data:') ? '' : imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Titles Grid (EN & TA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Banner Title (English) *"
            placeholder="e.g. TNPSC Quiz Challenge"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Banner Title (Tamil)"
            placeholder="எ.கா. TNPSC வினாடி வினா சவால்"
            value={titleTamil}
            onChange={(e) => setTitleTamil(e.target.value)}
          />
        </div>

        {/* Subtitles Grid (EN & TA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Subtitle (English)"
            placeholder="e.g. Test Your Knowledge • Win Real Cash"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
          <Input
            label="Subtitle (Tamil)"
            placeholder="எ.கா. அறிவை சோதித்து • ரொக்கப் பரிசு வெல்லுங்கள்"
            value={subtitleTamil}
            onChange={(e) => setSubtitleTamil(e.target.value)}
          />
        </div>

        {/* Action Type & Target */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Action Type"
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            options={[
              { label: 'Play Now / Open Category', value: 'PLAY_NOW' },
              { label: 'Link to Category', value: 'CATEGORY' },
            ]}
          />

          <Select
            label="Target Category"
            value={actionTarget}
            onChange={(e) => setActionTarget(e.target.value)}
            options={categories.map((c) => ({ label: c, value: c }))}
          />

          <Input
            label="Display Priority Order"
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </div>

        {/* Action Buttons Grid (EN & TA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Button Text (English)"
            placeholder="Play Now"
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
          />
          <Input
            label="Button Text (Tamil)"
            placeholder="இப்போதே விளையாடு"
            value={actionTextTamil}
            onChange={(e) => setActionTextTamil(e.target.value)}
          />
        </div>

        {/* Live Preview Box */}
        {title && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-white">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Mobile App Preview
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-white text-base italic">{title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{subtitle || 'Subtitle preview'}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
                  ▶ {actionText || 'Play Now'}
                </div>
              </div>
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Thumb"
                  className="w-20 h-16 rounded-xl object-cover border border-emerald-700/50"
                />
              )}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Uploading Banner...' : 'Save & Publish Banner'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

