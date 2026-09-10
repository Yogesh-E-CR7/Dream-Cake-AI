export interface AISuggestion {
  id: string;
  category: 'flavor' | 'frosting' | 'color' | 'decoration' | 'theme' | 'message' | 'combo';
  title: string;
  description: string;
  appliedChanges: {
    flavor_id?: string;
    flavorName?: string;
    frosting_id?: string;
    frostingName?: string;
    shape?: string;
    tiers?: number;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    theme?: string;
    decorations?: string[];
    cake_message?: string;
    special_requirements?: string;
  };
}

export interface AIReferenceAnalysis {
  theme: string;
  detectedShape: string;
  estimatedTiers: number;
  detectedColors: {
    primary: string;
    secondary: string;
    accent: string;
    paletteName: string;
  };
  frostingStyle: string;
  decorations: string[];
  complexityScore: 'Standard' | 'Intricate' | 'Masterpiece';
  aestheticSummary: string;
  suggestedMatchingFlavor: string;
  suggestedMatchingFrosting: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestions?: AISuggestion[];
}

export interface PriceCalculation {
  basePrice: number;
  sizeModifier: number;
  flavorModifier: number;
  frostingModifier: number;
  decorationModifier: number;
  tierModifier: number;
  customComplexityModifier: number;
  estimatedPrice: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}
