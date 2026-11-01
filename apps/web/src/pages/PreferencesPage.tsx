import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePreferences, useSavePreferences } from '@/hooks/usePreferences'
import { useCuisines } from '@/hooks/useCuisines'
import type { Dietary } from '@nosh/shared'

const DIETARY_OPTIONS: { value: Dietary; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-free' },
  { value: 'dairy-free', label: 'Dairy-free' },
]

export default function PreferencesPage() {
  const { data: preferences, isLoading: prefsLoading } = usePreferences()
  const { data: cuisineOptions = [], isLoading: cuisinesLoading } = useCuisines()
  const { mutate: save, isPending, isSuccess } = useSavePreferences()

  const [dietary, setDietary] = useState<Dietary[]>([])
  const [cuisine, setCuisine] = useState<string[]>([])

  useEffect(() => {
    if (preferences) {
      setDietary(preferences.dietary)
      setCuisine(preferences.cuisine)
    }
  }, [preferences])

  function toggleDietary(value: Dietary) {
    setDietary((prev) => prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value])
  }

  function toggleCuisine(value: string) {
    setCuisine((prev) => prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value])
  }

  const isLoading = prefsLoading || cuisinesLoading

  return (
    <div className="min-h-screen bg-background p-6 space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/" aria-label="Back to recipes">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-heading text-nosh-green">Preferences</h1>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Dietary
        </h2>
        {prefsLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="space-y-3">
            {DIETARY_OPTIONS.map(({ value, label }) => (
              <li key={value}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dietary.includes(value)}
                    onChange={() => toggleDietary(value)}
                    className="h-4 w-4 rounded border-input accent-nosh-green"
                  />
                  <span className="text-sm text-foreground">{label}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Cuisine
        </h2>
        {cuisinesLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : cuisineOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cuisines found — add some recipes first.</p>
        ) : (
          <ul className="space-y-3">
            {cuisineOptions.map((value) => (
              <li key={value}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cuisine.includes(value)}
                    onChange={() => toggleCuisine(value)}
                    className="h-4 w-4 rounded border-input accent-nosh-green"
                  />
                  <span className="text-sm text-foreground">{value}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Button
        onClick={() => save({ dietary, cuisine })}
        disabled={isPending || isLoading}
      >
        {isPending ? 'Saving…' : isSuccess ? 'Saved' : 'Save preferences'}
      </Button>
    </div>
  )
}
