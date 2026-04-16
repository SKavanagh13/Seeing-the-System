import { Moon, Sunrise } from 'lucide-react'
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

const navBookends = [
  {
    to: '/',
    label: 'Prologue',
    Icon: Sunrise,
    title: 'Prologue',
  },
  {
    to: '/epilogue',
    label: 'Epilogue',
    Icon: Moon,
    title: 'Epilogue',
  },
] as const

export function NavClockGroup() {
  const location = useLocation()
  const filledState = getRouteDerivedClockState(location.pathname)
  const prologueBookend = navBookends[0]
  const epilogueBookend = navBookends[1]
  const PrologueIcon = prologueBookend.Icon
  const EpilogueIcon = epilogueBookend.Icon

  return (
    <nav className="clock-nav" aria-label="Clock navigation">
      <NavLink
        to={prologueBookend.to}
        end
        className="clock-nav__link clock-nav__link--bookend"
        aria-label={prologueBookend.label}
        title={prologueBookend.title}
      >
        <span className="clock-nav__item">
          <PrologueIcon
            className="clock-nav__icon"
            aria-hidden="true"
            size={28}
            strokeWidth={1.75}
          />
          <span className="clock-nav__label clock-nav__label--muted">
            {prologueBookend.label}
          </span>
        </span>
      </NavLink>

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

      <NavLink
        to={epilogueBookend.to}
        className="clock-nav__link clock-nav__link--bookend"
        aria-label={epilogueBookend.label}
        title={epilogueBookend.title}
      >
        <span className="clock-nav__item">
          <EpilogueIcon
            className="clock-nav__icon"
            aria-hidden="true"
            size={28}
            strokeWidth={1.75}
          />
          <span className="clock-nav__label clock-nav__label--muted">
            {epilogueBookend.label}
          </span>
        </span>
      </NavLink>
    </nav>
  )
}

export function ClockNav() {
  return <NavClockGroup />
}
