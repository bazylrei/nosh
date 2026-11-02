import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShoppingList, useToggleShoppingCheck, useUncheckAll } from '@/hooks/useShoppingList'
import { getWeekStart, shiftWeek, formatWeekLabel } from '@/lib/week'
import { cn } from '@/lib/utils'

export default function ShoppingListPage() {
  const [weekStart, setWeekStart] = useState(getWeekStart)
  const { data: items = [], isLoading } = useShoppingList(weekStart)
  const { mutate: toggle } = useToggleShoppingCheck(weekStart)
  const { mutate: uncheckAll, isPending: isUncheckingAll } = useUncheckAll(weekStart)

  const checkedCount = items.filter((i) => i.checked).length

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
        <>
          {checkedCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{checkedCount} of {items.length} picked up</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => uncheckAll()}
                disabled={isUncheckingAll}
              >
                Uncheck all
              </Button>
            </div>
          )}
          <ul className="divide-y rounded-lg border">
            {items.map((item) => {
              const key = `${item.item}::${item.unit ?? ''}`
              return (
                <li
                  key={key}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm transition-opacity',
                    item.checked && 'opacity-50',
                  )}
                >
                  <input
                    type="checkbox"
                    id={key}
                    checked={item.checked}
                    onChange={(e) => toggle({ item: item.item, unit: item.unit, checked: e.target.checked })}
                    className="h-4 w-4 rounded border-input accent-nosh-green shrink-0"
                    aria-label={`Mark ${item.item} as ${item.checked ? 'not picked up' : 'picked up'}`}
                  />
                  <label
                    htmlFor={key}
                    className={cn('flex-1 cursor-pointer font-medium capitalize', item.checked && 'line-through')}
                  >
                    {item.item}
                  </label>
                  <span className="text-muted-foreground shrink-0">
                    {item.totalQuantity !== null
                      ? `${Math.round(item.totalQuantity * 10) / 10}${item.unit ? ` ${item.unit}` : ''}`
                      : item.unit ?? '—'}
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
