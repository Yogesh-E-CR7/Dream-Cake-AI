import { describe, it, expect } from 'vitest';
import { PricingService } from '../src/services/pricing.service';
import { MOCK_CATEGORIES, MOCK_FLAVORS, MOCK_FROSTINGS, MOCK_SIZES, MOCK_DECORATIONS } from '../src/lib/mockData';

describe('PricingService', () => {
  it('calculates baseline standard price correctly', () => {
    const result = PricingService.calculatePrice(
      {
        occasion: 'Birthday',
        category_id: 'cat-birthday',
        flavor_id: 'flv-chocolate',
        frosting_id: 'frst-buttercream',
        size_id: 'sz-0.5',
        shape: 'Round',
        tiers: 1,
        decorations: [],
      },
      MOCK_CATEGORIES,
      MOCK_FLAVORS,
      MOCK_FROSTINGS,
      MOCK_SIZES,
      MOCK_DECORATIONS
    );

    // Base (799) + Chocolate (150) + Buttercream (80) + Size 0.5kg (0) = 1029
    expect(result.estimatedPrice).toBe(1029);
  });

  it('adds multi-tier and custom shape complexity modifiers', () => {
    const result = PricingService.calculatePrice(
      {
        occasion: 'Anniversary',
        category_id: 'cat-anniversary',
        flavor_id: 'flv-red-velvet',
        frosting_id: 'frst-cream-cheese',
        size_id: 'sz-1.5',
        shape: 'Heart',
        tiers: 2,
        decorations: ['Handcrafted Edible Sugar Roses', '24K Edible Gold Leaf Accents'],
      },
      MOCK_CATEGORIES,
      MOCK_FLAVORS,
      MOCK_FROSTINGS,
      MOCK_SIZES,
      MOCK_DECORATIONS
    );

    // Base (999) + Size 1.5kg (650) + Red Velvet (180) + Cream Cheese (120) + Roses (220) + Gold Leaf (250) + 2 Tiers (412) + Heart Shape (150)
    expect(result.estimatedPrice).toBeGreaterThan(2500);
    expect(result.breakdown.length).toBeGreaterThan(5);
  });
});
