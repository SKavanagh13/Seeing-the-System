import type { CSSProperties, ReactNode } from 'react'

import { cardTypeConfig, type CardType } from '../../lib/chapterCards'

type CardProps = {
  type: CardType
  title: string
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
}

export function Card({ type, title, children, isOpen, onToggle }: CardProps) {
  return (
    <section
      className={`chapter-card chapter-card--${type}`}
      style={
        {
          '--card-accent-color': cardTypeConfig[type].accentColor,
        } as CSSProperties
      }
    >
      <button
        type="button"
        className="chapter-card__toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="chapter-card__title">{title}</span>
        <span
          className={`chapter-card__chevron${isOpen ? ' is-open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? <div className="chapter-card__content">{children}</div> : null}
    </section>
  )
}
