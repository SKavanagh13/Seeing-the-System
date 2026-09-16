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
  const scrollBodyRef = useRef<HTMLDivElement | null>(null)

  // Manage inert, focus-on-open, and scroll reset
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    if (isOpen) {
      panel.removeAttribute('inert')
      // Focus close button after DOM commit
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus()
      })
      // Reset scroll region to top on each open
      if (scrollBodyRef.current) {
        scrollBodyRef.current.scrollTop = 0
      }
    } else {
      panel.setAttribute('inert', '')
    }
  }, [isOpen, term])

  // Focus trap: Tab / Shift-Tab cycle within panel
  useEffect(() => {
    if (!isOpen) return
    const panel = panelRef.current
    if (!panel) return

    const getFocusable = (): HTMLElement[] =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, a[href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    panel.addEventListener('keydown', handleKeyDown)
    return () => panel.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div
      className={`glossary-drawer${isOpen ? ' is-open' : ''}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="glossary-drawer__backdrop"
        tabIndex={-1}
        aria-label="Close glossary drawer"
        onClick={() => onClose()}
      />

      {/* Panel */}
      <section
        ref={panelRef}
        className="glossary-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={term ? `glossary-drawer-title-${term.key}` : undefined}
        tabIndex={-1}
      >
        {/* Header — fixed */}
        <div className="glossary-drawer__header">
          <p className="glossary-drawer__header-kicker">Glossary</p>
          <button
            ref={closeButtonRef}
            type="button"
            className="glossary-drawer__close"
            aria-label={term ? `Close glossary entry for ${term.term}` : 'Close glossary'}
            onClick={() => onClose()}
          >
            Close <span aria-hidden="true">&times;</span>
          </button>
        </div>

        {/* Scroll body */}
        <div ref={scrollBodyRef} className="glossary-drawer__body">
          {term ? (
            <>
              <h2
                id={`glossary-drawer-title-${term.key}`}
                className="glossary-drawer__title"
              >
                {term.term}
              </h2>
              <span className="glossary-drawer__title-rule" aria-hidden="true" />

              <p className="glossary-drawer__definition">{term.definition}</p>

              {term.stewardInsights.length > 0 ? (
                <div className="glossary-drawer__insights">
                  <p className="glossary-drawer__insights-label">
                    {'The savvy steward\u2019s insights\u2026'}
                  </p>
                  <ul className="glossary-drawer__insight-list">
                    {term.stewardInsights.map((insight) => (
                      <li key={insight}>{insight}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        {/* Footer — fixed */}
        <div className="glossary-drawer__footer">
          {term ? (
            <Link
              to={`/glossary#${term.slug}`}
              className="glossary-drawer__link"
              onClick={() => onClose({ restoreFocus: false })}
            >
              View in full glossary &rarr;
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  )
}
