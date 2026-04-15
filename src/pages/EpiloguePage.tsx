import epilogueSource from '../../content/epilogue.md?raw'

import { NavLink } from 'react-router-dom'

import { ChapterRenderer } from '../components/chapter/ChapterRenderer'
import { parseContent, type ContentNode } from '../lib/contentParser'

const stewardshipParagraph =
  'That is stewardship. Not expertise. Not perfect answers. The habit of asking the right questions, on all three clocks, for as long as you serve.'

const firstClosingParagraph =
  'The clocks were running before you arrived. They will keep running after you leave.'

const epilogueDocument = createEpilogueDocument(epilogueSource)
const stewardshipIndex = findParagraphIndex(
  epilogueDocument.nodes,
  stewardshipParagraph,
)
const closingStartIndex = findParagraphIndex(
  epilogueDocument.nodes,
  firstClosingParagraph,
)

if (stewardshipIndex === -1 || closingStartIndex === -1) {
  throw new Error('The epilogue content is missing a required closing paragraph.')
}

const introNodes = epilogueDocument.nodes.slice(0, stewardshipIndex)
const reflectionNodes = epilogueDocument.nodes.slice(
  stewardshipIndex + 1,
  closingStartIndex,
)
const stewardshipNode = epilogueDocument.nodes[stewardshipIndex]
const closingNodes = epilogueDocument.nodes.slice(closingStartIndex)

export function EpiloguePage() {
  return (
    <section className="page epilogue-page">
      <header className="epilogue-page__hero">
        <p className="page__eyebrow">Epilogue</p>
        <h1 className="page__title epilogue-page__title">
          {epilogueDocument.title}
        </h1>
      </header>

      <div className="epilogue-page__content">
        <ChapterRenderer nodes={introNodes} />

        <section className="epilogue-page__stewardship">
          <ChapterRenderer nodes={[stewardshipNode]} />
        </section>

        <ChapterRenderer nodes={reflectionNodes} />

        <section className="epilogue-page__closing" aria-label="Closing reflection">
          <ChapterRenderer nodes={closingNodes} />

          <div className="epilogue-page__clocks" aria-hidden="true">
            <span
              className="epilogue-page__clock epilogue-page__clock--annual"
            />
            <span
              className="epilogue-page__clock epilogue-page__clock--trajectory"
            />
            <span
              className="epilogue-page__clock epilogue-page__clock--generational"
            />
          </div>
        </section>

        <nav className="epilogue-page__links" aria-label="Related links">
          <NavLink to="/toolkit" className="epilogue-page__text-link">
            Return to the toolkit
          </NavLink>
          <NavLink to="/glossary" className="epilogue-page__text-link">
            Browse the glossary
          </NavLink>
        </nav>
      </div>
    </section>
  )
}

function createEpilogueDocument(markdown: string): {
  title: string
  nodes: ContentNode[]
} {
  const normalizedMarkdown = markdown.replace(/\r\n?/g, '\n')
  const lines = normalizedMarkdown.split('\n')
  const firstLine = lines[0]?.trim() ?? ''

  if (!firstLine.startsWith('# ')) {
    throw new Error('Epilogue markdown must begin with a top-level heading.')
  }

  return {
    title: firstLine.slice(2).trim(),
    nodes: parseContent(lines.slice(1).join('\n')),
  }
}

function findParagraphIndex(nodes: ContentNode[], text: string) {
  return nodes.findIndex(
    (node) => node.type === 'paragraph' && node.text === text,
  )
}
