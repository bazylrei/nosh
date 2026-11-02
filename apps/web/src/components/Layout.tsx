import type { ReactNode } from 'react'
import BottomNav from '@/components/BottomNav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="pb-16 md:pb-0">{children}</div>
      <BottomNav />
    </>
  )
}
