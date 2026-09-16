import { NavLink } from 'react-router-dom'

import { getGlossaryEntries, type GlossaryEntry } from '../lib/glossary'

const glossaryEntries = getGlossaryEntries()
const letterGroups = buildLetterGroups(glossaryEntries)

export function GlossaryPage() {
  return (
    <section className="page glossary-page">
      <div className="glossary-page__header">
        <h1 className="glossary-page__title">A working vocabulary for the system.</h1>
        <p className="glossary-page__description">
          Public finance has a language of its own. This glossary keeps key
          terms close at hand so the story can stay readable without flattening
          the ideas that matter.
        </p>
      </div>

      <div className="glossary-page__index-band">
        <span className="glossary-page__index-kicker">Jump to</span>
        <nav className="glossary-page__index" aria-label="Glossary letters">
          {letterGroups.map(({ letter }) => (
            <a
              key={letter}
              href={`#glossary-letter-${letter}`}
              className="glossary-page__index-link"
            >
              {letter}
            </a>
          ))}
        </nav>
        <span className="glossary-page__index-count">
          {glossaryEntries.length} terms
        </span>
      </div>

      <div className="glossary-page__entries">
        {letterGroups.map(({ letter, entries }) => (
          <div key={letter} className="glossary-letter-group">
            <div
              id={`glossary-letter-${letter}`}
              className="glossary-letter-heading"
            >
              <span className="glossary-letter-heading__glyph">{letter}</span>
              <span className="glossary-letter-heading__rule" aria-hidden="true" />
            </div>

            {entries.map((entry) => (
              <article
                key={entry.key}
                id={entry.slug}
                className="glossary-entry"
                aria-labelledby={`glossary-entry-title-${entry.key}`}
              >
                <h2
                  id={`glossary-entry-title-${entry.key}`}
                  className="glossary-entry__title"
                >
                  {entry.term}
                </h2>

                <p className="glossary-entry__definition">{entry.definition}</p>

                {entry.stewardInsights.length > 0 && (
                  <div className="glossary-entry__insights">
                    <p className="glossary-entry__insights-label">
                      {'The savvy steward\u2019s insights\u2026'}
                    </p>
                    <ul className="glossary-entry__insight-list">
                      {entry.stewardInsights.map((insight) => (
                        <li key={insight}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        ))}
      </div>

      <footer className="glossary-page__footer">
        <NavLink to="/toolkit" className="glossary-page__footer-card">
          <span className="glossary-page__footer-card-title">Critical Questions</span>
          <span className="glossary-page__footer-card-description">
            Organized by clock. Ready to ask.
          </span>
        </NavLink>
      </footer>
    </section>
  )
}

type LetterGroup = {
  letter: string
  entries: GlossaryEntry[]
}

function buildLetterGroups(entries: GlossaryEntry[]): LetterGroup[] {
  const groups: LetterGroup[] = []

  for (const entry of entries) {
    const last = groups[groups.length - 1]
    if (last && last.letter === entry.letter) {
      last.entries.push(entry)
    } else {
      groups.push({ letter: entry.letter, entries: [entry] })
    }
  }

  return groups
}
