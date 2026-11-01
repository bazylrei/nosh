import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { UserPreferencesSchema } from '@nosh/shared'
import { getPreferences, updatePreferences } from '../repositories/preferences.js'

export const preferencesRoute = new Hono()
  .get('/', async (c) => {
    return c.json(await getPreferences())
  })
  .put('/', zValidator('json', UserPreferencesSchema), async (c) => {
    return c.json(await updatePreferences(c.req.valid('json')))
  })
