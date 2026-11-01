import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { buildShoppingList } from '../lib/shopping-list.js'
import { findMealSlotsByWeek } from '../repositories/meal-slots.js'
import { findRecipes } from '../repositories/recipes.js'

const weekStartSchema = z.object({ weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD') })

export const shoppingListRoute = new Hono().get(
  '/',
  zValidator('query', weekStartSchema),
  async (c) => {
    const { weekStart } = c.req.valid('query')
    const slots = await findMealSlotsByWeek(weekStart)
    if (slots.length === 0) return c.json([])

    const recipeIds = [...new Set(slots.map((s) => s.recipeId))]
    const allRecipes = await findRecipes({})
    const recipesById = new Map(allRecipes.filter((r) => recipeIds.includes(r.id)).map((r) => [r.id, r]))

    return c.json(buildShoppingList(slots, recipesById))
  },
)
