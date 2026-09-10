import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatPrice } from '../../lib/utils';
import { DollarSign, Save, Sparkles, Check, Info } from 'lucide-react';

export const AdminPricingPage: React.FC = () => {
  const [basePrice, setBasePrice] = useState(799);
  const [tier2Modifier, setTier2Modifier] = useState(25);
  const [tier3Modifier, setTier3Modifier] = useState(50);
  const [heartShapeModifier, setHeartShapeModifier] = useState(150);
  const [intricateModifier, setIntricateModifier] = useState(150);
  const [masterpieceModifier, setMasterpieceModifier] = useState(300);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      {savedToast && (
        <div className="fixed top-20 right-8 z-50 rounded-2xl bg-emerald-700 text-white px-4 py-3 shadow-soft-xl flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <Check className="h-4 w-4 stroke-[3]" />
          <span>Pricing rules updated across all customer studios!</span>
        </div>
      )}

      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950">
          Dynamic Pricing Engine Matrix
        </h2>
        <p className="text-xs text-chocolate-600 mt-1">
          Configure baseline pricing multipliers and custom architectural surcharges without code changes
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Baseline Base Rules */}
        <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-cream-200">
            <DollarSign className="h-5 w-5 text-rose-700" />
            <h3 className="font-serif text-base font-bold text-chocolate-950">
              Base Architecture Multipliers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="Standard Single-Tier Base Price (₹)"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              helperText="Default base before flavor/size additions"
            />
            <Input
              label="Heart & Custom Base Sculpting Surcharge (₹)"
              type="number"
              value={heartShapeModifier}
              onChange={(e) => setHeartShapeModifier(Number(e.target.value))}
              helperText="Additional artisan sculpting labor"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="2-Tier Structural Surcharge (%)"
              type="number"
              value={tier2Modifier}
              onChange={(e) => setTier2Modifier(Number(e.target.value))}
              helperText="Percent surcharge on base + size for dowel reinforcement"
            />
            <Input
              label="3-Tier Structural Surcharge (%)"
              type="number"
              value={tier3Modifier}
              onChange={(e) => setTier3Modifier(Number(e.target.value))}
              helperText="Percent surcharge on base + size for 3+ tiers"
            />
          </div>
        </div>

        {/* AI Complexity Surcharges */}
        <div className="rounded-3xl bg-white/95 border border-cream-200/90 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-cream-200">
            <Sparkles className="h-5 w-5 text-gold-500" />
            <h3 className="font-serif text-base font-bold text-chocolate-950">
              AI Reference Complexity Modifiers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="'Intricate' Complexity Score Surcharge (₹)"
              type="number"
              value={intricateModifier}
              onChange={(e) => setIntricateModifier(Number(e.target.value))}
              helperText="Triggered by intricate Lambeth piping or multi-color gradients"
            />
            <Input
              label="'Masterpiece' Complexity Score Surcharge (₹)"
              type="number"
              value={masterpieceModifier}
              onChange={(e) => setMasterpieceModifier(Number(e.target.value))}
              helperText="Triggered by extensive 24K leaf brushing or 3D sugar sculpting"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-chocolate-600 flex items-start gap-2">
          <Info className="h-4 w-4 text-chocolate-500 mt-0.5 shrink-0" />
          <span>
            These rules automatically update the real-time live price calculator on every customer's 14-step designer canvas. Bakery staff can still make final manual adjustments per order.
          </span>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" size="lg" leftIcon={<Save className="h-4 w-4" />}>
            Save Pricing Rules
          </Button>
        </div>
      </form>
    </div>
  );
};
