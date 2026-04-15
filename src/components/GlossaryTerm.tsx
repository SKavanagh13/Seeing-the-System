import type { ReactNode } from 'react'

import { getGlossaryEntry } from '../lib/glossary'
import { useGlossaryDrawer } from '../lib/useGlossaryDrawer'

type GlossaryTermProps = {
  termKey: string
  children?: ReactNode
}

export function GlossaryTerm({ termKey, children }: GlossaryTermProps) {
  const term = getGlossaryEntry(termKey)
  const { openTerm } = useGlossaryDrawer()

  if (!term) {
    return <>{children ?? termKey}</>
  }

  return (
    <button
      type="button"
      className="glossary-term"
      onClick={(event) => openTerm(term.key, event.currentTarget)}
      aria-label={`Open glossary term: ${term.term}`}
    >
      {children ?? term.term}
    </button>
  )
}
