import React, { useState } from 'react';
import { CakeDesign } from '../../types/database.types';
import { Sparkles, Eye, RotateCw, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CakePreviewCanvasProps {
  design: Partial<CakeDesign>;
  aiPreviewUrl?: string | null;
  isGenerating?: boolean;
  onGenerateAIPreview?: () => void;
  className?: string;
}

export const CakePreviewCanvas: React.FC<CakePreviewCanvasProps> = ({
  design,
  aiPreviewUrl,
  isGenerating = false,
  onGenerateAIPreview,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'ai'>(aiPreviewUrl ? 'ai' : 'interactive');

  const tiers = design.tiers || 1;
  const shape = design.shape || 'Round';
  const primaryColor = design.primary_color || '#FDF2F4';
  const secondaryColor = design.secondary_color || '#BE123C';
  const accentColor = design.accent_color || '#D4AF37';
  const decorations = design.decorations || [];
  const cakeMessage = design.cake_message || '';

  const hasRoses = decorations.some((d) => d.toLowerCase().includes('rose') || d.toLowerCase().includes('flower'));
  const hasGold = decorations.some((d) => d.toLowerCase().includes('gold'));
  const hasBerries = decorations.some((d) => d.toLowerCase().includes('berry') || d.toLowerCase().includes('fruit'));
  const hasDrip = decorations.some((d) => d.toLowerCase().includes('drip') || d.toLowerCase().includes('chocolate'));
  const hasTopper = decorations.some((d) => d.toLowerCase().includes('topper'));
  const hasPiping = decorations.some((d) => d.toLowerCase().includes('piping'));

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EF] to-cream-100 border border-cream-300 p-6 shadow-soft-lg overflow-hidden min-h-[440px] ${className || ''}`}>
      {/* Background Ambience / Sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#E11D48_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Mode Switcher */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-xl bg-white/90 p-1 border border-cream-300 shadow-xs backdrop-blur-xs">
        <button
          type="button"
          onClick={() => setViewMode('interactive')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            viewMode === 'interactive'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'text-chocolate-600 hover:text-chocolate-900'
          }`}
        >
          <RotateCw className="h-3.5 w-3.5" /> 3D Studio Concept
        </button>
        {aiPreviewUrl && (
          <button
            type="button"
            onClick={() => setViewMode('ai')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === 'ai'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-chocolate-600 hover:text-chocolate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-400" /> AI Photorealistic
          </button>
        )}
      </div>

      {/* Main Visual Display */}
      {viewMode === 'ai' && aiPreviewUrl ? (
        <div className="relative h-80 sm:h-96 w-full max-w-md rounded-2xl overflow-hidden shadow-soft-xl border-2 border-cream-300 animate-fade-in group">
          <img
            src={aiPreviewUrl}
            alt="AI Cake Concept"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-chocolate-950/80 via-chocolate-950/40 to-transparent p-4 text-white">
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-300">
              <Sparkles className="h-3.5 w-3.5" /> AI Generated Concept
            </span>
            <p className="text-xs text-cream-200 mt-0.5">
              {design.name || 'Custom Cake Design'} • {design.theme}
            </p>
          </div>
        </div>
      ) : (
        /* Dynamic SVG / Canvas Multi-Tier Cake Renderer */
        <div className="relative w-full max-w-sm sm:max-w-md h-80 sm:h-96 flex items-center justify-center animate-fade-in">
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Primary Color Gradient */}
              <linearGradient id="primaryTierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={primaryColor} />
                <stop offset="70%" stopColor={primaryColor} />
                <stop offset="100%" stopColor="#1A0D08" stopOpacity="0.15" />
              </linearGradient>

              {/* Secondary Color Gradient */}
              <linearGradient id="secondaryTierGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={secondaryColor} />
                <stop offset="100%" stopColor="#430A19" />
              </linearGradient>

              {/* Gold Accents Gradient */}
              <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F6E7A1" />
                <stop offset="50%" stopColor={accentColor || '#D4AF37'} />
                <stop offset="100%" stopColor="#8E6E18" />
              </linearGradient>

              {/* Shadow filter */}
              <filter id="cakeDropShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Cake Stand / Pedestal */}
            <ellipse cx="200" cy="360" rx="140" ry="16" fill="#DCCABB" />
            <ellipse cx="200" cy="358" rx="136" ry="13" fill="#FAF6EF" stroke="#C5AA96" strokeWidth="2" />
            <path d="M170 365H230V380C230 384 225 388 215 388H185C175 388 170 384 170 380V365Z" fill="#B69123" />
            <ellipse cx="200" cy="388" rx="40" ry="6" fill="#8E6E18" />

            {/* Bottom Tier (Tier 1) */}
            <g id="tier-1" filter="url(#cakeDropShadow)">
              {shape === 'Heart' ? (
                <path
                  d="M100 280 C100 240, 160 230, 200 260 C240 230, 300 240, 300 280 C300 325, 200 355, 200 355 C200 355, 100 325, 100 280 Z"
                  fill="url(#primaryTierGrad)"
                  stroke={secondaryColor}
                  strokeWidth="2"
                />
              ) : shape === 'Square' ? (
                <>
                  <rect x="90" y="270" width="220" height="75" rx="8" fill="url(#primaryTierGrad)" stroke="#C5AA96" strokeWidth="1.5" />
                  <ellipse cx="200" cy="270" rx="110" ry="12" fill={primaryColor} opacity="0.9" />
                </>
              ) : (
                <>
                  <path d="M95 270H305V335C305 348 258 358 200 358C142 358 95 348 95 335V270Z" fill="url(#primaryTierGrad)" />
                  <ellipse cx="200" cy="270" rx="105" ry="18" fill={primaryColor} stroke="#C5AA96" strokeWidth="1" />
                </>
              )}

              {/* Drip / Frosting Waves on Tier 1 */}
              {hasDrip && (
                <path
                  d="M95 275 C115 295 130 270 150 295 C170 320 185 275 205 295 C225 315 240 275 265 300 C285 320 295 280 305 285 V270 H95 V275 Z"
                  fill="url(#secondaryTierGrad)"
                  opacity="0.9"
                />
              )}

              {/* Gold Leaf Flakes on Tier 1 */}
              {hasGold && (
                <>
                  <polygon points="120,290 128,295 124,302 116,298" fill="url(#goldSheen)" />
                  <polygon points="270,300 278,304 274,312 265,307" fill="url(#goldSheen)" />
                  <polygon points="180,325 186,328 183,334 176,330" fill="url(#goldSheen)" />
                </>
              )}

              {/* Lambeth Piping Border */}
              {hasPiping && (
                <path
                  d="M98 335 Q115 342 130 338 Q150 345 170 340 Q190 347 210 342 Q230 348 250 343 Q270 349 290 342 Q302 338 304 335"
                  stroke={secondaryColor}
                  strokeWidth="3.5"
                  fill="none"
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* Middle Tier (Tier 2 if tiers >= 2) */}
            {tiers >= 2 && (
              <g id="tier-2" filter="url(#cakeDropShadow)">
                <path d="M125 200H275V260C275 270 241 278 200 278C159 278 125 270 125 260V200Z" fill="url(#primaryTierGrad)" />
                <ellipse cx="200" cy="200" rx="75" ry="14" fill={primaryColor} stroke="#C5AA96" strokeWidth="1" />
                
                {hasDrip && (
                  <path
                    d="M125 205 C140 220 150 202 165 220 C180 235 195 205 210 222 C225 238 240 205 255 220 C265 230 270 205 275 210 V200 H125 V205 Z"
                    fill="url(#secondaryTierGrad)"
                  />
                )}

                {hasGold && (
                  <>
                    <polygon points="150,220 156,224 153,230 146,226" fill="url(#goldSheen)" />
                    <polygon points="230,230 236,233 234,239 227,235" fill="url(#goldSheen)" />
                  </>
                )}
              </g>
            )}

            {/* Top Tier (Tier 3 if tiers >= 3) */}
            {tiers >= 3 && (
              <g id="tier-3" filter="url(#cakeDropShadow)">
                <path d="M150 140H250V190C250 198 228 205 200 205C172 205 150 198 150 190V140Z" fill="url(#primaryTierGrad)" />
                <ellipse cx="200" cy="140" rx="50" ry="10" fill={primaryColor} stroke="#C5AA96" strokeWidth="1" />
              </g>
            )}

            {/* Handcrafted Sugar Roses */}
            {hasRoses && (
              <g id="sugar-roses">
                <circle cx={tiers === 1 ? 200 : 200} cy={tiers === 3 ? 135 : tiers === 2 ? 195 : 265} r="14" fill="#BE123C" />
                <circle cx={tiers === 1 ? 200 : 200} cy={tiers === 3 ? 135 : tiers === 2 ? 195 : 265} r="9" fill="#FB7185" />
                <circle cx={tiers === 1 ? 200 : 200} cy={tiers === 3 ? 135 : tiers === 2 ? 195 : 265} r="4" fill="#FFE4E8" />
                <circle cx={tiers === 1 ? 180 : 185} cy={tiers === 3 ? 140 : tiers === 2 ? 200 : 270} r="10" fill="#E11D48" />
                <circle cx={tiers === 1 ? 220 : 215} cy={tiers === 3 ? 140 : tiers === 2 ? 200 : 270} r="10" fill="#E11D48" />
              </g>
            )}

            {/* Organic Fresh Berries */}
            {hasBerries && (
              <g id="fresh-berries">
                <circle cx="160" cy={tiers === 3 ? 142 : tiers === 2 ? 202 : 272} r="6" fill="#881337" />
                <circle cx="170" cy={tiers === 3 ? 145 : tiers === 2 ? 205 : 275} r="5" fill="#3B82F6" />
                <circle cx="230" cy={tiers === 3 ? 142 : tiers === 2 ? 202 : 272} r="6" fill="#881337" />
                <circle cx="240" cy={tiers === 3 ? 146 : tiers === 2 ? 206 : 276} r="5" fill="#3B82F6" />
              </g>
            )}

            {/* Custom Acrylic Topper / Candle */}
            {hasTopper && (
              <g id="acrylic-topper">
                <line x1="200" y1={tiers === 3 ? 135 : tiers === 2 ? 195 : 265} x2="200" y2={tiers === 3 ? 95 : tiers === 2 ? 150 : 210} stroke="#D4AF37" strokeWidth="2.5" />
                <rect
                  x="150"
                  y={tiers === 3 ? 65 : tiers === 2 ? 115 : 175}
                  width="100"
                  height="30"
                  rx="6"
                  fill="url(#goldSheen)"
                  stroke="#8E6E18"
                  strokeWidth="1.5"
                />
                <text
                  x="200"
                  y={tiers === 3 ? 84 : tiers === 2 ? 134 : 194}
                  textAnchor="middle"
                  fill="#26150D"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="'Playfair Display', serif"
                >
                  {cakeMessage ? cakeMessage.slice(0, 15) : 'Dream Cake'}
                </text>
              </g>
            )}

            {/* Cake Message Scroll on Front */}
            {cakeMessage && !hasTopper && (
              <g id="message-ribbon">
                <rect x="130" y="300" width="140" height="24" rx="4" fill="#FFFDF9" stroke={accentColor || '#D4AF37'} strokeWidth="1.5" />
                <text
                  x="200"
                  y="316"
                  textAnchor="middle"
                  fill="#430A19"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="'Playfair Display', serif"
                >
                  {cakeMessage.length > 20 ? `${cakeMessage.slice(0, 19)}…` : cakeMessage}
                </text>
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Floating Action / Prompt to Generate AI concept */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 z-10">
        {onGenerateAIPreview && (
          <Button
            type="button"
            variant="gold"
            size="sm"
            onClick={onGenerateAIPreview}
            isLoading={isGenerating}
            leftIcon={<Sparkles className="h-4 w-4" />}
          >
            {aiPreviewUrl ? 'Regenerate AI Preview' : 'Generate AI Cake Concept'}
          </Button>
        )}
      </div>
    </div>
  );
};
