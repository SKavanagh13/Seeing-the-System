import { NavLink } from 'react-router-dom'

import { ChapterRenderer } from '../components/chapter/ChapterRenderer'
import { getChapterContent } from '../lib/chapterContent'

export function HomePage() {
  const prologue = getChapterContent('prologue')

  return (
    <section className="page home-page">
      <header className="chapter-page__hero">
        <p className="page__eyebrow">{prologue.eyebrow}</p>
        <h1 className="page__title chapter-page__title">{prologue.title}</h1>
      </header>

      <ChapterRenderer nodes={prologue.nodes} />

      <div className="home-page__actions">
        <NavLink to="/annual-clock" className="home-page__link">
          Enter the Annual Clock
        </NavLink>
        <NavLink to="/glossary" className="home-page__link">
          Browse the full glossary
        </NavLink>
      </div>
    </section>
  )
}
