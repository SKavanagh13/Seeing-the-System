import { NavLink } from 'react-router-dom'

import type { ClockVisitedState } from '../lib/clockState'
import { ClockNav } from './ClockNav'

const utilityLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/toolkit', label: 'Toolkit' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/epilogue', label: 'Epilogue' },
]

type TopNavProps = {
  visitedState: ClockVisitedState
}

export function TopNav({ visitedState }: TopNavProps) {
  return (
    <header className="top-nav">
      <div className="top-nav__bar">
        <NavLink to="/" end className="top-nav__title">
          Seeing the System
        </NavLink>

        <nav className="top-nav__links" aria-label="Primary">
          {utilityLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `top-nav__link${isActive ? ' is-active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <ClockNav visitedState={visitedState} />
    </header>
  )
}
