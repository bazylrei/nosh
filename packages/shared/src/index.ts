import { z } from 'zod'

export const MealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'dessert'])
export const DietarySchema = z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free'])

export const IngredientSchema = z.object({
  id: z.string(),
  item: z.string(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  prep: z.string().optional().nullable(),
})

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  cuisine: z.string(),
  mealType: z.array(MealTypeSchema),
  dietary: z.array(DietarySchema),
  tags: z.array(z.string()),
  serves: z.number(),
  isCustom: z.boolean().default(false),
  ingredients: z.array(IngredientSchema),
  method: z.array(z.string()),
})

export const CreateRecipeSchema = RecipeSchema.omit({ id: true, isCustom: true })

export const MealSlotSchema = z.object({
  id: z.string(),
  day: z.number().min(0).max(6),
  mealType: MealTypeSchema,
  recipeId: z.string(),
  serves: z.number().min(1).max(20),
  weekStart: z.string(),
})

export const UpsertMealSlotSchema = MealSlotSchema.omit({ id: true }).extend({
  id: z.string().optional(),
})

export const ShoppingItemSchema = z.object({
  item: z.string(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  estimatedPence: z.number().nullable(),
})

export type MealType = z.infer<typeof MealTypeSchema>
export type Dietary = z.infer<typeof DietarySchema>
export type Ingredient = z.infer<typeof IngredientSchema>
export type Recipe = z.infer<typeof RecipeSchema>
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>
export type MealSlot = z.infer<typeof MealSlotSchema>
export type UpsertMealSlot = z.infer<typeof UpsertMealSlotSchema>
export type ShoppingItem = z.infer<typeof ShoppingItemSchema>

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']
