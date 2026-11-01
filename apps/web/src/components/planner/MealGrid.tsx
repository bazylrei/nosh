import { DAYS, MEAL_TYPES } from '@nosh/shared'
import MealSlotCell from './MealSlotCell'
import type { MealSlot, Recipe, MealType } from '@nosh/shared'

interface Props {
  slots: MealSlot[]
  recipeMap: Map<string, Recipe>
  onAdd: (day: number, mealType: MealType) => void
  onRemove: (id: string) => void
  onServesChange: (id: string, serves: number) => void
}

export default function MealGrid({ slots, recipeMap, onAdd, onRemove, onServesChange }: Props) {
  const slotMap = new Map(slots.map((s) => [`${s.day}-${s.mealType}`, s]))

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="w-16" />
          {MEAL_TYPES.map((mealType) => (
            <th key={mealType} className="text-center text-xs font-semibold text-muted-foreground pb-2 px-1 capitalize">
              {mealType}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {DAYS.map((day, dayIdx) => (
          <tr key={day}>
            <td className="pr-2 py-1 text-xs font-semibold text-muted-foreground align-top pt-3 w-16">
              {day.slice(0, 3)}
            </td>
            {MEAL_TYPES.map((mealType) => {
              const slot = slotMap.get(`${dayIdx}-${mealType}`)
              const recipe = slot ? recipeMap.get(slot.recipeId) : undefined
              return (
                <td key={mealType} className="px-1 py-1 align-top">
                  <MealSlotCell
                    slot={slot}
                    recipe={recipe}
                    onAdd={() => onAdd(dayIdx, mealType as MealType)}
                    onRemove={() => slot && onRemove(slot.id)}
                    onServesChange={(serves) => slot && onServesChange(slot.id, serves)}
                  />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
