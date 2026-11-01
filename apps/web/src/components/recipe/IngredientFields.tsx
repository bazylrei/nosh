import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Ingredient } from '@nosh/shared'

interface Props {
  ingredients: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

const empty = (): Ingredient => ({ item: '', quantity: null, unit: null })

export default function IngredientFields({ ingredients, onChange }: Props) {
  function update(index: number, patch: Partial<Ingredient>) {
    onChange(ingredients.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)))
  }

  function remove(index: number) {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {ingredients.map((ing, i) => (
        <div key={i} className="flex gap-2 items-center">
          <Input
            placeholder="Item"
            value={ing.item}
            onChange={(e) => update(i, { item: e.target.value })}
            className="flex-[2]"
          />
          <Input
            placeholder="Qty"
            type="number"
            value={ing.quantity ?? ''}
            onChange={(e) => update(i, { quantity: e.target.value ? Number(e.target.value) : null })}
            className="w-20 shrink-0"
          />
          <Input
            placeholder="Unit"
            value={ing.unit ?? ''}
            onChange={(e) => update(i, { unit: e.target.value || null })}
            className="w-20 shrink-0"
          />
          <Input
            placeholder="Prep"
            value={ing.prep ?? ''}
            onChange={(e) => update(i, { prep: e.target.value || undefined })}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove ingredient"
            onClick={() => remove(i)}
            disabled={ingredients.length === 1}
          >
            ×
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...ingredients, empty()])}>
        + Add ingredient
      </Button>
    </div>
  )
}
