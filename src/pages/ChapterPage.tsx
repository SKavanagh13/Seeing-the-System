import { NavLink } from 'react-router-dom'

import { ChapterRenderer } from '../components/chapter/ChapterRenderer'
import {
  getChapterContent,
  type ChapterId,
} from '../lib/chapterContent'

type ChapterPageProps = {
  chapterId: Exclude<ChapterId, 'prologue'>
}

export function ChapterPage({ chapterId }: ChapterPageProps) {
  const chapter = getChapterContent(chapterId)
  const previousChapter = chapter.previousChapterId
    ? getChapterContent(chapter.previousChapterId)
    : null
  const nextChapter = chapter.nextChapterId
    ? getChapterContent(chapter.nextChapterId)
    : null
  // Chapter 3's spec-defined closing is authored as the final paragraph node.
  const hasDedicatedClosing =
    chapter.id === 'generational-clock' &&
    chapter.nodes.at(-1)?.type === 'paragraph'
  const contentNodes = hasDedicatedClosing ? chapter.nodes.slice(0, -1) : chapter.nodes
  const closingNodes = hasDedicatedClosing ? chapter.nodes.slice(-1) : []

  return (
    <section className={`page chapter-page chapter-page--${chapter.id}`}>
      <header className="chapter-page__hero">
        <h1 className="page__title chapter-page__title">{chapter.title}</h1>
      </header>

      <div className="chapter-page__content">
        <ChapterRenderer nodes={contentNodes} />
      </div>

      {hasDedicatedClosing ? (
        <section className="chapter-page__closing" aria-label="Closing">
          <p className="chapter-page__closing-eyebrow">Closing</p>
          <ChapterRenderer nodes={closingNodes} />
          <div className="chapter-page__closing-action">
            <NavLink to="/epilogue" className="home-page__primary-cta">
              Continue to the Epilogue →
            </NavLink>
          </div>
        </section>
      ) : (
        <nav className="chapter-page__footer" aria-label="Chapter navigation">
          {previousChapter ? (
            <NavLink to={previousChapter.route} className="chapter-page__link">
              Back to {previousChapter.eyebrow}
            </NavLink>
          ) : <span />}

          {nextChapter ? (
            <NavLink to={nextChapter.route} className="chapter-page__link">
              Continue to {nextChapter.eyebrow}
            </NavLink>
          ) : null}
        </nav>
      )}
    </section>
  )
}
