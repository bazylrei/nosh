import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Recipe } from '@nosh/shared'
import { recipesRoute } from '../../src/routes/recipes.js'

vi.mock('../../src/repositories/recipes.js', () => ({
  findRecipes: vi.fn(),
  findRecipeById: vi.fn(),
  createRecipe: vi.fn(),
  updateRecipe: vi.fn(),
  deleteRecipe: vi.fn(),
}))

import * as repo from '../../src/repositories/recipes.js'

const mockRecipe: Recipe = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Porridge',
  cuisine: 'british',
  mealType: ['breakfast'],
  dietary: ['vegetarian'],
  tags: ['quick'],
  serves: 2,
  isCustom: false,
  ingredients: [{ item: 'oats', quantity: 100, unit: 'g' }],
  method: ['Cook oats'],
  createdAt: new Date().toISOString(),
}

beforeEach(() => vi.clearAllMocks())

describe('GET /recipes', () => {
  it('returns 200 with recipe array', async () => {
    vi.mocked(repo.findRecipes).mockResolvedValue([mockRecipe])
    const res = await recipesRoute.request('/')
    expect(res.status).toBe(200)
    const body = await res.json() as Recipe[]
    expect(body).toHaveLength(1)
    expect(body[0].name).toBe('Porridge')
  })

  it('passes mealType filter to repository', async () => {
    vi.mocked(repo.findRecipes).mockResolvedValue([])
    await recipesRoute.request('/?mealType=breakfast')
    expect(repo.findRecipes).toHaveBeenCalledWith(expect.objectContaining({ mealType: 'breakfast' }))
  })

  it('passes dietary filter to repository', async () => {
    vi.mocked(repo.findRecipes).mockResolvedValue([])
    await recipesRoute.request('/?dietary=vegetarian&dietary=vegan')
    expect(repo.findRecipes).toHaveBeenCalledWith(
      expect.objectContaining({ dietary: ['vegetarian', 'vegan'] }),
    )
  })
})

describe('GET /recipes/:id', () => {
  it('returns 200 with recipe when found', async () => {
    vi.mocked(repo.findRecipeById).mockResolvedValue(mockRecipe)
    const res = await recipesRoute.request(`/${mockRecipe.id}`)
    expect(res.status).toBe(200)
    const body = await res.json() as Recipe
    expect(body.id).toBe(mockRecipe.id)
  })

  it('returns 404 when recipe not found', async () => {
    vi.mocked(repo.findRecipeById).mockResolvedValue(undefined)
    const res = await recipesRoute.request('/00000000-0000-0000-0000-000000000099')
    expect(res.status).toBe(404)
  })
})

describe('POST /recipes', () => {
  it('returns 201 with created recipe', async () => {
    vi.mocked(repo.createRecipe).mockResolvedValue({ ...mockRecipe, isCustom: true })
    const res = await recipesRoute.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Porridge',
        cuisine: 'british',
        mealType: ['breakfast'],
        dietary: ['vegetarian'],
        tags: [],
        serves: 2,
        ingredients: [{ item: 'oats', quantity: 100, unit: 'g' }],
        method: ['Cook oats'],
      }),
    })
    expect(res.status).toBe(201)
  })

  it('returns 400 for invalid body', async () => {
    const res = await recipesRoute.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })
    expect(res.status).toBe(400)
  })
})

describe('PUT /recipes/:id', () => {
  it('returns 200 with updated recipe', async () => {
    vi.mocked(repo.updateRecipe).mockResolvedValue({ ...mockRecipe, name: 'Updated' })
    const res = await recipesRoute.request(`/${mockRecipe.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' }),
    })
    expect(res.status).toBe(200)
  })

  it('returns 404 when recipe not found', async () => {
    vi.mocked(repo.updateRecipe).mockResolvedValue(undefined)
    const res = await recipesRoute.request(`/${mockRecipe.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Updated' }),
    })
    expect(res.status).toBe(404)
  })
})

describe('DELETE /recipes/:id', () => {
  it('returns 204 on success', async () => {
    vi.mocked(repo.deleteRecipe).mockResolvedValue(true)
    const res = await recipesRoute.request(`/${mockRecipe.id}`, { method: 'DELETE' })
    expect(res.status).toBe(204)
  })

  it('returns 404 when recipe not found', async () => {
    vi.mocked(repo.deleteRecipe).mockResolvedValue(false)
    const res = await recipesRoute.request(`/${mockRecipe.id}`, { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})
