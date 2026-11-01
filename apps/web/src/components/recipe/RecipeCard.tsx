import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Recipe } from '@nosh/shared'

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{recipe.name}</CardTitle>
          {recipe.isCustom && <Badge variant="secondary" className="shrink-0">Custom</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          {recipe.cuisine} · Serves {recipe.serves}
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-0">
        <div className="flex flex-wrap gap-1">
          {recipe.mealType.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        {recipe.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.dietary.map((d) => (
              <Badge key={d} variant="outline">{d}</Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
