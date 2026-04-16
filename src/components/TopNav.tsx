import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { ClockNav } from './ClockNav'

const utilityLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/toolkit', label: 'Toolkit' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/epilogue', label: 'Epilogue' },
]

const compressedScrollOffset = 24

export function TopNav() {
  const [compressed, setCompressed] = useState(false)

  useEffect(() => {
    const updateCompressed = () => {
      setCompressed(window.scrollY > compressedScrollOffset)
    }

    updateCompressed()
    window.addEventListener('scroll', updateCompressed, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateCompressed)
    }
  }, [])

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
          <ClockNav compressed={compressed} />
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
