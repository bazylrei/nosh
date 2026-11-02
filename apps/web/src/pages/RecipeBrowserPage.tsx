import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Settings, CalendarDays, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchInput from '@/components/ui/SearchInput'
import RecipeFilters from '@/components/recipe/RecipeFilters'
import RecipeGrid from '@/components/recipe/RecipeGrid'
import { fetchRecipes } from '@/lib/recipes'
import { useDebounce } from '@/hooks/useDebounce'
import { usePreferences } from '@/hooks/usePreferences'
import type { MealType, Dietary } from '@nosh/shared'

export default function RecipeBrowserPage() {
  const [search, setSearch] = useState('')
  const [mealType, setMealType] = useState<MealType | undefined>()
  const [dietary, setDietary] = useState<Dietary[]>([])
  const [cuisine, setCuisine] = useState<string[]>([])

  const debouncedSearch = useDebounce(search, 300)
  const { data: preferences } = usePreferences()
  const initialised = useRef(false)

  useEffect(() => {
    if (!initialised.current && preferences) {
      setDietary(preferences.dietary)
      setCuisine(preferences.cuisine)
      initialised.current = true
    }
  }, [preferences])

  const savedDietary = preferences?.dietary ?? []
  const savedCuisine = preferences?.cuisine ?? []

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', debouncedSearch, mealType, dietary, cuisine],
    queryFn: () =>
      fetchRecipes({
        search: debouncedSearch || undefined,
        mealType,
        dietary: dietary.length ? dietary : undefined,
        cuisine: cuisine.length ? cuisine : undefined,
      }),
  })

  const cuisineOptions = [...new Set(recipes.map((r) => r.cuisine).concat(savedCuisine))].sort()

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-heading text-nosh-green">Recipes</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
            <Link to="/planner" aria-label="Meal planner">
              <CalendarDays />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
            <Link to="/shopping-list" aria-label="Shopping list">
              <ShoppingCart />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" asChild>
            <Link to="/preferences" aria-label="Preferences">
              <Settings />
            </Link>
          </Button>
          <Button asChild>
            <Link to="/recipes/new">+ Add recipe</Link>
          </Button>
        </div>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search recipes..."
      />

      <RecipeFilters
        mealType={mealType}
        onMealTypeChange={setMealType}
        dietary={dietary}
        onDietaryChange={setDietary}
        savedDietary={savedDietary}
        cuisine={cuisine}
        onCuisineChange={setCuisine}
        savedCuisine={savedCuisine}
        cuisineOptions={cuisineOptions}
      />

      <RecipeGrid recipes={recipes} isLoading={isLoading} />
    </div>
  )
}
