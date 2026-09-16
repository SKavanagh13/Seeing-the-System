import { createContext, useContext } from 'react'

// Tracks glossary term keys already rendered in the current chapter.
// Mutated synchronously during render — first mention renders as a trigger,
// subsequent mentions render as plain text.
export const SeenTermsContext = createContext<Set<string> | null>(null)

export function useSeenTerms(): Set<string> | null {
  return useContext(SeenTermsContext)
}
