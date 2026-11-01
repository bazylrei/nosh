import { db } from '../db/client.js'
import { userPreferences } from '../db/schema.js'
import { sql } from 'drizzle-orm'
import type { UserPreferences, Dietary } from '@nosh/shared'

export async function getPreferences(): Promise<UserPreferences> {
  const [row] = await db.select().from(userPreferences)
  return {
    dietary: (row?.dietary ?? []) as Dietary[],
    cuisine: row?.cuisine ?? [],
  }
}

export async function updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
  const dietary = (data.dietary ?? []) as string[]
  const cuisine = (data.cuisine ?? []) as string[]
  const [row] = await db
    .insert(userPreferences)
    .values({ id: 1, dietary, cuisine })
    .onConflictDoUpdate({
      target: userPreferences.id,
      set: {
        dietary: sql`excluded.dietary`,
        cuisine: sql`excluded.cuisine`,
      },
    })
    .returning()
  return {
    dietary: (row.dietary ?? []) as Dietary[],
    cuisine: row.cuisine ?? [],
  }
}
