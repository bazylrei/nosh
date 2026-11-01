export function getWeekStart(from = new Date()): string {
  const d = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()))
  const dow = d.getUTCDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().split('T')[0]
}

export function shiftWeek(weekStart: string, delta: number): string {
  const [y, m, day] = weekStart.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1, day + delta * 7))
  return d.toISOString().split('T')[0]
}

export function formatWeekLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, d))
  const end = new Date(Date.UTC(y, m - 1, d + 6))
  const fmt = (date: Date, includeYear = false) =>
    date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      ...(includeYear ? { year: 'numeric' } : {}),
      timeZone: 'UTC',
    })
  return `${fmt(start)} – ${fmt(end, true)}`
}
