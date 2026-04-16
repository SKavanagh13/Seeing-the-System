import { Outlet, useLocation } from 'react-router-dom'

import { TopNav } from '../components/TopNav'
import { GlossaryDrawerProvider } from '../lib/glossaryDrawer'
import { useScrollPattern } from '../lib/useScrollPattern'

export function AppShell() {
  const location = useLocation()

  useScrollPattern()

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
