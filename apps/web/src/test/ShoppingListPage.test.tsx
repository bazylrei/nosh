import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ShoppingListPage from '../pages/ShoppingListPage'
import type { ShoppingItem } from '@nosh/shared'

const mockItems: ShoppingItem[] = [
  { item: 'chicken breast', totalQuantity: 600, unit: 'g', checked: false },
  { item: 'onion', totalQuantity: 2, unit: null, checked: false },
  { item: 'salt and pepper', totalQuantity: null, unit: null, checked: false },
]

function makeFetch(items: ShoppingItem[] = mockItems) {
  return vi.fn((url: string, init?: RequestInit) => {
    if (init?.method === 'PATCH' || init?.method === 'DELETE') {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true }) })
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(items) })
  })
}

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/shopping-list']}>
        <Routes>
          <Route path="/shopping-list" element={children} />
          <Route path="/planner" element={<div>Planner</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => vi.stubGlobal('fetch', makeFetch()))
afterEach(() => vi.unstubAllGlobals())

describe('ShoppingListPage', () => {
  it('renders the page heading', () => {
    render(<ShoppingListPage />, { wrapper })
    expect(screen.getByText('Shopping List')).toBeInTheDocument()
  })

  it('renders week navigation buttons', () => {
    render(<ShoppingListPage />, { wrapper })
    expect(screen.getByRole('button', { name: /previous week/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next week/i })).toBeInTheDocument()
  })

  it('renders shopping items with quantities', async () => {
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('chicken breast')).toBeInTheDocument())
    expect(screen.getByText('600 g')).toBeInTheDocument()
    expect(screen.getByText('onion')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows — for items with null quantity', async () => {
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('salt and pepper')).toBeInTheDocument())
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders a checkbox for each item', async () => {
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('chicken breast')).toBeInTheDocument())
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('shows empty state when no meals are planned', async () => {
    vi.stubGlobal('fetch', makeFetch([]))
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() =>
      expect(screen.getByText(/no meals planned/i)).toBeInTheDocument()
    )
  })

  it('calls PATCH when a checkbox is toggled', async () => {
    const fetchMock = makeFetch()
    vi.stubGlobal('fetch', fetchMock)
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('chicken breast')).toBeInTheDocument())

    const checkboxes = screen.getAllByRole('checkbox')
    await userEvent.click(checkboxes[0])

    await waitFor(() => {
      const patchCall = fetchMock.mock.calls.find(([, init]) => init?.method === 'PATCH')
      expect(patchCall).toBeDefined()
    })
  })

  it('shows Uncheck all button when items are checked', async () => {
    const checkedItems: ShoppingItem[] = [
      { item: 'chicken breast', totalQuantity: 600, unit: 'g', checked: true },
      { item: 'onion', totalQuantity: 2, unit: null, checked: false },
    ]
    vi.stubGlobal('fetch', makeFetch(checkedItems))
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByRole('button', { name: /uncheck all/i })).toBeInTheDocument())
  })

  it('does not show Uncheck all when nothing is checked', async () => {
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('chicken breast')).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: /uncheck all/i })).not.toBeInTheDocument()
  })

  it('calls DELETE when Uncheck all is clicked', async () => {
    const checkedItems: ShoppingItem[] = [
      { item: 'chicken breast', totalQuantity: 600, unit: 'g', checked: true },
    ]
    const fetchMock = makeFetch(checkedItems)
    vi.stubGlobal('fetch', fetchMock)
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByRole('button', { name: /uncheck all/i })).toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: /uncheck all/i }))

    await waitFor(() => {
      const deleteCall = fetchMock.mock.calls.find(([, init]) => init?.method === 'DELETE')
      expect(deleteCall).toBeDefined()
    })
  })

  it('re-fetches when week changes', async () => {
    const fetchMock = makeFetch()
    vi.stubGlobal('fetch', fetchMock)
    render(<ShoppingListPage />, { wrapper })
    await waitFor(() => expect(screen.getByText('chicken breast')).toBeInTheDocument())

    const callsBefore = fetchMock.mock.calls.length
    await userEvent.click(screen.getByRole('button', { name: /next week/i }))
    await waitFor(() => expect(fetchMock.mock.calls.length).toBeGreaterThan(callsBefore))
  })
})
