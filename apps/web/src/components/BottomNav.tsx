import { Link, useLocation } from 'react-router-dom'
import { Utensils, CalendarDays, ShoppingCart, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { to: '/', label: 'Recipes', icon: Utensils },
  { to: '/planner', label: 'Planner', icon: CalendarDays },
  { to: '/shopping-list', label: 'Shopping', icon: ShoppingCart },
  { to: '/preferences', label: 'Prefs', icon: Settings },
] as const

export default function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors min-h-[56px]',
                active ? 'text-nosh-green' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
