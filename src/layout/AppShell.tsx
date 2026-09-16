import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Masthead } from '../components/Masthead'
import { GlossaryDrawerProvider } from '../lib/glossaryDrawer'
import { useScrollPattern } from '../lib/useScrollPattern'
import { useVisitedChapters, type StopKey } from '../lib/visitedChapters'
import { getDocumentTitle } from '../site'

const ROUTE_TO_STOP: Partial<Record<string, StopKey>> = {
  '/':                   'prologue',
  '/annual-clock':       'annual',
  '/trajectory-clock':   'trajectory',
  '/generational-clock': 'generational',
  '/epilogue':           'epilogue',
}

export function AppShell() {
  const location = useLocation()
  const [visited, markVisited] = useVisitedChapters()

  useScrollPattern()

  useEffect(() => {
    document.title = getDocumentTitle(location.pathname)
    const stop = ROUTE_TO_STOP[location.pathname]
    if (stop) markVisited(stop)
  }, [location.pathname, markVisited])

  return (
    <div className="app-shell">
      <Masthead visited={visited} />

      <GlossaryDrawerProvider key={location.pathname}>
        <main className="app-shell__main">
          <Outlet />
        </main>
      </GlossaryDrawerProvider>
    </div>
  )
}
