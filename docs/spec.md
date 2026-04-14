# Seeing the System - Complete Build Spec (v3)

Single authoritative source for Codex (programmer) and Claude Code (reviewer).

## Core Design Principle
Does this serve the story or distract from it? If it serves the story, build it. If it is decorative, cut it.

## 1. Project Overview
A narrative-first, lightly interactive desktop web experience helping newly elected local government officials understand public finance as a system.

Stack:
- React + TypeScript
- Vite
- React Router
- localStorage (clock progress only)
- No backend, no CMS, no global state libraries

Routes:
- /
- /annual-clock
- /trajectory-clock
- /generational-clock
- /toolkit
- /glossary
- /epilogue

## 2. Content Files
- glossary.json
- prologue.md
- chapter1.md
- chapter2.md
- chapter3.md
- toolkit.json
- epilogue.md

## 3. Content Parser (Critical)
Pure function:
input: string
output: ContentNode[]

type ContentNode =
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

## 4. Design System
Colors:
- Annual: #1F4E79
- Trajectory: #C97D1A
- Generational: #0D6B5E

Typography:
- Body: 17px
- Key questions: 28px

## 5. Scroll Behavior
Single shared hook for all scroll interactions.

## 6. Navigation
Persistent top bar with clock circles (localStorage state).

## 7. PR Plan
- PR1: Shell + nav
- PR2: Glossary
- PR3: Parser
- PR4: Chapter engine
- PR5: Chapters 2-3
- PR6: Toolkit
- PR7: Epilogue
- PR8: Visuals

## Final Note
The clocks were running before you arrived. What matters is what you did while you were here.
