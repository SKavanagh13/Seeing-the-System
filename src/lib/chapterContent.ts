import chapter1Source from '../../content/chapter1.md?raw'
import chapter2Source from '../../content/chapter2.md?raw'
import chapter3Source from '../../content/chapter3.md?raw'
import prologueSource from '../../content/prologue.md?raw'

import { parseContent, type ContentNode } from './contentParser'

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
  nodes: ContentNode[]
  previousChapterId: ChapterId | null
  nextChapterId: ChapterId | null
}

type ChapterSourceDefinition = Omit<ChapterContent, 'title' | 'nodes'>

const chapterSources: Record<ChapterId, ChapterSourceDefinition & { markdown: string }> = {
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
    markdown: chapter1Source,
    previousChapterId: 'prologue',
    nextChapterId: 'trajectory-clock',
  },
  'trajectory-clock': {
    id: 'trajectory-clock',
    route: '/trajectory-clock',
    eyebrow: 'Trajectory Clock',
    markdown: chapter2Source,
    previousChapterId: 'annual-clock',
    nextChapterId: 'generational-clock',
  },
  'generational-clock': {
    id: 'generational-clock',
    route: '/generational-clock',
    eyebrow: 'Generational Clock',
    markdown: chapter3Source,
    previousChapterId: 'trajectory-clock',
    nextChapterId: null,
  },
}

const chapterContentMap = new Map(
  Object.values(chapterSources).map((definition) => {
    const document = parseChapterDocument(definition.markdown)

    return [
      definition.id,
      {
        id: definition.id,
        route: definition.route,
        eyebrow: definition.eyebrow,
        title: document.title,
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

function parseChapterDocument(markdown: string): {
  title: string
  nodes: ContentNode[]
} {
  const normalizedMarkdown = markdown.replace(/\r\n?/g, '\n')
  const lines = normalizedMarkdown.split('\n')
  const firstLine = lines[0]?.trim() ?? ''

  if (!firstLine.startsWith('# ')) {
    throw new Error('Chapter markdown must begin with a top-level heading.')
  }

  return {
    title: firstLine.slice(2).trim(),
    nodes: parseContent(lines.slice(1).join('\n')),
  }
}
