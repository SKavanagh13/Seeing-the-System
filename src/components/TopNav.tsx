import { NavLink } from 'react-router-dom'

import { ClockNav } from './ClockNav'

const utilityLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/toolkit', label: 'Toolkit' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/epilogue', label: 'Epilogue' },
]

export function TopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav__bar">
        <NavLink to="/" end className="top-nav__title">
          Seeing the System
        </NavLink>

        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            minWidth: 0,
          }}
        >
          <ClockNav />
        </div>

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
    </header>
  )
}
