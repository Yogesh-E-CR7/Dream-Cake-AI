import React from 'react';
import { CakeDesign, CakeFlavor, Frosting, CakeSize } from '../../types/database.types';
import { formatPrice } from '../../lib/utils';
import { Sparkles, Heart, Layers, Scale, Cake, Palette } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface CakeSummaryCardProps {
  design: Partial<CakeDesign>;
  flavors?: CakeFlavor[];
  frostings?: Frosting[];
  sizes?: CakeSize[];
  className?: string;
}

export const CakeSummaryCard: React.FC<CakeSummaryCardProps> = ({
  design,
  flavors = [],
  frostings = [],
  sizes = [],
  className,
}) => {
  const flavor = flavors.find((f) => f.id === design.flavor_id);
  const frosting = frostings.find((fr) => fr.id === design.frosting_id);
  const size = sizes.find((s) => s.id === design.size_id);

  return (
    <div className={`rounded-2xl bg-white/95 border border-cream-300 p-5 shadow-soft space-y-4 ${className || ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
            {design.occasion || 'Celebration'}
          </span>
          <h3 className="font-serif text-lg font-bold text-chocolate-950 mt-1.5 line-clamp-1">
            {design.name || 'Custom Handcrafted Cake'}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="h-5 w-5 rounded-full border border-cream-400 shadow-2xs"
            style={{ backgroundColor: design.primary_color || '#FFF1F4' }}
            title="Primary Color"
          />
          <span
            className="h-5 w-5 rounded-full border border-cream-400 shadow-2xs"
            style={{ backgroundColor: design.secondary_color || '#BE123C' }}
            title="Secondary Color"
          />
          <span
            className="h-5 w-5 rounded-full border border-cream-400 shadow-2xs"
            style={{ backgroundColor: design.accent_color || '#D4AF37' }}
            title="Accent Color"
          />
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="rounded-xl bg-cream-50 p-2.5 border border-cream-200">
          <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Shape & Tiers</span>
          <span className="font-semibold text-chocolate-900 mt-0.5 block">
            {design.shape || 'Round'} • {design.tiers || 1} {design.tiers === 1 ? 'Tier' : 'Tiers'}
          </span>
        </div>

        <div className="rounded-xl bg-cream-50 p-2.5 border border-cream-200">
          <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Weight / Size</span>
          <span className="font-semibold text-chocolate-900 mt-0.5 block">
            {size ? size.name : '1.0 kg'}
          </span>
        </div>

        <div className="rounded-xl bg-cream-50 p-2.5 border border-cream-200">
          <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Gourmet Flavor</span>
          <span className="font-semibold text-chocolate-900 mt-0.5 block line-clamp-1">
            {flavor ? flavor.name : 'Belgian Chocolate'}
          </span>
        </div>

        <div className="rounded-xl bg-cream-50 p-2.5 border border-cream-200">
          <span className="text-[10px] uppercase font-bold text-chocolate-500 block">Frosting Style</span>
          <span className="font-semibold text-chocolate-900 mt-0.5 block line-clamp-1">
            {frosting ? frosting.name : 'Buttercream'}
          </span>
        </div>
      </div>

      {/* Decorations List */}
      {design.decorations && design.decorations.length > 0 && (
        <div>
          <span className="text-[10px] uppercase font-bold text-chocolate-500 block mb-1.5">
            Decorations ({design.decorations.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {design.decorations.map((deco, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[11px] font-medium bg-rose-50 text-rose-900 border border-rose-200 px-2 py-0.5 rounded-md"
              >
                {deco}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Message Inscription */}
      {design.cake_message && (
        <div className="rounded-xl bg-gold-50/70 border border-gold-200 p-2.5">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Inscription on Cake</span>
          <p className="font-serif italic font-semibold text-chocolate-950 mt-0.5 text-xs">
            "{design.cake_message}"
          </p>
        </div>
      )}
    </div>
  );
};
