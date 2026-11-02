import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BottomNav />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('renders all four tabs', () => {
    renderAt('/')
    expect(screen.getByText('Recipes')).toBeInTheDocument()
    expect(screen.getByText('Planner')).toBeInTheDocument()
    expect(screen.getByText('Shopping')).toBeInTheDocument()
    expect(screen.getByText('Prefs')).toBeInTheDocument()
  })

  it('marks the Recipes tab active on /', () => {
    renderAt('/')
    expect(screen.getByText('Recipes').closest('a')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Planner').closest('a')).not.toHaveAttribute('aria-current')
  })

  it('marks the Planner tab active on /planner', () => {
    renderAt('/planner')
    expect(screen.getByText('Planner').closest('a')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText('Recipes').closest('a')).not.toHaveAttribute('aria-current')
  })

  it('marks the Shopping tab active on /shopping-list', () => {
    renderAt('/shopping-list')
    expect(screen.getByText('Shopping').closest('a')).toHaveAttribute('aria-current', 'page')
  })

  it('marks the Prefs tab active on /preferences', () => {
    renderAt('/preferences')
    expect(screen.getByText('Prefs').closest('a')).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark Recipes active when on /planner', () => {
    renderAt('/planner')
    expect(screen.getByText('Recipes').closest('a')).not.toHaveAttribute('aria-current')
  })
})
