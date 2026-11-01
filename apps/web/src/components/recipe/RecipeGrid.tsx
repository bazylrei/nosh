import RecipeCard from './RecipeCard'
import type { Recipe } from '@nosh/shared'

interface Props {
  recipes: Recipe[]
  isLoading: boolean
}

export default function RecipeGrid({ recipes, isLoading }: Props) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading recipes…</p>
  }

  if (recipes.length === 0) {
    return <p className="text-sm text-muted-foreground">No recipes match your filters.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {recipes.map((r) => (
        <RecipeCard key={r.id} recipe={r} />
      ))}
    </div>
  )
}
