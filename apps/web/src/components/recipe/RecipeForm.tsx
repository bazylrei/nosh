import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import IngredientFields from './IngredientFields'
import MethodFields from './MethodFields'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { CreateRecipeSchema } from '@nosh/shared'
import type { CreateRecipe, MealType, Dietary, Ingredient } from '@nosh/shared'

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'dessert']
const DIETARY_OPTIONS: Dietary[] = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free']
const EMPTY_INGREDIENT: Ingredient = { item: '', quantity: null, unit: null }

interface Props {
  defaultValues?: Partial<CreateRecipe>
  onSubmit: (data: CreateRecipe) => Promise<void>
  onDelete?: () => void
}

export default function RecipeForm({ defaultValues, onSubmit, onDelete }: Props) {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [cuisine, setCuisine] = useState(defaultValues?.cuisine ?? '')
  const [mealType, setMealType] = useState<MealType[]>(defaultValues?.mealType ?? [])
  const [dietary, setDietary] = useState<Dietary[]>(defaultValues?.dietary ?? [])
  const [serves, setServes] = useState(defaultValues?.serves ?? 2)
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    defaultValues?.ingredients?.length ? defaultValues.ingredients : [EMPTY_INGREDIENT],
  )
  const [method, setMethod] = useState<string[]>(
    defaultValues?.method?.length ? defaultValues.method : [''],
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  function toggleMealType(t: MealType) {
    setMealType((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  function toggleDietary(d: Dietary) {
    setDietary((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const clientErrors: Record<string, string> = {}
    if (!name.trim()) clientErrors.name = 'Name is required'
    if (mealType.length === 0) clientErrors.mealType = 'Select at least one meal type'
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    const raw = {
      name,
      cuisine,
      mealType,
      dietary,
      tags: [],
      serves,
      ingredients: ingredients.filter((i) => i.item.trim()),
      method: method.filter((s) => s.trim()),
    }
    const result = CreateRecipeSchema.safeParse(raw)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString() ?? 'form'
        if (!fieldErrors[key]) fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      await onSubmit(result.data)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Recipe name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jollof Rice"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cuisine">Cuisine</Label>
            <Input
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g. West African"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="serves">Serves</Label>
          <Input
            id="serves"
            type="number"
            min={1}
            max={50}
            value={serves}
            onChange={(e) => setServes(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Meal type</Label>
          <div className="flex flex-wrap gap-2">
            {MEAL_TYPES.map((t) => (
              <Button
                key={t}
                type="button"
                size="sm"
                variant={mealType.includes(t) ? 'default' : 'outline'}
                onClick={() => toggleMealType(t)}
              >
                {t}
              </Button>
            ))}
          </div>
          {errors.mealType && <p className="text-xs text-destructive">{errors.mealType}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Dietary</Label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((d) => (
              <Button
                key={d}
                type="button"
                size="sm"
                variant={dietary.includes(d) ? 'default' : 'outline'}
                onClick={() => toggleDietary(d)}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Ingredients</Label>
          <IngredientFields ingredients={ingredients} onChange={setIngredients} />
        </div>

        <div className="space-y-1.5">
          <Label>Method</Label>
          <MethodFields steps={method} onChange={setMethod} />
        </div>

        <div className={cn('flex gap-3', onDelete ? 'justify-between' : 'justify-end')}>
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete recipe
            </Button>
          )}
          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save recipe'}
            </Button>
          </div>
        </div>
      </form>

      {onDelete && (
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onConfirm={() => { setShowDeleteDialog(false); onDelete() }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  )
}
