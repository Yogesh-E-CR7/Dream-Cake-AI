import React, { useState, useRef } from 'react';
import { cn } from '../../lib/utils';
import { UploadCloud, X, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';

export interface ImageUploaderProps {
  value?: string | null;
  onChange: (dataUrlOrUrl: string | null) => void;
  onAnalyze?: (dataUrlOrUrl: string) => void;
  label?: string;
  helperText?: string;
  isAnalyzing?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onAnalyze,
  label,
  helperText,
  isAnalyzing = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-chocolate-700">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative rounded-2xl border border-cream-300 bg-cream-50/50 p-3 overflow-hidden group">
          <div className="relative h-60 w-full overflow-hidden rounded-xl bg-chocolate-950 flex items-center justify-center shadow-inner">
            <img
              src={value}
              alt="Uploaded Reference"
              className="h-full w-full object-contain"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-3 right-3 rounded-full bg-chocolate-900/80 p-2 text-white shadow-lg backdrop-blur-xs hover:bg-rose-600 transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {onAnalyze && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-chocolate-600 font-medium flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-rose-600" /> Reference Image Ready
              </span>
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={() => onAnalyze(value)}
                isLoading={isAnalyzing}
                leftIcon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Analyze with AI
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer bg-white/70 backdrop-blur-xs',
            isDragging
              ? 'border-rose-500 bg-rose-50/60 scale-[1.01]'
              : 'border-cream-300 hover:border-rose-400 hover:bg-cream-50/50'
          )}
        >
          <div className="rounded-full bg-rose-50 p-4 text-rose-700 shadow-xs mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-7 w-7 stroke-[1.8]" />
          </div>
          <p className="text-sm font-semibold text-chocolate-900">
            Click to upload or drag & drop reference photo
          </p>
          <p className="mt-1 text-xs text-chocolate-500">
            Supports high-res JPG, PNG, WEBP (Max 10MB)
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-chocolate-500">{helperText}</p>}
    </div>
  );
};
