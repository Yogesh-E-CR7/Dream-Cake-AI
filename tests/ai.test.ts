import { describe, it, expect } from 'vitest';
import { MockAIService } from '../src/services/ai.service';
import { CakeDesign } from '../src/types/database.types';

describe('AIService (Mock & Strategy)', () => {
  const service = new MockAIService();

  it('generates romantic recommendations for anniversary/romantic keywords', async () => {
    const design: Partial<CakeDesign> = { occasion: 'Anniversary' };
    const response = await service.chat('I need a romantic cake for my anniversary with my wife', design, []);

    expect(response.sender).toBe('ai');
    expect(response.text.toLowerCase()).toContain('romantic');
    expect(response.suggestions).toBeDefined();
    expect(response.suggestions!.length).toBeGreaterThan(0);
    expect(response.suggestions![0].appliedChanges.shape).toBe('Heart');
    expect(response.suggestions![0].appliedChanges.flavor_id).toBe('flv-red-velvet');
  });

  it('generates chocolate recommendations for chocolate lover prompts', async () => {
    const design: Partial<CakeDesign> = { occasion: 'Birthday' };
    const response = await service.chat('Can you make a rich dark chocolate truffle cake?', design, []);

    expect(response.text.toLowerCase()).toContain('chocolate');
    expect(response.suggestions).toBeDefined();
    expect(response.suggestions![0].appliedChanges.flavor_id).toBe('flv-chocolate');
    expect(response.suggestions![0].appliedChanges.frosting_id).toBe('frst-ganache');
  });

  it('analyzes reference image and extracts structured attributes', async () => {
    const analysis = await service.analyzeReference('data:image/jpeg;base64,mockImage', { occasion: 'Wedding' });

    expect(analysis.detectedShape).toBe('Round');
    expect(analysis.estimatedTiers).toBe(2);
    expect(analysis.detectedColors.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(analysis.detectedColors.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(analysis.detectedColors.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(analysis.complexityScore).toBe('Intricate');
    expect(analysis.decorations.length).toBeGreaterThan(0);
  });

  it('returns chef pairing suggestions without overriding user state', async () => {
    const suggestions = await service.getSuggestions({ decorations: [] });
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].category).toBe('combo');
  });
});
