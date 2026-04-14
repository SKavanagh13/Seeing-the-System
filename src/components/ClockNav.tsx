import type { CSSProperties } from 'react'
import { NavLink } from 'react-router-dom'

import type { ClockKey, ClockVisitedState } from '../lib/clockState'

type ClockLink = {
  key: ClockKey
  label: string
  shortLabel: string
  to: string
  colorVar: string
}

const clockLinks: ClockLink[] = [
  {
    key: 'annual',
    label: 'Annual Clock',
    shortLabel: 'A',
    to: '/annual-clock',
    colorVar: 'var(--color-annual)',
  },
  {
    key: 'trajectory',
    label: 'Trajectory Clock',
    shortLabel: 'T',
    to: '/trajectory-clock',
    colorVar: 'var(--color-trajectory)',
  },
  {
    key: 'generational',
    label: 'Generational Clock',
    shortLabel: 'G',
    to: '/generational-clock',
    colorVar: 'var(--color-generational)',
  },
]

type ClockNavProps = {
  visitedState: ClockVisitedState
}

export function ClockNav({ visitedState }: ClockNavProps) {
  return (
    <div className="clock-nav" aria-label="Clock navigation">
      {clockLinks.map((clock) => (
        <NavLink
          key={clock.key}
          to={clock.to}
          className={({ isActive }) =>
            `clock-nav__link${isActive ? ' is-active' : ''}`
          }
          aria-label={clock.label}
        >
          <span
            className={`clock-nav__circle${
              visitedState[clock.key] ? ' is-visited' : ''
            }`}
            style={{ '--clock-color': clock.colorVar } as CSSProperties}
            aria-hidden="true"
          >
            {clock.shortLabel}
          </span>
          <span className="clock-nav__text">{clock.label}</span>
        </NavLink>
      ))}
    </div>
  )
}
