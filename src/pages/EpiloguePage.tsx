import epilogueSource from '../../content/epilogue.md?raw'

import { NavLink } from 'react-router-dom'

import { ClockDial } from '../components/ClockDial'
import { ChapterRenderer } from '../components/chapter/ChapterRenderer'
import { parseContent, type ContentNode } from '../lib/contentParser'

const stewardshipParagraph =
  'That is stewardship. Not expertise. Not perfect answers. The habit of asking the right questions, on all three clocks, for as long as you serve.'

const firstClosingParagraph =
  'The clocks were running before you arrived. They will keep running after you leave.'

const transitionParagraphs = [
  "You've read the clocks. Now the work begins.",
  'The Critical Questions are what you carry with you throughout your term \u2014 organized by clock, ready for any conversation about your community\'s finances.',
  'The Glossary is there whenever you need to look something up.',
] as const

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
    <article className="page epilogue-page">
      <div className="epilogue-page__header">
        <h1 className="epilogue-page__title">{epilogueDocument.title}</h1>
      </div>

      <div className="epilogue-page__content">
        <ChapterRenderer nodes={introNodes} />

        <div className="epilogue-page__stewardship">
          <ChapterRenderer nodes={[stewardshipNode]} />
        </div>

        <ChapterRenderer nodes={reflectionNodes} />

        <div className="epilogue-page__clocks" aria-hidden="true">
          <ClockDial clock="annual" size={76} visited={true} />
          <ClockDial clock="trajectory" size={76} visited={true} />
          <ClockDial clock="generational" size={76} visited={true} />
        </div>

        <section className="epilogue-page__closing" aria-label="Closing reflection">
          <ChapterRenderer nodes={closingNodes} />
        </section>
      </div>

      <section className="epilogue-page__handoff" aria-label="Next destinations">
        <h2 className="epilogue-page__handoff-heading">Where you go from here</h2>

        <div className="epilogue-page__transition">
          {transitionParagraphs.map((paragraph) => (
            <p key={paragraph} className="epilogue-page__transition-paragraph">
              {paragraph}
            </p>
          ))}
        </div>

        <nav className="epilogue-page__cards" aria-label="Related links">
          <NavLink to="/toolkit" className="epilogue-page__card">
            <span className="epilogue-page__card-title">Critical Questions</span>
            <span className="epilogue-page__card-description">
              Organized by clock. Ready to ask.
            </span>
          </NavLink>

          <NavLink to="/glossary" className="epilogue-page__card">
            <span className="epilogue-page__card-title">Glossary</span>
            <span className="epilogue-page__card-description">
              Every defined term in one place.
            </span>
          </NavLink>
        </nav>
      </section>
    </article>
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
