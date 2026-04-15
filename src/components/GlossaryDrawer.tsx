import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import type { GlossaryEntry } from '../lib/glossary'

type GlossaryDrawerProps = {
  term: GlossaryEntry | null
  onClose: (options?: { restoreFocus?: boolean }) => void
}

export function GlossaryDrawer({ term, onClose }: GlossaryDrawerProps) {
  const isOpen = term !== null
  const panelRef = useRef<HTMLElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const panelElement = panelRef.current
    if (!panelElement) {
      return
    }

    if (isOpen) {
      panelElement.removeAttribute('inert')
      closeButtonRef.current?.focus()
      return
    }

    panelElement.setAttribute('inert', '')
  }, [isOpen])

  return (
    <div
      className={`glossary-drawer${isOpen ? ' is-open' : ''}`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="glossary-drawer__backdrop"
        tabIndex={-1}
        aria-label="Close glossary drawer"
        onClick={() => onClose()}
      />

      <section
        ref={panelRef}
        className="glossary-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={term ? `glossary-drawer-title-${term.key}` : undefined}
        tabIndex={-1}
      >
        {term ? (
          <>
            <div className="glossary-drawer__header">
              <p className="glossary-drawer__eyebrow">Glossary term</p>
              <button
                ref={closeButtonRef}
                type="button"
                className="glossary-drawer__close"
                aria-label={`Close glossary entry for ${term.term}`}
                onClick={() => onClose()}
              >
                Close
              </button>
            </div>

            <h2
              id={`glossary-drawer-title-${term.key}`}
              className="glossary-drawer__title"
            >
              {term.term}
            </h2>

            <p className="glossary-drawer__definition">{term.definition}</p>

            {term.stewardInsights.length > 0 ? (
              <div className="glossary-drawer__insights">
                <p className="glossary-drawer__insights-label">
                  Steward insights
                </p>
                <ul className="glossary-drawer__insight-list">
                  {term.stewardInsights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              to={`/glossary#${term.slug}`}
              className="glossary-drawer__link"
              onClick={() => onClose({ restoreFocus: false })}
            >
              View this term in the master glossary
            </Link>
          </>
        ) : null}
      </section>
    </div>
  )
}
