import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { TopNav } from '../components/TopNav'
import { GlossaryDrawerProvider } from '../lib/glossaryDrawer'
import { useScrollPattern } from '../lib/useScrollPattern'
import { getDocumentTitle } from '../site'

export function AppShell() {
  const location = useLocation()

  useScrollPattern()

  useEffect(() => {
    document.title = getDocumentTitle(location.pathname)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <TopNav />

      <GlossaryDrawerProvider key={location.pathname}>
        <main className="app-shell__main">
          <Outlet />
        </main>
      </GlossaryDrawerProvider>
    </div>
  )
}
