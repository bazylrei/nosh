import { eq, sql } from 'drizzle-orm'
import { db } from '../db/client.js'
import { mealSlots } from '../db/schema.js'
import type { MealSlot, UpsertMealSlot, MealType } from '@nosh/shared'

function toMealSlot(row: typeof mealSlots.$inferSelect): MealSlot {
  return {
    ...row,
    mealType: row.mealType as MealType,
  }
}

export async function findMealSlotsByWeek(weekStart: string): Promise<MealSlot[]> {
  const rows = await db.select().from(mealSlots).where(eq(mealSlots.weekStart, weekStart))
  return rows.map(toMealSlot)
}

export async function upsertMealSlot(data: UpsertMealSlot): Promise<MealSlot> {
  const { day, mealType, recipeId, serves, weekStart } = data
  const [row] = await db
    .insert(mealSlots)
    .values({ day, mealType, recipeId, serves, weekStart })
    .onConflictDoUpdate({
      target: [mealSlots.day, mealSlots.mealType, mealSlots.weekStart],
      set: { recipeId: sql`excluded.recipe_id`, serves: sql`excluded.serves` },
    })
    .returning()
  return toMealSlot(row)
}

export async function deleteMealSlot(id: string): Promise<boolean> {
  const [row] = await db.delete(mealSlots).where(eq(mealSlots.id, id)).returning({ id: mealSlots.id })
  return !!row
}
