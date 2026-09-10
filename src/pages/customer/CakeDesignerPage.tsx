import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useDesignerStore } from '../../stores/designerStore';
import { DesignService } from '../../services/design.service';
import { Stepper, StepItem } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ColorPicker } from '../../components/ui/ColorPicker';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { PriceBreakdown } from '../../components/ui/PriceBreakdown';
import { CakePreviewCanvas } from '../../components/cake/CakePreviewCanvas';
import { CakeSummaryCard } from '../../components/cake/CakeSummaryCard';
import { AICakeAssistant } from '../../components/cake/AICakeAssistant';
import { ReferenceAnalyzerModal } from '../../components/cake/ReferenceAnalyzerModal';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Save,
  ShoppingBag,
  Wand2,
  Layers,
  Heart,
  Scale,
  Cake,
  Palette,
  MessageSquare,
  FileText,
  Camera,
  Check,
  RotateCcw,
} from 'lucide-react';

const DESIGN_STEPS: StepItem[] = [
  { id: 1, label: 'Occasion', icon: '🎂' },
  { id: 2, label: 'Style', icon: '✨' },
  { id: 3, label: 'Shape', icon: '📐' },
  { id: 4, label: 'Weight', icon: '⚖️' },
  { id: 5, label: 'Tiers', icon: '🥞' },
  { id: 6, label: 'Flavor', icon: '🍫' },
  { id: 7, label: 'Frosting', icon: '🧁' },
  { id: 8, label: 'Theme', icon: '🎨' },
  { id: 9, label: 'Colors', icon: '🌈' },
  { id: 10, label: 'Decorations', icon: '🌸' },
  { id: 11, label: 'Message', icon: '✍️' },
  { id: 12, label: 'Special Notes', icon: '📝' },
  { id: 13, label: 'Reference Photo', icon: '📷' },
  { id: 14, label: 'AI Concept Preview', icon: '🪄' },
];

