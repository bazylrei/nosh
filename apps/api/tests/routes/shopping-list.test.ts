import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { MealSlot, Recipe, ShoppingItem } from '@nosh/shared'
import { shoppingListRoute } from '../../src/routes/shopping-list.js'

vi.mock('../../src/repositories/meal-slots.js', () => ({
  findMealSlotsByWeek: vi.fn(),
}))
vi.mock('../../src/repositories/recipes.js', () => ({
  findRecipes: vi.fn(),
}))

import * as slotsRepo from '../../src/repositories/meal-slots.js'
import * as recipesRepo from '../../src/repositories/recipes.js'

const recipeId = '00000000-0000-0000-0000-000000000001'
const mockSlot: MealSlot = {
  id: 's1',
  day: 0,
  mealType: 'dinner',
  recipeId,
  serves: 2,
  weekStart: '2025-01-06',
}
const mockRecipe: Recipe = {
  id: recipeId,
  name: 'Pasta',
  cuisine: 'italian',
  mealType: ['dinner'],
  dietary: [],
  tags: [],
  serves: 4,
  isCustom: false,
  ingredients: [{ item: 'spaghetti', quantity: 400, unit: 'g' }],
  method: ['Cook'],
}

beforeEach(() => vi.clearAllMocks())

describe('GET /shopping-list', () => {
  it('returns 200 with aggregated shopping items', async () => {
    vi.mocked(slotsRepo.findMealSlotsByWeek).mockResolvedValue([mockSlot])
    vi.mocked(recipesRepo.findRecipes).mockResolvedValue([mockRecipe])
    const res = await shoppingListRoute.request('/?weekStart=2025-01-06')
    expect(res.status).toBe(200)
    const body = await res.json() as ShoppingItem[]
    expect(body[0]).toMatchObject({ item: 'spaghetti', totalQuantity: 200, unit: 'g' })
  })

  it('returns empty array when no slots exist', async () => {
    vi.mocked(slotsRepo.findMealSlotsByWeek).mockResolvedValue([])
    vi.mocked(recipesRepo.findRecipes).mockResolvedValue([])
    const res = await shoppingListRoute.request('/?weekStart=2025-01-06')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('returns 400 when weekStart is missing', async () => {
    const res = await shoppingListRoute.request('/')
    expect(res.status).toBe(400)
  })
})
