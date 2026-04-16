import { useEffect, useSyncExternalStore } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { TopNav } from '../components/TopNav'
import {
  defaultClockVisitedState,
  getClockKeyForPath,
  markClockVisited,
  readClockVisitedState,
  subscribeToClockVisitedState,
} from '../lib/clockState'
import { GlossaryDrawerProvider } from '../lib/glossaryDrawer'
import { useScrollPattern } from '../lib/useScrollPattern'

export function AppShell() {
  const location = useLocation()
  const persistedVisitedState = useSyncExternalStore(
    subscribeToClockVisitedState,
    readClockVisitedState,
    readClockVisitedState,
  )
  const visitedState =
    location.pathname === '/epilogue'
      ? {
          ...defaultClockVisitedState,
          annual: true,
          trajectory: true,
          generational: true,
        }
      : persistedVisitedState

  useScrollPattern()

  useEffect(() => {
    const currentClock = getClockKeyForPath(location.pathname)
    if (!currentClock) {
      return
    }

    markClockVisited(currentClock)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <TopNav visitedState={visitedState} />

      <GlossaryDrawerProvider key={location.pathname}>
        <main className="app-shell__main">
          <Outlet />
        </main>
      </GlossaryDrawerProvider>
    </div>
  )
}
