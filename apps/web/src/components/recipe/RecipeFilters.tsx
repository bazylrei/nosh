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
  cuisine: string
  onCuisineChange: (c: string) => void
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
  cuisineOptions,
}: Props) {
  function toggleMealType(t: MealType) {
    onMealTypeChange(mealType === t ? undefined : t)
  }

  function toggleDietary(d: Dietary) {
    onDietaryChange(dietary.includes(d) ? dietary.filter((x) => x !== d) : [...dietary, d])
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {MEAL_TYPES.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={mealType === t ? 'default' : 'outline'}
            onClick={() => toggleMealType(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {DIETARY_OPTIONS.map((d) => (
          <Button
            key={d}
            size="sm"
            variant={dietary.includes(d) ? 'default' : 'outline'}
            onClick={() => toggleDietary(d)}
            className={cn(savedDietary.includes(d) && !dietary.includes(d) && 'ring-1 ring-nosh-green')}
          >
            {d}
          </Button>
        ))}
      </div>

      {cuisineOptions.length > 0 && (
        <select
          value={cuisine}
          onChange={(e) => onCuisineChange(e.target.value)}
          className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All cuisines</option>
          {cuisineOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}
    </div>
  )
}
