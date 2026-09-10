import { create } from 'zustand';
import {
  CakeCategory,
  CakeFlavor,
  Frosting,
  CakeSize,
  Decoration,
  CakeDesign,
} from '../types/database.types';
import { AISuggestion, AIReferenceAnalysis, AIChatMessage, PriceCalculation } from '../types/ai.types';
import { CakeService } from '../services/cake.service';
import { PricingService } from '../services/pricing.service';
import { aiService } from '../services/ai.service';
import { DesignService } from '../services/design.service';

interface DesignerState {
  // Step navigation (1 to 14)
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Catalog
  categories: CakeCategory[];
  flavors: CakeFlavor[];
  frostings: Frosting[];
  sizes: CakeSize[];
  decorations: Decoration[];
  isLoadingCatalog: boolean;
  loadCatalog: () => Promise<void>;

  // Current Design Draft
  currentDesign: Partial<CakeDesign>;
  priceCalc: PriceCalculation;
  updateDesign: (updates: Partial<CakeDesign>) => void;
  resetDesign: () => void;
  loadDesign: (design: CakeDesign) => void;

  // AI Assistant Chat
  chatMessages: AIChatMessage[];
  isAiTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  applySuggestion: (suggestion: AISuggestion) => void;

  // Reference Image & Analysis
  referenceImage: string | null;
  isAnalyzing: boolean;
  analysisResult: AIReferenceAnalysis | null;
  setReferenceImage: (img: string | null) => void;
  analyzeReference: (imgUrl: string) => Promise<void>;
  applyAnalysisSuggestions: () => void;

  // AI Preview
  isGeneratingPreview: boolean;
  previewUrl: string | null;
  generatePreview: () => Promise<string>;

  // Saving
  isSaving: boolean;
  saveCurrentDesign: (userId: string) => Promise<CakeDesign>;
}

const INITIAL_DESIGN: Partial<CakeDesign> = {
  name: 'My Handcrafted Dream Cake',
  occasion: 'Birthday',
  shape: 'Round',
  tiers: 1,
  theme: 'Floral Luxury',
  primary_color: '#FDF2F4',
  secondary_color: '#BE123C',
  accent_color: '#D4AF37',
  decorations: ['Handcrafted Edible Sugar Roses'],
  cake_message: 'Happy Birthday!',
  special_requirements: '',
  reference_image_url: '',
  ai_preview_url: '',
  status: 'DRAFT',
};

