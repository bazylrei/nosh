import type { PriceMap } from '@nosh/shared'

// UK supermarket average prices (2025). Keys match ingredient item names (lowercase).
// unit: 'count' covers ingredients recorded with null unit in recipes.
export const PRICE_MAP: PriceMap = {
  // --- g ---
  'beef mince':        { priceGBP: 0.011,  per: 1, unit: 'g' },
  'lamb mince':        { priceGBP: 0.012,  per: 1, unit: 'g' },
  'chicken breast':    { priceGBP: 0.011,  per: 1, unit: 'g' },
  'chicken thighs':    { priceGBP: 0.008,  per: 1, unit: 'g' },
  'cheddar':           { priceGBP: 0.009,  per: 1, unit: 'g' },
  'halloumi':          { priceGBP: 0.011,  per: 1, unit: 'g' },
  'butter':            { priceGBP: 0.0072, per: 1, unit: 'g' },
  'plain flour':       { priceGBP: 0.00065, per: 1, unit: 'g' },
  'self-raising flour':{ priceGBP: 0.00065, per: 1, unit: 'g' },
  'basmati rice':      { priceGBP: 0.0017, per: 1, unit: 'g' },
  'jasmine rice':      { priceGBP: 0.0017, per: 1, unit: 'g' },
  'rice':              { priceGBP: 0.0015, per: 1, unit: 'g' },
  'egg noodles':       { priceGBP: 0.005,  per: 1, unit: 'g' },
  'spaghetti':         { priceGBP: 0.002,  per: 1, unit: 'g' },
  'potatoes':          { priceGBP: 0.0005, per: 1, unit: 'g' },
  'frozen peas':       { priceGBP: 0.001,  per: 1, unit: 'g' },
  'broccoli':          { priceGBP: 0.00225, per: 1, unit: 'g' },
  'green beans':       { priceGBP: 0.005,  per: 1, unit: 'g' },
  'cherry tomatoes':   { priceGBP: 0.005,  per: 1, unit: 'g' },
  'mushrooms':         { priceGBP: 0.004,  per: 1, unit: 'g' },
  'dark brown sugar':  { priceGBP: 0.001,  per: 1, unit: 'g' },
  'sugar':             { priceGBP: 0.0009, per: 1, unit: 'g' },
  'red lentils':       { priceGBP: 0.0025, per: 1, unit: 'g' },
  'porridge oats':     { priceGBP: 0.0015, per: 1, unit: 'g' },
  'rolled oats':       { priceGBP: 0.0015, per: 1, unit: 'g' },
  'mixed berries':     { priceGBP: 0.005,  per: 1, unit: 'g' },
  'pitted dates':      { priceGBP: 0.01,   per: 1, unit: 'g' },

  // --- count (null unit in recipes maps to 'count') ---
  'apple':             { priceGBP: 0.30, per: 1, unit: 'count' },
  'apples':            { priceGBP: 0.30, per: 1, unit: 'count' },
  'aubergine':         { priceGBP: 0.80, per: 1, unit: 'count' },
  'baguette':          { priceGBP: 0.80, per: 1, unit: 'count' },
  'baking potatoes':   { priceGBP: 0.50, per: 1, unit: 'count' },
  'beef stock cube':   { priceGBP: 0.10, per: 1, unit: 'count' },
  'carrot':            { priceGBP: 0.18, per: 1, unit: 'count' },
  'carrots':           { priceGBP: 0.18, per: 1, unit: 'count' },
  'cod fillets':       { priceGBP: 1.75, per: 1, unit: 'count' },
  'courgette':         { priceGBP: 0.65, per: 1, unit: 'count' },
  'eggs':              { priceGBP: 0.40, per: 1, unit: 'count' },
  'lemon':             { priceGBP: 0.45, per: 1, unit: 'count' },
  'onion':             { priceGBP: 0.22, per: 1, unit: 'count' },
  'pork sausages':     { priceGBP: 0.42, per: 1, unit: 'count' },
  'pizza base':        { priceGBP: 1.10, per: 1, unit: 'count' },
  'red onion':         { priceGBP: 0.30, per: 1, unit: 'count' },
  'red pepper':        { priceGBP: 0.65, per: 1, unit: 'count' },
  'tomatoes':          { priceGBP: 0.20, per: 1, unit: 'count' },

  // --- tin ---
  'baked beans':       { priceGBP: 0.50, per: 1, unit: 'tin' },
  'chopped tomatoes':  { priceGBP: 0.50, per: 1, unit: 'tin' },
  'coconut milk':      { priceGBP: 1.20, per: 1, unit: 'tin' },
  'kidney beans':      { priceGBP: 0.50, per: 1, unit: 'tin' },

  // --- ml ---
  'double cream':      { priceGBP: 0.006,    per: 1, unit: 'ml' },
  'milk':              { priceGBP: 0.00067,  per: 1, unit: 'ml' },
  'passata':           { priceGBP: 0.0016,   per: 1, unit: 'ml' },
  'vegetable stock':   { priceGBP: 0.001,    per: 1, unit: 'ml' },

  // --- tbsp ---
  'balsamic vinegar':  { priceGBP: 0.10, per: 1, unit: 'tbsp' },
  'branston pickle':   { priceGBP: 0.08, per: 1, unit: 'tbsp' },
  'chilli powder':     { priceGBP: 0.12, per: 1, unit: 'tbsp' },
  'curry powder':      { priceGBP: 0.10, per: 1, unit: 'tbsp' },
  'fish sauce':        { priceGBP: 0.10, per: 1, unit: 'tbsp' },
  'gravy granules':    { priceGBP: 0.08, per: 1, unit: 'tbsp' },
  'green curry paste': { priceGBP: 0.14, per: 1, unit: 'tbsp' },
  'honey':             { priceGBP: 0.12, per: 1, unit: 'tbsp' },
  'oil':               { priceGBP: 0.03, per: 1, unit: 'tbsp' },
  'olive oil':         { priceGBP: 0.07, per: 1, unit: 'tbsp' },
  'sesame oil':        { priceGBP: 0.20, per: 1, unit: 'tbsp' },
  'soy sauce':         { priceGBP: 0.12, per: 1, unit: 'tbsp' },
  'tikka curry paste': { priceGBP: 0.14, per: 1, unit: 'tbsp' },
  'tomato puree':      { priceGBP: 0.05, per: 1, unit: 'tbsp' },

  // --- tsp ---
  'bicarbonate of soda': { priceGBP: 0.02, per: 1, unit: 'tsp' },
  'cinnamon':            { priceGBP: 0.09, per: 1, unit: 'tsp' },
  'ground cumin':        { priceGBP: 0.10, per: 1, unit: 'tsp' },

  // --- other ---
  'garlic':        { priceGBP: 0.05,  per: 1, unit: 'clove' },
  'ginger':        { priceGBP: 0.25,  per: 1, unit: 'thumb' },
  'fresh basil':   { priceGBP: 0.35,  per: 1, unit: 'handful' },
  'salad leaves':  { priceGBP: 0.25,  per: 1, unit: 'handful' },
  'back bacon':    { priceGBP: 0.42,  per: 1, unit: 'rasher' },
  'bread':         { priceGBP: 0.05,  per: 1, unit: 'slice' },
  'ham':           { priceGBP: 0.35,  per: 1, unit: 'slice' },
  'mozzarella':    { priceGBP: 1.25,  per: 1, unit: 'ball' },
}