export const CakeDesignerPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    currentStep,
    setStep,
    nextStep,
    prevStep,
    currentDesign,
    updateDesign,
    priceCalc,
    categories,
    flavors,
    frostings,
    sizes,
    decorations,
    loadCatalog,
    isLoadingCatalog,
    referenceImage,
    setReferenceImage,
    isAnalyzing,
    analysisResult,
    analyzeReference,
    applyAnalysisSuggestions,
    isGeneratingPreview,
    previewUrl,
    generatePreview,
    saveCurrentDesign,
    isSaving,
    loadDesign,
    resetDesign,
  } = useDesignerStore();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isAnalyzerModalOpen, setIsAnalyzerModalOpen] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  useEffect(() => {
    loadCatalog();
    const designId = searchParams.get('id');
    if (designId) {
      DesignService.getDesignById(designId).then((d) => {
        if (d) loadDesign(d);
      });
    }
  }, [searchParams]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await saveCurrentDesign(user.id);
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 3000);
    } catch (e) {
      alert('Could not save design. Please check your inputs.');
    }
  };

  const handleProceedToOrder = async () => {
    if (!user) return;
    const saved = await saveCurrentDesign(user.id);
    navigate(`/customer/orders/request?designId=${saved.id}`);
  };

  const handleAnalyzePhoto = async (imgUrl: string) => {
    await analyzeReference(imgUrl);
    setIsAnalyzerModalOpen(true);
  };

  // Decoration toggler
  const toggleDecoration = (decoName: string) => {
    const list = currentDesign.decorations || [];
    const exists = list.includes(decoName);
    const updated = exists ? list.filter((d) => d !== decoName) : [...list, decoName];
    updateDesign({ decorations: updated });
  };

  const cakeStyles = [
    'Artisan Classic',
    'Haute Couture Designer',
    'Edible Photo Cake',
    'Themed Sculpted Cake',
    'Royal Multi-tier Wedding',
    'Korean Bento Cake',
    'Bespoke AI Creation',
  ];

  const shapes = ['Round', 'Square', 'Heart', 'Rectangle', 'Custom Hexagon'];
  const themes = [
    'Floral Luxury',
    'Modern Minimalist',
    'Kids & Cartoon',
    'Rustic Vintage',
    'Chocolate Decadence',
    'Royal Gold Elegance',
    'Pastel Dreamscape',
    'Botanical Herbarium',
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Toast */}
      {saveSuccessToast && (
        <div className="fixed top-20 right-8 z-50 rounded-2xl bg-emerald-700 text-white px-4 py-3 shadow-soft-xl flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <Check className="h-4 w-4 stroke-[3]" />
          <span>Design saved successfully to your collection!</span>
        </div>
      )}

      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
              <Sparkles className="h-3 w-3" /> Step {currentStep} of 14
            </span>
            <span className="text-xs text-chocolate-500 font-medium">
              • {DESIGN_STEPS.find((s) => s.id === currentStep)?.label}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate-950 mt-1">
            Cake Design Studio
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={resetDesign}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleProceedToOrder}
            leftIcon={<ShoppingBag className="h-3.5 w-3.5" />}
          >
            Request This Cake
          </Button>
        </div>
      </div>

      {/* Stepper Bar */}
      <Stepper
        steps={DESIGN_STEPS}
        currentStep={currentStep}
        onStepClick={(s) => setStep(s)}
        className="bg-white/80 p-2 rounded-2xl border border-cream-200 shadow-2xs"
      />

      {/* 3-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Step Configuration Controls (Cols: 4) */}
        <div className="lg:col-span-4 rounded-3xl bg-white/95 border border-cream-200 p-5 sm:p-6 shadow-soft-lg space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <h3 className="font-serif text-lg font-bold text-chocolate-950">
              {DESIGN_STEPS.find((s) => s.id === currentStep)?.label}
            </h3>
            <span className="text-xs font-semibold text-rose-700">
              {currentStep}/14
            </span>
          </div>

          {/* STEP 1: Occasion */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Select the milestone for your custom cake:</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const isSelected = currentDesign.category_id === cat.id || currentDesign.occasion === cat.name;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateDesign({ category_id: cat.id, occasion: cat.name })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/70 shadow-xs ring-2 ring-rose-200 font-bold'
                          : 'border-cream-200 hover:border-rose-300 hover:bg-cream-50'
                      }`}
                    >
                      <span className="font-serif text-xs text-chocolate-950 block">{cat.name}</span>
                      <span className="text-[10px] text-chocolate-500 block mt-0.5">From ₹{cat.base_price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Cake Style / Type */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Choose the architectural cake styling category:</p>
              <div className="space-y-2">
                {cakeStyles.map((style) => {
                  const isSelected = currentDesign.name?.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => updateDesign({ name: `${style} — ${currentDesign.occasion || 'Celebration'}` })}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                          : 'border-cream-200 hover:bg-cream-50 text-chocolate-800'
                      }`}
                    >
                      <span>{style}</span>
                      {isSelected && <Check className="h-4 w-4 text-rose-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Shape */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Choose the cake base silhouette:</p>
              <div className="grid grid-cols-2 gap-2.5">
                {shapes.map((s) => {
                  const isSelected = currentDesign.shape === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateDesign({ shape: s })}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 shadow-xs ring-2 ring-rose-200 font-bold text-rose-900'
                          : 'border-cream-200 hover:bg-cream-50 text-chocolate-800'
                      }`}
                    >
                      <span className="text-lg block mb-1">
                        {s === 'Heart' ? '❤️' : s === 'Square' ? '⏹️' : s === 'Rectangle' ? '▬' : '⭕'}
                      </span>
                      <span className="text-xs">{s}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Weight & Servings */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Select weight and estimated guest servings:</p>
              <div className="space-y-2">
                {sizes.map((sz) => {
                  const isSelected = currentDesign.size_id === sz.id;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => updateDesign({ size_id: sz.id })}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 shadow-xs ring-2 ring-rose-200 font-bold'
                          : 'border-cream-200 hover:bg-cream-50'
                      }`}
                    >
                      <div>
                        <span className="text-chocolate-950 font-bold block">{sz.name}</span>
                        <span className="text-[11px] text-chocolate-500 font-normal">{sz.servings}</span>
                      </div>
                      <span className="text-xs font-semibold text-rose-700">
                        {sz.price_modifier > 0 ? `+₹${sz.price_modifier}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Tiers */}
          {currentStep === 5 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Choose multi-tier vertical height:</p>
              <div className="grid grid-cols-3 gap-2.5">
                {[1, 2, 3].map((tierNum) => {
                  const isSelected = currentDesign.tiers === tierNum;
                  return (
                    <button
                      key={tierNum}
                      type="button"
                      onClick={() => updateDesign({ tiers: tierNum })}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 shadow-xs ring-2 ring-rose-200 font-bold text-rose-900'
                          : 'border-cream-200 hover:bg-cream-50 text-chocolate-800'
                      }`}
                    >
                      <span className="font-serif text-xl font-bold block">{tierNum}</span>
                      <span className="text-xs mt-0.5 block">{tierNum === 1 ? 'Single Tier' : `${tierNum} Tiers`}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Gourmet Flavor */}
          {currentStep === 6 && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <p className="text-xs text-chocolate-600">Select handcrafted gourmet sponge flavor:</p>
              <div className="space-y-2">
                {flavors.map((flv) => {
                  const isSelected = currentDesign.flavor_id === flv.id;
                  return (
                    <div
                      key={flv.id}
                      onClick={() => updateDesign({ flavor_id: flv.id })}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/80 shadow-xs ring-2 ring-rose-200'
                          : 'border-cream-200 hover:bg-cream-50'
                      }`}
                    >
                      <div className="h-10 w-10 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                        <img src={flv.image_url} alt={flv.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-chocolate-950">{flv.name}</span>
                          <span className="text-[11px] font-semibold text-rose-700">
                            +₹{flv.price_modifier}
                          </span>
                        </div>
                        <p className="text-[11px] text-chocolate-600 mt-0.5 line-clamp-2">{flv.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: Frosting */}
          {currentStep === 7 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Choose coating and outer frosting:</p>
              <div className="space-y-2">
                {frostings.map((fr) => {
                  const isSelected = currentDesign.frosting_id === fr.id;
                  return (
                    <div
                      key={fr.id}
                      onClick={() => updateDesign({ frosting_id: fr.id })}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 shadow-xs ring-2 ring-rose-200 font-bold'
                          : 'border-cream-200 hover:bg-cream-50'
                      }`}
                    >
                      <div>
                        <span className="text-chocolate-950 font-bold block">{fr.name}</span>
                        <span className="text-[11px] text-chocolate-600 font-normal">{fr.description}</span>
                      </div>
                      <span className="text-xs font-semibold text-rose-700 shrink-0">
                        {fr.price_modifier > 0 ? `+₹${fr.price_modifier}` : 'Standard'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: Theme */}
          {currentStep === 8 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Select design aesthetic & motif theme:</p>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((th) => {
                  const isSelected = currentDesign.theme === th;
                  return (
                    <button
                      key={th}
                      type="button"
                      onClick={() => updateDesign({ theme: th })}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-200'
                          : 'border-cream-200 hover:bg-cream-50 text-chocolate-800'
                      }`}
                    >
                      {th}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9: Colors */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <ColorPicker
                label="Primary Base Color"
                value={currentDesign.primary_color || '#FDF2F4'}
                onChange={(c) => updateDesign({ primary_color: c })}
                helper="Main background frosting color"
              />
              <ColorPicker
                label="Secondary Accent / Drip Color"
                value={currentDesign.secondary_color || '#BE123C'}
                onChange={(c) => updateDesign({ secondary_color: c })}
                helper="Color for borders, drips, and floral accents"
              />
              <ColorPicker
                label="Metallic Gold / Highlight Color"
                value={currentDesign.accent_color || '#D4AF37'}
                onChange={(c) => updateDesign({ accent_color: c })}
                helper="Color for topper calligraphy and leaf flakes"
              />
            </div>
          )}

          {/* STEP 10: Decorations (Multi-select) */}
          {currentStep === 10 && (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              <p className="text-xs text-chocolate-600">Select toppings & handcrafted accents (Multiple allowed):</p>
              <div className="space-y-2">
                {decorations.map((deco) => {
                  const isSelected = (currentDesign.decorations || []).includes(deco.name);
                  return (
                    <div
                      key={deco.id}
                      onClick={() => toggleDecoration(deco.name)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50 shadow-xs ring-2 ring-rose-200'
                          : 'border-cream-200 hover:bg-cream-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{deco.image_url}</span>
                        <div>
                          <span className="font-bold text-chocolate-950 block">{deco.name}</span>
                          <span className="text-[10px] text-chocolate-500">{deco.category} • {deco.description}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-rose-700">+₹{deco.price_modifier}</span>
                        <div
                          className={`h-5 w-5 rounded-md border flex items-center justify-center ${
                            isSelected ? 'bg-rose-600 text-white border-rose-600' : 'border-cream-300'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 11: Message Inscription */}
          {currentStep === 11 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Enter calligraphy inscription or acrylic topper text:</p>
              <Input
                label="Cake Inscription"
                placeholder="e.g. Happy Birthday Sarah!"
                value={currentDesign.cake_message || ''}
                onChange={(e) => updateDesign({ cake_message: e.target.value })}
                startIcon={<MessageSquare className="h-4 w-4" />}
                maxLength={40}
              />
              <p className="text-[11px] text-chocolate-500">
                Live preview is rendered directly on your 3D cake canvas.
              </p>
            </div>
          )}

          {/* STEP 12: Special Requirements */}
          {currentStep === 12 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Add dietary or custom styling preferences for the baker:</p>
              <Textarea
                label="Baker Notes & Dietary Preferences"
                placeholder="e.g. Less sweet, eggless, no nuts, add extra fresh strawberries on side..."
                value={currentDesign.special_requirements || ''}
                onChange={(e) => updateDesign({ special_requirements: e.target.value })}
                rows={4}
              />
            </div>
          )}

          {/* STEP 13: Reference Image Upload & AI Analysis */}
          {currentStep === 13 && (
            <div className="space-y-3">
              <p className="text-xs text-chocolate-600">Upload a photo for AI reference extraction & complexity analysis:</p>
              <ImageUploader
                value={referenceImage}
                onChange={setReferenceImage}
                onAnalyze={handleAnalyzePhoto}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}

          {/* STEP 14: AI Concept Preview */}
          {currentStep === 14 && (
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl bg-gradient-to-br from-rose-950 to-burgundy-950 text-white p-4 space-y-2">
                <span className="font-bold text-gold-300 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Generative AI Concept Engine
                </span>
                <p className="text-rose-100 text-xs leading-relaxed">
                  Click below to synthesize a high-resolution photorealistic preview based on all your custom specifications.
                </p>
                <Button
                  type="button"
                  variant="gold"
                  size="md"
                  onClick={generatePreview}
                  isLoading={isGeneratingPreview}
                  leftIcon={<Sparkles className="h-4 w-4" />}
                  className="w-full mt-2"
                >
                  {previewUrl ? 'Regenerate Photorealistic Preview' : 'Generate AI Cake Concept'}
                </Button>
              </div>

              <div className="rounded-2xl bg-cream-50 p-3.5 border border-cream-200">
                <span className="font-bold text-chocolate-900 block mb-1">Specifications Locked</span>
                <p className="text-chocolate-600 text-[11px]">
                  You are in 100% control of all specifications. You can continue tweaking or request bakery review anytime.
                </p>
              </div>
            </div>
          )}

          {/* Step Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-cream-200">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Previous
            </Button>

            {currentStep < 14 ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={nextStep}
                rightIcon={<ChevronRight className="h-4 w-4" />}
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={handleProceedToOrder}
                rightIcon={<ShoppingBag className="h-4 w-4" />}
              >
                Proceed to Order
              </Button>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Live Interactive 3D / SVG Canvas Studio (Cols: 5) */}
        <div className="lg:col-span-5 space-y-5">
          <CakePreviewCanvas
            design={currentDesign}
            aiPreviewUrl={previewUrl || currentDesign.ai_preview_url}
            isGenerating={isGeneratingPreview}
            onGenerateAIPreview={generatePreview}
          />

          <CakeSummaryCard
            design={currentDesign}
            flavors={flavors}
            frostings={frostings}
            sizes={sizes}
          />
        </div>

        {/* RIGHT COLUMN: AI Assistant Chat & Live Pricing Engine (Cols: 3) */}
        <div className="lg:col-span-3 space-y-5">
          <PriceBreakdown priceCalc={priceCalc} />
          <AICakeAssistant />
        </div>
      </div>

      {/* Reference Analysis Modal */}
      <ReferenceAnalyzerModal
        isOpen={isAnalyzerModalOpen}
        onClose={() => setIsAnalyzerModalOpen(false)}
        analysis={analysisResult}
        onApply={applyAnalysisSuggestions}
      />
    </div>
  );
};
