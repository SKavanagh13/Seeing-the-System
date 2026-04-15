import { NavLink } from 'react-router-dom'

import { GlossaryTerm } from '../components/GlossaryTerm'

export function HomePage() {
  return (
    <section className="page home-page">
      <p className="page__eyebrow">Home</p>
      <h1 className="page__title">
        The language of public finance should not stay hidden from the reader.
      </h1>

      <div className="home-page__prose">
        <p>
          A budget can appear balanced while deeper forces keep moving beneath
          the surface. Terms like{' '}
          <GlossaryTerm termKey="structural_balance">
            structural balance
          </GlossaryTerm>
          , <GlossaryTerm termKey="fund_balance">fund balance</GlossaryTerm>,
          and{' '}
          <GlossaryTerm termKey="deferred_maintenance">
            deferred maintenance
          </GlossaryTerm>{' '}
          shape whether today&apos;s decisions actually hold over time.
        </p>

        <p>
          The experience is narrative-first, but it should never assume the
          reader already knows the vocabulary. Inline terms open the same
          glossary source that powers the dedicated reference surface, so the
          explanation stays close to the story.
        </p>
      </div>

      <div className="home-page__actions">
        <NavLink to="/glossary" className="home-page__link">
          Browse the full glossary
        </NavLink>
      </div>
    </section>
  )
}
