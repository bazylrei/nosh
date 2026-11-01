import { describe, it, expect } from 'vitest'
import { computeCostPerPersonWithMap } from '../../src/lib/pricing.js'
import type { Recipe, PriceMap } from '@nosh/shared'

const prices: PriceMap = {
  'chicken breast': { priceGBP: 0.011, per: 1, unit: 'g' },
  'onion': { priceGBP: 0.22, per: 1, unit: 'count' },
  'olive oil': { priceGBP: 0.07, per: 1, unit: 'tbsp' },
}

function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 'r1',
    name: 'Test',
    cuisine: 'Test',
    mealType: ['dinner'],
    dietary: [],
    tags: [],
    serves: 2,
    isCustom: false,
    method: [],
    ingredients: [
      { item: 'chicken breast', quantity: 400, unit: 'g' },
      { item: 'onion', quantity: 1, unit: null },
      { item: 'olive oil', quantity: 2, unit: 'tbsp' },
    ],
    ...overrides,
  }
}

describe('computeCostPerPersonWithMap', () => {
  it('calculates total cost and divides by serves', () => {
    const result = computeCostPerPersonWithMap(makeRecipe(), prices)
    // chicken: 400 × 0.011 = 4.40
    // onion: 1 × 0.22 = 0.22
    // olive oil: 2 × 0.07 = 0.14
    // total = 4.76 / 2 serves = 2.38
    expect(result).toBeCloseTo(2.38)
  })

  it('treats null unit as count', () => {
    const recipe = makeRecipe({
      ingredients: [{ item: 'onion', quantity: 2, unit: null }],
      serves: 2,
    })
    // 2 × 0.22 = 0.44 / 2 = 0.22
    expect(computeCostPerPersonWithMap(recipe, prices)).toBeCloseTo(0.22)
  })

  it('skips ingredients with unit mismatch', () => {
    const mismatchPrices: PriceMap = { 'milk': { priceGBP: 0.001, per: 1, unit: 'ml' } }
    const recipe = makeRecipe({
      ingredients: [{ item: 'milk', quantity: 2, unit: 'tbsp' }],
      serves: 1,
    })
    expect(computeCostPerPersonWithMap(recipe, mismatchPrices)).toBeNull()
  })

  it('skips ingredients with null quantity', () => {
    const recipe = makeRecipe({
      ingredients: [
        { item: 'chicken breast', quantity: 400, unit: 'g' },
        { item: 'salt and pepper', quantity: null, unit: null },
      ],
      serves: 1,
    })
    const result = computeCostPerPersonWithMap(recipe, prices)
    expect(result).toBeCloseTo(400 * 0.011)
  })

  it('returns null when no ingredients are priced', () => {
    const recipe = makeRecipe({
      ingredients: [{ item: 'truffle oil', quantity: 1, unit: 'tbsp' }],
      serves: 1,
    })
    expect(computeCostPerPersonWithMap(recipe, prices)).toBeNull()
  })

  it('returns null when serves is 0', () => {
    expect(computeCostPerPersonWithMap(makeRecipe({ serves: 0 }), prices)).toBeNull()
  })

  it('matches ingredient names case-insensitively', () => {
    const recipe = makeRecipe({
      ingredients: [{ item: 'Chicken Breast', quantity: 200, unit: 'g' }],
      serves: 2,
    })
    // 200 × 0.011 / 2 = 1.10
    expect(computeCostPerPersonWithMap(recipe, prices)).toBeCloseTo(1.10)
  })
})
