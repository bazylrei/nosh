import { scaleQuantity } from '@/lib/scaling'
import type { Ingredient } from '@nosh/shared'

interface Props {
  ingredients: Ingredient[]
  recipeServes: number
  selectedServes: number
}

export default function IngredientList({ ingredients, recipeServes, selectedServes }: Props) {
  return (
    <ul className="space-y-2">
      {ingredients.map((ing, i) => {
        const qty = scaleQuantity(ing.quantity, recipeServes, selectedServes)
        return (
          <li key={i} className="flex items-baseline gap-2 text-sm">
            <span className="w-20 shrink-0 text-right text-muted-foreground tabular-nums">
              {qty !== null ? qty : '—'}{ing.unit ? ` ${ing.unit}` : ''}
            </span>
            <span>{ing.item}{ing.prep ? `, ${ing.prep}` : ''}</span>
          </li>
        )
      })}
    </ul>
  )
}
