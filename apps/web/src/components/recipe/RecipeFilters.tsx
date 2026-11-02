import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { MealType, Dietary } from '@nosh/shared'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'dessert']
const DIETARY_OPTIONS: Dietary[] = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free']

interface Props {
  mealType: MealType | undefined
  onMealTypeChange: (t: MealType | undefined) => void
  dietary: Dietary[]
  onDietaryChange: (d: Dietary[]) => void
  savedDietary: Dietary[]
  cuisine: string[]
  onCuisineChange: (c: string[]) => void
  savedCuisine: string[]
  cuisineOptions: string[]
}

export default function RecipeFilters({
  mealType,
  onMealTypeChange,
  dietary,
  onDietaryChange,
  savedDietary,
  cuisine,
  onCuisineChange,
  savedCuisine,
  cuisineOptions,
}: Props) {
  function toggleMealType(t: MealType) {
    onMealTypeChange(mealType === t ? undefined : t)
  }

  function toggleDietary(d: Dietary) {
    onDietaryChange(dietary.includes(d) ? dietary.filter((x) => x !== d) : [...dietary, d])
  }

  function toggleCuisine(c: string) {
    onCuisineChange(cuisine.includes(c) ? cuisine.filter((x) => x !== c) : [...cuisine, c])
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Meal type</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by meal type">
          {MEAL_TYPES.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={mealType === t ? 'default' : 'outline'}
              aria-pressed={mealType === t}
              onClick={() => toggleMealType(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dietary</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by dietary requirement">
          {DIETARY_OPTIONS.map((d) => (
            <Button
              key={d}
              size="sm"
              variant={dietary.includes(d) ? 'default' : 'outline'}
              aria-pressed={dietary.includes(d)}
              onClick={() => toggleDietary(d)}
              className={cn(savedDietary.includes(d) && !dietary.includes(d) && 'ring-1 ring-nosh-green')}
            >
              {d}
              {savedDietary.includes(d) && !dietary.includes(d) && <span className="sr-only">(saved preference)</span>}
            </Button>
          ))}
        </div>
      </div>

      {cuisineOptions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cuisine</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by cuisine">
            {cuisineOptions.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={cuisine.includes(c) ? 'default' : 'outline'}
                aria-pressed={cuisine.includes(c)}
                onClick={() => toggleCuisine(c)}
                className={cn(savedCuisine.includes(c) && !cuisine.includes(c) && 'ring-1 ring-nosh-green')}
              >
                {c}
                {savedCuisine.includes(c) && !cuisine.includes(c) && <span className="sr-only">(saved preference)</span>}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
