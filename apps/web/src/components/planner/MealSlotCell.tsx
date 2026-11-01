import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ServingStepper from '@/components/recipe/ServingStepper'
import type { MealSlot, Recipe } from '@nosh/shared'

interface Props {
  slot: MealSlot | undefined
  recipe: Recipe | undefined
  onAdd: () => void
  onRemove: () => void
  onServesChange: (serves: number) => void
}

export default function MealSlotCell({ slot, recipe, onAdd, onRemove, onServesChange }: Props) {
  if (!slot || !recipe) {
    return (
      <button
        onClick={onAdd}
        aria-label="Add recipe"
        className="h-full w-full min-h-[5rem] rounded-md border-2 border-dashed border-border hover:border-nosh-green hover:bg-accent/50 flex items-center justify-center text-xl text-muted-foreground hover:text-nosh-green transition-colors"
      >
        +
      </button>
    )
  }

  return (
    <div className="rounded-md border bg-card p-2 space-y-2 text-sm min-h-[5rem]">
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <Link to={`/recipes/${recipe.id}`} className="font-medium truncate hover:underline block">{recipe.name}</Link>
          <p className="text-xs text-muted-foreground truncate">{recipe.cuisine}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          aria-label={`Remove ${recipe.name}`}
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      <ServingStepper value={slot.serves} onChange={onServesChange} />
    </div>
  )
}
