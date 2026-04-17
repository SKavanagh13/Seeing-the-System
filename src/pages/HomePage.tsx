import { Fragment, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

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
  const contentSegments = buildContentSegments(prologue.nodes)

  return (
    <section className="page home-page">
      <header className="chapter-page__hero">
        <h1 className="page__title chapter-page__title">{prologue.title}</h1>
      </header>

      {renderContentSegments(contentSegments)}

      <div className="home-page__primary-cta-wrap">
        <NavLink to="/annual-clock" className="home-page__primary-cta">
          Begin with the Annual Clock {'\u2192'}
        </NavLink>
      </div>
    </section>
  )
}

function GoalBlock({ lead, body }: GoalMarkup) {
  return (
    <p className="chapter-paragraph home-page__goal-block">
      <span className="home-page__goal-lead">
        <InlineContent text={lead} />
      </span>{' '}
      <InlineContent text={body} />
    </p>
  )
}

type GoalMarkup = {
  lead: string
  body: string
}

type ContentSegment =
  | { type: 'chapter'; nodes: ChapterRenderNode[] }
  | { type: 'goal'; goal: GoalMarkup }

function renderContentSegments(segments: ContentSegment[]) {
  const renderedSegments: ReactNode[] = []
  let index = 0

  while (index < segments.length) {
    const segment = segments[index]

    if (segment.type === 'chapter') {
      renderedSegments.push(
        <ChapterRenderer key={`chapter-${index}`} nodes={segment.nodes} />,
      )
      index += 1
      continue
    }

    const goals: GoalMarkup[] = []
    let goalIndex = index

    while (goalIndex < segments.length) {
      const goalSegment = segments[goalIndex]

      if (goalSegment.type !== 'goal') {
        break
      }

      goals.push(goalSegment.goal)
      goalIndex += 1
    }

    renderedSegments.push(
      <div className="home-page__goal-group" key={`goal-group-${index}`}>
        {goals.map((goal, groupIndex) => (
          <GoalBlock
            key={`goal-${goal.lead}-${index + groupIndex}`}
            lead={goal.lead}
            body={goal.body}
          />
        ))}
      </div>,
    )

    index = goalIndex
  }

  return renderedSegments
}

function buildContentSegments(nodes: ChapterRenderNode[]): ContentSegment[] {
  const segments: ContentSegment[] = []
  let currentNodes: ChapterRenderNode[] = []

  for (const node of nodes) {
    const goal = getGoalMarkup(node)

    if (!goal) {
      currentNodes.push(node)
      continue
    }

    if (currentNodes.length > 0) {
      segments.push({ type: 'chapter', nodes: currentNodes })
      currentNodes = []
    }

    segments.push({ type: 'goal', goal })
  }

  if (currentNodes.length > 0) {
    segments.push({ type: 'chapter', nodes: currentNodes })
  }

  return segments
}

function getGoalMarkup(node: ChapterRenderNode): GoalMarkup | null {
  if (node.type !== 'paragraph') {
    return null
  }

  const match = node.text.match(/^\[GOAL\]([^|]+)\|(.+)\[\/GOAL\]$/)

  if (!match) {
    return null
  }

  return {
    lead: match[1].trim(),
    body: match[2].trim(),
  }
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
