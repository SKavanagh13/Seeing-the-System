import type { ReactNode } from 'react'

import { getGlossaryEntry } from '../lib/glossary'
import { useGlossaryDrawer } from '../lib/useGlossaryDrawer'
import { useSeenTerms } from '../lib/seenTerms'

type GlossaryTermProps = {
  termKey: string
  children?: ReactNode
}

export function GlossaryTerm({ termKey, children }: GlossaryTermProps) {
  const term = getGlossaryEntry(termKey)
  const { openTerm } = useGlossaryDrawer()
  const seenTerms = useSeenTerms()

  if (!term) {
    return <>{children ?? termKey}</>
  }

  // First-mention-only: render plain text on second+ occurrence
  if (seenTerms) {
    if (seenTerms.has(termKey)) {
      return <>{children ?? term.term}</>
    }
    seenTerms.add(termKey)
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
