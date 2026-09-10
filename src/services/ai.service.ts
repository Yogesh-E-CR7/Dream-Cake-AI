import { CakeDesign } from '../types/database.types';
import { AISuggestion, AIReferenceAnalysis, AIChatMessage } from '../types/ai.types';

export interface AIService {
  chat(message: string, currentDesign: Partial<CakeDesign>, history: AIChatMessage[]): Promise<AIChatMessage>;
  analyzeReference(imageDataUrlOrUrl: string, currentDesign: Partial<CakeDesign>): Promise<AIReferenceAnalysis>;
  generatePreview(design: Partial<CakeDesign>): Promise<string>;
  getSuggestions(design: Partial<CakeDesign>): Promise<AISuggestion[]>;
}

export class MockAIService implements AIService {
  async chat(message: string, currentDesign: Partial<CakeDesign>, _history: AIChatMessage[]): Promise<AIChatMessage> {
    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = message.toLowerCase();
    const suggestions: AISuggestion[] = [];
    let responseText = '';

    if (lower.includes('romantic') || lower.includes('anniversary') || lower.includes('wife') || lower.includes('husband') || lower.includes('love')) {
      responseText = `A romantic celebration calls for elegance! I suggest a heart-shaped silhouette with soft ivory and crimson tones, finished with handcrafted sugar roses and sparkling 24K gold leaf.`;
      suggestions.push({
        id: `sug-${Date.now()}-1`,
        category: 'combo',
        title: 'Romantic Elegance Suite',
        description: 'Heart Shape + Royal Red Velvet + Tangy Cream Cheese + Sugar Roses & Gold Leaf',
        appliedChanges: {
          shape: 'Heart',
          tiers: 2,
          flavor_id: 'flv-red-velvet',
          frosting_id: 'frst-cream-cheese',
          primary_color: '#FFF1F4',
          secondary_color: '#BE123C',
          accent_color: '#D4AF37',
          decorations: ['Handcrafted Edible Sugar Roses', '24K Edible Gold Leaf Accents'],
          theme: 'Floral Luxury',
        },
      });
    } else if (lower.includes('chocolate') || lower.includes('truffle') || lower.includes('dark')) {
      responseText = `For chocolate aficionados, a decadent double-tier Belgian Chocolate Truffle with glossy chocolate ganache and hand-tempered chocolate shards provides unbeatable depth.`;
      suggestions.push({
        id: `sug-${Date.now()}-2`,
        category: 'flavor',
        title: 'Decadent Chocolate Feast',
        description: 'Belgian Chocolate Truffle + Ganache Gloss + Chocolate Drip & Shards',
        appliedChanges: {
          flavor_id: 'flv-chocolate',
          frosting_id: 'frst-ganache',
          primary_color: '#26150D',
          secondary_color: '#7B523A',
          accent_color: '#D4AF37',
          decorations: ['Artisan Chocolate Drip & Shards', '24K Edible Gold Leaf Accents'],
        },
      });
    } else if (lower.includes('kids') || lower.includes('cartoon') || lower.includes('birthday') || lower.includes('child')) {
      responseText = `For a magical children's birthday, vibrant pastel colors with whimsical sprinkles and a custom 3D sculpted figurine create wonderful memories!`;
      suggestions.push({
        id: `sug-${Date.now()}-3`,
        category: 'theme',
        title: 'Playful Wonderland Palette',
        description: 'Pastel Blue & Yellow + Sprinkles + 3D Figurines',
        appliedChanges: {
          shape: 'Round',
          primary_color: '#E0F2FE',
          secondary_color: '#FEF08A',
          accent_color: '#F472B6',
          theme: 'Kids & Cartoon',
          decorations: ['Sparkling Pearl & Gold Sprinkles', '3D Custom Figurines'],
        },
      });
    } else if (lower.includes('flower') || lower.includes('floral') || lower.includes('garden')) {
      responseText = `Botanical designs look breathtaking when paired with Fresh Strawberry Rose or Pistachio Saffron sponge and hand-piped sugar roses.`;
      suggestions.push({
        id: `sug-${Date.now()}-4`,
        category: 'decoration',
        title: 'Enchanted Floral Bouquet',
        description: 'Pistachio Saffron + Sugar Roses + Edible Gold Flakes',
        appliedChanges: {
          flavor_id: 'flv-pistachio',
          frosting_id: 'frst-buttercream',
          primary_color: '#F0FDF4',
          secondary_color: '#FDA4AF',
          accent_color: '#D4AF37',
          decorations: ['Handcrafted Edible Sugar Roses', '24K Edible Gold Leaf Accents'],
          theme: 'Floral Luxury',
        },
      });
    } else {
      responseText = `I've analyzed your current configuration for a "${currentDesign.occasion || 'Celebration'}" cake. Based on bakery trends, I recommend pairing this with delicate Lambeth piping and a personalized gold acrylic topper.`;
      suggestions.push({
        id: `sug-${Date.now()}-5`,
        category: 'decoration',
        title: 'Vintage Royalty Finish',
        description: 'Add Vintage Lambeth Piping and Gold Acrylic Topper for refined elegance',
        appliedChanges: {
          decorations: Array.from(new Set([...(currentDesign.decorations || []), 'Vintage Royal Lambeth Piping', 'Acrylic Laser Cut Name Topper'])),
        },
      });
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }

  async analyzeReference(imageDataUrlOrUrl: string, currentDesign: Partial<CakeDesign>): Promise<AIReferenceAnalysis> {
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Heuristics based on image and design context
    return {
      theme: currentDesign.occasion === 'Wedding' ? 'Grand Royal Floral' : 'Modern Luxury Minimalist',
      detectedShape: 'Round',
      estimatedTiers: 2,
      detectedColors: {
        primary: '#FFF8F0',
        secondary: '#E11D48',
        accent: '#D4AF37',
        paletteName: 'Champagne, Crimson & Gold',
      },
      frostingStyle: 'Swiss Meringue Buttercream (Textured Scrape)',
      decorations: [
        'Handcrafted Edible Sugar Roses',
        '24K Edible Gold Leaf Accents',
        'Vintage Royal Lambeth Piping',
      ],
      complexityScore: 'Intricate',
      aestheticSummary:
        'The reference image showcases a modern artisan tiered presentation featuring smooth porcelain frosting, organic sugar floral cascading down the front edge, and subtle warm 24K leaf brushing.',
      suggestedMatchingFlavor: 'Royal Red Velvet or Belgian Chocolate Truffle',
      suggestedMatchingFrosting: 'Swiss Meringue Buttercream',
    };
  }

  async generatePreview(design: Partial<CakeDesign>): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // High resolution aesthetic generative cake visual pool mapped to themes and shapes
    const previewsByTheme: Record<string, string[]> = {
      'Floral Luxury': [
        'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1000&auto=format&fit=crop&q=80',
      ],
      'Modern Luxury': [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=1000&auto=format&fit=crop&q=80',
      ],
      'Kids & Cartoon': [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&auto=format&fit=crop&q=80',
      ],
      'Minimal': [
        'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=1000&auto=format&fit=crop&q=80',
      ],
    };

    const themeKey = design.theme || 'Floral Luxury';
    const list = previewsByTheme[themeKey] || previewsByTheme['Floral Luxury'];
    return list[Math.floor(Math.random() * list.length)];
  }

  async getSuggestions(design: Partial<CakeDesign>): Promise<AISuggestion[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [
      {
        id: 'sug-rec-1',
        category: 'combo',
        title: 'Master Pastry Chef Recommended Pairing',
        description: 'Pair Royal Red Velvet with Tangy Cream Cheese & 24K Gold Leaf highlights.',
        appliedChanges: {
          flavor_id: 'flv-red-velvet',
          frosting_id: 'frst-cream-cheese',
          accent_color: '#D4AF37',
        },
      },
      {
        id: 'sug-rec-2',
        category: 'decoration',
        title: 'Add Handcrafted Sugar Petals',
        description: 'Elevates visual height and gives an organic handcrafted finish.',
        appliedChanges: {
          decorations: Array.from(new Set([...(design.decorations || []), 'Handcrafted Edible Sugar Roses'])),
        },
      },
    ];
  }
}

// Service Factory
const isMock = import.meta.env.VITE_AI_MODE !== 'real';
export const aiService: AIService = new MockAIService();
