import chapter1Source from '../../content/chapter1.md?raw'
import chapter2Source from '../../content/chapter2.md?raw'
import chapter3Source from '../../content/chapter3.md?raw'
import prologueSource from '../../content/prologue.md?raw'

import { parseContent } from './contentParser'
import {
  transformChapterNodes,
  type ChapterRenderNode,
} from './chapterCards'
import type { ClockKey } from '../components/ClockDial'

export type ChapterId =
  | 'prologue'
  | 'annual-clock'
  | 'trajectory-clock'
  | 'generational-clock'

export type ChapterClosingMetadata = {
  clockKey: ClockKey
  clockLabel: string
  primaryLine: string
  secondaryLine: string
  ctaLabel: string
  ctaTo: string
  ctaColor: string
  ctaHoverColor: string
}

export type ChapterContent = {
  id: ChapterId
  route: string
  eyebrow: string
  title: string
  clockNumber?: string
  closing?: ChapterClosingMetadata
  nodes: ChapterRenderNode[]
  previousChapterId: ChapterId | null
  nextChapterId: ChapterId | null
}

type ChapterSourceDefinition = Omit<ChapterContent, 'title' | 'nodes'> & {
  pageTitle?: string
  clockNumber?: string
  closing?: ChapterClosingMetadata
}

const chapterSources: Record<
  ChapterId,
  ChapterSourceDefinition & { markdown: string }
> = {
  prologue: {
    id: 'prologue',
    route: '/',
    eyebrow: 'Prologue',
    markdown: prologueSource,
    previousChapterId: null,
    nextChapterId: 'annual-clock',
  },
  'annual-clock': {
    id: 'annual-clock',
    route: '/annual-clock',
    eyebrow: 'Annual Clock',
    pageTitle: 'The Annual Clock',
    clockNumber: '01',
    markdown: chapter1Source,
    previousChapterId: 'prologue',
    nextChapterId: 'trajectory-clock',
    closing: {
      clockKey: 'annual',
      clockLabel: 'The annual clock',
      primaryLine: 'You leave this chapter genuinely equipped for the annual clock — you know what \u201cbalanced\u201d really means, what questions to ask before and during the year, and how annual choices begin to shape long-term outcomes.',
      secondaryLine: 'But the annual budget is a one-year picture. A government could answer both questions well in any given year and still be drifting toward trouble \u2014 because some forces only become visible across years and decades.',
      ctaLabel: 'Continue to the Trajectory Clock \u2192',
      ctaTo: '/trajectory-clock',
      ctaColor: '#C97D1A',
      ctaHoverColor: '#A8650F',
    },
  },
  'trajectory-clock': {
    id: 'trajectory-clock',
    route: '/trajectory-clock',
    eyebrow: 'Trajectory Clock',
    clockNumber: '02',
    markdown: chapter2Source,
    previousChapterId: 'annual-clock',
    nextChapterId: 'generational-clock',
    closing: {
      clockKey: 'trajectory',
      clockLabel: 'The trajectory clock',
      primaryLine: 'You\u2019ve learned to read the trajectory clock \u2014 how to check your accumulated position, whether your government is honoring its own commitments, and where current decisions are leading.',
      secondaryLine: 'But both the annual and trajectory clocks measure your government\u2019s health during your time in office. The next clock asks a harder question: what are you choosing to hand forward to the people who aren\u2019t at the table yet?',
      ctaLabel: 'Continue to the Generational Clock \u2192',
      ctaTo: '/generational-clock',
      ctaColor: '#0D6B5E',
      ctaHoverColor: '#0A574C',
    },
  },
  'generational-clock': {
    id: 'generational-clock',
    route: '/generational-clock',
    eyebrow: 'Generational Clock',
    clockNumber: '03',
    markdown: chapter3Source,
    previousChapterId: 'trajectory-clock',
    nextChapterId: null,
  },
}

const chapterContentMap = new Map(
  Object.values(chapterSources).map((definition) => {
    const document = parseChapterDocument(definition.id, definition.markdown)

    return [
      definition.id,
      {
        id: definition.id,
        route: definition.route,
        eyebrow: definition.eyebrow,
        title: definition.pageTitle ?? document.title,
        clockNumber: definition.clockNumber,
        closing: definition.closing,
        nodes: document.nodes,
        previousChapterId: definition.previousChapterId,
        nextChapterId: definition.nextChapterId,
      } satisfies ChapterContent,
    ] as const
  }),
)

export function getChapterContent(chapterId: ChapterId) {
  const chapter = chapterContentMap.get(chapterId)

  if (!chapter) {
    throw new Error(`Unknown chapter "${chapterId}".`)
  }

  return chapter
}

function parseChapterDocument(chapterId: ChapterId, markdown: string): {
  title: string
  nodes: ChapterRenderNode[]
} {
  const normalizedMarkdown = markdown.replace(/\r\n?/g, '\n')
  const lines = normalizedMarkdown.split('\n')
  const firstLine = lines[0]?.trim() ?? ''

  if (!firstLine.startsWith('# ')) {
    throw new Error('Chapter markdown must begin with a top-level heading.')
  }

  return {
    title: firstLine.slice(2).trim(),
    nodes: transformChapterNodes(chapterId, parseContent(lines.slice(1).join('\n'))),
  }
}
