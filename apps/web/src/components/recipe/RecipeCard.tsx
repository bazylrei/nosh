import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Recipe } from '@nosh/shared'

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
    <Card className="flex flex-col h-full transition-colors hover:border-nosh-green">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{recipe.name}</CardTitle>
          {recipe.isCustom && <Badge variant="secondary" className="shrink-0">Custom</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          Serves {recipe.serves}
          {recipe.costPerPerson != null && ` · ~£${recipe.costPerPerson.toFixed(2)}/person`}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        <div className="flex flex-wrap gap-1">
          {recipe.mealType.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
          <Badge variant="outline" className="border-nosh-teal/40 bg-nosh-teal/10 text-nosh-teal">{recipe.cuisine}</Badge>
          {recipe.dietary.map((d) => (
            <Badge key={d} variant="outline" className="border-nosh-leaf/40 bg-nosh-leaf/10 text-nosh-leaf">{d}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}
