import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { CreateRecipeSchema, UpdateRecipeSchema, MealTypeSchema, DietarySchema } from '@nosh/shared'
import {
  findRecipes,
  findRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../repositories/recipes.js'

const querySchema = z.object({
  mealType: MealTypeSchema.optional(),
  dietary: z.union([DietarySchema, z.array(DietarySchema)]).optional().transform((v) =>
    v === undefined ? undefined : Array.isArray(v) ? v : [v],
  ),
  cuisine: z.string().optional(),
  search: z.string().optional(),
})

export const recipesRoute = new Hono()
  .get('/', zValidator('query', querySchema), async (c) => {
    const { mealType, dietary, cuisine, search } = c.req.valid('query')
    const data = await findRecipes({ mealType, dietary, cuisine, search })
    return c.json(data)
  })
  .get('/:id', async (c) => {
    const recipe = await findRecipeById(c.req.param('id'))
    if (!recipe) return c.json({ error: 'Not found' }, 404)
    return c.json(recipe)
  })
  .post('/', zValidator('json', CreateRecipeSchema), async (c) => {
    const data = c.req.valid('json')
    const recipe = await createRecipe(data)
    return c.json(recipe, 201)
  })
  .put('/:id', zValidator('json', UpdateRecipeSchema), async (c) => {
    const recipe = await updateRecipe(c.req.param('id'), c.req.valid('json'))
    if (!recipe) return c.json({ error: 'Not found' }, 404)
    return c.json(recipe)
  })
  .delete('/:id', async (c) => {
    const deleted = await deleteRecipe(c.req.param('id'))
    if (!deleted) return c.json({ error: 'Not found' }, 404)
    return new Response(null, { status: 204 })
  })
