import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import SearchInput from '@/components/ui/SearchInput'
import { fetchRecipes } from '@/lib/recipes'
import { useDebounce } from '@/hooks/useDebounce'
import type { MealType, Recipe } from '@nosh/shared'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  mealType: MealType
  onSelect: (recipe: Recipe) => void
}

export default function RecipePickerDialog({ open, onOpenChange, mealType, onSelect }: Props) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes', { mealType, search: debouncedSearch }],
    queryFn: () => fetchRecipes({ mealType, search: debouncedSearch || undefined }),
    enabled: open,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="capitalize">Pick a {mealType} recipe</DialogTitle>
        </DialogHeader>
        <SearchInput value={search} onChange={setSearch} placeholder="Search recipes..." />
        <ul className="flex-1 overflow-y-auto space-y-1 mt-1">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-sm"
                onClick={() => { onSelect(recipe); onOpenChange(false) }}
              >
                <span className="font-medium">{recipe.name}</span>
                <span className="ml-2 text-muted-foreground text-xs">{recipe.cuisine}</span>
              </button>
            </li>
          ))}
          {recipes.length === 0 && (
            <li className="px-3 py-6 text-sm text-muted-foreground text-center">No recipes found.</li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
