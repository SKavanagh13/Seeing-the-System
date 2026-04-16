import { BookOpen, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { ClockNav } from './ClockNav'
import { siteSubtitle, siteTitle } from '../site'

const utilityLinks = [
  {
    to: '/toolkit',
    label: 'Critical Questions',
    shortLabel: 'Critical Questions',
    title: 'Critical Questions',
    icon: Search,
  },
  {
    to: '/glossary',
    label: 'Glossary',
    shortLabel: 'Glossary',
    title: 'Glossary',
    icon: BookOpen,
  },
] as const

export function TopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav__bar">
        <div className="top-nav__branding">
          <NavLink to="/" end className="top-nav__title">
            {siteTitle}
          </NavLink>
          <p className="top-nav__subtitle">{siteSubtitle}</p>
        </div>

        <div className="top-nav__center">
          <ClockNav />
        </div>

        <nav className="top-nav__utilities" aria-label="Utility">
          {utilityLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="top-nav__utility-link"
              aria-label={link.label}
              title={link.title}
            >
              <span className="top-nav__utility-item">
                <link.icon
                  className="top-nav__utility-icon"
                  aria-hidden="true"
                  size={24}
                  strokeWidth={1.75}
                />
                <span className="top-nav__utility-label">{link.shortLabel}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
