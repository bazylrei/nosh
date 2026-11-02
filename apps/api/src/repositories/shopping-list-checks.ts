import { eq, and } from 'drizzle-orm'
import { db } from '../db/client.js'
import { shoppingListChecks } from '../db/schema.js'

export async function findChecksForWeek(weekStart: string) {
  return db
    .select()
    .from(shoppingListChecks)
    .where(eq(shoppingListChecks.weekStart, weekStart))
}

export async function upsertCheck(weekStart: string, item: string, unit: string, checked: boolean) {
  await db
    .insert(shoppingListChecks)
    .values({ weekStart, item, unit, checked })
    .onConflictDoUpdate({
      target: [shoppingListChecks.weekStart, shoppingListChecks.item, shoppingListChecks.unit],
      set: { checked, updatedAt: new Date() },
    })
}

export async function deleteChecksForWeek(weekStart: string) {
  await db
    .delete(shoppingListChecks)
    .where(eq(shoppingListChecks.weekStart, weekStart))
}
