import { describe, it, expect } from 'vitest'
import { scaleQuantity } from '../lib/scaling'

describe('scaleQuantity', () => {
  it('scales quantity proportionally', () => {
    expect(scaleQuantity(400, 4, 2)).toBe(200)
  })

  it('rounds to 1 decimal place', () => {
    expect(scaleQuantity(100, 3, 2)).toBe(66.7)
  })

  it('returns null when quantity is null', () => {
    expect(scaleQuantity(null, 4, 2)).toBeNull()
  })

  it('returns original quantity when serves are unchanged', () => {
    expect(scaleQuantity(250, 4, 4)).toBe(250)
  })

  it('scales up correctly', () => {
    expect(scaleQuantity(200, 2, 6)).toBe(600)
  })
})
