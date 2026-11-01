import type { Recipe, PriceMap } from '@nosh/shared'
import { PRICE_MAP } from '../data/prices.js'

export function computeCostPerPerson(recipe: Recipe): number | null {
  return computeCostPerPersonWithMap(recipe, PRICE_MAP)
}

export function computeCostPerPersonWithMap(recipe: Recipe, prices: PriceMap): number | null {
  if (recipe.serves <= 0) return null

  let totalGBP = 0
  let coveredCount = 0
  let totalCount = 0

  for (const ing of recipe.ingredients) {
    if (ing.quantity === null) continue
    totalCount++

    const entry = prices[ing.item.toLowerCase()]
    if (!entry) continue

    const ingUnit = ing.unit ?? 'count'
    if (ingUnit !== entry.unit) continue

    coveredCount++
    totalGBP += (ing.quantity / entry.per) * entry.priceGBP
  }

  if (coveredCount === 0) return null
  return totalGBP / recipe.serves
}
