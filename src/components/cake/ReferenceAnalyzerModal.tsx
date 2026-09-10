import React from 'react';
import { AIReferenceAnalysis } from '../../types/ai.types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sparkles, Check, Layers, Palette, Eye, ArrowRight } from 'lucide-react';

export interface ReferenceAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AIReferenceAnalysis | null;
  onApply: () => void;
}

export const ReferenceAnalyzerModal: React.FC<ReferenceAnalyzerModalProps> = ({
  isOpen,
  onClose,
  analysis,
  onApply,
}) => {
  if (!analysis) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 text-chocolate-950">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-chocolate-950">AI Reference Breakdown</h3>
            <p className="text-xs text-chocolate-600">Visual attributes detected from your uploaded image</p>
          </div>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        {/* Aesthetic Summary */}
        <div className="rounded-2xl bg-rose-50/70 border border-rose-200 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-1">
            Artistic Analysis Summary
          </span>
          <p className="text-chocolate-800 leading-relaxed">{analysis.aestheticSummary}</p>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Theme & Complexity */}
          <div className="rounded-xl bg-cream-50 p-3 border border-cream-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-chocolate-500 block">
              Detected Theme
            </span>
            <span className="font-bold text-sm text-chocolate-950 mt-1 block">
              {analysis.theme}
            </span>
            <span className="inline-block mt-2 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Complexity: {analysis.complexityScore}
            </span>
          </div>

          {/* Architecture */}
          <div className="rounded-xl bg-cream-50 p-3 border border-cream-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-chocolate-500 block">
              Architecture & Silhouette
            </span>
            <span className="font-bold text-sm text-chocolate-950 mt-1 block">
              {analysis.detectedShape} • {analysis.estimatedTiers} {analysis.estimatedTiers === 1 ? 'Tier' : 'Tiers'}
            </span>
            <span className="text-[11px] text-chocolate-600 block mt-1">
              Frosting: {analysis.frostingStyle}
            </span>
          </div>
        </div>

        {/* Color Palette */}
        <div className="rounded-xl bg-white border border-cream-300 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-chocolate-600">
              Detected Color Palette ({analysis.detectedColors.paletteName})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="h-6 w-6 rounded-full border border-cream-400 shadow-2xs"
                style={{ backgroundColor: analysis.detectedColors.primary }}
              />
              <span className="text-[11px] text-chocolate-700">Primary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-6 w-6 rounded-full border border-cream-400 shadow-2xs"
                style={{ backgroundColor: analysis.detectedColors.secondary }}
              />
              <span className="text-[11px] text-chocolate-700">Secondary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-6 w-6 rounded-full border border-cream-400 shadow-2xs"
                style={{ backgroundColor: analysis.detectedColors.accent }}
              />
              <span className="text-[11px] text-chocolate-700">Accent</span>
            </div>
          </div>
        </div>

        {/* Detected Decorations */}
        <div className="rounded-xl bg-white border border-cream-300 p-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-chocolate-600 block mb-1.5">
            Key Decorative Elements
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.decorations.map((deco, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-cream-100 text-chocolate-800 border border-cream-300 px-2 py-0.5 rounded-md"
              >
                {deco}
              </span>
            ))}
          </div>
        </div>

        {/* Chef Flavor Recommendations */}
        <div className="rounded-xl bg-gold-50/80 border border-gold-200 p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
              Chef Recommended Pairing
            </span>
            <span className="font-semibold text-chocolate-900 text-xs">
              {analysis.suggestedMatchingFlavor} + {analysis.suggestedMatchingFrosting}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-cream-200">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Keep Current Choices
          </Button>
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={() => {
              onApply();
              onClose();
            }}
            leftIcon={<Check className="h-4 w-4" />}
          >
            Apply Suggestions to Design
          </Button>
        </div>
      </div>
    </Modal>
  );
};
