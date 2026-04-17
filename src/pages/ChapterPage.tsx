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
  const closingStartIndex = getClosingStartIndex(chapter)
  const hasDedicatedClosing = closingStartIndex !== -1
  const contentEndIndex =
    hasDedicatedClosing && chapter.nodes[closingStartIndex - 1]?.type === 'subsectionDivider'
      ? closingStartIndex - 1
      : closingStartIndex
  const contentNodes = hasDedicatedClosing
    ? chapter.nodes.slice(0, contentEndIndex)
    : chapter.nodes
  const closingNodes = hasDedicatedClosing
    ? chapter.nodes.slice(closingStartIndex + 1)
    : []

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
              Continue to the Epilogue {'\u2192'}
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

function getClosingStartIndex(chapter: ReturnType<typeof getChapterContent>) {
  if (chapter.id !== 'generational-clock') return -1
  const headingIndex = chapter.nodes.findLastIndex(
    (node) => node.type === 'heading' && node.text === 'Closing'
  )
  if (headingIndex === -1) return -1
  const paragraphNode = chapter.nodes[headingIndex + 1]
  return paragraphNode?.type === 'paragraph' ? headingIndex : -1
}
