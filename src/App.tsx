import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './layout/AppShell'

type PlaceholderPageProps = {
  eyebrow: string
  title: string
  description: string
}

function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <section className="page">
      <p className="page__eyebrow">{eyebrow}</p>
      <h1 className="page__title">{title}</h1>
      <p className="page__description">{description}</p>
    </section>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        <Route
          index
          element={
            <PlaceholderPage
              eyebrow="PR1 Foundation"
              title="Application shell and navigation are in place."
              description="This route is intentionally a placeholder. Later PRs will add the prologue experience, parser-driven chapter rendering, glossary interactions, and the remaining narrative systems."
            />
          }
        />
        <Route
          path="annual-clock"
          element={
            <PlaceholderPage
              eyebrow="Annual Clock"
              title="Annual Clock placeholder"
              description="PR1 establishes the route, persistent shell, and visited-state tracking only. Chapter rendering and scroll-driven behavior are intentionally deferred."
            />
          }
        />
        <Route
          path="trajectory-clock"
          element={
            <PlaceholderPage
              eyebrow="Trajectory Clock"
              title="Trajectory Clock placeholder"
              description="This route reserves the chapter surface for later work while keeping the app structure aligned with the spec."
            />
          }
        />
        <Route
          path="generational-clock"
          element={
            <PlaceholderPage
              eyebrow="Generational Clock"
              title="Generational Clock placeholder"
              description="The page exists now so later PRs can layer in chapter engine, content parsing, and interactive storytelling without changing the route foundation."
            />
          }
        />
        <Route
          path="toolkit"
          element={
            <PlaceholderPage
              eyebrow="Toolkit"
              title="Toolkit placeholder"
              description="PR1 creates the toolkit route only. Table behavior and data presentation are intentionally out of scope."
            />
          }
        />
        <Route
          path="glossary"
          element={
            <PlaceholderPage
              eyebrow="Glossary"
              title="Glossary placeholder"
              description="PR1 creates the glossary route only. Glossary drawer behavior and content integration are reserved for PR2."
            />
          }
        />
        <Route
          path="epilogue"
          element={
            <PlaceholderPage
              eyebrow="Epilogue"
              title="Epilogue placeholder"
              description="This route is present so the application shell is complete, but the final epilogue experience is intentionally deferred."
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
