import { useContext } from 'react'

import { GlossaryDrawerContext } from './glossaryDrawerContext'

export function useGlossaryDrawer() {
  const context = useContext(GlossaryDrawerContext)

  if (!context) {
    throw new Error('useGlossaryDrawer must be used within GlossaryDrawerProvider')
  }

  return context
}
