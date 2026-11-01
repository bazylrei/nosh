import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UserPreferences } from '@nosh/shared'
import { preferencesRoute } from '../../src/routes/preferences.js'

vi.mock('../../src/repositories/preferences.js', () => ({
  getPreferences: vi.fn(),
  updatePreferences: vi.fn(),
}))

import * as repo from '../../src/repositories/preferences.js'

beforeEach(() => vi.clearAllMocks())

describe('GET /preferences', () => {
  it('returns 200 with preferences including cuisine', async () => {
    vi.mocked(repo.getPreferences).mockResolvedValue({ dietary: ['vegetarian'], cuisine: ['Italian'] })
    const res = await preferencesRoute.request('/')
    expect(res.status).toBe(200)
    const body = await res.json() as UserPreferences
    expect(body.dietary).toEqual(['vegetarian'])
    expect(body.cuisine).toEqual(['Italian'])
  })
})

describe('PUT /preferences', () => {
  it('returns 200 with updated preferences including cuisine', async () => {
    vi.mocked(repo.updatePreferences).mockResolvedValue({ dietary: ['vegan'], cuisine: ['Japanese', 'Thai'] })
    const res = await preferencesRoute.request('/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dietary: ['vegan'], cuisine: ['Japanese', 'Thai'] }),
    })
    expect(res.status).toBe(200)
    const body = await res.json() as UserPreferences
    expect(body.dietary).toEqual(['vegan'])
    expect(body.cuisine).toEqual(['Japanese', 'Thai'])
  })

  it('returns 400 for invalid dietary value', async () => {
    const res = await preferencesRoute.request('/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dietary: ['not-a-real-diet'] }),
    })
    expect(res.status).toBe(400)
  })
})
