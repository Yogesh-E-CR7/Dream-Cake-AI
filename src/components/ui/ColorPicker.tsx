import React from 'react';
import { cn } from '../../lib/utils';
import { Palette, Check } from 'lucide-react';

export interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  helper?: string;
}

const DEFAULT_PRESETS = [
  '#FFFDF9', // Warm Ivory
  '#FDF2F4', // Soft Blush
  '#FDA4AF', // Rose Petal
  '#E11D48', // Crimson Rose
  '#881337', // Deep Burgundy
  '#26150D', // Dark Chocolate
  '#7B523A', // Milk Chocolate
  '#D4AF37', // Champagne Gold
  '#FEF08A', // Buttercup Yellow
  '#E0F2FE', // Powder Sky Blue
  '#DCFCE7', // Pistachio Mint
  '#F3E8FF', // Lavender Mist
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = DEFAULT_PRESETS,
  helper,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-chocolate-700">
          {label}
        </label>
        <span className="text-xs font-mono font-medium text-chocolate-500 uppercase bg-cream-100 px-2 py-0.5 rounded-md border border-cream-200">
          {value || '#FFFFFF'}
        </span>
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-6 gap-2">
        {presetColors.map((hex) => {
          const isSelected = value.toLowerCase() === hex.toLowerCase();
          return (
            <button
              key={hex}
              type="button"
              onClick={() => onChange(hex)}
              className={cn(
                'relative h-8 w-full rounded-lg border transition-all duration-150 flex items-center justify-center shadow-xs',
                isSelected
                  ? 'border-chocolate-900 ring-2 ring-rose-500 scale-105'
                  : 'border-cream-300 hover:scale-105'
              )}
              style={{ backgroundColor: hex }}
              title={hex}
            >
              {isSelected && (
                <Check
                  className={cn(
                    'h-4 w-4 stroke-[3]',
                    hex === '#FFFDF9' || hex === '#FDF2F4' || hex === '#FEF08A' || hex === '#E0F2FE' || hex === '#DCFCE7'
                      ? 'text-chocolate-900'
                      : 'text-white'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Color Input & Hex Field */}
      <div className="flex items-center gap-2 pt-1">
        <div className="relative flex items-center">
          <input
            type="color"
            value={value || '#BE123C'}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded-lg border border-cream-300 bg-white p-0.5 shadow-sm"
          />
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#HEX Code"
            className="w-full rounded-lg border border-cream-300 bg-white/90 px-3 py-1.5 text-xs font-mono uppercase text-chocolate-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-200"
          />
        </div>
      </div>

      {helper && <p className="text-[11px] text-chocolate-500">{helper}</p>}
    </div>
  );
};
