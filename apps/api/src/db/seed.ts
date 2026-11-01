import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { db } from './client.js'
import { recipes, userPreferences } from './schema.js'
import { RecipeSchema } from '@nosh/shared'
import { z } from 'zod'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SeedRecipeSchema = RecipeSchema.omit({ id: true, isCustom: true, createdAt: true })
const SeedArraySchema = z.array(SeedRecipeSchema)

function loadSeedData() {
  const jsonPath = resolve(__dirname, '../../data/recipes.json')
  const raw = JSON.parse(readFileSync(jsonPath, 'utf-8'))
  return SeedArraySchema.parse(raw)
}

async function seed() {
  const data = loadSeedData()
  console.log(`Seeding ${data.length} recipes...`)

  await db.delete(userPreferences)
  await db.insert(userPreferences).values({ id: 1, dietary: [] })

  await db.delete(recipes)
  await db.insert(recipes).values(data.map((r) => ({ ...r, isCustom: false })))

  console.log('Done.')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
