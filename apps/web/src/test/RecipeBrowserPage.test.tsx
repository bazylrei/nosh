import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RecipeBrowserPage from '../pages/RecipeBrowserPage'
import type { Recipe, UserPreferences } from '@nosh/shared'

const mockRecipe: Recipe = {
  id: '1',
  name: 'Jollof Rice',
  cuisine: 'West African',
  mealType: ['dinner'],
  dietary: ['vegan'],
  tags: [],
  serves: 4,
  isCustom: false,
  ingredients: [],
  method: [],
}

const emptyPrefs: UserPreferences = { dietary: [], cuisine: [] }

function makeFetch(recipes: Recipe[], prefs = emptyPrefs) {
  return vi.fn((url: string) => {
    const body = url.includes('/api/preferences') ? prefs : recipes
    return Promise.resolve({ ok: true, json: () => Promise.resolve(body) })
  })
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => vi.stubGlobal('fetch', makeFetch([mockRecipe])))
afterEach(() => vi.unstubAllGlobals())

describe('RecipeBrowserPage', () => {
  it('renders recipe cards after loading', async () => {
    render(<RecipeBrowserPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('Jollof Rice')).toBeInTheDocument())
  })

  it('renders a search input', () => {
    render(<RecipeBrowserPage />, { wrapper })
    expect(screen.getByPlaceholderText(/search recipes/i)).toBeInTheDocument()
  })

  it('renders meal type filter buttons', () => {
    render(<RecipeBrowserPage />, { wrapper })
    expect(screen.getByRole('button', { name: /breakfast/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dinner/i })).toBeInTheDocument()
  })

  it('renders dietary filter buttons', () => {
    render(<RecipeBrowserPage />, { wrapper })
    expect(screen.getByRole('button', { name: /vegetarian/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /vegan/i })).toBeInTheDocument()
  })

  it('shows empty state when no recipes returned', async () => {
    vi.stubGlobal('fetch', makeFetch([]))
    render(<RecipeBrowserPage />, { wrapper })
    await waitFor(() =>
      expect(screen.getByText(/no recipes match/i)).toBeInTheDocument()
    )
  })

  it('pre-activates dietary filters from saved preferences', async () => {
    vi.stubGlobal('fetch', makeFetch([mockRecipe], { dietary: ['vegetarian'], cuisine: [] }))
    render(<RecipeBrowserPage />, { wrapper })
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /vegetarian/i })
      expect(btn).toHaveClass('bg-primary')
    })
  })

  it('pre-activates cuisine filters from saved preferences', async () => {
    vi.stubGlobal('fetch', makeFetch([mockRecipe], { dietary: [], cuisine: ['West African'] }))
    render(<RecipeBrowserPage />, { wrapper })
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /west african/i })
      expect(btn).toHaveClass('bg-primary')
    })
  })

  it('allows removing a saved preference filter without it snapping back', async () => {
    vi.stubGlobal('fetch', makeFetch([mockRecipe], { dietary: ['vegetarian'], cuisine: [] }))
    render(<RecipeBrowserPage />, { wrapper })
    const btn = await screen.findByRole('button', { name: /vegetarian/i })
    await waitFor(() => expect(btn).toHaveClass('bg-primary'))
    await userEvent.click(btn)
    expect(btn).not.toHaveClass('bg-primary')
  })
})
