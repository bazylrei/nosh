import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { buildShoppingList } from '../lib/shopping-list.js'
import { findMealSlotsByWeek } from '../repositories/meal-slots.js'
import { findRecipes } from '../repositories/recipes.js'
import { findChecksForWeek, upsertCheck, deleteChecksForWeek } from '../repositories/shopping-list-checks.js'

const weekStartSchema = z.object({ weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD') })

const checkBodySchema = z.object({
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  item: z.string().min(1),
  unit: z.string().nullable(),
  checked: z.boolean(),
})

export const shoppingListRoute = new Hono()
  .get('/', zValidator('query', weekStartSchema), async (c) => {
    const { weekStart } = c.req.valid('query')
    const slots = await findMealSlotsByWeek(weekStart)
    if (slots.length === 0) return c.json([])

    const recipeIds = [...new Set(slots.map((s) => s.recipeId))]
    const allRecipes = await findRecipes({})
    const recipesById = new Map(allRecipes.filter((r) => recipeIds.includes(r.id)).map((r) => [r.id, r]))

    const items = buildShoppingList(slots, recipesById)
    const checks = await findChecksForWeek(weekStart)
    const checkedKeys = new Set(checks.filter((c) => c.checked).map((c) => `${c.item}::${c.unit}`))

    return c.json(items.map((item) => ({
      ...item,
      checked: checkedKeys.has(`${item.item}::${item.unit ?? ''}`),
    })))
  })
  .patch('/checked', zValidator('json', checkBodySchema), async (c) => {
    const { weekStart, item, unit, checked } = c.req.valid('json')
    await upsertCheck(weekStart, item, unit ?? '', checked)
    return c.json({ ok: true })
  })
  .delete('/checked', zValidator('query', weekStartSchema), async (c) => {
    const { weekStart } = c.req.valid('query')
    await deleteChecksForWeek(weekStart)
    return c.json({ ok: true })
  })
