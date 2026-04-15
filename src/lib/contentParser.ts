export type ContentNode =
  | { type: 'paragraph'; text: string }
  | { type: 'bulletList'; items: string[] }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'keyQuestion'; text: string }
  | { type: 'l1Block'; children: ContentNode[] }
  | { type: 'l2Block'; children: ContentNode[] }
  | { type: 'billboard'; text: string }
  | { type: 'exit'; text: string }
  | { type: 'glossaryTerm'; termKey: string; displayText: string }
  | { type: 'visual'; description: string }
  | { type: 'subsectionDivider'; label: string }

export type InlineContentNode =
  | { type: 'text'; text: string }
  | Extract<ContentNode, { type: 'glossaryTerm' }>

type ParseResult = {
  nodes: ContentNode[]
  nextIndex: number
}

const glossaryPattern =
  /\[GLOSSARY:([a-z0-9_]+)\]([\s\S]*?)\[\/GLOSSARY\]/g

export function parseContent(markdown: string): ContentNode[] {
  const lines = normalizeLineEndings(markdown).split('\n')
  const { nodes } = parseNodes(lines, 0)

  return nodes
}

// parseContent returns block-level nodes only. Inline glossary markup remains
// embedded in text fields at this stage and should be resolved by renderers via
// parseInlineGlossary in PR4.
export function parseInlineGlossary(text: string): InlineContentNode[] {
  const nodes: InlineContentNode[] = []
  let lastIndex = 0

  glossaryPattern.lastIndex = 0

  for (const match of text.matchAll(glossaryPattern)) {
    const [fullMatch, termKey, displayText] = match
    const matchIndex = match.index ?? 0

    if (matchIndex > lastIndex) {
      nodes.push({
        type: 'text',
        text: text.slice(lastIndex, matchIndex),
      })
    }

    nodes.push({
      type: 'glossaryTerm',
      termKey,
      displayText,
    })

    lastIndex = matchIndex + fullMatch.length
  }

  if (lastIndex < text.length) {
    nodes.push({
      type: 'text',
      text: text.slice(lastIndex),
    })
  }

  if (nodes.length === 0) {
    return [{ type: 'text', text }]
  }

  return nodes
}

export function stripInlineGlossaryMarkup(text: string): string {
  return parseInlineGlossary(text)
    .map((node) => (node.type === 'text' ? node.text : node.displayText))
    .join('')
}

function parseNodes(
  lines: string[],
  startIndex: number,
  stopToken?: '[/L1]' | '[/L2]',
): ParseResult {
  const nodes: ContentNode[] = []
  let index = startIndex

  while (index < lines.length) {
    const rawLine = lines[index]
    const trimmedLine = rawLine.trim()

    if (stopToken && trimmedLine === stopToken) {
      return {
        nodes,
        nextIndex: index + 1,
      }
    }

    if (!trimmedLine) {
      index += 1
      continue
    }

    if (trimmedLine === '[/L1]' || trimmedLine === '[/L2]') {
      throw new Error(`Unexpected closing token "${trimmedLine}" at line ${index + 1}.`)
    }

    if (trimmedLine === '[L1]') {
      const block = parseNodes(lines, index + 1, '[/L1]')
      nodes.push({
        type: 'l1Block',
        children: block.nodes,
      })
      index = block.nextIndex
      continue
    }

    if (trimmedLine === '[L2]') {
      const block = parseNodes(lines, index + 1, '[/L2]')
      nodes.push({
        type: 'l2Block',
        children: block.nodes,
      })
      index = block.nextIndex
      continue
    }

    if (trimmedLine.startsWith('# ')) {
      index += 1
      continue
    }

    const headingNode = parseHeading(trimmedLine)

    if (headingNode) {
      nodes.push(headingNode)
      index += 1
      continue
    }

    const subsectionDividerNode = parseSubsectionDivider(trimmedLine)

    if (subsectionDividerNode) {
      nodes.push(subsectionDividerNode)
      index += 1
      continue
    }

    const billboardNode = parseWrappedTextNode(trimmedLine, 'BILLBOARD', 'billboard')

    if (billboardNode) {
      nodes.push(billboardNode)
      index += 1
      continue
    }

    const exitNode = parseWrappedTextNode(trimmedLine, 'EXIT', 'exit')

    if (exitNode) {
      nodes.push(exitNode)
      index += 1
      continue
    }

    const visualNode = parseVisual(trimmedLine)

    if (visualNode) {
      nodes.push(visualNode)
      index += 1
      continue
    }

    if (isBulletLine(rawLine)) {
      const bulletList = parseBulletList(lines, index)
      nodes.push({
        type: 'bulletList',
        items: bulletList.items,
      })
      index = bulletList.nextIndex
      continue
    }

    const paragraph = parseParagraph(lines, index)
    nodes.push({
      type: 'paragraph',
      text: paragraph.text,
    })
    index = paragraph.nextIndex
  }

  if (stopToken) {
    throw new Error(`Missing closing token "${stopToken}".`)
  }

  return {
    nodes,
    nextIndex: index,
  }
}

