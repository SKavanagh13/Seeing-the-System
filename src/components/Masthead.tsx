// Broadsheet masthead — replaces TopNav + ClockNav.
// Five-stop journey nav with visited state coloring and utility links.

import { NavLink, useLocation } from 'react-router-dom'

import { ClockDial, type ClockKey } from './ClockDial'
import { JourneyIcon } from './JourneyIcon'
import { siteSubtitle, siteTitle } from '../site'
import type { StopKey } from '../lib/visitedChapters'

type StopType = 'prologue' | 'clock' | 'epilogue'

type Stop = {
  key: StopKey
  label: string
  to: string
  width: number
  type: StopType
  clock?: ClockKey
}

const STOPS: Stop[] = [
  { key: 'prologue',    label: 'Prologue',    to: '/',                  width: 62, type: 'prologue' },
  { key: 'annual',      label: 'Annual',      to: '/annual-clock',      width: 76, type: 'clock', clock: 'annual' },
  { key: 'trajectory',  label: 'Trajectory',  to: '/trajectory-clock',  width: 76, type: 'clock', clock: 'trajectory' },
  { key: 'generational',label: 'Generational',to: '/generational-clock', width: 84, type: 'clock', clock: 'generational' },
  { key: 'epilogue',    label: 'Epilogue',    to: '/epilogue',          width: 62, type: 'epilogue' },
]

const ROUTE_TO_STOP: Partial<Record<string, StopKey>> = {
  '/':                  'prologue',
  '/annual-clock':      'annual',
  '/trajectory-clock':  'trajectory',
  '/generational-clock':'generational',
  '/epilogue':          'epilogue',
}

// Fill color for each stop when active or visited.
// Prologue/Epilogue use navy. Clocks use their own colors.
const STOP_FILL: Record<StopKey, string> = {
  prologue:     '#1F4E79',
  annual:       '#1F4E79',
  trajectory:   '#C97D1A',
  generational: '#0D6B5E',
  epilogue:     '#1F4E79',
}

const UTILITY_PAGES = new Set(['/glossary', '/toolkit'])

type MastheadProps = {
  visited: Set<StopKey>
}

export function Masthead({ visited }: MastheadProps) {
  const { pathname } = useLocation()
  const currentStop = ROUTE_TO_STOP[pathname]
  const isUtilityPage = UTILITY_PAGES.has(pathname)

  function isStopFilled(stop: Stop): boolean {
    return visited.has(stop.key) || stop.key === currentStop
  }

  function ruleColor(stop: Stop): string {
    // Utility pages: all rules gray (standing legend, not progress claim)
    if (isUtilityPage) return '#E3DFD4'
    return isStopFilled(stop) ? STOP_FILL[stop.key] : '#E3DFD4'
  }

  function labelColor(stop: Stop): string {
    // Prologue/Epilogue labels are always masthead-muted
    if (stop.type !== 'clock') return '#6B6A64'
    // On utility pages: no colored label
    if (isUtilityPage) return '#8C8A82'
    return isStopFilled(stop) ? STOP_FILL[stop.key] : '#8C8A82'
  }

  function iconColor(stop: Stop): string {
    // For journey icons (Prologue/Epilogue): navy when visited, muted gray when not
    return isStopFilled(stop) ? '#1F4E79' : '#6B6A64'
  }

  function dialVisited(stop: Stop): boolean {
    // On utility pages: all clock dials show colored (standing legend)
    if (isUtilityPage) return true
    return isStopFilled(stop)
  }

  return (
    <header className="masthead">
      <div className="masthead__inner">

        {/* Wordmark */}
        <div className="masthead__wordmark">
          <NavLink to="/" className="masthead__title">
            {siteTitle}
          </NavLink>
          <p className="masthead__subtitle">{siteSubtitle}</p>
        </div>

        {/* Journey nav */}
        <nav className="masthead__journey" aria-label="Journey progress">
          {STOPS.map((stop) => (
            <NavLink
              key={stop.key}
              to={stop.to}
              end={stop.to === '/'}
              className="masthead__stop"
              style={{ width: stop.width }}
              aria-current={stop.key === currentStop ? 'page' : undefined}
            >
              <span className="masthead__stop-icon">
                {stop.type === 'clock' ? (
                  <ClockDial
                    clock={stop.clock!}
                    size={38}
                    visited={dialVisited(stop)}
                  />
                ) : (
                  <JourneyIcon
                    type={stop.type}
                    color={iconColor(stop)}
                    size={30}
                  />
                )}
              </span>
              <span
                className="masthead__rule"
                aria-hidden="true"
                style={{ background: ruleColor(stop) }}
              />
              <span
                className="masthead__label"
                style={{ color: labelColor(stop) }}
              >
                {stop.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Utilities */}
        <nav className="masthead__utilities" aria-label="Reference">
          <NavLink
            to="/toolkit"
            className={({ isActive }) =>
              isActive ? 'masthead__utility masthead__utility--active' : 'masthead__utility'
            }
          >
            Questions
          </NavLink>
          <NavLink
            to="/glossary"
            className={({ isActive }) =>
              isActive ? 'masthead__utility masthead__utility--active' : 'masthead__utility'
            }
          >
            Glossary
          </NavLink>
        </nav>

      </div>
    </header>
  )
}
