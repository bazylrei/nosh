import { db } from '../db/client.js'
import { userPreferences } from '../db/schema.js'
import { sql } from 'drizzle-orm'
import type { UserPreferences, Dietary } from '@nosh/shared'

export async function getPreferences(): Promise<UserPreferences> {
  const [row] = await db.select().from(userPreferences)
  return { dietary: (row?.dietary ?? []) as Dietary[] }
}

export async function updatePreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
  const dietary = (data.dietary ?? []) as string[]
  const [row] = await db
    .insert(userPreferences)
    .values({ id: 1, dietary })
    .onConflictDoUpdate({ target: userPreferences.id, set: { dietary: sql`excluded.dietary` } })
    .returning()
  return { dietary: (row.dietary ?? []) as Dietary[] }
}
