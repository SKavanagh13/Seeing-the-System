import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

import { ClockDial } from '../components/ClockDial'
import { StreetSectionSvg } from '../components/StreetSectionSvg'
import { GlossaryTerm } from '../components/GlossaryTerm'
import { ChapterRenderer } from '../components/chapter/ChapterRenderer'
import { getChapterContent } from '../lib/chapterContent'
import type { ChapterRenderNode } from '../lib/chapterCards'
import {
  parseInlineGlossary,
  type InlineContentNode,
} from '../lib/contentParser'

export function HomePage() {
  const prologue = getChapterContent('prologue')
  const segments = buildHomeSegments(prologue.nodes)

  return (
    <article className="page home-page">
      <div className="home-page__header">
        <p className="home-page__eyebrow">Prologue / Start here</p>
        <h1 className="home-page__title">{prologue.title}</h1>
      </div>

      {renderHomeSegments(segments)}

      <section className="chapter-closing-panel home-page__closing" aria-label="Get started">
        <div className="chapter-closing-panel__header">
          <ClockDial clock="annual" size={40} visited={false} />
          <span className="chapter-closing-panel__label">Clock 01 / The Annual Clock</span>
        </div>
        <p className="chapter-closing-panel__primary">
          Every steward starts with the same question: how is this year going?
        </p>
        <p className="chapter-closing-panel__secondary">
          The Annual Clock is where the work begins — and the foundation for everything that follows.
        </p>
        <NavLink
          to="/annual-clock"
          className="chapter-cta"
          style={{ background: '#1F4E79' }}
        >
          Begin with the Annual Clock &#x2192;
        </NavLink>
      </section>
    </article>
  )
}

type GoalMarkup = {
  lead: string
  body: string
}

type VisualMarkup = {
  caption: string
}

type HomeSegment =
  | { type: 'chapter'; nodes: ChapterRenderNode[] }
  | { type: 'goal'; goal: GoalMarkup }
  | { type: 'visual'; visual: VisualMarkup }

function renderHomeSegments(segments: HomeSegment[]): ReactNode[] {
  const result: ReactNode[] = []
  let i = 0

  while (i < segments.length) {
    const seg = segments[i]

    if (seg.type === 'visual') {
      result.push(
        <StreetSectionIllustration key={`visual-${i}`} />,
      )
      i += 1
      continue
    }

    if (seg.type === 'chapter') {
      result.push(
        <ChapterRenderer key={`chapter-${i}`} nodes={seg.nodes} />,
      )
      i += 1
      continue
    }

    // Collect consecutive goals into a numbered ledger
    const goals: GoalMarkup[] = []
    let j = i
    while (j < segments.length && segments[j].type === 'goal') {
      goals.push((segments[j] as { type: 'goal'; goal: GoalMarkup }).goal)
      j += 1
    }
    result.push(
      <div className="home-page__goal-ledger" key={`goal-ledger-${i}`}>
        {goals.map((goal, idx) => (
          <GoalRow key={`goal-${idx}`} number={idx + 1} lead={goal.lead} body={goal.body} />
        ))}
      </div>,
    )
    i = j
  }

  return result
}

function buildHomeSegments(nodes: ChapterRenderNode[]): HomeSegment[] {
  const segments: HomeSegment[] = []
  let currentNodes: ChapterRenderNode[] = []

  for (const node of nodes) {
    const goal = getGoalMarkup(node)
    if (goal) {
      if (currentNodes.length > 0) {
        segments.push({ type: 'chapter', nodes: currentNodes })
        currentNodes = []
      }
      segments.push({ type: 'goal', goal })
      continue
    }

    const visual = getVisualMarkup(node)
    if (visual) {
      if (currentNodes.length > 0) {
        segments.push({ type: 'chapter', nodes: currentNodes })
        currentNodes = []
      }
      segments.push({ type: 'visual', visual })
      continue
    }

    currentNodes.push(node)
  }

  if (currentNodes.length > 0) {
    segments.push({ type: 'chapter', nodes: currentNodes })
  }

  return segments
}

function getGoalMarkup(node: ChapterRenderNode): GoalMarkup | null {
  if (node.type !== 'paragraph') return null
  const match = node.text.match(/^\[GOAL\]([^|]+)\|(.+)\[\/GOAL\]$/)
  if (!match) return null
  return { lead: match[1].trim(), body: match[2].trim() }
}

function getVisualMarkup(node: ChapterRenderNode): VisualMarkup | null {
  if (node.type !== 'paragraph') return null
  const match = node.text.match(/^\[VISUAL:(.+)\]$/)
  if (!match) return null
  return { caption: match[1].trim() }
}

function GoalRow({
  number,
  lead,
  body,
}: {
  number: number
  lead: string
  body: string
}) {
  const num = String(number).padStart(2, '0')
  return (
    <div className="home-page__goal-row">
      <span className="home-page__goal-number">{num}</span>
      <div className="home-page__goal-content">
        <span className="home-page__goal-lead">
          <InlineContent text={lead} />
        </span>{' '}
        <InlineContent text={body} />
      </div>
    </div>
  )
}

function StreetSectionIllustration() {
  const [narrow, setNarrow] = useState(
    () => window.matchMedia('(max-width: 560px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)')
    const handler = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const viewBox = narrow ? '330 150 180 150' : '0 0 640 300'

  return (
    <figure className="street-section">
      <StreetSectionSvg viewBox={viewBox} />
    </figure>
  )
}

function InlineContent({ text }: { text: string }) {
  const nodes = parseInlineGlossary(text)
  return (
    <>
      {nodes.map((node, index) => (
        <InlineNode key={createInlineKey(node, index)} node={node} />
      ))}
    </>
  )
}

function InlineNode({ node }: { node: InlineContentNode }) {
  if (node.type === 'text') {
    return <Fragment>{node.text}</Fragment>
  }
  return <GlossaryTerm termKey={node.termKey}>{node.displayText}</GlossaryTerm>
}

function createInlineKey(node: InlineContentNode, index: number) {
  if (node.type === 'text') {
    return `text-${index}-${node.text}`
  }
  return `glossary-${index}-${node.termKey}-${node.displayText}`
}
