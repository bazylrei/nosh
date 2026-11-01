import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import RecipeForm from '@/components/recipe/RecipeForm'
import { fetchRecipeById, createRecipe, updateRecipe, deleteRecipe } from '@/lib/recipes'
import type { CreateRecipe } from '@nosh/shared'

export default function RecipeFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = !!id

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => fetchRecipeById(id!),
    enabled: isEdit,
  })

  async function handleSubmit(data: CreateRecipe) {
    if (isEdit) {
      await updateRecipe(id!, data)
      queryClient.invalidateQueries({ queryKey: ['recipe', id] })
    } else {
      await createRecipe(data)
    }
    queryClient.invalidateQueries({ queryKey: ['recipes'] })
    navigate('/')
  }

  async function handleDelete() {
    await deleteRecipe(id!)
    queryClient.invalidateQueries({ queryKey: ['recipes'] })
    navigate('/')
  }

  if (isEdit && isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading…</p>
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto space-y-8">
      <div>
        <Link to={isEdit ? `/recipes/${id}` : '/'} className="text-sm text-muted-foreground hover:text-foreground">
          ← {isEdit ? 'Back to recipe' : 'All recipes'}
        </Link>
      </div>

      <h1 className="text-3xl font-heading text-nosh-green">
        {isEdit ? 'Edit recipe' : 'New recipe'}
      </h1>

      <RecipeForm
        defaultValues={recipe}
        onSubmit={handleSubmit}
        onDelete={isEdit ? handleDelete : undefined}
      />
    </div>
  )
}
