import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import PreferencesPage from '../pages/PreferencesPage'
import type { UserPreferences } from '@nosh/shared'

function makeFetch(prefs: UserPreferences) {
  return vi.fn((url: string, init?: RequestInit) => {
    if (init?.method === 'PUT') {
      const body = JSON.parse(init.body as string) as UserPreferences
      return Promise.resolve({ ok: true, json: () => Promise.resolve(body) })
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve(prefs) })
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

beforeEach(() => vi.stubGlobal('fetch', makeFetch({ dietary: [] })))
afterEach(() => vi.unstubAllGlobals())

describe('PreferencesPage', () => {
  it('renders checkboxes for all dietary options', async () => {
    render(<PreferencesPage />, { wrapper })
    await waitFor(() => expect(screen.getByLabelText(/vegetarian/i)).toBeInTheDocument())
    expect(screen.getByLabelText(/vegan/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/gluten-free/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/dairy-free/i)).toBeInTheDocument()
  })

  it('pre-checks saved dietary preferences', async () => {
    vi.stubGlobal('fetch', makeFetch({ dietary: ['vegan', 'gluten-free'] }))
    render(<PreferencesPage />, { wrapper })
    await waitFor(() => {
      expect(screen.getByLabelText(/vegan/i)).toBeChecked()
      expect(screen.getByLabelText(/gluten-free/i)).toBeChecked()
      expect(screen.getByLabelText(/vegetarian/i)).not.toBeChecked()
    })
  })

  it('toggles a checkbox on click', async () => {
    render(<PreferencesPage />, { wrapper })
    await waitFor(() => expect(screen.getByLabelText(/vegetarian/i)).toBeInTheDocument())
    const checkbox = screen.getByLabelText(/vegetarian/i)
    expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('calls PUT /api/preferences with selected dietary on save', async () => {
    const fetchMock = makeFetch({ dietary: [] })
    vi.stubGlobal('fetch', fetchMock)
    render(<PreferencesPage />, { wrapper })
    await waitFor(() => expect(screen.getByLabelText(/vegan/i)).toBeInTheDocument())

    await userEvent.click(screen.getByLabelText(/vegan/i))
    await userEvent.click(screen.getByRole('button', { name: /save preferences/i }))

    await waitFor(() => {
      const putCall = fetchMock.mock.calls.find(
        ([, init]) => (init as RequestInit)?.method === 'PUT'
      )
      expect(putCall).toBeDefined()
      const body = JSON.parse((putCall![1] as RequestInit).body as string)
      expect(body).toEqual({ dietary: ['vegan'] })
    })
  })

  it('renders a link back to recipes', async () => {
    render(<PreferencesPage />, { wrapper })
    expect(screen.getByRole('link', { name: /back to recipes/i })).toBeInTheDocument()
  })
})
