import { NavLink } from 'react-router-dom'

import type { ClockKey, ClockVisitedState } from '../lib/clockState'
import { ClockCircle } from './ClockCircle'

type ClockLink = {
  key: ClockKey
  label: string
  to: string
}

const clockLinks: ClockLink[] = [
  {
    key: 'annual',
    label: 'Annual Clock',
    to: '/annual-clock',
  },
  {
    key: 'trajectory',
    label: 'Trajectory Clock',
    to: '/trajectory-clock',
  },
  {
    key: 'generational',
    label: 'Generational Clock',
    to: '/generational-clock',
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
          className="clock-nav__link"
          aria-label={clock.label}
          title={clock.label}
        >
          <ClockCircle
            clockType={clock.key}
            visited={visitedState[clock.key]}
          />
        </NavLink>
      ))}
    </div>
  )
}
