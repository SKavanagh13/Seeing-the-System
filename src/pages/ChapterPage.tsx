import { useMemo } from 'react'
import { NavLink } from 'react-router-dom'

import { ClockDial } from '../components/ClockDial'
import { ChapterRenderer } from '../components/chapter/ChapterRenderer'
import {
  getChapterContent,
  type ChapterContent,
  type ChapterClosingMetadata,
} from '../lib/chapterContent'
import type { ChapterId } from '../lib/chapterContent'
import { SeenTermsContext } from '../lib/seenTerms'

type ChapterPageProps = {
  chapterId: Exclude<ChapterId, 'prologue'>
}

export function ChapterPage({ chapterId }: ChapterPageProps) {
  const chapter = getChapterContent(chapterId)
  // Fresh Set per chapter — tracks first-mention-only glossary terms
  const seenTerms = useMemo(() => new Set<string>(), [chapterId])

  // Detect markdown-based closing (Generational only)
  const closingStartIndex = getClosingStartIndex(chapter)
  const hasDedicatedClosing = closingStartIndex !== -1
  const contentEndIndex =
    hasDedicatedClosing && chapter.nodes[closingStartIndex - 1]?.type === 'subsectionDivider'
      ? closingStartIndex - 1
      : closingStartIndex
  const allContentNodes = hasDedicatedClosing
    ? chapter.nodes.slice(0, contentEndIndex)
    : chapter.nodes
  const closingNodes = hasDedicatedClosing
    ? chapter.nodes.slice(closingStartIndex + 1)
    : []

  // Split intro (before first keyQuestionSection) from body
  const firstKQIndex = allContentNodes.findIndex((n) => n.type === 'keyQuestionSection')
  const introNodes = firstKQIndex >= 0 ? allContentNodes.slice(0, firstKQIndex) : []
  const bodyNodes = firstKQIndex >= 0 ? allContentNodes.slice(firstKQIndex) : allContentNodes

  return (
    <SeenTermsContext.Provider value={seenTerms}>
    <article className={`page chapter-page chapter-page--${chapterId}`}>
      <div className="chapter-page__header">
        {chapter.clockNumber && (
          <p className="chapter-eyebrow">
            Clock {chapter.clockNumber} / {chapter.eyebrow}
          </p>
        )}
        <h1 className="chapter-page__title">{chapter.title}</h1>
      </div>

      {introNodes.length > 0 && (
        <div className="chapter-page__intro">
          <ChapterRenderer nodes={introNodes} />
        </div>
      )}

      <div className="chapter-page__body">
        <ChapterRenderer nodes={bodyNodes} />
      </div>

      {/* Annual / Trajectory: structured closing panel */}
      {chapter.closing && (
        <StructuredClosingPanel closing={chapter.closing} />
      )}

      {/* Generational: prose closing panel */}
      {hasDedicatedClosing && (
        <section className="chapter-closing-panel" aria-label="Closing">
          <ChapterRenderer nodes={closingNodes} />
          <NavLink
            to="/epilogue"
            className="chapter-cta"
            style={{ background: '#1F4E79' }}
          >
            Continue to the Epilogue &#x2192;
          </NavLink>
        </section>
      )}
    </article>
    </SeenTermsContext.Provider>
  )
}

function StructuredClosingPanel({ closing }: { closing: ChapterClosingMetadata }) {
  return (
    <section className="chapter-closing-panel" aria-label="Closing">
      <div className="chapter-closing-panel__header">
        <ClockDial clock={closing.clockKey} size={40} visited={true} />
        <span className="chapter-closing-panel__label">{closing.clockLabel}</span>
      </div>
      <p className="chapter-closing-panel__primary">{closing.primaryLine}</p>
      <p className="chapter-closing-panel__secondary">{closing.secondaryLine}</p>
      <NavLink
        to={closing.ctaTo}
        className="chapter-cta"
        style={{ background: closing.ctaColor }}
      >
        {closing.ctaLabel}
      </NavLink>
    </section>
  )
}

function getClosingStartIndex(chapter: ChapterContent) {
  if (chapter.id !== 'generational-clock') return -1
  const headingIndex = chapter.nodes.findLastIndex(
    (node) => node.type === 'heading' && node.text === 'Closing',
  )
  if (headingIndex === -1) return -1
  const paragraphNode = chapter.nodes[headingIndex + 1]
  return paragraphNode?.type === 'paragraph' ? headingIndex : -1
}
