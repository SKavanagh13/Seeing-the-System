import { createContext } from 'react'

export type GlossaryDrawerContextValue = {
  openTerm: (termKey: string, triggerElement?: HTMLElement | null) => void
  closeDrawer: (options?: { restoreFocus?: boolean }) => void
}

export const GlossaryDrawerContext =
  createContext<GlossaryDrawerContextValue | null>(null)
