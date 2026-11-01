export function scaleQuantity(
  quantity: number | null,
  recipeServes: number,
  selectedServes: number,
): number | null {
  if (quantity === null) return null
  return Math.round((quantity / recipeServes) * selectedServes * 10) / 10
}
