import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import PlannerPage from '../pages/PlannerPage'
import type { Recipe, MealSlot } from '@nosh/shared'

const mockRecipe: Recipe = {
  id: 'r1',
  name: 'Avocado Toast',
  cuisine: 'Modern',
  mealType: ['breakfast'],
  dietary: ['vegan'],
  tags: [],
  serves: 2,
  isCustom: false,
  ingredients: [],
  method: [],
}

const mockSlot: MealSlot = {
  id: 's1',
  day: 0,
  mealType: 'breakfast',
  recipeId: 'r1',
  serves: 2,
  weekStart: '2026-01-05',
}

function makeFetch(slots: MealSlot[] = [], recipes: Recipe[] = [mockRecipe]) {
  return vi.fn((url: string, init?: RequestInit) => {
    if (init?.method === 'DELETE') return Promise.resolve({ ok: true, status: 204, json: () => Promise.reject(new SyntaxError('no body')) })
    if (init?.method === 'PUT') return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(slots[0] ?? mockSlot) })
    if ((url as string).includes('/api/meal-slots')) return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(slots) })
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(recipes) })
  })
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/planner']}>
        <Routes>
          <Route path="/planner" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => vi.stubGlobal('fetch', makeFetch()))
afterEach(() => vi.unstubAllGlobals())

describe('PlannerPage', () => {
  it('renders meal type column headers', () => {
    render(<PlannerPage />, { wrapper })
    // Both mobile and desktop layouts render; getAllByText handles either/both being visible
    expect(screen.getAllByText('breakfast')[0]).toBeInTheDocument()
    expect(screen.getAllByText('lunch')[0]).toBeInTheDocument()
    expect(screen.getAllByText('dinner')[0]).toBeInTheDocument()
  })

  it('renders day row labels', () => {
    render(<PlannerPage />, { wrapper })
    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByText('Sun')).toBeInTheDocument()
  })

  it('renders add buttons for empty slots', () => {
    render(<PlannerPage />, { wrapper })
    const addBtns = screen.getAllByRole('button', { name: /add recipe/i })
    // Mobile and desktop grids both render in jsdom (CSS not applied) — 21 slots × 2 layouts
    expect(addBtns.length).toBe(42)
  })

  it('shows recipe name in a filled slot', async () => {
    vi.stubGlobal('fetch', makeFetch([mockSlot]))
    render(<PlannerPage />, { wrapper })
    await waitFor(() => expect(screen.getAllByText('Avocado Toast').length).toBeGreaterThan(0))
  })

  it('opens recipe picker when clicking an empty slot', async () => {
    render(<PlannerPage />, { wrapper })
    const addBtns = await screen.findAllByRole('button', { name: /add recipe/i })
    await userEvent.click(addBtns[0])
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
  })

  it('renders prev/next week navigation buttons', () => {
    render(<PlannerPage />, { wrapper })
    expect(screen.getByRole('button', { name: /previous week/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next week/i })).toBeInTheDocument()
  })

  it('removes slot from planner after clicking delete', async () => {
    let deleted = false
    vi.stubGlobal('fetch', vi.fn((url: string, init?: RequestInit) => {
      if (init?.method === 'DELETE') {
        deleted = true
        return Promise.resolve({ ok: true, status: 204, json: () => Promise.reject(new SyntaxError('no body')) })
      }
      if (init?.method === 'PUT') return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(mockSlot) })
      if ((url as string).includes('/api/meal-slots')) return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(deleted ? [] : [mockSlot]) })
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([mockRecipe]) })
    }))
    render(<PlannerPage />, { wrapper })
    await waitFor(() => expect(screen.getAllByText('Avocado Toast').length).toBeGreaterThan(0))

    const removeBtn = screen.getAllByRole('button', { name: /remove avocado toast/i })[0]
    await userEvent.click(removeBtn)

    await waitFor(() => expect(screen.queryAllByText('Avocado Toast')).toHaveLength(0))
  })

  it('renders recipe name as a link to the recipe detail page', async () => {
    vi.stubGlobal('fetch', makeFetch([mockSlot]))
    render(<PlannerPage />, { wrapper })
    const links = await screen.findAllByRole('link', { name: 'Avocado Toast' })
    expect(links[0]).toHaveAttribute('href', '/recipes/r1')
  })

  it('shows incoming recipe banner when recipeId is in URL', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/planner?recipeId=r1']}>
          <Routes>
            <Route path="/planner" element={<PlannerPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
    await waitFor(() =>
      expect(screen.getAllByText(/avocado toast/i).length).toBeGreaterThan(0)
    )
  })
})
