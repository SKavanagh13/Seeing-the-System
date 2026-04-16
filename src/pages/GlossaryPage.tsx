import { getGlossaryEntries } from '../lib/glossary'

const glossaryEntries = getGlossaryEntries()

export function GlossaryPage() {
  return (
    <section className="page glossary-page">
      <div className="glossary-page__hero">
        <h1 className="page__title">A working vocabulary for the system.</h1>
        <p className="page__description">
          Public finance has a language of its own. This glossary keeps key
          terms close at hand so the story can stay readable without flattening
          the ideas that matter.
        </p>
      </div>

      <nav className="glossary-page__index" aria-label="Glossary letters">
        {Array.from(new Set(glossaryEntries.map((entry) => entry.letter))).map(
          (letter) => (
            <a
              key={letter}
              href={`#glossary-letter-${letter}`}
              className="glossary-page__index-link"
            >
              {letter}
            </a>
          ),
        )}
      </nav>

      <div className="glossary-page__entries">
        {glossaryEntries.map((entry, index) => {
          const showLetter =
            index === 0 || glossaryEntries[index - 1]?.letter !== entry.letter

          return (
            <article
              key={entry.key}
              id={entry.slug}
              className="glossary-entry"
              aria-labelledby={`glossary-entry-title-${entry.key}`}
            >
              <div className="glossary-entry__header">
                <div>
                  {showLetter ? (
                    <p
                      id={`glossary-letter-${entry.letter}`}
                      className="glossary-entry__letter"
                    >
                      {entry.letter}
                    </p>
                  ) : null}
                  <h2
                    id={`glossary-entry-title-${entry.key}`}
                    className="glossary-entry__title"
                  >
                    {entry.term}
                  </h2>
                </div>
              </div>

              <p className="glossary-entry__definition">{entry.definition}</p>

              {entry.stewardInsights.length > 0 ? (
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
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
