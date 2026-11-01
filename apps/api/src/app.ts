import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { recipesRoute } from './routes/recipes.js'
import { mealSlotsRoute } from './routes/meal-slots.js'
import { preferencesRoute } from './routes/preferences.js'
import { shoppingListRoute } from './routes/shopping-list.js'

const app = new Hono().basePath('/api')

app.use(logger())
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }))
app.use('*', async (c, next) => {
  await next()
  c.res.headers.set('Cache-Control', 'no-store')
})

app.get('/health', (c) => c.json({ ok: true }))
app.route('/recipes', recipesRoute)
app.route('/meal-slots', mealSlotsRoute)
app.route('/preferences', preferencesRoute)
app.route('/shopping-list', shoppingListRoute)

export default app
