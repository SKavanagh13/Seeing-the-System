import type { CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { getRouteDerivedClockState, type ClockKey } from '../lib/clockState'
import { ClockFace } from './ClockCircle'

type ClockLink = {
  key: ClockKey
  label: 'Annual' | 'Trajectory' | 'Generational'
  to: string
}

const clockLinks: ClockLink[] = [
  {
    key: 'annual',
    label: 'Annual',
    to: '/annual-clock',
  },
  {
    key: 'trajectory',
    label: 'Trajectory',
    to: '/trajectory-clock',
  },
  {
    key: 'generational',
    label: 'Generational',
    to: '/generational-clock',
  },
]

const filledLabelColors: Record<ClockKey, string> = {
  annual: '#1F4E79',
  trajectory: '#C97D1A',
  generational: '#0D6B5E',
}

export function NavClockGroup() {
  const location = useLocation()
  const filledState = getRouteDerivedClockState(location.pathname)

  return (
    <nav className="clock-nav" aria-label="Clock navigation">
      {clockLinks.map((clock) => (
        <NavLink
          key={clock.key}
          to={clock.to}
          className="clock-nav__link"
          aria-label={clock.label}
          title={clock.label}
        >
          <span
            className="clock-nav__item"
            style={
              {
                '--clock-label-color': filledState[clock.key]
                  ? filledLabelColors[clock.key]
                  : '#595956',
              } as CSSProperties
            }
          >
            <ClockFace clockType={clock.key} filled={filledState[clock.key]} size={48} />
            <span className="clock-nav__label">{clock.label}</span>
          </span>
        </NavLink>
      ))}
    </nav>
  )
}

export function ClockNav() {
  return <NavClockGroup />
}
