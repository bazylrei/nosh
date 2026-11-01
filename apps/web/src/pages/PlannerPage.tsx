import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import MealGrid from '@/components/planner/MealGrid'
import RecipePickerDialog from '@/components/planner/RecipePickerDialog'
import { useMealSlots, useUpsertMealSlot, useDeleteMealSlot } from '@/hooks/useMealPlan'
import { fetchRecipes } from '@/lib/recipes'
import { getWeekStart, shiftWeek, formatWeekLabel } from '@/lib/week'
import type { MealType, Recipe } from '@nosh/shared'

interface ActiveSlot { day: number; mealType: MealType }

export default function PlannerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const incomingRecipeId = searchParams.get('recipeId') ?? undefined

  const [weekStart, setWeekStart] = useState(getWeekStart)
  const [activeSlot, setActiveSlot] = useState<ActiveSlot | null>(null)

  const { data: slots = [] } = useMealSlots(weekStart)
  const { mutate: upsert } = useUpsertMealSlot(weekStart)
  const { mutate: remove } = useDeleteMealSlot(weekStart)

  const { data: allRecipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => fetchRecipes(),
  })

  const recipeMap = new Map(allRecipes.map((r) => [r.id, r]))
  const incomingRecipe = incomingRecipeId ? recipeMap.get(incomingRecipeId) : undefined

  function handleAdd(day: number, mealType: MealType) {
    if (incomingRecipeId) {
      const recipe = recipeMap.get(incomingRecipeId)
      upsert({ day, mealType, recipeId: incomingRecipeId, serves: recipe?.serves ?? 2, weekStart })
      setSearchParams({})
    } else {
      setActiveSlot({ day, mealType })
    }
  }

  function handlePickRecipe(recipe: Recipe) {
    if (!activeSlot) return
    upsert({ ...activeSlot, recipeId: recipe.id, serves: recipe.serves, weekStart })
  }

  function handleServesChange(slotId: string, serves: number) {
    const slot = slots.find((s) => s.id === slotId)
    if (!slot) return
    upsert({ id: slotId, day: slot.day, mealType: slot.mealType as MealType, recipeId: slot.recipeId, serves, weekStart })
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/" aria-label="Back to recipes">
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-3xl font-heading text-nosh-green">Meal Planner</h1>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/shopping-list" aria-label="Shopping list">
            <ShoppingCart />
          </Link>
        </Button>
      </div>

      {incomingRecipe && (
        <div className="rounded-md bg-nosh-green/10 border border-nosh-green/30 px-4 py-3 text-sm">
          Adding <strong>{incomingRecipe.name}</strong> — tap an empty slot to place it.
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWeekStart((w) => shiftWeek(w, -1))}
          aria-label="Previous week"
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm font-medium min-w-[12rem] text-center">
          {formatWeekLabel(weekStart)}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWeekStart((w) => shiftWeek(w, 1))}
          aria-label="Next week"
        >
          <ChevronRight />
        </Button>
      </div>

      <MealGrid
        slots={slots}
        recipeMap={recipeMap}
        onAdd={handleAdd}
        onRemove={remove}
        onServesChange={handleServesChange}
      />

      {activeSlot && (
        <RecipePickerDialog
          open={true}
          onOpenChange={(open) => !open && setActiveSlot(null)}
          mealType={activeSlot.mealType}
          onSelect={handlePickRecipe}
        />
      )}
    </div>
  )
}
