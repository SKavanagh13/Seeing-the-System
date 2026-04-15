import glossarySource from '../../content/glossary.json'

type GlossarySourceEntry = {
  term: string
  definition: string
  stewardInsights: string[]
}

export type GlossaryEntry = {
  key: string
  term: string
  definition: string
  stewardInsights: string[]
  slug: string
  letter: string
}

const glossaryRecord = glossarySource as Record<string, GlossarySourceEntry>

const glossaryEntries = Object.entries(glossaryRecord)
  .map(([key, entry]) => ({
    key,
    term: entry.term,
    definition: entry.definition,
    stewardInsights: entry.stewardInsights,
    slug: createSlug(entry.term),
    letter: entry.term.charAt(0).toUpperCase(),
  }))
  .sort((left, right) => left.term.localeCompare(right.term))

const glossaryEntryMap = new Map(
  glossaryEntries.map((entry) => [entry.key, entry] as const),
)

export function getGlossaryEntries() {
  return glossaryEntries
}

export function getGlossaryEntry(termKey: string) {
  return glossaryEntryMap.get(termKey) ?? null
}

function createSlug(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
