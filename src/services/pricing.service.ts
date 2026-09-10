import { CakeDesign, CakeCategory, CakeFlavor, Frosting, CakeSize, Decoration } from '../types/database.types';
import { PriceCalculation } from '../types/ai.types';

export class PricingService {
  static calculatePrice(
    design: Partial<CakeDesign>,
    categories: CakeCategory[],
    flavors: CakeFlavor[],
    frostings: Frosting[],
    sizes: CakeSize[],
    decorationsCatalog: Decoration[]
  ): PriceCalculation {
    const category = categories.find((c) => c.id === design.category_id || c.name === design.occasion);
    const flavor = flavors.find((f) => f.id === design.flavor_id);
    const frosting = frostings.find((fr) => fr.id === design.frosting_id);
    const size = sizes.find((s) => s.id === design.size_id);

    const basePrice = category ? category.base_price : 799;
    const sizeModifier = size ? size.price_modifier : 0;
    const flavorModifier = flavor ? flavor.price_modifier : 0;
    const frostingModifier = frosting ? frosting.price_modifier : 0;

    // Calculate decorations modifier
    let decorationModifier = 0;
    const selectedDecoNames = design.decorations || [];
    selectedDecoNames.forEach((name) => {
      const match = decorationsCatalog.find((d) => d.name === name);
      if (match) {
        decorationModifier += match.price_modifier;
      } else {
        decorationModifier += 100;
      }
    });

    // Multi-tier modifier: +20% for 2 tiers, +45% for 3+ tiers
    let tierModifier = 0;
    if (design.tiers && design.tiers === 2) {
      tierModifier = Math.round((basePrice + sizeModifier) * 0.25);
    } else if (design.tiers && design.tiers >= 3) {
      tierModifier = Math.round((basePrice + sizeModifier) * 0.5);
    }

    // Custom complexity modifier (e.g. Heart shape or complex reference)
    let customComplexityModifier = 0;
    if (design.shape === 'Heart' || design.shape === 'Custom') {
      customComplexityModifier += 150;
    }
    if (design.ai_analysis && design.ai_analysis.complexityScore === 'Masterpiece') {
      customComplexityModifier += 300;
    } else if (design.ai_analysis && design.ai_analysis.complexityScore === 'Intricate') {
      customComplexityModifier += 150;
    }

    const estimatedPrice =
      basePrice +
      sizeModifier +
      flavorModifier +
      frostingModifier +
      decorationModifier +
      tierModifier +
      customComplexityModifier;

    const breakdown = [
      { label: `Base Cake (${category ? category.name : design.occasion || 'Standard'})`, amount: basePrice },
      ...(sizeModifier > 0 ? [{ label: `Size / Weight (${size?.name})`, amount: sizeModifier }] : []),
      ...(flavorModifier > 0 ? [{ label: `Gourmet Flavor (${flavor?.name})`, amount: flavorModifier }] : []),
      ...(frostingModifier > 0 ? [{ label: `Premium Frosting (${frosting?.name})`, amount: frostingModifier }] : []),
      ...(decorationModifier > 0 ? [{ label: `Selected Decorations (${selectedDecoNames.length} items)`, amount: decorationModifier }] : []),
      ...(tierModifier > 0 ? [{ label: `Multi-Tier Architecture (${design.tiers} Tiers)`, amount: tierModifier }] : []),
      ...(customComplexityModifier > 0 ? [{ label: 'Custom Sculpting & Complexity', amount: customComplexityModifier }] : []),
    ];

    return {
      basePrice,
      sizeModifier,
      flavorModifier,
      frostingModifier,
      decorationModifier,
      tierModifier,
      customComplexityModifier,
      estimatedPrice,
      breakdown,
    };
  }
}
