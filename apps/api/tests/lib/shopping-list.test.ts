import { describe, it, expect } from 'vitest'
import { buildShoppingList } from '../../src/lib/shopping-list.js'
import type { Recipe, MealSlot } from '@nosh/shared'

const pasta: Recipe = {
  id: 'r1',
  name: 'Pasta',
  cuisine: 'italian',
  mealType: ['dinner'],
  dietary: [],
  tags: [],
  serves: 4,
  isCustom: false,
  ingredients: [
    { item: 'spaghetti', quantity: 400, unit: 'g' },
    { item: 'tomatoes', quantity: 800, unit: 'g' },
    { item: 'salt and pepper', quantity: null, unit: null },
  ],
  method: ['Cook pasta', 'Add sauce'],
}

const slot = (overrides: Partial<MealSlot> = {}): MealSlot => ({
  id: 's1',
  day: 0,
  mealType: 'dinner',
  recipeId: 'r1',
  serves: 4,
  weekStart: '2025-01-06',
  ...overrides,
})

describe('buildShoppingList', () => {
  it('returns ingredients at full serves', () => {
    const result = buildShoppingList([slot()], new Map([['r1', pasta]]))
    expect(result.find((i) => i.item === 'spaghetti')).toMatchObject({ totalQuantity: 400, unit: 'g' })
  })

  it('scales down when slot serves < recipe serves', () => {
    const result = buildShoppingList([slot({ serves: 2 })], new Map([['r1', pasta]]))
    expect(result.find((i) => i.item === 'spaghetti')?.totalQuantity).toBe(200)
  })

  it('scales up when slot serves > recipe serves', () => {
    const result = buildShoppingList([slot({ serves: 8 })], new Map([['r1', pasta]]))
    expect(result.find((i) => i.item === 'tomatoes')?.totalQuantity).toBe(1600)
  })

  it('combines the same ingredient across multiple slots', () => {
    const slots = [slot({ id: 's1', day: 0 }), slot({ id: 's2', day: 1 })]
    const result = buildShoppingList(slots, new Map([['r1', pasta]]))
    expect(result.find((i) => i.item === 'spaghetti')?.totalQuantity).toBe(800)
  })

  it('keeps null quantity as null (free staples)', () => {
    const result = buildShoppingList([slot()], new Map([['r1', pasta]]))
    expect(result.find((i) => i.item === 'salt and pepper')?.totalQuantity).toBeNull()
  })

  it('keeps null if any contributing slot has null quantity', () => {
    const slots = [slot({ id: 's1', day: 0 }), slot({ id: 's2', day: 1 })]
    const result = buildShoppingList(slots, new Map([['r1', pasta]]))
    expect(result.find((i) => i.item === 'salt and pepper')?.totalQuantity).toBeNull()
  })

  it('ignores slots whose recipe is not in the map', () => {
    const result = buildShoppingList([slot()], new Map())
    expect(result).toHaveLength(0)
  })

  it('returns empty list for no slots', () => {
    expect(buildShoppingList([], new Map())).toHaveLength(0)
  })

  it('does not combine items with different units', () => {
    const recipe: Recipe = {
      ...pasta,
      ingredients: [
        { item: 'flour', quantity: 200, unit: 'g' },
        { item: 'flour', quantity: 2, unit: 'cup' },
      ],
    }
    const result = buildShoppingList([slot()], new Map([['r1', recipe]]))
    expect(result.filter((i) => i.item === 'flour')).toHaveLength(2)
  })
})
