import { Fragment, useState } from 'react'

import { GlossaryTerm } from '../GlossaryTerm'
import {
  parseInlineGlossary,
  type InlineContentNode,
} from '../../lib/contentParser'
import {
  OFFRAMP_THRESHOLD_LINE,
  type ChapterRenderNode,
  type KeyQuestionSequenceNode,
} from '../../lib/chapterCards'
import { Card } from './Card'

type ChapterRendererProps = {
  nodes: ChapterRenderNode[]
}

type BlockProps = {
  node: ChapterRenderNode
}

export function ChapterRenderer({ nodes }: ChapterRendererProps) {
  return (
    <div className="chapter-renderer">
      {nodes.map((node, index) => (
        <ContentBlock key={createNodeKey(node, index)} node={node} />
      ))}
    </div>
  )
}

function ContentBlock({ node }: BlockProps) {
  switch (node.type) {
    case 'keyQuestionSection':
      return <KeyQuestionBlock node={node} />

    case 'paragraph':
      return (
        <p className="chapter-paragraph">
          <InlineContent text={node.text} />
        </p>
      )

    case 'bulletList':
      return (
        <ul className="chapter-bullet-list">
          {node.items.map((item, index) => (
            <li key={`${item}-${index}`} className="chapter-bullet-item">
              <InlineContent text={item} />
            </li>
          ))}
        </ul>
      )

    case 'heading':
      if (node.level === 2) {
        return (
          <h2 className="chapter-heading chapter-heading--level-2">
            <InlineContent text={node.text} />
          </h2>
        )
      }

      return (
        <h3 className="chapter-heading chapter-heading--level-3">
          <InlineContent text={node.text} />
        </h3>
      )

    case 'keyQuestion':
      return (
        <section className="chapter-key-question" aria-label="Key question">
          <h2 className="chapter-key-question__title">
            <InlineContent text={node.text} />
          </h2>
        </section>
      )

    case 'l1Block':
      return (
        <section className="chapter-block chapter-block--l1">
          <ChapterRenderer nodes={node.children} />
        </section>
      )

    case 'l2Block':
      return (
        <section className="chapter-block chapter-block--l2">
          <ChapterRenderer nodes={node.children} />
        </section>
      )

    case 'billboard':
      return (
        <aside className="chapter-billboard">
          <p className="chapter-billboard__text">
            <InlineContent text={node.text} />
          </p>
        </aside>
      )

    case 'exit':
      return (
        <div className="chapter-exit">
          <p className="chapter-exit__text">
            <InlineContent text={node.text} />
          </p>
        </div>
      )

    case 'glossaryTerm':
      return <InlineGlossaryTerm node={node} />

    case 'visual':
      return (
        <aside className="chapter-visual" aria-label="Visual placeholder">
          <p className="chapter-visual__label">Visual placeholder</p>
          <p className="chapter-visual__description">{node.description}</p>
        </aside>
      )

    case 'subsectionDivider':
      return (
        <div className="chapter-divider" role="presentation">
          <span className="chapter-divider__rule" />
          {node.label ? (
            <span className="chapter-divider__label">{node.label}</span>
          ) : null}
          <span className="chapter-divider__rule" />
        </div>
      )
  }
}

function KeyQuestionBlock({
  node,
}: {
  node: Extract<ChapterRenderNode, { type: 'keyQuestionSection' }>
}) {
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null)

  return (
    <section className="chapter-key-question-block">
      <header className="chapter-key-question">
        <h2 className="chapter-key-question__title">
          <InlineContent text={node.title} />
        </h2>
      </header>

      <div className="chapter-key-question-block__sequence">
        {node.sequence.map((item, index) => (
          <KeyQuestionSequenceItem
            key={createSequenceKey(item, index)}
            item={item}
            isOpen={getCardIndex(node.sequence, index) === openCardIndex}
            onToggle={() => {
              const nextCardIndex = getCardIndex(node.sequence, index)

              if (nextCardIndex === -1) {
                return
              }

              setOpenCardIndex((currentIndex) =>
                currentIndex === nextCardIndex ? null : nextCardIndex,
              )
            }}
          />
        ))}
      </div>
    </section>
  )
}

function KeyQuestionSequenceItem({
  item,
  isOpen,
  onToggle,
}: {
  item: KeyQuestionSequenceNode
  isOpen: boolean
  onToggle: () => void
}) {
  switch (item.type) {
    case 'content':
      return (
        <div className="chapter-key-question-block__content">
          <ChapterRenderer nodes={item.nodes} />
        </div>
      )

    case 'offrampThreshold':
      return <OfframpThresholdLine />

    case 'card':
      return (
        <Card
          type={item.card.type}
          title={item.card.title}
          isOpen={isOpen}
          onToggle={onToggle}
        >
          <ChapterRenderer nodes={item.card.children} />
        </Card>
      )
  }
}

function OfframpThresholdLine() {
  return (
    <p className="chapter-offramp-threshold">
      {OFFRAMP_THRESHOLD_LINE.prefix}
      <strong>{OFFRAMP_THRESHOLD_LINE.emphasis}</strong>
      {OFFRAMP_THRESHOLD_LINE.suffix}
    </p>
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

  return <InlineGlossaryTerm node={node} />
}

function InlineGlossaryTerm({
  node,
}: {
  node: Extract<InlineContentNode, { type: 'glossaryTerm' }>
}) {
  return (
    <GlossaryTerm termKey={node.termKey}>{node.displayText}</GlossaryTerm>
  )
}

function createNodeKey(node: ChapterRenderNode, index: number) {
  switch (node.type) {
    case 'keyQuestionSection':
      return `${node.type}-${node.title}-${index}`
    case 'paragraph':
    case 'keyQuestion':
    case 'billboard':
    case 'exit':
      return `${node.type}-${node.text}-${index}`
    case 'heading':
      return `${node.type}-${node.level}-${node.text}-${index}`
    case 'bulletList':
      return `${node.type}-${node.items.join('|')}-${index}`
    case 'glossaryTerm':
      return `${node.type}-${node.termKey}-${node.displayText}-${index}`
    case 'visual':
      return `${node.type}-${node.description}-${index}`
    case 'subsectionDivider':
      return `${node.type}-${node.label}-${index}`
    case 'l1Block':
    case 'l2Block':
      return `${node.type}-${index}`
  }
}

function createSequenceKey(node: KeyQuestionSequenceNode, index: number) {
  switch (node.type) {
    case 'content':
      return `${node.type}-${index}-${node.nodes.length}`
    case 'offrampThreshold':
      return `${node.type}-${index}`
    case 'card':
      return `${node.type}-${node.card.type}-${node.card.title}-${index}`
  }
}

function getCardIndex(sequence: KeyQuestionSequenceNode[], currentIndex: number) {
  let cardIndex = -1

  for (let index = 0; index <= currentIndex; index += 1) {
    if (sequence[index]?.type === 'card') {
      cardIndex += 1
    }
  }

  return sequence[currentIndex]?.type === 'card' ? cardIndex : -1
}

function createInlineKey(node: InlineContentNode, index: number) {
  if (node.type === 'text') {
    return `text-${index}-${node.text}`
  }

  return `glossary-${index}-${node.termKey}-${node.displayText}`
}
