import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShoppingList } from '@/hooks/useShoppingList'
import { getWeekStart, shiftWeek, formatWeekLabel } from '@/lib/week'

export default function ShoppingListPage() {
  const [weekStart, setWeekStart] = useState(getWeekStart)
  const { data: items = [], isLoading } = useShoppingList(weekStart)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/planner" aria-label="Back to planner">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-heading text-nosh-green">Shopping List</h1>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWeekStart((w) => shiftWeek(w, -1))}
          aria-label="Previous week"
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm font-medium min-w-[12rem] text-center">
          {formatWeekLabel(weekStart)}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setWeekStart((w) => shiftWeek(w, 1))}
          aria-label="Next week"
        >
          <ChevronRight />
        </Button>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!isLoading && items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No meals planned for this week.{' '}
          <Link to="/planner" className="underline">Go to planner</Link>
        </p>
      )}

      {items.length > 0 && (
        <ul className="divide-y rounded-lg border">
          {items.map((item) => (
            <li key={`${item.item}::${item.unit ?? ''}`} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="font-medium capitalize">{item.item}</span>
              <span className="text-muted-foreground">
                {item.totalQuantity !== null
                  ? `${Math.round(item.totalQuantity * 10) / 10}${item.unit ? ` ${item.unit}` : ''}`
                  : item.unit ?? '—'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
