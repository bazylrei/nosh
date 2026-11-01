import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RecipeForm from '../components/recipe/RecipeForm'
import type { CreateRecipe } from '@nosh/shared'

const minimalValid: CreateRecipe = {
  name: 'Test Recipe',
  cuisine: 'British',
  mealType: ['dinner'],
  dietary: [],
  tags: [],
  serves: 2,
  ingredients: [{ item: 'flour', quantity: 200, unit: 'g' }],
  method: ['Mix and bake.'],
}

function wrapper({ children }: { children: React.ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('RecipeForm', () => {
  it('renders all required fields', () => {
    render(<RecipeForm onSubmit={vi.fn()} />, { wrapper })
    expect(screen.getByLabelText(/recipe name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cuisine/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/serves/i)).toBeInTheDocument()
  })

  it('renders meal type toggles', () => {
    render(<RecipeForm onSubmit={vi.fn()} />, { wrapper })
    expect(screen.getByRole('button', { name: /breakfast/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /dinner/i })).toBeInTheDocument()
  })

  it('shows validation error when name is empty on submit', async () => {
    render(<RecipeForm onSubmit={vi.fn()} />, { wrapper })
    await userEvent.click(screen.getByRole('button', { name: /save recipe/i }))
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument()
  })

  it('shows validation error when no meal type is selected', async () => {
    render(<RecipeForm onSubmit={vi.fn()} />, { wrapper })
    await userEvent.type(screen.getByLabelText(/recipe name/i), 'My Recipe')
    await userEvent.type(screen.getByLabelText(/cuisine/i), 'British')
    await userEvent.click(screen.getByRole('button', { name: /save recipe/i }))
    expect(await screen.findByText(/select at least one meal type/i)).toBeInTheDocument()
  })

  it('calls onSubmit with valid data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<RecipeForm onSubmit={onSubmit} />, { wrapper })

    await userEvent.type(screen.getByLabelText(/recipe name/i), minimalValid.name)
    await userEvent.type(screen.getByLabelText(/cuisine/i), minimalValid.cuisine)
    await userEvent.click(screen.getByRole('button', { name: /^dinner$/i }))

    const itemInput = screen.getByPlaceholderText(/item/i)
    await userEvent.type(itemInput, 'flour')
    const methodInput = screen.getByPlaceholderText(/step/i)
    await userEvent.type(methodInput, 'Mix and bake.')

    await userEvent.click(screen.getByRole('button', { name: /save recipe/i }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test Recipe', mealType: ['dinner'] }))
  })

  it('pre-populates fields when defaultValues are provided', () => {
    render(<RecipeForm onSubmit={vi.fn()} defaultValues={minimalValid} />, { wrapper })
    expect(screen.getByDisplayValue('Test Recipe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('British')).toBeInTheDocument()
  })

  it('shows delete button only when onDelete is provided', () => {
    const { rerender } = render(<RecipeForm onSubmit={vi.fn()} />, { wrapper })
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()

    rerender(<RecipeForm onSubmit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })
})
