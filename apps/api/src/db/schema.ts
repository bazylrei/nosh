import { pgTable, uuid, text, integer, boolean, jsonb, timestamp, date, uniqueIndex } from 'drizzle-orm/pg-core'
import type { Ingredient } from '@nosh/shared'

export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  cuisine: text('cuisine').notNull(),
  mealType: text('meal_type').array().notNull().default([]),
  dietary: text('dietary').array().notNull().default([]),
  tags: text('tags').array().notNull().default([]),
  serves: integer('serves').notNull().default(2),
  isCustom: boolean('is_custom').notNull().default(false),
  ingredients: jsonb('ingredients').notNull().$type<Ingredient[]>(),
  method: text('method').array().notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const mealSlots = pgTable(
  'meal_slots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    day: integer('day').notNull(),
    mealType: text('meal_type').notNull(),
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),
    serves: integer('serves').notNull().default(2),
    weekStart: date('week_start').notNull(),
  },
  (t) => [uniqueIndex('meal_slots_unique_slot').on(t.day, t.mealType, t.weekStart)],
)

export const shoppingListChecks = pgTable(
  'shopping_list_checks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    weekStart: date('week_start').notNull(),
    item: text('item').notNull(),
    unit: text('unit').notNull().default(''),
    checked: boolean('checked').notNull().default(true),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [uniqueIndex('shopping_list_checks_unique').on(t.weekStart, t.item, t.unit)],
)

export const userPreferences = pgTable('user_preferences', {
  id: integer('id').primaryKey().default(1),
  dietary: text('dietary').array().notNull().default([]),
  cuisine: text('cuisine').array().notNull().default([]),
})
