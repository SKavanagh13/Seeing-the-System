# Seeing the System - Full Build Spec

Single authoritative product spec for implementation and review.

## Core Design Principle
Does this serve the story or distract from it?

If it serves the story, build it.
If it is decorative, cut it.

## Product Summary
Seeing the System is a narrative-first, lightly interactive desktop web experience for newly elected local government officials. Its job is to help the reader understand public finance as a system rather than as a disconnected set of annual decisions.

The experience should feel deliberate, readable, reflective, and structurally clear. It is not a dashboard product, a data-entry application, or a gamified explainer.

## Audience
- Newly elected local government officials
- Readers who may not have a technical finance background
- Users who need orientation, clarity, and plain-language framing more than feature density

## Product Shape
The app is a single React application with a persistent shell and a sequence of narrative surfaces:
- Home / prologue
- Annual Clock
- Trajectory Clock
- Generational Clock
- Toolkit
- Glossary
- Epilogue

The three clocks are the conceptual spine of the experience. Everything else exists to support that framing.

## Non-Negotiable Constraints
- Build as a client-side React + TypeScript + Vite application
- Use React Router for route structure
- Use localStorage only for lightweight clock-progress state
- Do not introduce a backend
- Do not introduce a CMS
- Do not introduce a database
- Do not introduce global state libraries
- Do not turn the experience into a conventional enterprise dashboard

## Route Map
- `/` -> home / prologue
- `/annual-clock` -> Annual Clock chapter surface
- `/trajectory-clock` -> Trajectory Clock chapter surface
- `/generational-clock` -> Generational Clock chapter surface
- `/toolkit` -> Toolkit surface
- `/glossary` -> Glossary surface
- `/epilogue` -> Epilogue surface

Unknown routes should redirect safely to `/`.

## Application Shell
The shell is persistent across the app and should provide:
- A clear project title
- Utility navigation for Home, Toolkit, Glossary, and Epilogue
- A clock navigation control for Annual, Trajectory, and Generational
- A stable content outlet beneath the navigation

The shell should feel consistent and lightweight. It should frame the story, not compete with it.

## Clock Navigation
The clock navigation uses three circles:
- Annual
- Trajectory
- Generational

Each circle should:
- navigate to its route
- carry a distinct clock color
- reflect visited state once the route has been entered

Visited state should persist in localStorage so the app can remember simple progress across sessions. This state is intentionally minimal. No broader persistence layer should be added.

## Content Sources
Narrative and reference content lives in repository content files:
- `content/prologue.md`
- `content/chapter1.md`
- `content/chapter2.md`
- `content/chapter3.md`
- `content/toolkit.json`
- `content/glossary.json`
- `content/epilogue.md`

These files are the source material for the experience. Product code should render and structure them, not rewrite them into a second content system.

## Content Parser
Markdown-like chapter content is parsed by a pure function.

Input:
- `string`

Output:
- `ContentNode[]`

```ts
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
```

Parser requirements:
- Keep the parser pure
- Return structured nodes only
- Do not couple parsing to React rendering
- Do not mix route logic into parsing
- Preserve narrative structure instead of flattening everything into paragraphs

## Chapter Rendering Model
The chapter engine should render parsed content into a consistent narrative layout.

The renderer should support:
- readable paragraph flow
- clear section hierarchy
- prominent key-question treatment
- distinct billboard and exit moments
- nested structural blocks
- inline glossary term affordances
- reserved visual placeholders or visual-callout regions where the content requests them

The experience should privilege pacing and legibility over cleverness. Motion and interactivity should clarify narrative structure, not distract from it.

## Glossary
The glossary is a real product surface, not a dead-end reference dump.

Glossary requirements:
- glossary data comes from `content/glossary.json`
- glossary terms can be linked from narrative content
- the app should support a dedicated glossary route
- review and implementation should preserve a coherent relationship between inline term references and the glossary surface

If a term is referenced in narrative content, the product should make that term meaningfully accessible to the reader.

## Toolkit
The toolkit is a dedicated route backed by `content/toolkit.json`.

Toolkit requirements:
- keep the route in the primary shell
- present toolkit material as structured reference content
- keep the surface aligned with the same editorial voice as the rest of the app

The toolkit supports the story, but it should not overpower it.

## Epilogue
The epilogue is the closing narrative surface. It should feel intentional and complete, not like an appendix.

Final line:

The clocks were running before you arrived.
What matters is what you did while you were here.

## Design System
Clock colors:
- Annual: `#1F4E79`
- Trajectory: `#C97D1A`
- Generational: `#0D6B5E`

Core visual direction:
- warm, editorial, narrative-first presentation
- strong readability over dense controls
- intentional typography hierarchy
- restrained use of chrome

Typography anchors:
- body copy: `17px`
- key questions: `28px`

Design guidance:
- prefer calm, legible layouts
- preserve clear contrast and typographic hierarchy
- avoid generic SaaS styling
- avoid decorative features that do not support the story

## Scroll Behavior
Scroll behavior should be centralized in a shared pattern rather than scattered per page.

Requirements:
- use one shared hook or equivalent shared mechanism for scroll interactions
- keep route-aware scroll behavior centralized
- avoid duplicating scroll logic across chapter surfaces

## Accessibility and Responsiveness
Even though the experience is desktop-forward, it should still load and function cleanly on smaller screens.

Requirements:
- maintain readable typography and spacing
- preserve navigability across routes
- keep interactive elements labeled and understandable
- do not rely on color alone for meaning

## State and Data Boundaries
State should stay narrow and intentional.

Allowed persistence:
- lightweight localStorage for clock progress

Avoid:
- unnecessary client state layers
- persistence for unrelated product concerns
- hidden coupling between routes and content parsing

## PR Slicing Plan
- PR1: application shell, routing, navigation, tokens, and clock-progress state
- PR2: glossary system
- PR3: content parser
- PR4: chapter engine
- PR5: chapters 2 and 3
- PR6: toolkit
- PR7: epilogue
- PR8: visuals and polish

Each PR should stay tightly scoped to its intended slice. Do not smuggle future work into an earlier PR.

## Review Standard
When reviewing product work:
- treat this file as the source of truth
- check the PR against `docs/pr-plan.md`
- use `docs/review-checklist.md`
- prefer scope discipline and behavioral correctness over speculative improvements
