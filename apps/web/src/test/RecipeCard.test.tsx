import { render, screen } from '@testing-library/react'
import RecipeCard from '../components/recipe/RecipeCard'
import type { Recipe } from '@nosh/shared'

const base: Recipe = {
  id: '1',
  name: 'Jollof Rice',
  cuisine: 'West African',
  mealType: ['dinner'],
  dietary: ['vegan', 'gluten-free'],
  tags: [],
  serves: 4,
  isCustom: false,
  ingredients: [],
  method: [],
}

describe('RecipeCard', () => {
  it('renders name and cuisine', () => {
    render(<RecipeCard recipe={base} />)
    expect(screen.getByText('Jollof Rice')).toBeInTheDocument()
    expect(screen.getByText(/West African/)).toBeInTheDocument()
  })

  it('renders serves count', () => {
    render(<RecipeCard recipe={base} />)
    expect(screen.getByText(/serves 4/i)).toBeInTheDocument()
  })

  it('renders meal type badge', () => {
    render(<RecipeCard recipe={base} />)
    expect(screen.getByText('dinner')).toBeInTheDocument()
  })

  it('renders dietary badges', () => {
    render(<RecipeCard recipe={base} />)
    expect(screen.getByText('vegan')).toBeInTheDocument()
    expect(screen.getByText('gluten-free')).toBeInTheDocument()
  })

  it('shows Custom badge when isCustom is true', () => {
    render(<RecipeCard recipe={{ ...base, isCustom: true }} />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('does not show Custom badge for standard recipes', () => {
    render(<RecipeCard recipe={base} />)
    expect(screen.queryByText('Custom')).not.toBeInTheDocument()
  })
})
