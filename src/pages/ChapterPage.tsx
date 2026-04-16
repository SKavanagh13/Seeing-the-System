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

  return (
    <section className={`page chapter-page chapter-page--${chapter.id}`}>
      <header className="chapter-page__hero">
        <h1 className="page__title chapter-page__title">{chapter.title}</h1>
      </header>

      <ChapterRenderer nodes={chapter.nodes} />

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
    </section>
  )
}
