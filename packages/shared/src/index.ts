import { z } from 'zod'

export const MealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'dessert'])
export const DietarySchema = z.enum(['vegetarian', 'vegan', 'gluten-free', 'dairy-free'])

export const IngredientSchema = z.object({
  item: z.string().min(1),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
  prep: z.string().optional(),
})

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  cuisine: z.string().min(1),
  mealType: z.array(MealTypeSchema),
  dietary: z.array(DietarySchema).default([]),
  tags: z.array(z.string()).default([]),
  serves: z.number().int().min(1),
  isCustom: z.boolean().default(false),
  ingredients: z.array(IngredientSchema),
  method: z.array(z.string()),
  createdAt: z.string().optional(),
  costPerPerson: z.number().nullable().optional(),
})

export const CreateRecipeSchema = RecipeSchema.omit({ id: true, isCustom: true, createdAt: true, costPerPerson: true })
export const UpdateRecipeSchema = CreateRecipeSchema.partial()

export const MealSlotSchema = z.object({
  id: z.string().uuid(),
  day: z.number().int().min(0).max(6),
  mealType: MealTypeSchema,
  recipeId: z.string(),
  serves: z.number().int().min(1).max(20),
  weekStart: z.string(), // ISO date string, Monday of the week
})

export const UpsertMealSlotSchema = MealSlotSchema.omit({ id: true }).extend({
  id: z.string().uuid().optional(),
})

export const ShoppingItemSchema = z.object({
  item: z.string(),
  totalQuantity: z.number().nullable(),
  unit: z.string().nullable(),
  checked: z.boolean().default(false),
})

export const UserPreferencesSchema = z.object({
  dietary: z.array(DietarySchema).default([]),
  cuisine: z.array(z.string()).default([]),
})

export type MealType = z.infer<typeof MealTypeSchema>
export type Dietary = z.infer<typeof DietarySchema>
export type Ingredient = z.infer<typeof IngredientSchema>
export type Recipe = z.infer<typeof RecipeSchema>
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>
export type MealSlot = z.infer<typeof MealSlotSchema>
export type UpsertMealSlot = z.infer<typeof UpsertMealSlotSchema>
export type ShoppingItem = z.infer<typeof ShoppingItemSchema>
export type UserPreferences = z.infer<typeof UserPreferencesSchema>

export const PriceEntrySchema = z.object({
  priceGBP: z.number().positive(),
  per: z.number().positive(),
  unit: z.string(),
})
export const PriceMapSchema = z.record(PriceEntrySchema)

export type PriceEntry = z.infer<typeof PriceEntrySchema>
export type PriceMap = z.infer<typeof PriceMapSchema>

export type CostEstimate = {
  totalGBP: number
  coveredCount: number
  totalCount: number
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner']
