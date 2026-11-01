import type { MealSlot, Recipe, ShoppingItem } from '@nosh/shared'

export function buildShoppingList(slots: MealSlot[], recipesById: Map<string, Recipe>): ShoppingItem[] {
  const totals = new Map<string, ShoppingItem>()

  for (const slot of slots) {
    const recipe = recipesById.get(slot.recipeId)
    if (!recipe) continue

    const scale = slot.serves / recipe.serves

    for (const ing of recipe.ingredients) {
      const key = `${ing.item.toLowerCase().trim()}::${ing.unit?.toLowerCase().trim() ?? ''}`
      const existing = totals.get(key)
      const scaledQty = ing.quantity !== null ? ing.quantity * scale : null

      if (existing) {
        existing.totalQuantity =
          existing.totalQuantity !== null && scaledQty !== null
            ? existing.totalQuantity + scaledQty
            : null
      } else {
        totals.set(key, { item: ing.item, totalQuantity: scaledQty, unit: ing.unit ?? null })
      }
    }
  }

  return Array.from(totals.values())
}
