import { stripInlineGlossaryMarkup, type ContentNode } from './contentParser'
import type { ChapterId } from './chapterContent'

export type CardType = 'challenge' | 'steward' | 'offramp' | 'practice'

export type Card = {
  type: CardType
  title: string
  children: ContentNode[]
}

export type KeyQuestionSequenceNode =
  | { type: 'content'; nodes: ContentNode[] }
  | { type: 'card'; card: Card }
  | { type: 'offrampThreshold' }

export type KeyQuestionSectionNode = {
  type: 'keyQuestionSection'
  title: string
  sequence: KeyQuestionSequenceNode[]
}

export type ChapterRenderNode = ContentNode | KeyQuestionSectionNode

export const OFFRAMP_THRESHOLD_LINE = {
  prefix: 'For the steward who wants to see the ',
  emphasis: 'whole',
  suffix: ' system\u2026',
} as const

export const cardTypeConfig: Record<CardType, { accentColor: string }> = {
  challenge: { accentColor: '#A0522D' },
  steward: { accentColor: '#4A7C59' },
  offramp: { accentColor: '#7B6B8D' },
  practice: { accentColor: '#6B7B8D' },
}

type KeyQuestionInventory = {
  cards: CardType[]
}

const keyQuestionInventories: Record<
  Exclude<ChapterId, 'prologue'>,
  readonly KeyQuestionInventory[]
> = {
  'annual-clock': [
    { cards: ['challenge', 'steward', 'offramp', 'practice'] },
    { cards: ['challenge', 'steward', 'offramp'] },
  ],
  'trajectory-clock': [
    { cards: ['challenge', 'steward', 'offramp'] },
    { cards: ['challenge', 'steward', 'offramp'] },
    { cards: ['challenge', 'steward', 'offramp'] },
  ],
  'generational-clock': [{ cards: ['challenge', 'steward', 'offramp'] }],
}

export function transformChapterNodes(
  chapterId: ChapterId,
  nodes: ContentNode[],
): ChapterRenderNode[] {
  if (chapterId === 'prologue') {
    return nodes
  }

  const inventories = keyQuestionInventories[chapterId]
  const transformedNodes: ChapterRenderNode[] = []
  let index = 0
  let keyQuestionIndex = 0

  while (index < nodes.length) {
    const node = nodes[index]

    if (node.type !== 'keyQuestion') {
      transformedNodes.push(node)
      index += 1
      continue
    }

    const inventory = inventories[keyQuestionIndex]

    if (!inventory) {
      throw new Error(
        `Unexpected key question count in chapter "${chapterId}" at question ${keyQuestionIndex + 1}.`,
      )
    }

    const sectionEndIndex = findKeyQuestionSectionEnd(nodes, index + 1)
    const sectionNodes = nodes.slice(index + 1, sectionEndIndex)

    transformedNodes.push(
      transformKeyQuestionSection(chapterId, node.text, sectionNodes, inventory),
    )

    index = sectionEndIndex
    keyQuestionIndex += 1
  }

  if (keyQuestionIndex !== inventories.length) {
    throw new Error(
      `Expected ${inventories.length} key questions in chapter "${chapterId}" but found ${keyQuestionIndex}.`,
    )
  }

  return transformedNodes
}

function transformKeyQuestionSection(
  chapterId: ChapterId,
  title: string,
  sectionNodes: ContentNode[],
  inventory: KeyQuestionInventory,
): KeyQuestionSectionNode {
  const sequence: KeyQuestionSequenceNode[] = []
  const practiceStartIndex = findPracticeStartIndex(sectionNodes)
  const mainNodes =
    practiceStartIndex === -1
      ? sectionNodes
      : sectionNodes.slice(0, practiceStartIndex)
  const practiceNodes =
    practiceStartIndex === -1 ? [] : sectionNodes.slice(practiceStartIndex + 1)

  const stewardBlockIndex = findNodeIndex(mainNodes, (node) => node.type === 'l1Block')

  if (stewardBlockIndex === -1) {
    throw new Error(`Missing steward block in key question "${title}".`)
  }

  let currentIndex = stewardBlockIndex

  if (inventory.cards.includes('challenge')) {
    const challengeContent = getChallengeContent(
      chapterId,
      title,
      mainNodes,
      stewardBlockIndex,
    )

    if (challengeContent.openingNodes.length > 0) {
      sequence.push({
        type: 'content',
        nodes: challengeContent.openingNodes,
      })
    }

    sequence.push({
      type: 'card',
      card: challengeContent.card,
    })
  } else if (stewardBlockIndex > 0) {
    sequence.push({
      type: 'content',
      nodes: mainNodes.slice(0, stewardBlockIndex),
    })
  }

  if (inventory.cards.includes('steward')) {
    const stewardBlock = mainNodes[currentIndex]

    if (!stewardBlock || stewardBlock.type !== 'l1Block') {
      throw new Error(`Missing L1 steward block in key question "${title}".`)
    }

    sequence.push({
      type: 'card',
      card: createTitledCard('steward', stewardBlock.children),
    })

    currentIndex += 1
  }

  const offrampStartIndex = findNodeIndex(
    mainNodes,
    (node, nodeIndex) =>
      nodeIndex >= currentIndex &&
      (node.type === 'billboard' || node.type === 'exit'),
  )

  if (offrampStartIndex === -1) {
    throw new Error(`Missing offramp entry point in key question "${title}".`)
  }

  const contextNodes = mainNodes.slice(currentIndex, offrampStartIndex)

  if (contextNodes.length > 0) {
    sequence.push({
      type: 'content',
      nodes: contextNodes,
    })
  }

  if (inventory.cards.includes('practice')) {
    const trimmedPracticeNodes = trimTrailingSubsectionDividers(practiceNodes)

    if (trimmedPracticeNodes.length === 0) {
      throw new Error(`Missing practice section in key question "${title}".`)
    }

    sequence.push({
      type: 'card',
      card: createTitledCard('practice', trimmedPracticeNodes),
    })
  }

  const offrampNodes = mainNodes.slice(offrampStartIndex)
  const offrampCard = createOfframpCard(offrampNodes, title)

  sequence.push({ type: 'offrampThreshold' })
  sequence.push({
    type: 'card',
    card: offrampCard,
  })

  return {
    type: 'keyQuestionSection',
    title,
    sequence,
  }
}

