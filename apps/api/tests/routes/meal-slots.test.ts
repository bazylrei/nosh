import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { MealSlot } from '@nosh/shared'
import { mealSlotsRoute } from '../../src/routes/meal-slots.js'

vi.mock('../../src/repositories/meal-slots.js', () => ({
  findMealSlotsByWeek: vi.fn(),
  upsertMealSlot: vi.fn(),
  deleteMealSlot: vi.fn(),
}))

import * as repo from '../../src/repositories/meal-slots.js'

const mockSlot: MealSlot = {
  id: '00000000-0000-0000-0000-000000000001',
  day: 0,
  mealType: 'dinner',
  recipeId: '00000000-0000-0000-0000-000000000002',
  serves: 4,
  weekStart: '2025-01-06',
}

beforeEach(() => vi.clearAllMocks())

describe('GET /meal-slots', () => {
  it('returns 200 with slots for given weekStart', async () => {
    vi.mocked(repo.findMealSlotsByWeek).mockResolvedValue([mockSlot])
    const res = await mealSlotsRoute.request('/?weekStart=2025-01-06')
    expect(res.status).toBe(200)
    const body = await res.json() as MealSlot[]
    expect(body).toHaveLength(1)
    expect(body[0].weekStart).toBe('2025-01-06')
  })

  it('returns 400 when weekStart is missing', async () => {
    const res = await mealSlotsRoute.request('/')
    expect(res.status).toBe(400)
  })
})

describe('PUT /meal-slots', () => {
  it('returns 200 with upserted slot', async () => {
    vi.mocked(repo.upsertMealSlot).mockResolvedValue(mockSlot)
    const res = await mealSlotsRoute.request('/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day: 0,
        mealType: 'dinner',
        recipeId: '00000000-0000-0000-0000-000000000002',
        serves: 4,
        weekStart: '2025-01-06',
      }),
    })
    expect(res.status).toBe(200)
  })

  it('returns 400 for invalid body', async () => {
    const res = await mealSlotsRoute.request('/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day: 99 }),
    })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /meal-slots/:id', () => {
  it('returns 204 on success', async () => {
    vi.mocked(repo.deleteMealSlot).mockResolvedValue(true)
    const res = await mealSlotsRoute.request(`/${mockSlot.id}`, { method: 'DELETE' })
    expect(res.status).toBe(204)
  })

  it('returns 404 when slot not found', async () => {
    vi.mocked(repo.deleteMealSlot).mockResolvedValue(false)
    const res = await mealSlotsRoute.request(`/${mockSlot.id}`, { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})
