import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { GlossaryDrawer } from '../components/GlossaryDrawer'
import { getGlossaryEntry } from './glossary'
import { GlossaryDrawerContext } from './glossaryDrawerContext'

type GlossaryDrawerProviderProps = {
  children: ReactNode
}

export function GlossaryDrawerProvider({
  children,
}: GlossaryDrawerProviderProps) {
  const [activeTermKey, setActiveTermKey] = useState<string | null>(null)
  const triggerElementRef = useRef<HTMLElement | null>(null)
  const activeTerm = activeTermKey ? getGlossaryEntry(activeTermKey) : null

  const closeDrawer = (options?: { restoreFocus?: boolean }) => {
    const shouldRestoreFocus = options?.restoreFocus ?? true
    const triggerElement = triggerElementRef.current

    setActiveTermKey(null)

    if (shouldRestoreFocus) {
      triggerElement?.focus()
    }
  }

  useEffect(() => {
    if (!activeTerm) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeTerm])

  return (
    <GlossaryDrawerContext.Provider
      value={{
        openTerm: (termKey, triggerElement) => {
          if (getGlossaryEntry(termKey)) {
            triggerElementRef.current =
              triggerElement ?? (document.activeElement as HTMLElement | null)
            setActiveTermKey(termKey)
          }
        },
        closeDrawer,
      }}
    >
      {children}
      <GlossaryDrawer term={activeTerm} onClose={closeDrawer} />
    </GlossaryDrawerContext.Provider>
  )
}
