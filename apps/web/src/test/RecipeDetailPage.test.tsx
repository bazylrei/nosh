import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import RecipeDetailPage from '../pages/RecipeDetailPage'
import type { Recipe } from '@nosh/shared'

const mockRecipe: Recipe = {
  id: 'abc',
  name: 'Lentil Dahl',
  cuisine: 'South Asian',
  mealType: ['dinner'],
  dietary: ['vegan'],
  tags: [],
  serves: 4,
  isCustom: false,
  ingredients: [
    { item: 'red lentils', quantity: 400, unit: 'g', prep: 'rinsed' },
    { item: 'salt', quantity: null, unit: null },
  ],
  method: ['Sauté onions.', 'Add lentils and stock.', 'Simmer for 25 minutes.'],
}

function makeFetch(recipe: Recipe = mockRecipe) {
  return vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(recipe) })
  )
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/recipes/${mockRecipe.id}`]}>
        <Routes>
          <Route path="/recipes/:id" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => vi.stubGlobal('fetch', makeFetch()))
afterEach(() => vi.unstubAllGlobals())


describe('RecipeDetailPage', () => {
  it('renders the recipe name', async () => {
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('Lentil Dahl')).toBeInTheDocument())
  })

  it('renders cuisine and dietary badges', async () => {
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('South Asian')).toBeInTheDocument()
      expect(screen.getByText('vegan')).toBeInTheDocument()
    })
  })

  it('renders method steps', async () => {
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByText('Sauté onions.')).toBeInTheDocument()
      expect(screen.getByText('Simmer for 25 minutes.')).toBeInTheDocument()
    })
  })

  it('renders ingredients at default serves', async () => {
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => expect(screen.getByText(/red lentils/i)).toBeInTheDocument())
    expect(screen.getByText(/400/)).toBeInTheDocument()
  })

  it('scales ingredients when serves changes', async () => {
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => expect(screen.getByText(/red lentils/i)).toBeInTheDocument())

    const increment = screen.getByRole('button', { name: /increase/i })
    await userEvent.click(increment)

    expect(screen.getByText(/500/)).toBeInTheDocument()
  })

  it('does not go below 1 serve', async () => {
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => expect(screen.getByText(/red lentils/i)).toBeInTheDocument())

    const decrement = screen.getByRole('button', { name: /decrease/i })
    // click many times — should clamp at 1
    for (let i = 0; i < 10; i++) await userEvent.click(decrement)

    expect(screen.getByLabelText('1 serves')).toBeInTheDocument()
  })

  it('renders ingredient with null quantity without crashing', async () => {
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('salt')).toBeInTheDocument())
  })

  it('shows cost per person badge when recipe includes costPerPerson', async () => {
    const recipeWithCost = { ...mockRecipe, costPerPerson: 1.25 }
    vi.stubGlobal('fetch', makeFetch(recipeWithCost))
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => expect(screen.getByText(/~£1\.25\/person/i)).toBeInTheDocument())
  })

  it('hides cost badge when costPerPerson is null', async () => {
    const recipeNoCost = { ...mockRecipe, costPerPerson: null }
    vi.stubGlobal('fetch', makeFetch(recipeNoCost))
    render(<RecipeDetailPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('Lentil Dahl')).toBeInTheDocument())
    expect(screen.queryByText(/\/person/i)).not.toBeInTheDocument()
  })
})
