import chapter1Source from '../../content/chapter1.md?raw'
import chapter2Source from '../../content/chapter2.md?raw'
import chapter3Source from '../../content/chapter3.md?raw'
import prologueSource from '../../content/prologue.md?raw'

import { parseContent } from './contentParser'
import {
  transformChapterNodes,
  type ChapterRenderNode,
} from './chapterCards'

export type ChapterId =
  | 'prologue'
  | 'annual-clock'
  | 'trajectory-clock'
  | 'generational-clock'

export type ChapterContent = {
  id: ChapterId
  route: string
  eyebrow: string
  title: string
  nodes: ChapterRenderNode[]
  previousChapterId: ChapterId | null
  nextChapterId: ChapterId | null
}

type ChapterSourceDefinition = Omit<ChapterContent, 'title' | 'nodes'> & {
  pageTitle?: string
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
    markdown: chapter1Source,
    previousChapterId: 'prologue',
    nextChapterId: 'trajectory-clock',
  },
  'trajectory-clock': {
    id: 'trajectory-clock',
    route: '/trajectory-clock',
    eyebrow: 'Trajectory Clock',
    pageTitle: 'The Trajectory Clock',
    markdown: chapter2Source,
    previousChapterId: 'annual-clock',
    nextChapterId: 'generational-clock',
  },
  'generational-clock': {
    id: 'generational-clock',
    route: '/generational-clock',
    eyebrow: 'Generational Clock',
    pageTitle: 'The Generational Clock',
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