export const useDesignerStore = create<DesignerState>((set, get) => ({
  currentStep: 1,
  setStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 14) }),
  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 14) set({ currentStep: currentStep + 1 });
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) set({ currentStep: currentStep - 1 });
  },

  categories: [],
  flavors: [],
  frostings: [],
  sizes: [],
  decorations: [],
  isLoadingCatalog: true,

  loadCatalog: async () => {
    set({ isLoadingCatalog: true });
    const [categories, flavors, frostings, sizes, decorations] = await Promise.all([
      CakeService.getCategories(),
      CakeService.getFlavors(),
      CakeService.getFrostings(),
      CakeService.getSizes(),
      CakeService.getDecorations(),
    ]);

    const initial = {
      ...INITIAL_DESIGN,
      category_id: categories[0]?.id,
      flavor_id: flavors[0]?.id,
      frosting_id: frostings[0]?.id,
      size_id: sizes[1]?.id || sizes[0]?.id,
    };

    const priceCalc = PricingService.calculatePrice(
      initial,
      categories,
      flavors,
      frostings,
      sizes,
      decorations
    );

    set({
      categories,
      flavors,
      frostings,
      sizes,
      decorations,
      currentDesign: initial,
      priceCalc,
      isLoadingCatalog: false,
    });
  },

  currentDesign: INITIAL_DESIGN,
  priceCalc: {
    basePrice: 799,
    sizeModifier: 350,
    flavorModifier: 150,
    frostingModifier: 80,
    decorationModifier: 220,
    tierModifier: 0,
    customComplexityModifier: 0,
    estimatedPrice: 1599,
    breakdown: [],
  },

  updateDesign: (updates) => {
    const { currentDesign, categories, flavors, frostings, sizes, decorations } = get();
    const updated = { ...currentDesign, ...updates };
    const priceCalc = PricingService.calculatePrice(
      updated,
      categories,
      flavors,
      frostings,
      sizes,
      decorations
    );
    updated.estimated_price = priceCalc.estimatedPrice;
    set({ currentDesign: updated, priceCalc });
  },

  resetDesign: () => {
    const { categories, flavors, frostings, sizes, decorations } = get();
    const reset = {
      ...INITIAL_DESIGN,
      category_id: categories[0]?.id,
      flavor_id: flavors[0]?.id,
      frosting_id: frostings[0]?.id,
      size_id: sizes[1]?.id || sizes[0]?.id,
    };
    const priceCalc = PricingService.calculatePrice(
      reset,
      categories,
      flavors,
      frostings,
      sizes,
      decorations
    );
    set({
      currentStep: 1,
      currentDesign: reset,
      priceCalc,
      referenceImage: null,
      analysisResult: null,
      previewUrl: null,
      chatMessages: [
        {
          id: 'msg-welcome',
          sender: 'ai',
          text: 'Hello! I am Dream Cake AI, your personal pastry stylist. Tell me about your occasion or idea, and I will recommend bespoke combinations!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
  },

  loadDesign: (design) => {
    const { categories, flavors, frostings, sizes, decorations } = get();
    const priceCalc = PricingService.calculatePrice(
      design,
      categories,
      flavors,
      frostings,
      sizes,
      decorations
    );
    set({
      currentDesign: design,
      priceCalc,
      referenceImage: design.reference_image_url || null,
      previewUrl: design.ai_preview_url || null,
      analysisResult: (design.ai_analysis as any) || null,
      currentStep: 1,
    });
  },

  // AI Chat Assistant
  chatMessages: [
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Hello! I am Dream Cake AI, your personal pastry stylist. Tell me about your occasion, mood, or idea, and I will recommend bespoke flavor and design combinations!',
      timestamp: 'Now',
    },
  ],
  isAiTyping: false,

  sendMessage: async (text: string) => {
    const { chatMessages, currentDesign } = get();
    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set({ chatMessages: [...chatMessages, userMsg], isAiTyping: true });

    try {
      const aiReply = await aiService.chat(text, currentDesign, chatMessages);
      set((state) => ({
        chatMessages: [...state.chatMessages, aiReply],
        isAiTyping: false,
      }));
    } catch (e) {
      set({ isAiTyping: false });
    }
  },

  applySuggestion: (suggestion: AISuggestion) => {
    const { updateDesign, currentDesign, flavors, frostings } = get();
    const changes: Partial<CakeDesign> = { ...suggestion.appliedChanges };

    // Resolve flavor id if name given
    if (suggestion.appliedChanges.flavorName && !changes.flavor_id) {
      const match = flavors.find((f) => f.name.toLowerCase().includes(suggestion.appliedChanges.flavorName!.toLowerCase()));
      if (match) changes.flavor_id = match.id;
    }

    // Resolve frosting id if name given
    if (suggestion.appliedChanges.frostingName && !changes.frosting_id) {
      const match = frostings.find((fr) => fr.name.toLowerCase().includes(suggestion.appliedChanges.frostingName!.toLowerCase()));
      if (match) changes.frosting_id = match.id;
    }

    updateDesign(changes);

    // Add confirmation message to chat
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          id: `msg-applied-${Date.now()}`,
          sender: 'ai',
          text: `✨ Applied suggestion: "${suggestion.title}". You can continue tweaking or previewing anytime!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }));
  },

  // Reference Image & Analysis
  referenceImage: null,
  isAnalyzing: false,
  analysisResult: null,

  setReferenceImage: (img) => {
    set({ referenceImage: img });
    get().updateDesign({ reference_image_url: img || '' });
  },

  analyzeReference: async (imgUrl: string) => {
    set({ isAnalyzing: true });
    try {
      const result = await aiService.analyzeReference(imgUrl, get().currentDesign);
      set({ analysisResult: result, isAnalyzing: false });
      get().updateDesign({ ai_analysis: result as any });
    } catch (e) {
      set({ isAnalyzing: false });
    }
  },

  applyAnalysisSuggestions: () => {
    const { analysisResult, updateDesign, flavors, frostings } = get();
    if (!analysisResult) return;

    const matchedFlavor = flavors.find((f) =>
      analysisResult.suggestedMatchingFlavor.toLowerCase().includes(f.name.toLowerCase())
    );
    const matchedFrosting = frostings.find((fr) =>
      analysisResult.suggestedMatchingFrosting.toLowerCase().includes(fr.name.toLowerCase())
    );

    updateDesign({
      shape: analysisResult.detectedShape || 'Round',
      tiers: analysisResult.estimatedTiers || 1,
      primary_color: analysisResult.detectedColors.primary,
      secondary_color: analysisResult.detectedColors.secondary,
      accent_color: analysisResult.detectedColors.accent,
      decorations: analysisResult.decorations,
      flavor_id: matchedFlavor ? matchedFlavor.id : get().currentDesign.flavor_id,
      frosting_id: matchedFrosting ? matchedFrosting.id : get().currentDesign.frosting_id,
    });
  },

  // Preview Generation
  isGeneratingPreview: false,
  previewUrl: null,

  generatePreview: async () => {
    set({ isGeneratingPreview: true });
    try {
      const url = await aiService.generatePreview(get().currentDesign);
      set({ previewUrl: url, isGeneratingPreview: false });
      get().updateDesign({ ai_preview_url: url });
      return url;
    } catch (e) {
      set({ isGeneratingPreview: false });
      throw e;
    }
  },

  // Persistence
  isSaving: false,
  saveCurrentDesign: async (userId: string) => {
    set({ isSaving: true });
    try {
      const saved = await DesignService.saveDesign({
        ...get().currentDesign,
        user_id: userId,
        status: 'READY',
      });
      set({ currentDesign: saved, isSaving: false });
      return saved;
    } catch (e) {
      set({ isSaving: false });
      throw e;
    }
  },
}));
