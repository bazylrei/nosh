import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../components/ThemeToggle'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark', 'light')
})

describe('ThemeToggle', () => {
  it('shows sun icon when dark mode is active (default)', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /switch to light/i })).toBeInTheDocument()
  })

  it('switches to light mode and shows moon icon on click', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /switch to light/i }))
    expect(screen.getByRole('button', { name: /switch to dark/i })).toBeInTheDocument()
  })

  it('removes dark class from html element when switching to light', async () => {
    document.documentElement.classList.add('dark')
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /switch to light/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('adds dark class when switching back to dark', async () => {
    localStorage.setItem('nosh-theme', 'light')
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /switch to dark/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('persists preference to localStorage', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: /switch to light/i }))
    expect(localStorage.getItem('nosh-theme')).toBe('light')
  })
})
