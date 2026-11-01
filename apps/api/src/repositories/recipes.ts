import { eq, and, ilike, arrayContains, inArray, sql } from 'drizzle-orm'
import { db } from '../db/client.js'
import { recipes } from '../db/schema.js'
import { computeCostPerPerson } from '../lib/pricing.js'
import type { Recipe, CreateRecipe, UpdateRecipe, MealType, Dietary } from '@nosh/shared'

export type RecipeFilters = {
  mealType?: MealType
  dietary?: Dietary[]
  cuisine?: string[]
  search?: string
}

function toRecipe(row: typeof recipes.$inferSelect): Recipe {
  const recipe: Recipe = {
    ...row,
    mealType: row.mealType as MealType[],
    dietary: row.dietary as Dietary[],
    createdAt: row.createdAt.toISOString(),
  }
  recipe.costPerPerson = computeCostPerPerson(recipe)
  return recipe
}

export async function findRecipes(filters: RecipeFilters = {}): Promise<Recipe[]> {
  const conditions = []

  if (filters.mealType) {
    conditions.push(sql`${recipes.mealType} @> ARRAY[${filters.mealType}]::text[]`)
  }
  if (filters.dietary?.length) {
    conditions.push(arrayContains(recipes.dietary, filters.dietary))
  }
  if (filters.cuisine?.length) {
    conditions.push(inArray(recipes.cuisine, filters.cuisine))
  }
  if (filters.search) {
    conditions.push(ilike(recipes.name, `%${filters.search}%`))
  }

  const rows = await db
    .select()
    .from(recipes)
    .where(conditions.length ? and(...conditions) : undefined)

  return rows.map(toRecipe)
}

export async function findRecipeById(id: string): Promise<Recipe | undefined> {
  const [row] = await db.select().from(recipes).where(eq(recipes.id, id))
  return row ? toRecipe(row) : undefined
}

export async function createRecipe(data: CreateRecipe): Promise<Recipe> {
  const { name, cuisine, mealType, dietary, tags, serves, ingredients, method } = data
  const [row] = await db
    .insert(recipes)
    .values({ name, cuisine, mealType, dietary, tags, serves, ingredients, method, isCustom: true })
    .returning()
  return toRecipe(row)
}

export async function updateRecipe(id: string, data: UpdateRecipe): Promise<Recipe | undefined> {
  const [row] = await db.update(recipes).set(data).where(eq(recipes.id, id)).returning()
  return row ? toRecipe(row) : undefined
}

export async function deleteRecipe(id: string): Promise<boolean> {
  const [row] = await db.delete(recipes).where(eq(recipes.id, id)).returning({ id: recipes.id })
  return !!row
}
