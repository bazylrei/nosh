import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { UpsertMealSlotSchema } from '@nosh/shared'
import { findMealSlotsByWeek, upsertMealSlot, deleteMealSlot } from '../repositories/meal-slots.js'

const weekStartSchema = z.object({ weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD') })

export const mealSlotsRoute = new Hono()
  .get('/', zValidator('query', weekStartSchema), async (c) => {
    const { weekStart } = c.req.valid('query')
    return c.json(await findMealSlotsByWeek(weekStart))
  })
  .put('/', zValidator('json', UpsertMealSlotSchema), async (c) => {
    const slot = await upsertMealSlot(c.req.valid('json'))
    return c.json(slot)
  })
  .delete('/:id', async (c) => {
    const deleted = await deleteMealSlot(c.req.param('id'))
    if (!deleted) return c.json({ error: 'Not found' }, 404)
    return new Response(null, { status: 204 })
  })