function parseHeading(line: string): ContentNode | null {
  if (line.startsWith('### ')) {
    return {
      type: 'heading',
      level: 3,
      text: line.slice(4).trim(),
    }
  }

  if (!line.startsWith('## ')) {
    return null
  }

  const text = line.slice(3).trim()

  if (text.includes('?')) {
    return {
      type: 'keyQuestion',
      text,
    }
  }

  return {
    type: 'heading',
    level: 2,
    text,
  }
}

function parseSubsectionDivider(line: string): Extract<
  ContentNode,
  { type: 'subsectionDivider' }
> | null {
  if (line === '---') {
    return {
      type: 'subsectionDivider',
      label: '',
    }
  }

  const match = line.match(/^\[SUBSECTION:(.+)\]$/)

  if (!match) {
    return null
  }

  return {
    type: 'subsectionDivider',
    label: match[1].trim(),
  }
}

function parseWrappedTextNode<TTag extends 'BILLBOARD' | 'EXIT'>(
  line: string,
  tag: TTag,
  type: TTag extends 'BILLBOARD' ? 'billboard' : 'exit',
): Extract<ContentNode, { type: TTag extends 'BILLBOARD' ? 'billboard' : 'exit' }> | null {
  const match = line.match(new RegExp(`^\\[${tag}\\](.+)\\[\\/${tag}\\]$`))

  if (!match) {
    return null
  }

  return {
    type,
    text: match[1].trim(),
  } as Extract<
    ContentNode,
    { type: TTag extends 'BILLBOARD' ? 'billboard' : 'exit' }
  >
}

function parseVisual(line: string): Extract<ContentNode, { type: 'visual' }> | null {
  const match = line.match(/^\[VISUAL:(.+)\]$/)

  if (!match) {
    return null
  }

  return {
    type: 'visual',
    description: match[1].trim(),
  }
}

function parseBulletList(
  lines: string[],
  startIndex: number,
): { items: string[]; nextIndex: number } {
  const items: string[] = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]

    if (!isBulletLine(line)) {
      break
    }

    let item = line.trim().slice(2).trim()
    index += 1

    while (index < lines.length) {
      const continuationLine = lines[index]
      const trimmedContinuation = continuationLine.trim()

      if (!trimmedContinuation) {
        break
      }

      if (isStructuralLine(continuationLine) || isBulletLine(continuationLine)) {
        break
      }

      item = `${item} ${trimmedContinuation}`
      index += 1
    }

    items.push(item)

    while (index < lines.length && !lines[index].trim()) {
      index += 1

      if (index < lines.length && isBulletLine(lines[index])) {
        break
      }
    }
  }

  return {
    items,
    nextIndex: index,
  }
}

function parseParagraph(
  lines: string[],
  startIndex: number,
): { text: string; nextIndex: number } {
  const chunks: string[] = []
  let index = startIndex

  while (index < lines.length) {
    const line = lines[index]
    const trimmedLine = line.trim()

    if (!trimmedLine || isStructuralLine(line) || isBulletLine(line)) {
      break
    }

    chunks.push(trimmedLine)
    index += 1
  }

  return {
    text: chunks.join(' '),
    nextIndex: index,
  }
}

function isBulletLine(line: string): boolean {
  return line.trimStart().startsWith('- ')
}

function isStructuralLine(line: string): boolean {
  const trimmedLine = line.trim()

  return (
    !trimmedLine ||
    trimmedLine === '[L1]' ||
    trimmedLine === '[L2]' ||
    trimmedLine === '[/L1]' ||
    trimmedLine === '[/L2]' ||
    trimmedLine === '---' ||
    trimmedLine.startsWith('# ') ||
    trimmedLine.startsWith('## ') ||
    trimmedLine.startsWith('### ') ||
    /^\[(BILLBOARD|EXIT)\].+\[\/(BILLBOARD|EXIT)\]$/.test(trimmedLine) ||
    /^\[VISUAL:.+\]$/.test(trimmedLine) ||
    /^\[SUBSECTION:.+\]$/.test(trimmedLine)
  )
}

function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n?/g, '\n')
}