function getChallengeContent(
  chapterId: ChapterId,
  title: string,
  mainNodes: ContentNode[],
  stewardBlockIndex: number,
): { openingNodes: ContentNode[]; card: Card } {
  const challengeNodes = mainNodes.slice(0, stewardBlockIndex)

  if (chapterId === 'generational-clock') {
    return getGenerationalClockChallengeContent(challengeNodes, title)
  }

  const challengeHeadingIndex = findNodeIndex(
    challengeNodes,
    (node) => node.type === 'heading' && node.level === 3,
  )

  if (challengeHeadingIndex === -1) {
    throw new Error(`Missing challenge heading in key question "${title}".`)
  }

  return {
    openingNodes: challengeNodes.slice(0, challengeHeadingIndex),
    card: createTitledCard('challenge', challengeNodes.slice(challengeHeadingIndex)),
  }
}

function getGenerationalClockChallengeContent(
  challengeNodes: ContentNode[],
  sectionTitle: string,
): { openingNodes: ContentNode[]; card: Card } {
  const splitIndex = findNodeIndex(
    challengeNodes,
    (node) =>
      node.type === 'paragraph' &&
      stripInlineGlossaryMarkup(node.text).startsWith(
        'The compounding nature of these obligations',
      ),
  )

  if (splitIndex === -1) {
    throw new Error(
      `Missing Chapter 3 challenge split paragraph in key question "${sectionTitle}".`,
    )
  }

  const challengeList = challengeNodes[splitIndex + 1]

  if (!challengeList || challengeList.type !== 'bulletList') {
    throw new Error(
      `Expected bullet list after Chapter 3 challenge split in key question "${sectionTitle}".`,
    )
  }

  return {
    openingNodes: challengeNodes.slice(0, splitIndex),
    card: {
      type: 'challenge',
      title: "Why it's harder than it looks",
      children: [challengeNodes[splitIndex], challengeList],
    },
  }
}

function createTitledCard(
  type: Exclude<CardType, 'offramp'>,
  nodes: ContentNode[],
): Card {
  const [firstNode, ...children] = nodes

  if (!firstNode || firstNode.type !== 'heading' || firstNode.level !== 3) {
    throw new Error(`Missing card heading for "${type}".`)
  }

  return {
    type,
    title: firstNode.text,
    children,
  }
}

function createOfframpCard(nodes: ContentNode[], sectionTitle: string): Card {
  let index = 0
  const children: ContentNode[] = []

  if (nodes[index]?.type === 'billboard') {
    children.push(nodes[index])
    index += 1
  }

  const exitNode = nodes[index]

  if (!exitNode || exitNode.type !== 'exit') {
    throw new Error(`Missing EXIT node in key question "${sectionTitle}".`)
  }

  index += 1

  const l2Block = nodes[index]

  if (!l2Block || l2Block.type !== 'l2Block') {
    throw new Error(`Missing L2 offramp block in key question "${sectionTitle}".`)
  }

  children.push(...l2Block.children)

  return {
    type: 'offramp',
    title: exitNode.text,
    children,
  }
}

function findPracticeStartIndex(nodes: ContentNode[]) {
  return nodes.findIndex(
    (node) => node.type === 'subsectionDivider' && node.label === '',
  )
}

function findKeyQuestionSectionEnd(nodes: ContentNode[], startIndex: number) {
  let index = startIndex

  while (index < nodes.length) {
    const node = nodes[index]

    if (node.type === 'keyQuestion') {
      return index
    }

    if (node.type === 'heading' && node.level === 2) {
      return index
    }

    index += 1
  }

  return nodes.length
}

function findNodeIndex(
  nodes: ContentNode[],
  predicate: (node: ContentNode, index: number) => boolean,
) {
  return nodes.findIndex(predicate)
}

function trimTrailingSubsectionDividers(nodes: ContentNode[]) {
  let endIndex = nodes.length

  while (
    endIndex > 0 &&
    nodes[endIndex - 1]?.type === 'subsectionDivider'
  ) {
    endIndex -= 1
  }

  return nodes.slice(0, endIndex)
}
