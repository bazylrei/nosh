import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ServingStepper from '@/components/recipe/ServingStepper'
import IngredientList from '@/components/recipe/IngredientList'
import MethodSteps from '@/components/recipe/MethodSteps'
import CostBadge from '@/components/recipe/CostBadge'
import { fetchRecipeById } from '@/lib/recipes'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
  })

  const [serves, setServes] = useState<number | undefined>()
  const selectedServes = serves ?? recipe?.serves ?? 1

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading…</p>
  }
  if (!recipe) {
    return <p className="p-6 text-sm text-muted-foreground">Recipe not found.</p>
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground rounded px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">← All recipes</Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-heading text-nosh-green">{recipe.name}</h1>
          {recipe.isCustom && <Badge variant="secondary">Custom</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          {recipe.mealType.map((t) => <Badge key={t}>{t}</Badge>)}
          <Badge variant="outline" className="border-nosh-teal/40 bg-nosh-teal/10 text-nosh-teal">{recipe.cuisine}</Badge>
          {recipe.dietary.map((d) => <Badge key={d} variant="outline" className="border-nosh-leaf/40 bg-nosh-leaf/10 text-nosh-leaf">{d}</Badge>)}
          {recipe.costPerPerson != null && (
            <CostBadge costPerPerson={recipe.costPerPerson} serves={selectedServes} />
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading">Ingredients</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Serves</span>
            <ServingStepper
              value={selectedServes}
              onChange={setServes}
            />
          </div>
        </div>
        <IngredientList
          ingredients={recipe.ingredients}
          recipeServes={recipe.serves}
          selectedServes={selectedServes}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-heading">Method</h2>
        <MethodSteps steps={recipe.method} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="flex-1 sm:flex-none">
          <Link to={`/planner?recipeId=${recipe.id}`}>Add to meal plan</Link>
        </Button>
        {recipe.isCustom && (
          <Button asChild variant="secondary" className="flex-1 sm:flex-none">
            <Link to={`/recipes/${recipe.id}/edit`}>Edit recipe</Link>
          </Button>
        )}
      </div>
    </div>
  )
}
