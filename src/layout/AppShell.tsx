import { useEffect, useSyncExternalStore } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { TopNav } from '../components/TopNav'
import {
  getClockKeyForPath,
  markClockVisited,
  readClockVisitedState,
  subscribeToClockVisitedState,
} from '../lib/clockState'
import { useScrollPattern } from '../lib/useScrollPattern'

export function AppShell() {
  const location = useLocation()
  const visitedState = useSyncExternalStore(
    subscribeToClockVisitedState,
    readClockVisitedState,
    readClockVisitedState,
  )

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

      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  )
}
